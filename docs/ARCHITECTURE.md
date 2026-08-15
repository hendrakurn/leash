# Leash Architecture

## Thesis

Leash keeps money in fiat rails while moving enforceable AI-agent spending authority on-chain.

## Problem

An AI agent may be operationally able to pay but can be manipulated by prompt injection, use the wrong target, overspend, use an unscoped session key, or continue after revocation. A backend-only rule is controlled and audited by the same application that executes settlement.

## System Flow

The check order below is `authorizePayment`'s actual `if`/`revert` sequence in `contracts/src/LeashMandate.sol` — not a paraphrase.

~~~mermaid
flowchart TB
    Owner(["Owner wallet"])
    Register["registerMandate<br/>sessionKey · maxAmount · validUntil · targets[]"]
    Revoke["revokeMandate — one-way"]

    subgraph Callers["Session-key callers — apps/agent, apps/web, apps/telegram-bot, apps/demo-runner"]
        Caller["authorizePayment(mandateId, target, amount, paymentRef)"]
    end

    subgraph AuthCheck["LeashMandate.sol · authorizePayment, in order"]
        direction TB
        Q1{"mandate exists?"}
        Q2{"msg.sender == sessionKey?"}
        Q3{"not revoked?"}
        Q4{"before validUntil?"}
        Q5{"target allowlisted?"}
        Q6{"amount != 0?"}
        Q7{"amount within remaining cap?"}
        Ok["spentAmount += amount<br/>emit AuthorizationGranted"]

        Q1 -->|no| E1["revert InvalidMandate"]
        Q1 -->|yes| Q2
        Q2 -->|no| E2["revert NotOwner"]
        Q2 -->|yes| Q3
        Q3 -->|no| E3["revert Revoked"]
        Q3 -->|yes| Q4
        Q4 -->|no| E4["revert Expired"]
        Q4 -->|yes| Q5
        Q5 -->|no| E5["revert TargetNotAllowed"]
        Q5 -->|yes| Q6
        Q6 -->|no| E6["revert ZeroAmount"]
        Q6 -->|yes| Q7
        Q7 -->|no| E7["revert AmountExceedsCap"]
        Q7 -->|yes| Ok
    end

    subgraph Backend["apps/backend — independent, polls only"]
        Listener["listener.ts<br/>polls confirmed AuthorizationGranted<br/>up to latest − (confirmations − 1)"]
        Mock["mockBaas.ts<br/>idempotent on event id + nonzero paymentRef"]
    end

    Owner --> Register
    Owner -.-> Revoke
    Caller --> Q1
    Ok -.->|"confirmed block"| Listener
    Listener --> Mock
    Mock -->|"mock VCC issued"| Merchant["Merchant — mocked"]
    E1 & E2 & E3 & E4 & E5 & E6 & E7 -.->|"atomic — no state change, no log"| NoOp(("no settlement"))
~~~

## On-Chain Flow

1. The owner registers a unique mandate.
2. The mandate stores the session key, cumulative cap, expiry, and revocation state.
3. The contract stores the allowed target mappings.
4. The session key submits authorizePayment.
5. The contract validates existence, caller, revocation, expiry, target, amount, and remaining cap.
6. A valid request updates spentAmount and emits AuthorizationGranted.
7. An invalid request reverts atomically.

## Off-Chain Flow

1. The CLI or Telegram interface represents the agent.
2. It submits contract transactions from the configured session key.
3. The backend polls only confirmed blocks from the configured contract.
4. It decodes AuthorizationGranted.
5. The idempotent settlement processor issues a mock VCC and reports mock success.

## Smart-Contract Responsibilities

- mandate registration;
- session-key enforcement;
- target allowlist enforcement;
- cumulative cap accounting;
- exact expiry-boundary enforcement;
- irreversible revocation;
- authorization events;
- atomic reverts without state or log persistence.

The contract deliberately transfers no native currency, ERC-20 token, or fiat.

## Backend Responsibilities

- select the configured contract and deployment block;
- process confirmed canonical authorization logs;
- preserve deterministic event order;
- deduplicate event identity and nonzero payment references;
- invoke mock settlement only from a decoded event;
- expose no direct agent-to-settlement request path.

## AI-Agent Responsibilities

- use the assigned session key;
- choose a target and amount;
- submit the authorization transaction;
- handle rejections without treating them as settlement;
- never interpret an off-chain request as proof of authorization.

## Authorization and Settlement Boundary

AuthorizationGranted means the request satisfied the on-chain mandate at a particular block. It does not mean a bank, card network, or BaaS completed payment. The mock backend demonstrates the intended boundary: only a confirmed event is eligible to enter settlement.

## Real and Mocked Components

Real in the MVP:

