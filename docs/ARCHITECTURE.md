# Leash Architecture

## Thesis

Leash keeps money in fiat rails while moving enforceable AI-agent spending authority on-chain.

## Problem

An AI agent may be operationally able to pay but can be manipulated by prompt injection, use the wrong target, overspend, use an unscoped session key, or continue after revocation. A backend-only rule is controlled and audited by the same application that executes settlement.

## System Flow

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

1. Persistent idempotency and durable listener cursor.
2. Audited key custody and rotating session keys.
3. Production merchant identity registry.
4. BaaS partner integration with event-proof verification.
5. Compliance, fraud, refund, and dispute workflows.
6. Gas abstraction only after the core security model remains stable.
7. Privacy and multichain evaluation.

