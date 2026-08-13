# Leash One-Shot Execution Plan

Version: 2.0  
Prepared for: Codex or Hermes  
Repository: /home/hendra/projects/NTUhackathon  
Primary implementation prompt: CODEX_HERMES_IMPLEMENTATION_PROMPT.md

## 1. Mission

Build and verify a hackathon-ready MVP of Leash, a programmable spending firewall for AI agents.

Leash does not move fiat money on-chain. It moves spending authority on-chain. A user registers a mandate that limits a session key by target, cumulative amount, expiry, and revocation state. Off-chain settlement is eligible only after the configured Leash contract emits a confirmed AuthorizationGranted event.

The decisive demo is failure containment:

1. Rock Burger is allowlisted.
2. The mandate cap is 60,000 demo units.
3. A valid payment of 52,000 succeeds.
4. A manipulated agent attempts to pay Evil Store and is rejected.
5. The agent attempts to overspend and is rejected.
6. The backend produces exactly one mock settlement: the one backed by the valid event.
7. Revocation prevents all later authorization.

Pitch anchors:

> We do not put money on-chain. We put spending authority on-chain.

> Leash is a programmable spending firewall for AI agents.

## 2. Source-of-Truth Order

When two documents differ, use this order:

1. The current user request.
2. This LEASH_EXECUTION_PLAN.md as the primary implementation and sequencing source.
3. CODEX_HERMES_IMPLEMENTATION_PROMPT.md for operating rules and final-report requirements.
4. LEASH_IMPLEMENTATION_PLAN.md.
5. KELEMAHAN_MODEL_B_AI_AGENT_FIAT_AUTHORIZATION.md for risks and honest limitations.
6. AGENTSAFE_BRAINSTORM.md only as historical context.

Do not import the older AgentSafe stablecoin-treasury scope into Leash. The Leash MVP authorizes off-chain fiat settlement; it does not transfer stablecoins or implement a treasury dashboard.

This plan locks implementation choices that were ambiguous in the earlier plan. Do not replace those choices during implementation unless the repository already contains a compatible, tested pattern that is clearly safer.

## 3. What One-Shot Means

One-shot means the implementing agent should proceed from repository inspection through verified local integration without waiting for routine decisions.

It does not mean:

- skipping tests;
- claiming success from source code inspection;
- inventing credentials, addresses, hashes, or deployment results;
- broadcasting with an unverified wallet;
- continuing to later stages after a P0 gate fails;
- building UI before proving the enforcement layer.

Reasonable implementation fixes are authorized. External actions that need credentials remain conditional.

## 4. Completion States

Use these meanings in the final report:

- COMPLETE: all local P0 behavior is implemented and verified. Base Sepolia and Telegram runtime may be reported as credential-gated when their source compiles and the prompt-required limitation is documented.
- BLOCKED: a required local P0 gate still fails after root-cause diagnosis, or required tooling/dependency installation cannot be completed.
- SKIPPED_CREDENTIALS: an external runtime action was not attempted because a required secret or explicit testnet-wallet confirmation was absent. This is not fake success and does not by itself make the local MVP blocked.

Never use COMPLETE when contract tests, the attack demo, or settlement-boundary verification are failing.

## 5. Locked Technical Decisions

| Concern | Decision |
|---|---|
| Contract language | Solidity 0.8.24 |
| Contract tooling | Foundry |
| Local chain | Anvil |
| Public testnet | Base Sepolia, chain ID verified from RPC before broadcast |
| TypeScript runtime | Node.js 20 or newer, TypeScript, tsx |
| Blockchain client | viem everywhere; do not mix viem and ethers |
| Package manager | npm with committed package-lock.json files |
| ABI source | Foundry artifact at contracts/out/LeashMandate.sol/LeashMandate.json |
| Owner and agent identity | Separate owner and session-key wallets |
| Demo amount unit | Opaque integer on-chain; interpreted as one rupiah per unit only by the demo |
| Expiry boundary | Expired when block.timestamp is greater than or equal to validUntil |
| Settlement trigger | Confirmed AuthorizationGranted logs from the configured contract only |
| Listener transport | HTTP-compatible confirmed-block polling, not WebSocket-only |
| Idempotency | Event identity plus paymentRef within the listener process |
| UI | No dashboard in the first pass |
| Fiat/BaaS | Mock only |
| ERC-4337/paymaster | Out of scope until every required gate passes |

Use exact dependency versions resolved during implementation and keep each package lockfile. Do not leave dependency values as latest after installation.

## 6. Security Invariants

The final implementation must maintain all of these invariants:

1. A mandate exists only after a successful owner registration transaction.
2. Only the stored session key can call authorizePayment successfully.
3. Only an allowlisted target can receive authorization.
4. A zero amount can never be authorized.
5. spentAmount never exceeds maxAmount.
6. Cumulative spending is enforced across transactions.
7. An authorization at or after validUntil fails.
8. A revoked mandate can never authorize again.
9. Only the mandate owner can revoke it.
10. No invalid authorization changes spentAmount.
11. No invalid authorization emits AuthorizationGranted.
12. The contract does not transfer native currency, ERC-20 tokens, or fiat.
13. The contract has no administrator bypass and never uses tx.origin.
14. The backend has no request path that directly invokes settlement.
15. A reverted transaction cannot create a settlement because it has no successful AuthorizationGranted log.
16. Duplicate delivery of the same log cannot create a second settlement within a listener run.
17. Reuse of the same nonzero paymentRef cannot create a second mock settlement within a listener run.

The MVP does not cryptographically prevent a malicious backend from bypassing its own protocol and calling a future real BaaS directly. State this limitation clearly.

## 7. Required Repository Result

The completed repository should contain at least:

~~~text
.
├── .gitignore
├── README.md
├── LEASH_IMPLEMENTATION_PLAN.md
├── LEASH_EXECUTION_PLAN.md
├── CODEX_HERMES_IMPLEMENTATION_PROMPT.md
├── contracts/
│   ├── .env.example
│   ├── foundry.toml
│   ├── lib/
│   │   └── forge-std/
│   ├── script/
│   │   └── DeployLeashMandate.s.sol
│   ├── src/
│   │   └── LeashMandate.sol
│   └── test/
│       └── LeashMandate.t.sol
├── apps/
│   ├── backend/
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── config.ts
│   │       ├── index.ts
│   │       ├── listener.ts
│   │       ├── mockBaas.ts
│   │       └── mockBaas.test.ts
│   ├── demo-runner/
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── demo.ts
│   └── telegram-bot/
│       ├── .env.example
│       ├── package.json
│       ├── package-lock.json
│       ├── tsconfig.json
│       └── src/
│           └── bot.ts
├── scripts/
│   └── run-local-demo.sh
└── docs/
    ├── PRD_Leash_ID.md
    ├── ARCHITECTURE.md
    ├── DEMO_SCRIPT.md
    ├── DEPLOYMENT.md
    ├── RISK_AND_LIMITATIONS.md
    └── VERIFICATION.md
~~~

Generated directories such as contracts/out, contracts/cache, node_modules, logs, broadcast artifacts containing environment-specific data, and local environment files must be ignored. Do not commit a real private key, bot token, or RPC secret.

## 8. Execution Protocol

Before any edit, run from the repository root:

~~~bash
pwd
git status --short
rg --files
forge --version
anvil --version
node --version
npm --version
~~~

Rules:

1. If git status reports that the directory is not a Git repository, record that fact and continue. Do not initialize Git unless requested.
2. Read every existing file that overlaps the stage being implemented.
3. Preserve existing user files and content. Never use git reset --hard, git checkout --, or a destructive cleanup command.
4. Do not use forge init --force.
5. Use apply_patch for manual source edits.
6. Use a subagent-development skill only if it is actually available and applicable. Its absence is not a blocker.
7. Run the verification gate after each stage.
8. Diagnose a failing command and fix its cause before moving forward.
9. Report actual command output, not expected output presented as fact.
10. Keep P1 credential-dependent work from blocking verified local P0 work.

After each stage, report:

~~~text
STAGE:
- stage name

STATUS:
- PASS, FAIL, or SKIPPED_CREDENTIALS

FILES:
- files created or modified

VERIFICATION:
- exact commands

RESULT:
- actual pass/fail counts or error

NEXT:
- next stage or blocker
~~~

## 9. Stage 0 — Safe Setup and Document Baseline

### Objective

Create a usable project baseline without overwriting existing work.

### Tasks

1. Inspect the root and all overlapping files.
2. Create contracts, apps, docs, and scripts directories only when absent. Do not create an empty app package directory early; create apps/demo-runner, apps/backend, and apps/telegram-bot when their package.json and tsconfig.json are written in the same stage.
3. Add a root .gitignore covering:
   - all .env files except .env.example;
   - node_modules;
   - Foundry out, cache, and local broadcast data;
   - temporary logs;
   - editor and OS artifacts.
4. Create a minimal README only if README.md does not exist. It will be completed later.
5. Locate source documents with rg rather than assuming a Hermes cache path.
6. Preserve KELEMAHAN_MODEL_B_AI_AGENT_FIAT_AUTHORIZATION.md at the root.
7. Use that risk document as source material for docs/RISK_AND_LIMITATIONS.md.
8. No Leash PRD currently needs to be fetched from a private cache. If no PRD_Leash_ID.md exists, create docs/PRD_Leash_ID.md as an explicit Leash product-requirements distillation of LEASH_IMPLEMENTATION_PLAN.md and CODEX_HERMES_IMPLEMENTATION_PROMPT.md.
9. Treat AGENTSAFE_BRAINSTORM.md as historical context, not as the Leash PRD.

