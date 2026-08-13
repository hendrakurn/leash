# Leash Implementation Prompt for Codex or Hermes

You are a senior full-stack Web3 engineer and hackathon builder.

Work in this repository:

```text
/home/hendra/projects/NTUhackathon
```

Read this plan before changing code:

```text
/home/hendra/projects/NTUhackathon/LEASH_EXECUTION_PLAN.md
```

Use that plan as the primary source of truth for scope and sequencing. Do not start with the UI. Prove the smart-contract enforcement layer first.

## 1. Product Context

Leash is an on-chain spending authorization layer for AI agents.

Leash does not move fiat money on-chain. It moves spending authority on-chain.

The problem is that an AI agent may be able to make payments, but it can be manipulated by prompt injection, pay the wrong merchant, overspend, use a session key without limits, or continue paying after a user revokes permission.

The solution is a user-approved spending mandate enforced by a smart contract. A mandate defines:

- the AI agent or session key that may request payments;
- the merchants or target addresses that may be paid;
- the maximum cumulative spending amount;
- the expiry time;
- whether the mandate has been revoked.

Every payment request must pass through the smart contract before any off-chain settlement is triggered.

For a valid request:

1. The smart contract accepts the authorization.
2. The contract emits `AuthorizationGranted`.
3. The backend detects the event.
4. The backend runs a mock fiat or BaaS settlement.

For an invalid request:

1. The smart contract reverts.
2. No `AuthorizationGranted` event exists.
3. The backend must not run settlement.

The central demo must prove that a manipulated AI agent cannot pay outside the user-approved mandate.

Pitch anchor:

> We do not put money on-chain. We put spending authority on-chain.

Product description:

> Leash is a programmable spending firewall for AI agents.

## 2. Target Outcome

Build a hackathon-ready MVP for Track 1: Payments and Financial Infrastructure.

### P0: Must be complete

1. Smart-contract spending mandate registry.
2. Session-key authorization.
3. Cumulative spending-cap enforcement.
4. Merchant or target allowlist enforcement.
5. Expiry enforcement.
6. Revocation enforcement.
7. `AuthorizationGranted` event for valid requests.
8. Revert for invalid requests.
9. Foundry tests for all critical failure cases.
10. Attack demo showing a malicious request being rejected.
11. Mock settlement that only runs after `AuthorizationGranted`.

### P1: Complete after P0 is stable

1. Deterministic CLI demo runner or simple dashboard.
2. Backend event listener.
3. Mock BaaS settlement.
4. Base Sepolia deployment.
5. Telegram interface.
6. Demo script and submission documentation.

### Explicitly out of scope for the first MVP

Do not prioritize:

- real BaaS or virtual-card issuance;
- real fiat movement on-chain;
- a fully autonomous browser agent;
- paymaster or gasless transactions;
- zero-knowledge authorization;
- a production-grade merchant registry;
- multichain deployment;
- ERC-4337 if the core contract is not already stable.

Only consider ERC-4337 after the contract, tests, local demo, and settlement listener are complete and stable.

## 3. Engineering Rules

Before editing files:

1. Inspect the repository with `pwd`, `git status --short`, and `rg --files`.
2. Read existing files that overlap with this task.
3. Preserve user changes. Never use `git reset --hard`, `git checkout --`, or another destructive command.
4. Reuse existing project patterns and dependencies where practical.
5. Use `apply_patch` for manual edits.
6. Do not hide errors with fake success output.
7. Verify each stage before starting the next stage.
8. If a command fails, diagnose and fix the root cause.
9. Do not stop after creating skeleton files. Implement and test the behavior.
10. If a required environment variable is missing, document the limitation instead of inventing a result.

If a subagent-driven-development skill is available, use it to execute the work task by task. Otherwise, execute the stages below directly.

After each stage, report the files changed, the verification command, and the result before continuing.

## 4. Expected Repository Structure

Create or adapt this structure:

```text
contracts/
├── foundry.toml
├── src/
│   └── LeashMandate.sol
├── test/
│   └── LeashMandate.t.sol
└── script/
    └── DeployLeashMandate.s.sol

apps/
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── config.ts
│       ├── index.ts
│       ├── listener.ts
│       └── mockBaas.ts
├── demo-runner/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       └── demo.ts
└── telegram-bot/
    ├── package.json
    ├── .env.example
    └── src/
        └── bot.ts

docs/
├── PRD_Leash_ID.md
├── DEMO_SCRIPT.md
├── ARCHITECTURE.md
└── RISK_AND_LIMITATIONS.md

README.md
```

