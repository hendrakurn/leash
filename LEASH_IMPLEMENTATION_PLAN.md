# Leash Implementation Plan

## 1. Project Summary

Leash is an on-chain spending authorization layer for AI agents.

Leash does not move fiat money on-chain. It moves spending authority on-chain and ensures that off-chain settlement can happen only after a payment request satisfies a user-approved mandate.

The core security claim is:

> An AI agent cannot trigger payment settlement outside a user-approved spending mandate, even if the agent is manipulated or attempts to overspend.

### Hackathon Track

Track 1: Payments and Financial Infrastructure

### Primary Demo Scenario

1. A user creates a mandate for an AI agent.
2. The mandate allows payment only to Rock Burger.
3. The mandate has a cumulative cap of Rp60.000.
4. The agent successfully authorizes a Rp52.000 payment to Rock Burger.
5. A manipulated agent attempts to pay Evil Store.
6. The smart contract rejects the request.
7. The agent attempts to pay Rp500.000 to Rock Burger.
8. The smart contract rejects the request because of the cumulative cap.
9. The mock settlement service runs only for the valid authorization event.

## 2. Product Boundary

### On-chain responsibilities

- Store spending mandates.
- Store the owner, session key, cap, expiry, and allowed targets.
- Validate every payment authorization request.
- Track cumulative spending.
- Support mandate revocation.
- Emit an authorization event for valid requests.
- Revert invalid requests before settlement.

### Off-chain responsibilities

- Represent the AI agent or demo interface.
- Submit authorization requests to the contract.
- Listen for `AuthorizationGranted`.
- Trigger a mock BaaS or fiat settlement after a confirmed event.
- Display success, rejection, and settlement status.

### Explicitly mocked

- Fiat movement.
- Virtual card issuance.
- BaaS provider.
- Natural-language AI interpretation.
- Merchant identity verification.
- Production compliance and risk systems.

## 3. Technical Stack

| Layer | Technology | Purpose |
|---|---|---|
| Smart contract | Solidity | Mandate and authorization enforcement |
| Contract tooling | Foundry | Build, test, and deploy |
| Test network | Base Sepolia | Public testnet deployment |
| Backend | Node.js and TypeScript | Event listener and mock settlement |
| Blockchain client | viem or ethers | Contract interaction |
| Demo interface | CLI first, Telegram optional | Demonstrate agent actions |
| Documentation | Markdown | Architecture, demo, risks, and setup |

## 4. Repository Structure

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
├── ARCHITECTURE.md
├── DEMO_SCRIPT.md
└── RISK_AND_LIMITATIONS.md