### Foundry initialization rule

If contracts does not exist, initialize it with a non-destructive no-Git Foundry command. If contracts already exists, inspect it and add only missing files. Never use force. If forge-std is missing, install it without creating a nested Git repository:

~~~bash
forge install foundry-rs/forge-std --no-git
~~~

Delete sample Counter files only when they were just generated by this implementation run and are positively identified as Foundry samples. Do not delete pre-existing user files.

### Gate 0

~~~bash
rg --files
test -f README.md
test -f docs/PRD_Leash_ID.md
test -f docs/RISK_AND_LIMITATIONS.md
test -f contracts/foundry.toml
~~~

Pass when the required directories and baseline documents exist, secrets are excluded, and no package directory is an unexplained empty placeholder.

## 10. Stage 1 — Smart Contract Core

### 10.1 Foundry configuration

Use:

~~~toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.24"
optimizer = true
optimizer_runs = 200
~~~

### 10.2 Contract API

Create contracts/src/LeashMandate.sol with SPDX MIT and pragma solidity 0.8.24.

Required state:

~~~solidity
struct Mandate {
    address owner;
    address sessionKey;
    uint256 maxAmount;
    uint256 spentAmount;
    uint256 validUntil;
    bool revoked;
}

mapping(bytes32 => Mandate) public mandates;
mapping(bytes32 => mapping(address => bool)) public allowedTargets;
~~~

Required errors:

~~~solidity
error NotOwner();
error InvalidMandate();
error Revoked();
error Expired();
error TargetNotAllowed();
error AmountExceedsCap();
error MandateAlreadyExists();
error ZeroAmount();
~~~

Required events:

~~~solidity
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
~~~

Required functions:

~~~solidity
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
~~~

### 10.3 Deterministic validation order

Use this order so tests and decoded errors are stable.

#### registerMandate

1. If mandates[mandateId].owner is nonzero, revert MandateAlreadyExists.
2. If sessionKey is zero, revert InvalidMandate.
3. If maxAmount is zero, revert InvalidMandate.
4. If validUntil is less than or equal to block.timestamp, revert InvalidMandate.
5. If targets is empty, revert InvalidMandate.
6. If any target is the zero address, revert InvalidMandate.
7. Store the mandate with owner equal to msg.sender, spentAmount zero, and revoked false.
8. Mark every target as allowed. Duplicate nonzero targets are harmless and may be stored once by the mapping.
9. Emit MandateRegistered after all state writes.

#### authorizePayment

1. Load the mandate.
2. If owner is zero, revert InvalidMandate.
3. If msg.sender is not sessionKey, revert NotOwner. This intentionally reuses the prompt-required authorization error.
4. If revoked is true, revert Revoked.
5. If block.timestamp is greater than or equal to validUntil, revert Expired.
6. If target is not allowlisted, revert TargetNotAllowed.
7. If amount is zero, revert ZeroAmount.
8. If amount is greater than maxAmount minus spentAmount, revert AmountExceedsCap.
9. Increase spentAmount before emitting any event.
10. Emit AuthorizationGranted.

Use subtraction in the cap check to avoid an overflow panic for a maliciously large amount. Solidity checked arithmetic remains enabled.

#### revokeMandate

1. If owner is zero, revert InvalidMandate.
2. If msg.sender is not owner, revert NotOwner.
3. If already revoked, revert Revoked.
4. Set revoked to true.
5. Emit MandateRevoked.

### 10.4 Explicit exclusions

Do not add:

- token transfer logic;
- native currency handling;
- owner target updates;
- cap increases;
- an administrator;
- upgradeability;
- tx.origin;
- ERC-4337;
- signatures or EIP-712;
- a paymentRef replay mapping on-chain unless every required stage is already green.

Backend paymentRef idempotency is sufficient for this MVP and must be documented as process-local.

### Gate 1

~~~bash
cd contracts
forge fmt
forge build
~~~

Pass when LeashMandate compiles with the configured compiler and there are no critical warnings.

## 11. Stage 2 — Foundry Security Proof

### 11.1 Test setup

Create contracts/test/LeashMandate.t.sol using forge-std/Test.sol.

Use distinct, nonzero addresses for:

- owner;
- sessionKey;
- rockBurger;
- evilStore;
- attacker.

Set a stable initial timestamp in setUp. Create a helper that registers a default mandate from owner with:

- cap 60,000;
- Rock Burger allowed;
- expiry one day in the future.

### 11.2 Required test names

Registration:

1. testRegisterMandateStoresFields
2. testRegisterMandateSetsAllowedTargets
3. testCannotRegisterDuplicateMandate
4. testCannotRegisterWithZeroSessionKey
5. testCannotRegisterWithZeroCap
6. testCannotRegisterWithInvalidExpiry
7. testCannotRegisterWithoutTargets

Valid authorization:

8. testValidPaymentAuthorizationSucceeds
9. testAuthorizationIncreasesSpentAmount
10. testValidAuthorizationEmitsEvent

Rejections:

11. testWrongSessionKeyReverts
12. testTargetOutsideAllowlistReverts
13. testSingleAmountOverCapReverts
14. testCumulativeAmountOverCapReverts
15. testExpiredMandateReverts
16. testRevokedMandateReverts
17. testUnknownMandateReverts
18. testZeroAmountReverts

Revocation:

19. testOwnerCanRevokeMandate
20. testNonOwnerCannotRevokeMandate
21. testRevokedMandateCannotAuthorize

Attack proof:

22. testAttackInvalidTargetLeavesStateAndEmitsNoAuthorization

Additional boundary hardening:

23. testCannotRegisterZeroTarget
24. testAuthorizationAtExactExpiryReverts
25. testSecondRevocationReverts

### 11.3 Mandatory assertions

- The cumulative-cap test authorizes 52,000, then rejects 10,000 because 62,000 would exceed 60,000.
- The single-cap test rejects an initial amount greater than 60,000.
- The invalid-target attack uses the correct session key and a positive in-cap amount so TargetNotAllowed is the only failure reason.
- The invalid-target attack records spentAmount before and after and proves equality.
- Record logs around the reverting attack and assert that no log has the AuthorizationGranted event signature.
- The over-cap, expired, revoked, wrong-key, unknown-mandate, and zero-amount tests each assert the exact custom-error selector.
- The exact-expiry test warps to validUntil, not one second after it.
- Event tests verify all indexed fields, amount, and paymentRef.
- Revocation tests prove revoked remains true after the failed later authorization.

### Gate 2

~~~bash
cd contracts
forge fmt --check
forge build
forge test -vvv
~~~

Pass only when every required and hardening test passes and none is skipped.

Do not proceed to TypeScript integration while Gate 2 is red.

## 12. Stage 3 — Deployment Script Readiness

### 12.1 Script

Create contracts/script/DeployLeashMandate.s.sol. It must:

1. import forge-std/Script.sol;
2. load PRIVATE_KEY with vm.envUint;
3. start broadcast with that key;
4. deploy exactly one LeashMandate;
5. stop broadcast;
6. return or log the deployed contract address.

### 12.2 Environment template

Create contracts/.env.example:

~~~text
BASE_SEPOLIA_RPC_URL=
PRIVATE_KEY=
BASESCAN_API_KEY=
CONFIRM_TESTNET_ONLY_WALLET=false
~~~

CONFIRM_TESTNET_ONLY_WALLET is a safety assertion. Actual Base broadcast is allowed only when it is explicitly true. Never place a real key in .env.example.

### 12.3 Readiness verification

~~~bash
cd contracts
forge fmt --check
forge build
~~~

The deployment script must also be exercised against Anvil during the local integration gate. Compilation alone is not sufficient to claim that it deployed.

Do not broadcast to Base yet. Public deployment occurs after the full local settlement-boundary gate passes.

## 13. Stage 4 — TypeScript Demo Runner

### 13.1 Package

Create a standalone npm package at apps/demo-runner with:

- package.json using type module;
- package-lock.json;
- strict tsconfig.json;
- viem, dotenv, and tsx;
- TypeScript and Node type definitions;
- scripts named demo and typecheck.

Load the ABI from the Foundry artifact. Fail with a clear instruction to run forge build if the artifact is missing. Do not manually maintain a second ABI.

### 13.2 Environment

Create apps/demo-runner/.env.example:

~~~text
RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=
OWNER_PRIVATE_KEY=
SESSION_KEY_PRIVATE_KEY=
ROCK_BURGER_ADDRESS=
EVIL_STORE_ADDRESS=
ATTACK_GAS_LIMIT=300000
~~~

Validate every required value at startup. Verify that owner and session-key accounts are different. Verify that merchant and evil-store addresses are different and nonzero.

### 13.3 Demo transaction flow

The runner performs this sequence:

1. Connect to the configured chain and contract.
2. Read the latest block timestamp.
3. Derive a unique mandateId for the run and print it.
4. Derive unique nonzero payment references for each logical payment.
5. Register a Rock Burger mandate from owner:
   - session key: configured session-key address;
   - cap: 60,000;
   - expiry: current block timestamp plus 3,600 seconds;
   - targets: Rock Burger only.