## 5. Stage 0: Project Setup

Create the required directories and a minimal README if they do not exist. Locate any existing PRD and risk-analysis documents and copy or reference them under `docs/` without deleting the originals.

Acceptance criteria:

- all required top-level folders exist;
- `README.md` exists;
- the PRD and risk-analysis documents are available under `docs/`;
- no required package directory is left unusable or empty;
- `rg --files` shows the expected project structure.

## 6. Stage 1: Smart Contract Core

Set up Foundry inside `contracts/`.

Use Solidity `0.8.24` or a compatible version and enable the optimizer:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.24"
optimizer = true
optimizer_runs = 200
```

Implement `contracts/src/LeashMandate.sol`.

The minimum mandate structure is:

```solidity
struct Mandate {
    address owner;
    address sessionKey;
    uint256 maxAmount;
    uint256 spentAmount;
    uint256 validUntil;
    bool revoked;
}
```

Required storage:

```solidity
mapping(bytes32 => Mandate) public mandates;
mapping(bytes32 => mapping(address => bool)) public allowedTargets;
```

Required custom errors:

```solidity
error NotOwner();
error InvalidMandate();
error Revoked();
error Expired();
error TargetNotAllowed();
error AmountExceedsCap();
error MandateAlreadyExists();
error ZeroAmount();
```

Required events:

```solidity
event MandateRegistered(
    bytes32 indexed mandateId,
    address indexed owner,
    address indexed sessionKey,
    uint256 maxAmount,
    uint256 validUntil
);

event AuthorizationGranted(
    bytes32 indexed mandateId,
    address indexed sessionKey,
    address indexed target,
    uint256 amount,
    bytes32 paymentRef
);

event MandateRevoked(bytes32 indexed mandateId);
```

Implement:

```solidity
function registerMandate(
    bytes32 mandateId,
    address sessionKey,
    uint256 maxAmount,
    uint256 validUntil,
    address[] calldata targets
) external;

function authorizePayment(
    bytes32 mandateId,
    address target,
    uint256 amount,
    bytes32 paymentRef
) external;