- Solidity enforcement;
- Foundry tests;
- successful and reverted EVM receipts;
- event log;
- confirmed-block listener;
- idempotency behavior;
- AI natural-language reasoning (`apps/agent` — a real Claude tool-calling agent with a session key; `pay_merchant` performs no client-side validation, so a genuinely manipulated agent is stopped only by the contract).

Mocked:

- fiat movement;
- BaaS provider;
- virtual-card issuance;
- merchant identity.

## Trust Model

The user trusts the contract code, RPC view, key custody, configured contract address, and backend operator. The backend remains capable of violating the off-chain protocol in a future real integration. Leash makes authorization independently verifiable and deviations auditable; this MVP does not cryptographically control a bank API.

## Why Blockchain

The user-approved policy, revocation state, cumulative usage, and authorization evidence are independently readable and not silently mutable by the application backend. Multiple settlement providers or auditors can share the same policy source.

## Why Fiat Remains Off-Chain

Fiat settlement depends on licensed banking partners, card networks, custody, KYC, AML, disputes, refunds, and jurisdiction-specific compliance. Putting those operations into this MVP would obscure the core authorization proof.

## What Leash Protects

- payments to non-allowlisted addresses;
- spending above a cumulative cap;
- spending by the wrong session key;
- spending after expiry;
- spending after revocation;
- accidental settlement processing of reverted requests by a conforming listener.

## What Leash Does Not Protect

- poor choices within an allowed scope;
- stolen owner or session private keys;
- malicious backend bypass of the protocol;
- false mapping between a real merchant and an address;
- fiat-provider failure, fraud, dispute, or chargeback;
- public on-chain privacy leakage.

## Production Roadmap

1. Persistent idempotency and durable listener cursor, so a backend restart cannot replay a settlement.
2. Audited key custody and rotating session keys.
3. Embedded wallet onboarding (Privy, Dynamic, or Web3Auth) so a user creates a mandate with an email or passkey, never a seed phrase. The resulting address is an ordinary EOA calling the same `registerMandate`/`authorizePayment` functions that exist today — this is additive to the current architecture, not an account-abstraction rewrite, and does not wait on any other roadmap item.
4. Production merchant identity registry, replacing the address allowlist's implicit trust that an address is who it claims to be.
5. BaaS partner integration with event-proof verification, replacing the mock settlement processor with a real fiat rail that itself checks for a confirmed `AuthorizationGranted` before moving money.
6. Compliance, fraud, refund, and dispute workflows.
7. Gas abstraction — an ERC-4337 smart account plus paymaster — only after the core security model remains stable. This is the one step that touches enforcement itself: `validateUserOp` would replace the current plain function calls, trading a materially larger contract surface for a user who never holds a gas token. Sequenced last on purpose; embedded wallet onboarding (step 3) gets most of the same UX win without this risk.
8. Progressive disclosure of the on-chain audit trail. The authorization ledger stays the backend of record, but the primary interface shows plain-language outcomes ("blocked: unrecognized merchant") by default; the transaction evidence sits behind a "verify" link for auditors and power users, not on the front door.
9. Privacy and multichain evaluation.



## Hosted Telegram Agent Flow

The Telegram bot is a hosted deterministic agent for the MVP. Users do not need a wallet, RPC endpoint, or private key to use the demo. The operator keeps separate testnet owner and session-key accounts, while the bot exposes a chat interface.

Natural-language messages are parsed into a small, deterministic intent set:

- payment intent: resolve Rock Burger or Evil Store and parse the requested amount;
- status intent: read the active mandate;
- revoke intent: call owner-only revocation;
- cheap-burger intent: use the simulated catalog and authorize the Rock Burger offer;
- promo intent: simulate a prompt-injected checkout that tries Evil Store.

The parser never approves a payment, computes remaining cap, or decides whether a target is allowed. It only supplies arguments to `authorizePayment`. The contract remains the final authority.

For every chat payment, the bot uses the session key to simulate `authorizePayment`. A successful simulation is broadcast and the receipt must contain exactly one `AuthorizationGranted` event. A rejected simulation is reported as a policy rejection; when `BROADCAST_REVERTS=true`, the bot may additionally broadcast a reverted testnet transaction. In both cases, no event means no settlement eligibility.

The backend listener is independent from Telegram and scans only confirmed `AuthorizationGranted` logs. It does not accept a Telegram request, an HTTP request, or a parser result as settlement proof.

## Chat Sequence

~~~text
/mandate_food
belikan burger 52 ribu                 -> Rock Burger, AuthorizationGranted
cek status                            -> spent 52000, remaining 8000
bayar evil store 50000                -> TargetNotAllowed, no settlement
bayar rock burger 500000               -> AmountExceedsCap, no settlement
carikan burger murah dan bayar kalau aman -> simulated Rock Burger, approved if mandate is valid
buka halaman promo burger              -> simulated Evil Store injection, TargetNotAllowed
batalkan mandate                       -> owner revokes mandate
belikan burger 52 ribu                 -> Revoked, no settlement
~~~