6. Wait for a successful registration receipt and print its hash.
7. Authorize 52,000 to Rock Burger from the session key.
8. Wait for a successful receipt, decode AuthorizationGranted from that receipt, and assert its fields.
9. Query spentAmount and assert 52,000.
10. Simulate a 50,000 payment to Evil Store and decode TargetNotAllowed.
11. Broadcast the same invalid-target call with an explicit gas limit so Anvil mines a real reverted transaction.
12. Print the reverted transaction hash and receipt status.
13. Assert that its receipt has no AuthorizationGranted log.
14. Query spentAmount and assert it is still 52,000.
15. Simulate a 500,000 payment to Rock Burger and decode AmountExceedsCap.
16. Broadcast it with an explicit gas limit and assert the receipt is reverted.
17. Assert no AuthorizationGranted log and unchanged spentAmount.
18. Revoke the mandate from owner and assert revoked is true.
19. Attempt another valid-looking payment from the session key, decode Revoked, broadcast it on Anvil, and assert it reverts without changing spentAmount.
20. Print final spent amount 52,000, remaining amount 8,000, and revoked true.

The simulation is used to decode the expected custom error. The explicit-gas transaction is used to produce an actual reverted transaction hash. Do not report an eth_call-only simulation as an on-chain attack transaction.

### 13.4 Required output semantics

The output must clearly distinguish:

~~~text
[1] Register mandate
SUCCESS mandate registered

[2] Normal payment
SUCCESS AuthorizationGranted
Target: Rock Burger
Amount: 52000

[3] Prompt injection attack
REJECTED TargetNotAllowed
Transaction status: reverted
AuthorizationGranted logs: 0
Settlement eligibility: NONE

[4] Overspending attack
REJECTED AmountExceedsCap
Transaction status: reverted
AuthorizationGranted logs: 0
Settlement eligibility: NONE

[5] Revoke
SUCCESS mandate revoked

[6] Post-revocation payment
REJECTED Revoked
AuthorizationGranted logs: 0

Final spent amount: 52000
Final remaining amount: 8000
~~~

The runner may say settlement eligibility is none because no event exists. The authoritative settlement count is verified by the backend stage.

### Gate 4

~~~bash
cd apps/demo-runner
npm install
npm run typecheck
~~~

Runtime verification is completed in the shared Anvil integration stage after the backend exists.

## 14. Stage 5 — Confirmed Event Listener and Mock BaaS

### 14.1 Package

Create apps/backend as a strict TypeScript npm package using viem, dotenv, tsx, TypeScript, Node types, and the Node built-in test runner through tsx.

Required scripts:

- dev: run src/index.ts;
- typecheck: run TypeScript without emitting;
- test: run mockBaas.test.ts.

### 14.2 Environment

Create apps/backend/.env.example:

~~~text
RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=
START_BLOCK=0
CONFIRMATIONS=1
POLL_INTERVAL_MS=1000
LISTENER_MODE=live
EXPECTED_SETTLEMENTS=
~~~

Supported listener modes:

- live: continue polling new confirmed blocks;
- once: process confirmed logs from START_BLOCK through the current safe block, print a summary, and exit.

### 14.3 config.ts

config.ts must:

1. load environment variables;
2. validate RPC URL and contract address;
3. parse nonnegative START_BLOCK;
4. require CONFIRMATIONS of at least one;
5. require a positive poll interval;
6. validate listener mode;
7. parse optional EXPECTED_SETTLEMENTS as a nonnegative integer;
8. expose typed immutable configuration;
9. never log secrets.

### 14.4 listener.ts

Use confirmed-block polling so the same code works with HTTP RPC:

1. Initialize cursor at START_BLOCK.
2. Read latest block.
3. Compute safe block as latest minus (CONFIRMATIONS - 1), with safe underflow handling. With one confirmation, the latest block is safe.
4. Query AuthorizationGranted only from the configured contract and ABI.
5. Sort logs by block number, transaction index, and log index.
6. Pass each canonical confirmed log to the settlement processor.
7. Advance the cursor only after successful processing.
8. In once mode, print the processed-event and settlement counts, compare the settlement count with EXPECTED_SETTLEMENTS when configured, and exit nonzero on a mismatch.
9. In live mode, wait POLL_INTERVAL_MS and continue.

Do not expose an HTTP endpoint that accepts an AI request and calls mock settlement.

### 14.5 mockBaas.ts

The settlement processor accepts a typed AuthorizationGranted event, not arbitrary request fields.

For each accepted event, print:

~~~text
AuthorizationGranted detected
Issuing mock VCC
Amount: Rp52.000
Mock card: **** **** **** 4242
Settlement status: SUCCESS
~~~

Use deterministic Indonesian number formatting for display only. The contract itself remains currency-agnostic.

Maintain in-memory sets for:

- chain ID, contract address, transaction hash, and log index as the event identity;
- nonzero paymentRef as the logical-payment identity.

When either identity was already processed, print an idempotent skip and do not issue another mock card. Document that this protection resets when the process restarts.

### 14.6 Backend tests

mockBaas.test.ts must prove:

1. the first valid event creates exactly one settlement;
2. replaying the same event creates no second settlement;
3. a different event with the same nonzero paymentRef creates no second settlement;
4. a different event with a different paymentRef can create another settlement;
5. no public function settles from raw agent-request fields.