function revokeMandate(bytes32 mandateId) external;
```

Registration rules:

- reject duplicate mandate IDs;
- reject a zero session key;
- reject a zero cap;
- reject an expiry at or before `block.timestamp`;
- reject an empty target list;
- set `msg.sender` as owner;
- store every allowed target;
- emit `MandateRegistered`.

Authorization rules:

- the mandate must exist;
- `msg.sender` must equal the mandate session key;
- the mandate must not be revoked;
- the mandate must not be expired;
- the target must be allowlisted;
- the amount must be greater than zero;
- `spentAmount + amount` must not exceed `maxAmount`;
- update `spentAmount` before emitting the event;
- emit `AuthorizationGranted` only after every check succeeds;
- do not move fiat or tokens in this MVP.

Revocation rules:

- the mandate must exist;
- only the owner may revoke it;
- set `revoked = true`;
- emit `MandateRevoked`;
- a revoked mandate can never authorize another payment.

Security requirements:

- do not use `tx.origin`;
- do not add an administrative bypass;
- the session key must not modify targets or increase the cap;
- invalid requests must not modify spending state;
- invalid requests must not emit `AuthorizationGranted`;
- enforce the cumulative cap, not only a per-transaction cap;
- use custom errors and clear state transitions.

## 7. Stage 1.1: Foundry Tests

Create `contracts/test/LeashMandate.t.sol`.

Use test addresses for owner, session key, merchant, evil merchant, and attacker.

Required registration tests:

- `testRegisterMandateStoresFields`
- `testRegisterMandateSetsAllowedTargets`
- `testCannotRegisterDuplicateMandate`
- `testCannotRegisterWithZeroSessionKey`
- `testCannotRegisterWithZeroCap`
- `testCannotRegisterWithInvalidExpiry`
- `testCannotRegisterWithoutTargets`

Required valid-flow tests:

- `testValidPaymentAuthorizationSucceeds`
- `testAuthorizationIncreasesSpentAmount`
- `testValidAuthorizationEmitsEvent`

Required rejection tests:

- `testWrongSessionKeyReverts`
- `testTargetOutsideAllowlistReverts`
- `testSingleAmountOverCapReverts`
- `testCumulativeAmountOverCapReverts`
- `testExpiredMandateReverts`
- `testRevokedMandateReverts`
- `testUnknownMandateReverts`
- `testZeroAmountReverts`

Required revocation tests:

- `testOwnerCanRevokeMandate`
- `testNonOwnerCannotRevokeMandate`
- `testRevokedMandateCannotAuthorize`

The cumulative-cap test must prove that a mandate with a cap of `60,000` accepts `52,000`, then rejects another `10,000` because the total would be `62,000`.

The attack test must prove that a mandate allowing Rock Burger rejects a payment to Evil Store, leaves `spentAmount` unchanged, and emits no `AuthorizationGranted` event.

Run:

```bash
cd contracts
forge fmt
forge build
forge test -vvv
```

Acceptance criteria:

- every test passes;
- no critical test is skipped;
- failure tests verify the expected revert;
- invalid requests do not change state;
- the contract builds without critical warnings.

## 8. Stage 1.2: Base Sepolia Deployment

Create `contracts/script/DeployLeashMandate.s.sol` and `contracts/.env.example`.

Required environment variables:

```text
BASE_SEPOLIA_RPC_URL=
PRIVATE_KEY=
BASESCAN_API_KEY=
```

Create a Foundry deployment script for `LeashMandate`.

If credentials are available, deploy to Base Sepolia and record:

- network;
- contract address;
- deployment transaction hash;
- explorer URL;
- block number if available.

Never use a wallet containing mainnet funds.

If credentials are unavailable, compile and test the deployment script, document the command, and do not invent an address or transaction hash.

## 9. Stage 2: TypeScript Demo Runner

Create:

- `apps/demo-runner/package.json`;
- `apps/demo-runner/src/demo.ts`;
- `apps/demo-runner/.env.example`.

Use TypeScript, `viem` or `ethers`, `dotenv`, and `tsx`.

The runner must:

1. register a mandate;
2. print the mandate ID;
3. print the session key and allowed merchant;
4. execute a valid payment;
5. execute an invalid-target attack;
6. execute an over-cap attack;
7. print transaction hashes and statuses;
8. print the final spent amount.

Default scenario:

- merchant: Rock Burger;
- cap: `60,000` units;
- valid payment: `52,000` units;
- invalid target: Evil Store;
- over-cap payment: `500,000` units.

Expected behavior:

```text
[1] Register mandate
SUCCESS mandate registered

[2] Normal payment
SUCCESS AuthorizationGranted
Target: Rock Burger
Amount: 52000

[3] Prompt injection attack
REJECTED TargetNotAllowed
No settlement triggered

[4] Overspending attack
REJECTED AmountExceedsCap
No settlement triggered
```

Expected attack reverts must be handled as part of the demo and must not crash the entire runner.

## 10. Stage 3: Backend Listener and Mock BaaS

Create:

- `apps/backend/package.json`;
- `apps/backend/src/config.ts`;
- `apps/backend/src/listener.ts`;
- `apps/backend/src/mockBaas.ts`;
- `apps/backend/src/index.ts`;
- `apps/backend/.env.example`.

The listener must read `AuthorizationGranted` from the contract and pass only confirmed events to the mock BaaS.

Example mock output:

```text
AuthorizationGranted detected
Issuing mock VCC
Amount: Rp52.000
Mock card: **** **** **** 4242
Settlement status: SUCCESS
```

Rules:

- never settle directly from an AI-agent request;
- never settle merely because an HTTP request was received;
- settle only after `AuthorizationGranted`;
- reverted transactions must produce no settlement;
- invalid-target and over-cap attacks must produce no settlement;
- add basic idempotency using a transaction hash or payment reference.

Verification:

1. Start the listener.
2. Run the valid demo.
3. Confirm mock settlement appears.
4. Run the invalid-target attack.
5. Confirm no settlement appears.
6. Run the over-cap attack.
7. Confirm no settlement appears.

## 11. Stage 4: Telegram Interface

Complete this stage only after the contract, tests, demo runner, and backend listener are stable.

Create:

- `apps/telegram-bot/package.json`;
- `apps/telegram-bot/src/bot.ts`;
- `apps/telegram-bot/.env.example`.

Support these commands:

```text
/start
/mandate_food
/normal
/attack_target
/attack_amount
/revoke
/status
```

Behavior:

- `/mandate_food` creates a Rock Burger mandate with a `60,000` cap;
- `/normal` sends a valid `52,000` authorization;
- `/attack_target` attempts `50,000` to Evil Store and is rejected;
- `/attack_amount` attempts `500,000` to Rock Burger and is rejected;
- `/revoke` revokes the mandate;
- `/status` displays owner, session key, cap, spent amount, remaining amount, expiry, revocation state, and allowed targets.

Natural-language parsing may be mocked. The MVP is proving secure spending authorization, not building a sophisticated AI model.

If a Telegram token is unavailable, create and compile the bot source and clearly document that runtime testing requires the token.

## 12. Stage 5: Documentation

Create `docs/ARCHITECTURE.md` with:

1. one-sentence thesis;
2. the problem;
3. the on-chain flow;
4. the off-chain flow;
5. smart-contract responsibilities;
6. backend responsibilities;
7. AI-agent responsibilities;
8. the authorization/settlement boundary;
9. mocked versus real components;
10. the trust model;
11. why blockchain is useful;
12. why fiat remains off-chain;
13. what the system protects;
14. what the system does not protect;
15. the production roadmap.

Include this flow:

```text
User
  |
  v