README.md
```

## 5. Milestone Overview

| Milestone | Scope | Priority | Completion signal |
|---|---|---:|---|
| M0 | Repository and tooling setup | P0 | Foundry and Node projects run |
| M1 | Mandate smart contract | P0 | Contract builds and exposes required API |
| M2 | Contract security tests | P0 | All valid and invalid flows pass tests |
| M3 | Local CLI demo | P0 | Normal and attack flows are reproducible |
| M4 | Base Sepolia deployment | P0 | Contract address and explorer proof available |
| M5 | Event listener and mock settlement | P0 | Settlement occurs only after valid event |
| M6 | Telegram interface | P1 | Demo can be controlled from Telegram |
| M7 | Documentation and presentation | P0 | README and demo script are submission-ready |
| M8 | Final verification | P0 | All acceptance criteria pass |

## 6. Milestone M0: Repository and Tooling Setup

### Objective

Prepare a clean project structure for the contract, backend, demo runner, optional Telegram bot, and documentation.

### Tasks

- Inspect the existing repository and preserve existing user work.
- Create the required directories.
- Initialize Foundry under `contracts/`.
- Initialize Node.js and TypeScript packages for the demo runner and backend.
- Add `.env.example` files.
- Move or copy the existing PRD and risk documents into `docs/` if needed.
- Add a minimal root README.

### Outputs

- `contracts/foundry.toml`.
- `apps/demo-runner/package.json`.
- `apps/backend/package.json`.
- Required source and documentation directories.
- Environment variable templates.

### Verification

```bash
rg --files
cd contracts && forge build
cd apps/demo-runner && npm install
cd apps/backend && npm install
```

### Acceptance criteria

- The expected repository structure exists.
- Foundry can build the contract workspace.
- Node dependencies install successfully.
- No secret values are committed.

## 7. Milestone M1: Mandate Smart Contract

### Objective

Implement the on-chain authorization firewall.

### Contract

File: `contracts/src/LeashMandate.sol`

### Mandate state

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

### Storage

```solidity
mapping(bytes32 => Mandate) public mandates;
mapping(bytes32 => mapping(address => bool)) public allowedTargets;
```

### Required functions

#### `registerMandate`

Inputs:

- `mandateId`;
- `sessionKey`;
- `maxAmount`;
- `validUntil`;
- target allowlist.

Rules:

- mandate ID must be unique;
- session key cannot be zero;
- cap must be greater than zero;
- expiry must be in the future;
- target list cannot be empty;
- caller becomes owner.

#### `authorizePayment`

Inputs:

- `mandateId`;
- payment target;
- payment amount;
- payment reference.

Rules:

- mandate must exist;
- caller must equal the session key;
- mandate must not be revoked;
- mandate must not be expired;
- target must be allowlisted;
- amount must be greater than zero;
- cumulative spending must remain within the cap;
- spent amount must be updated before emitting the event.

#### `revokeMandate`

Rules:

- mandate must exist;
- only the owner may revoke;
- revocation is permanent for the MVP;
- revoked mandates cannot authorize future payments.

### Required errors

- `NotOwner()`.
- `InvalidMandate()`.
- `Revoked()`.
- `Expired()`.
- `TargetNotAllowed()`.
- `AmountExceedsCap()`.
- `MandateAlreadyExists()`.
- `ZeroAmount()`.

### Required events

- `MandateRegistered`.
- `AuthorizationGranted`.
- `MandateRevoked`.

### Security constraints

- Do not use `tx.origin`.
- Do not add an admin bypass.
- The session key cannot modify its own mandate.
- The session key cannot add targets or increase the cap.
- Invalid requests must not modify `spentAmount`.
- Invalid requests must not emit `AuthorizationGranted`.
- Use cumulative accounting, not only a per-transaction limit.

### Outputs

- Implemented contract.
- Compiled ABI and bytecode generated by Foundry.
- Clear custom errors and events.

### Verification

```bash
cd contracts
forge fmt
forge build
```

### Acceptance criteria

- Contract compiles.
- All required public functions exist.
- Mandate fields are readable.
- Valid authorization updates state and emits an event.
- Invalid authorization reverts.

## 8. Milestone M2: Smart Contract Security Tests

### Objective

Prove that the authorization firewall contains invalid or malicious payment requests.

### Test file

`contracts/test/LeashMandate.t.sol`

### Registration tests

- Stores owner, session key, cap, expiry, and initial state.
- Stores every allowed target.
- Rejects duplicate mandate IDs.
- Rejects zero session keys.
- Rejects zero caps.
- Rejects invalid expiry.
- Rejects empty target lists.

### Valid authorization tests

- Correct session key can authorize an allowlisted payment.
- Spent amount increases correctly.
- `AuthorizationGranted` is emitted.
- Payment reference is included in the event.

### Invalid authorization tests

- Wrong session key reverts.
- Non-allowlisted target reverts.
- Single payment above the cap reverts.
- Cumulative spending above the cap reverts.
- Expired mandate reverts.
- Revoked mandate reverts.
- Unknown mandate reverts.
- Zero amount reverts.

### Revocation tests

- Owner can revoke.
- Non-owner cannot revoke.
- Revoked mandate cannot authorize payment.
- Revocation event is emitted.

### Required attack scenario

Configure:

- max amount: `60,000`;
- allowed target: Rock Burger;
- first payment: `52,000`;
- attack target: Evil Store;
- attack amount: `500,000`.

Prove:

- the normal payment succeeds;
- Evil Store payment reverts with `TargetNotAllowed`;
- overspending reverts with `AmountExceedsCap`;
- `spentAmount` remains unchanged after each invalid request;
- no authorization event is emitted for invalid requests.

### Verification

```bash
cd contracts
forge fmt
forge test -vvv
```

### Acceptance criteria

- All tests pass.
- Critical failure cases are explicitly covered.
- Attack behavior is demonstrated in tests.
- No invalid request can reach an authorization event.

## 9. Milestone M3: Local CLI Demo

### Objective

Create a deterministic local demonstration of the complete authorization behavior.

### Files

- `apps/demo-runner/package.json`.
- `apps/demo-runner/src/demo.ts`.
- `apps/demo-runner/.env.example`.

### Dependencies

- TypeScript.
- `viem` or `ethers`.
- `dotenv`.
- `tsx`.

### Demo flow

1. Register a mandate.
2. Display the mandate ID and parameters.
3. Submit a valid payment to Rock Burger.
4. Display the successful transaction and event.
5. Submit an invalid payment to Evil Store.
6. Display the expected rejection.
7. Submit an over-cap payment to Rock Burger.
8. Display the expected rejection.
9. Display final spending and remaining allowance.

### Required environment

```text
RPC_URL=
PRIVATE_KEY=
CONTRACT_ADDRESS=
```

### Example output

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

### Acceptance criteria

- The CLI can execute the normal flow.
- Expected reverts are displayed clearly.
- An expected attack revert does not crash the entire demo.
- Transaction hashes and status are displayed.
- Final state is readable.

## 10. Milestone M4: Base Sepolia Deployment

### Objective

Make the core contract publicly verifiable on Base Sepolia.

### Files

- `contracts/script/DeployLeashMandate.s.sol`.
- `contracts/.env.example`.

### Environment

```text
BASE_SEPOLIA_RPC_URL=
PRIVATE_KEY=
BASESCAN_API_KEY=
```

### Deployment command

```bash
cd contracts
source .env
forge script script/DeployLeashMandate.s.sol:DeployLeashMandateScript \
  --rpc-url "$BASE_SEPOLIA_RPC_URL" \
  --broadcast \
  --verify \
  --etherscan-api-key "$BASESCAN_API_KEY"