The final integration scenario expects only one AuthorizationGranted event, so its total settlement count must be one.

### Gate 5

~~~bash
cd apps/backend
npm install
npm run typecheck
npm test
~~~

Pass when all backend tests pass.

## 15. Stage 6 — Deterministic Local End-to-End Gate

### 15.1 Purpose

This is the most important non-contract gate. It proves the authorization-to-settlement boundary in one reproducible command.

Create scripts/run-local-demo.sh. It must use strict shell mode and manage only processes it started.

### 15.2 Script behavior

1. Verify forge, anvil, node, and npm exist.
2. Create a task-specific temporary directory.
3. Start Anvil on a known available local port with deterministic test-only accounts.
4. Store the Anvil PID and always stop that exact PID on exit.
5. Never kill an unrelated Anvil process.
6. Build and test the contract.
7. Deploy LeashMandate through DeployLeashMandate.s.sol, not through a different shortcut.
8. Parse the local broadcast artifact to obtain:
   - contract address;
   - deployment transaction hash;
   - deployment block.
9. Export only test-only Anvil keys for owner and session key.
10. Set distinct deterministic Rock Burger and Evil Store addresses.
11. Run the demo runner through npm run demo.
12. Run the backend through npm run dev with LISTENER_MODE=once, START_BLOCK equal to the deployment block, and EXPECTED_SETTLEMENTS=1.
13. Assert the backend reports:
   - one AuthorizationGranted event;
   - one mock settlement;
   - no settlement for any reverted attack.
14. Assert the demo reports:
   - normal payment successful;
   - invalid target reverted with TargetNotAllowed;
   - over-cap payment reverted with AmountExceedsCap;
   - post-revocation payment reverted with Revoked;
   - final spent amount 52,000.
15. Exit nonzero on any mismatch.
16. Print a concise PASS summary only after every assertion passes.

Hardcoded Anvil development keys are permitted only inside this local test script and must be labeled unsafe for every public network. Never reuse them on Base Sepolia.

### 15.3 Required proof

The run must produce actual receipt hashes for:

- mandate registration;
- valid authorization;
- invalid-target revert;
- over-cap revert;
- revocation;
- post-revocation revert.

Expected aggregate:

| Item | Count |
|---|---:|
| Successful AuthorizationGranted logs | 1 |
| Mock settlements | 1 |
| Settlement caused by invalid target | 0 |
| Settlement caused by over-cap request | 0 |
| Settlement caused after revocation | 0 |
| Final spent amount | 52,000 |

### Gate 6

~~~bash
chmod +x scripts/run-local-demo.sh
./scripts/run-local-demo.sh
~~~

Pass only when the script exits zero and its assertions, not just its printed labels, prove the expected aggregate.

Write the actual commands, tool versions, test counts, and local integration summary to docs/VERIFICATION.md. Do not publish local Anvil hashes as Base Sepolia evidence.

## 16. Stage 7 — Base Sepolia Deployment

Begin only after Gate 6 passes.

### 16.1 Preconditions

All of these must be present:

- BASE_SEPOLIA_RPC_URL;
- PRIVATE_KEY;
- BASESCAN_API_KEY when verification is requested;
- CONFIRM_TESTNET_ONLY_WALLET=true.

The operator must affirm that the deployer wallet is testnet-only and does not contain mainnet funds. If this cannot be affirmed, report SKIPPED_CREDENTIALS.

### 16.2 Network validation

Before broadcast:

1. Query the RPC chain ID.
2. Confirm it is Base Sepolia, expected chain ID 84532.
3. Derive and print only the deployer address, never its private key.
4. Confirm it has sufficient testnet ETH.
5. Run forge build and forge test again.

### 16.3 Deployment

Use DeployLeashMandate.s.sol with broadcast and verification. Do not invent results when verification fails.

Run from contracts:

~~~bash
forge script script/DeployLeashMandate.s.sol:DeployLeashMandateScript --rpc-url "$BASE_SEPOLIA_RPC_URL" --broadcast --verify --etherscan-api-key "$BASESCAN_API_KEY"
~~~

Record only verified facts:

- network;
- chain ID;
- contract address;
- deployment transaction hash;
- deployment block;
- explorer transaction URL;
- explorer contract URL;
- source-verification status.

Store these in docs/DEPLOYMENT.md and add the contract link to README only after checking that the address and transaction exist on the expected network.

If credentials are absent:

- keep the script compiled and locally exercised;
- document the exact deployment command with placeholders;
- state SKIPPED_CREDENTIALS;
- do not place blank or example addresses in README as if deployed.

## 17. Stage 8 — Telegram Interface

Implement this stage only after Gate 6 is green.

### 17.1 Package and environment

Create apps/telegram-bot with strict TypeScript, viem, dotenv, tsx, a maintained Telegram bot library, Node types, and locked dependencies.

