# Leash

Leash is a programmable spending firewall for AI agents.

> We do not put money on-chain. We put spending authority on-chain.

## Problem

Payment-capable AI agents can be manipulated into paying the wrong merchant, overspending, using an unbounded session key, or continuing after the user revokes permission.

## Solution

A user registers an on-chain mandate containing:

- the authorized session key;
- an allowlist of target addresses;
- a cumulative spending cap;
- an expiry timestamp;
- an irreversible revocation state.

Every agent payment request passes through LeashMandate. A valid request updates cumulative spending and emits AuthorizationGranted. An invalid request reverts, emits no authorization, and is ineligible for settlement.

## Why Web3

The mandate and authorization trail live on an independently verifiable execution layer instead of only inside an application database. Users and third parties can audit the policy, revocation, cumulative spending, and authorization evidence. Fiat settlement remains off-chain because banking, cards, compliance, disputes, refunds, and custody still belong to existing payment rails.

This MVP does not make the fiat backend trustless. It proves a protocol in which a conforming backend settles only after confirmed on-chain authorization.

## Architecture

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

## Default Demo

- target: Rock Burger;
- cap: 60,000 units;
- valid authorization: 52,000;
- Evil Store attack: TargetNotAllowed;
- 500,000 attack: AmountExceedsCap;
- post-revocation attempt: Revoked;
- final spent amount: 52,000;
- mock settlement count: exactly one.

The contract amount is currency-agnostic. The demo displays one unit as one Indonesian rupiah.

## Prerequisites

- Foundry and Anvil;
- Node.js 20 or newer;
- npm;
- ripgrep.

Verified development environment:

- Foundry and Anvil 1.5.1-stable;
- Node.js 24.12.0;
- npm 11.6.2;
- Solidity 0.8.24.

## Contract Tests

~~~bash
cd contracts
forge fmt --check
forge build
forge test -vvv
~~~

The current suite contains 25 passing tests covering registration, authorization, cumulative cap, allowlist, expiry boundary, revocation, wrong session key, zero amount, state preservation, and absence of authorization logs for attacks.

## One-Shot Local Demo

Install dependencies once:

~~~bash
cd apps/demo-runner
npm install

cd ../backend
npm install
~~~

Then run from the repository root:

~~~bash
./scripts/run-local-demo.sh
~~~

The script starts only its own Anvil process, deploys through the Foundry deployment script, runs real successful and reverted transactions, replays confirmed events through the backend, asserts exactly one settlement, and stops its Anvil process.

## Manual Demo Runner

Copy apps/demo-runner/.env.example to .env and provide local or testnet values:

~~~bash
cd apps/demo-runner
npm install
npm run typecheck
npm run demo
~~~

Owner and session-key private keys must be different and funded on the selected network.

## Backend

Copy apps/backend/.env.example to .env. The backend supports:

- live mode for continuous confirmed-block polling;
- once mode for deterministic backfill and verification.

~~~bash
cd apps/backend
npm install
npm run typecheck
npm test
npm run dev
~~~

The backend has no HTTP settlement endpoint. Its settlement processor accepts decoded AuthorizationGranted events from the configured contract only.

## Telegram

Copy apps/telegram-bot/.env.example to .env:

~~~bash
cd apps/telegram-bot
npm install
npm run typecheck
npm run dev
~~~

Commands:

~~~text
/start
/mandate_food
/normal
/attack_target
/attack_amount
/revoke
/status
~~~

Runtime requires TELEGRAM_BOT_TOKEN. Without a token, source compilation can still be verified. Reverted attacks are simulated by default; set BROADCAST_REVERTS=true only on a funded test network when actual reverted receipts are desired.

## Base Sepolia

The deployment script is contracts/script/DeployLeashMandate.s.sol. Required environment variables are documented in contracts/.env.example.

No Base Sepolia address is listed because deployment credentials were unavailable during verification. See docs/DEPLOYMENT.md for the exact command and status.

## Mocked Components

- fiat movement;
- BaaS integration;
- virtual-card issuance;
- merchant identity verification;
- natural-language AI interpretation.

## Limitations

- not a production payment system;
- backend fiat remains trusted to follow the protocol;
- prompt injection is contained, not fully solved;
- private and session keys still need production custody;
- idempotency is process-local;
- no KYC, AML, compliance, disputes, refunds, or chargebacks;
- no gas abstraction, ERC-4337, privacy, or multichain;
- Base Sepolia is a testnet;
- AuthorizationGranted is authorization evidence, not settlement finality.

## Documentation

- docs/PRD_Leash_ID.md
- docs/ARCHITECTURE.md
- docs/DEMO_SCRIPT.md
- docs/RISK_AND_LIMITATIONS.md
- docs/DEPLOYMENT.md
- docs/VERIFICATION.md

## Hackathon Alignment

Leash targets Track 1: Payments and Financial Infrastructure. It demonstrates programmable payment authorization, policy enforcement, auditable delegation, and a strict authorization-to-fiat-settlement boundary.