```

### Outputs

- deployed contract address;
- deployment transaction hash;
- Base Sepolia explorer URL;
- deployment network;
- updated `.env` values for local demo use.

### Acceptance criteria

- Deployment script compiles.
- Deployment succeeds if valid credentials are available.
- The contract address is recorded only after verification.
- No mainnet private key is used.

## 11. Milestone M5: Backend Listener and Mock Settlement

### Objective

Demonstrate that the settlement rail is downstream of on-chain authorization.

### Files

- `apps/backend/package.json`.
- `apps/backend/src/config.ts`.
- `apps/backend/src/listener.ts`.
- `apps/backend/src/mockBaas.ts`.
- `apps/backend/src/index.ts`.
- `apps/backend/.env.example`.

### Listener behavior

The backend watches for `AuthorizationGranted` events and extracts:

- mandate ID;
- session key;
- target;
- amount;
- payment reference;
- transaction hash.

Only confirmed events may call the mock BaaS layer.

### Mock BaaS behavior

```text
AuthorizationGranted detected
Issuing mock VCC
Amount: Rp52.000
Mock card: **** **** **** 4242
Settlement status: SUCCESS
```

### Required safeguards

- Do not process settlement directly from an agent HTTP request.
- Do not settle based only on an off-chain message.
- Do not settle reverted transactions.
- Add basic event idempotency using transaction hash or payment reference.
- Log rejected or ignored events clearly.

### Acceptance criteria

- Valid authorization produces one mock settlement.
- Invalid target produces no settlement.
- Over-cap request produces no settlement.
- Duplicate event processing does not create duplicate settlement.
- Logs make the authorization-to-settlement relationship obvious.

## 12. Milestone M6: Telegram Interface

### Objective

Make the demo feel like an AI-agent payment workflow without making natural-language intelligence a dependency for the MVP.

### Files

- `apps/telegram-bot/package.json`.
- `apps/telegram-bot/src/bot.ts`.
- `apps/telegram-bot/.env.example`.

### Commands

```text
/start
/mandate_food
/normal
/attack_target
/attack_amount
/revoke
/status
```

### Behavior

| Command | Expected behavior |
|---|---|
| `/start` | Explain the demo briefly |
| `/mandate_food` | Create a Rock Burger mandate with a Rp60.000 cap |
| `/normal` | Submit a valid Rp52.000 authorization |
| `/attack_target` | Attempt a payment to Evil Store and show rejection |
| `/attack_amount` | Attempt a Rp500.000 payment and show cap rejection |
| `/revoke` | Revoke the active mandate |
| `/status` | Show mandate state and remaining allowance |

### Acceptance criteria

- Commands call the same contract flow as the CLI.
- Successful and failed requests are visible to the user.
- `/status` shows current on-chain state.
- Missing Telegram credentials are documented instead of hidden.

## 13. Milestone M7: Documentation and Submission Assets

### `docs/ARCHITECTURE.md`

Document:

- the product thesis;
- the problem;
- the on-chain/off-chain boundary;
- contract responsibilities;
- backend responsibilities;
- trust assumptions;
- mocked components;
- why blockchain is used;
- why fiat stays off-chain;
- production roadmap;
- limitations.

### `docs/DEMO_SCRIPT.md`

Write a short presentation sequence:

1. Explain the payment risk of AI agents.
2. Create the user mandate.
3. Run the valid payment.
4. Show the authorization event.
5. Trigger the malicious target attack.
6. Show the contract revert.
7. Trigger the overspending attack.
8. Show the cap revert.
9. Show that only the valid event triggers mock settlement.
10. Revoke the mandate.
11. Attempt another payment and show rejection.

### `docs/RISK_AND_LIMITATIONS.md`

Document that:

- fiat settlement is mocked;
- the system is not production-ready;
- prompt injection is contained, not fully solved;
- AI decisions may still be wrong within a valid mandate;
- keys and session keys still require secure custody;
- merchant identity and allowlists are simplified;
- KYC, AML, compliance, and disputes are not implemented;
- privacy, multichain, gas abstraction, and ERC-4337 are not part of the first MVP.

### `README.md`

Include:

- project name;
- problem;
- solution;
- Web3 rationale;
- architecture diagram or flow;
- setup instructions;
- contract commands;
- demo commands;
- backend commands;
- Telegram commands if available;
- deployed contract address only if verified;
- mocked components;
- limitations;
- hackathon track alignment.

### Acceptance criteria

- A judge can understand the product in under two minutes.
- A developer can run the core tests using the README.
- A reviewer can distinguish real, mocked, on-chain, and off-chain components.
- The demo script clearly emphasizes rejected attacks, not only successful payments.

## 14. Milestone M8: Final Verification

### Contract verification

```bash
cd contracts
forge fmt --check
forge build
forge test -vvv
```

### Demo verification

```bash
cd apps/demo-runner
npm install
npm run demo
```

### Backend verification

```bash
cd apps/backend
npm install
npm run dev
```

### Final behavior checklist

- [ ] Valid payment succeeds.
- [ ] `AuthorizationGranted` is emitted for valid payment.
- [ ] Allowlisted target is enforced.
- [ ] Non-allowlisted target is rejected.
- [ ] Single payment above cap is rejected.
- [ ] Cumulative spending above cap is rejected.
- [ ] Expired mandate is rejected.
- [ ] Revoked mandate is rejected.
- [ ] Wrong session key is rejected.
- [ ] Invalid requests do not increase `spentAmount`.
- [ ] Invalid requests do not emit `AuthorizationGranted`.
- [ ] Mock settlement runs only after a valid event.
- [ ] Attack flows never trigger mock settlement.
- [ ] Deployment information is recorded only when verified.
- [ ] README setup instructions are accurate.
- [ ] Demo script can be followed without undocumented steps.

## 15. Definition of Done

The MVP is done when all of the following are true:

1. The contract builds successfully.
2. All critical Foundry tests pass.
3. A valid authorization succeeds.
4. A malicious target request reverts.
5. An over-cap request reverts.
6. Revocation prevents further authorization.
7. The local demo reproduces normal and attack flows.
8. The backend settles only after `AuthorizationGranted`.
9. The contract is deployed to Base Sepolia or deployment is ready and documented.
10. README, architecture, risks, and demo script are complete.
11. No unsupported feature is presented as production-ready.
12. The final presentation clearly communicates that Leash protects spending authority while fiat settlement remains off-chain.

## 16. Execution Priority When Time Is Limited

Execute in this exact order:

1. `LeashMandate.sol`.
2. Foundry security tests.
3. Local CLI demo.
4. Base Sepolia deployment.
5. Backend event listener.
6. Mock BaaS settlement.
7. Telegram bot.
8. Dashboard or UI polish.
9. ERC-4337 or paymaster experiments.

The project is successful when the enforcement proof is clear and reproducible. UI polish must not delay the core authorization and rejection flows.