Create apps/telegram-bot/.env.example:

~~~text
TELEGRAM_BOT_TOKEN=
RPC_URL=
CONTRACT_ADDRESS=
OWNER_PRIVATE_KEY=
SESSION_KEY_PRIVATE_KEY=
ROCK_BURGER_ADDRESS=
EVIL_STORE_ADDRESS=
BROADCAST_REVERTS=false
~~~

### 17.2 Commands

Support:

~~~text
/start
/mandate_food
/normal
/attack_target
/attack_amount
/revoke
/status
~~~

Behavior:

- /start explains that settlement follows on-chain authorization.
- /mandate_food creates a new per-chat Rock Burger mandate with cap 60,000 and stores its active mandate ID in memory.
- /normal authorizes 52,000 to Rock Burger from the session key.
- /attack_target simulates 50,000 to Evil Store, decodes TargetNotAllowed, and broadcasts only when BROADCAST_REVERTS is true.
- /attack_amount simulates 500,000 to Rock Burger, decodes AmountExceedsCap, and broadcasts only when BROADCAST_REVERTS is true.
- /revoke sends revocation from the owner wallet.
- /status reads the public mandate getter and known target mappings and displays owner, session key, cap, spent, remaining, expiry, revoked, Rock Burger allowed, and Evil Store allowed.

Because an on-chain mapping cannot be enumerated, /status may display only the targets known to the bot and verify each through allowedTargets. State this implementation detail.

Do not implement natural-language AI parsing. Do not call mock BaaS from the bot.

### Gate 8

Always run:

~~~bash
cd apps/telegram-bot
npm install
npm run typecheck
~~~

If TELEGRAM_BOT_TOKEN is available, run npm run dev for a startup and command smoke test and record the result. If it is absent, report runtime as SKIPPED_CREDENTIALS while keeping compilation green.

## 18. Stage 9 — Documentation

Documentation must describe what was actually implemented and verified.

### 18.1 docs/PRD_Leash_ID.md

Include:

- problem and target user;
- product thesis;
- P0 and P1 scope;
- demo scenario;
- functional requirements;
- explicit non-goals;
- success criteria;
- mocked components;
- hackathon Track 1 alignment.

Label it as derived from the implementation plan when no independent PRD source exists.

### 18.2 docs/ARCHITECTURE.md

Include:

1. one-sentence thesis;
2. problem;
3. on-chain flow;
4. off-chain flow;
5. smart-contract responsibilities;
6. backend responsibilities;
7. AI-agent responsibilities;
8. authorization/settlement boundary;
9. mocked versus real components;
10. trust model;
11. Web3 rationale;
12. why fiat remains off-chain;
13. protected cases;
14. unprotected cases;
15. production roadmap.

Include this exact conceptual flow:

~~~text
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
~~~

State that AuthorizationGranted is authorization evidence, not fiat settlement finality.

### 18.3 docs/DEMO_SCRIPT.md

Use this sequence:

1. Explain that payment-capable AI agents need enforceable policy.
2. Create a Rock Burger mandate with cap 60,000.
3. Execute the valid 52,000 payment.
4. Show AuthorizationGranted and spentAmount 52,000.
5. Simulate prompt injection toward Evil Store.
6. Show TargetNotAllowed and no event.
7. Attempt 500,000 to Rock Burger.
8. Show AmountExceedsCap and no event.
9. Show exactly one mock settlement.
10. Revoke the mandate.
11. Show a later payment fails with Revoked.
12. Close with: Money stays in fiat rails. Spending authority is enforced on-chain.

### 18.4 docs/RISK_AND_LIMITATIONS.md

Preserve the useful analysis from KELEMAHAN_MODEL_B_AI_AGENT_FIAT_AUTHORIZATION.md and clearly state:

- fiat settlement and VCC issuance are mocked;
- this is not a production payment system;
- the backend remains trusted to follow the protocol;
- the agent may still make poor decisions within its mandate;
- prompt injection is contained, not solved;
- private and session keys require secure custody;
- paymentRef idempotency is process-local;
- merchant identity and allowlists are simplified;
- amount has no on-chain currency metadata;
- KYC, AML, compliance, disputes, refunds, and chargebacks are absent;
- gas abstraction and ERC-4337 are absent;
- privacy and multichain support are absent;
- Base Sepolia is a testnet;
- AuthorizationGranted is not settlement finality.

### 18.5 README.md

Include:

- project name;
- problem;
- solution;
- pitch anchor;
- why Web3;
- architecture flow;
- prerequisites;
- exact contract commands;
- exact local one-shot demo command;
- manual demo-runner commands;
- backend live and once-mode commands;
- Telegram commands and credential caveat;
- verified Base deployment only when available;
- mocked components;
- limitations;
- default demo scenario;
- Track 1 alignment.

### 18.6 docs/VERIFICATION.md and docs/DEPLOYMENT.md