Spending Mandate
  |
  v
AI Agent / Session Key
  |
  v
Leash Smart Contract
  |
  +--> valid --> AuthorizationGranted --> Mock BaaS Settlement
  |
  +--> invalid --> revert --> no settlement
```

Create `docs/DEMO_SCRIPT.md` with this sequence:

1. Explain that AI agents can now make payments but need enforceable spending policies.
2. Create a Rock Burger mandate with a `60,000` cap.
3. Execute a valid `52,000` payment.
4. Show `AuthorizationGranted` and the updated `spentAmount`.
5. Simulate prompt injection toward Evil Store.
6. Show `TargetNotAllowed` revert.
7. Attempt a `500,000` payment.
8. Show `AmountExceedsCap` revert.
9. Show that mock BaaS settlement occurred only for the valid event.
10. Revoke the mandate and show that a later payment fails.
11. Close with: “Money stays in fiat rails. Spending authority is enforced on-chain.”

Create `docs/RISK_AND_LIMITATIONS.md` explaining:

- fiat settlement is mocked;
- this is not a production payment system;
- the AI agent can still make poor decisions within its mandate;
- prompt injection is contained, not fully solved;
- session keys and private keys must still be secured;
- merchant allowlists are simplified;
- compliance, KYC, and AML are not implemented;
- dispute resolution is not implemented;
- gas abstraction is not implemented;
- privacy and multichain support are not implemented;
- Base Sepolia is a testnet.

Update `README.md` with:

- project name;
- problem;
- solution;
- why Web3;
- architecture;
- setup instructions;
- contract test commands;
- demo-runner commands;
- backend commands;
- Telegram commands if available;
- deployed contract address and explorer link only if verified;
- mocked components;
- limitations;
- demo scenario;
- hackathon-track alignment.

## 13. Final Verification

Run every applicable command:

```bash
cd contracts
forge fmt --check
forge build
forge test -vvv
```

```bash
cd apps/demo-runner
npm install
npm run demo
```

```bash
cd apps/backend
npm install
npm run dev
```

If the Telegram bot is implemented:

```bash
cd apps/telegram-bot
npm install
npm run dev
```

The final system must prove:

1. valid payment succeeds;
2. a non-allowlisted target fails;
3. cumulative cap enforcement works;
4. expired mandates fail;
5. revoked mandates fail;
6. an incorrect session key fails;
7. invalid requests do not change `spentAmount`;
8. invalid requests do not emit `AuthorizationGranted`;
9. backend settlement happens only for valid events;
10. attack flows never trigger mock settlement.

## 14. Required Final Report

After implementation, provide a concise report using this format:

```text
STATUS:
- COMPLETE or BLOCKED

IMPLEMENTED:
- completed features

FILES CREATED/MODIFIED:
- important files

CONTRACT:
- contract name
- main functions
- events
- enforced rules

TEST RESULTS:
- commands executed
- tests passed or failed

DEMO RESULTS:
- valid payment
- invalid target
- over-cap payment
- revocation

BACKEND RESULTS:
- listener status
- when mock settlement was triggered

DEPLOYMENT:
- network
- contract address, if available
- explorer link, if available
- reason if deployment was not possible

MOCKED COMPONENTS:
- mocked components

KNOWN LIMITATIONS:
- limitations

NEXT PRIORITY:
- next recommended task
```

Never claim that a feature is complete without verification. Never invent a transaction hash, contract address, explorer URL, or test result.