VERIFICATION records dated local evidence and exact test results. DEPLOYMENT separates local Anvil evidence from Base Sepolia evidence and never uses placeholders as real results.

## 19. Stage 10 — Final Verification

Run all applicable commands from clean package state.

### Contract

~~~bash
cd contracts
forge fmt --check
forge build
forge test -vvv
~~~

### Demo runner

~~~bash
cd apps/demo-runner
npm install
npm run typecheck
~~~

### Backend

~~~bash
cd apps/backend
npm install
npm run typecheck
npm test
~~~

### Telegram

~~~bash
cd apps/telegram-bot
npm install
npm run typecheck
~~~

### End to end

~~~bash
./scripts/run-local-demo.sh
~~~

The local script must invoke the actual demo runner through npm run demo and the backend through npm run dev in once mode. A separate manual live-listener run may be added for presentation, but cannot replace the automated aggregate assertion.

### Final behavior matrix

| Claim | Required evidence |
|---|---|
| Valid payment succeeds | successful receipt, matching event, spent 52,000 |
| Non-allowlisted target fails | TargetNotAllowed, reverted receipt, no event |
| Cumulative cap works | Foundry test with 52,000 then rejected 10,000 |
| Large over-cap attack fails | AmountExceedsCap for 500,000, no event |
| Expired mandate fails | exact custom-error test including boundary |
| Revoked mandate fails | Revoked test and local demo receipt |
| Wrong session key fails | exact custom-error Foundry test |
| Invalid requests preserve state | before-and-after assertions |
| Invalid requests do not authorize | no AuthorizationGranted in receipts/logs |
| Settlement follows valid event only | backend count equals one |
| Duplicate event is idempotent | backend unit test |
| Deployment evidence is honest | verified Base facts or SKIPPED_CREDENTIALS |

## 20. Failure Handling

When a command fails:

1. Capture the exact error.
2. Determine whether it is source, tooling, dependency, network, RPC, credential, or configuration related.
3. Fix the root cause within scope.
4. Rerun the smallest failing check.
5. Rerun the full gate.
6. Update docs/VERIFICATION.md with only the final verified result and relevant limitation.

Examples:

- Missing Git repository: continue; not a product blocker.
- Missing forge or Node: install only with allowed permissions, otherwise BLOCKED.
- Dependency download failure: retry with required network permission; never create fake node_modules.
- Missing Base secrets: SKIPPED_CREDENTIALS.
- Missing Telegram token: compile and report SKIPPED_CREDENTIALS for runtime.
- Revert simulation passes but no reverted transaction hash exists: local demo gate still fails until the explicit-gas transaction is mined.
- Listener prints settlement without a decoded confirmed event: security boundary failure; stop and fix.

## 21. Definition of Done

The implementation is done when:

1. LeashMandate builds.
2. All named Foundry tests pass.
3. The deployment script deploys successfully on Anvil.
4. The CLI produces real successful and reverted receipts.
5. The invalid target leaves spentAmount unchanged and emits no authorization.
6. Cumulative overspending is proven by tests.
7. Expiry, wrong key, and revocation are proven.
8. The listener finds only confirmed AuthorizationGranted events from the configured contract.
9. The mock BaaS runs exactly once in the default local scenario.
10. Listener idempotency tests pass.
11. Telegram source type-checks; runtime status is honest.
12. README, architecture, PRD, demo, risk, deployment, and verification documents match reality.
13. No real secret is committed.
14. No unsupported production claim is made.
15. Base deployment facts are included only if actually verified.

## 22. Required Final Report

Use this exact structure and include actual evidence:

~~~text
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
- exact commands
- passed, failed, and skipped counts

DEMO RESULTS:
- valid payment
- invalid target
- over-cap payment
- revocation
- final spent amount

BACKEND RESULTS:
- listener mode and confirmation policy
- event count
- settlement count
- idempotency result

DEPLOYMENT:
- Anvil result
- Base Sepolia network and chain ID
- contract address and explorer links only if verified
- reason when public deployment was not possible

MOCKED COMPONENTS:
- mocked components

KNOWN LIMITATIONS:
- limitations

NEXT PRIORITY:
- next recommended task
~~~

Never claim a feature is complete without its gate. Never invent a transaction hash, contract address, block number, explorer URL, test count, or runtime result.

## 23. Strict Execution Order

Execute in this order:

1. Safe inspection and baseline.
2. Contract implementation.
3. Foundry security tests.
4. Deployment script readiness.
5. Demo runner.
6. Backend listener and mock BaaS.
7. Deterministic local end-to-end gate.
8. Base Sepolia deployment when safely credentialed.
9. Telegram interface.
10. Documentation reconciliation.
11. Full final verification.
12. Final report.

Do not start a dashboard or other UI. Do not begin ERC-4337, paymaster, real BaaS, or multichain work during this plan.
