# Leash

Leash is a programmable spending firewall for AI agents.

> We do not put money on-chain. We put spending authority on-chain.

**NTU InnovateX Hackathon 2026 — Track 2: Web3 Applications, AI Agents and Real-World Use Cases**

## Problem

An AI agent that can pay is an agent that reads the outside world — merchant pages, search results, messages. Any of those surfaces can carry a foreign instruction, and an LLM has no hard boundary between "data I am reading" and "commands I am following." No attack is even required: agents also just misread amounts, pick the wrong merchant, or repeat an order.

Today the only defense is a spending limit enforced by an `if` statement on the agent operator's own server, with the approval record sitting in that same operator's database. When something goes wrong, the only evidence the user ever agreed lives with one of the parties to the dispute. That is not evidence — it is a claim.

Every existing effort in this space — x402, ACP, Agentcard, Coinbase Agentic Wallets — answers *how does an agent pay* or *who is this agent*. Almost nothing answers the question that actually loses people money: **is this agent allowed to do this, who authorized it, and how do you prove it after the fact?**

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

## What This Does and Does Not Solve

Leash does not solve prompt injection — that lives in the model's reasoning layer, not the ledger. No contract can make an LLM stop believing a false instruction. What it provides is containment: the blast radius of a hijacked or hallucinating agent is bounded exactly by the mandate a human actually approved, and every attempt beyond it is permanently recorded on-chain.

The contract also enforces hard constraints, not semantic correctness. It checks which session key, which target, how much, until when — not whether the purchase matches what the user meant. A mandate scoped to "Rock Burger, max Rp60,000" cannot be redirected to an unlisted merchant or exceed its cap, but it also cannot tell a wanted order from an unwanted one at the same merchant under the same cap. Tight caps and short expiries are a mitigation, not a solved problem.

## Architecture

~~~mermaid
flowchart TB
    Owner(["Owner wallet"])

    subgraph Callers["Session-key callers — zero validation of their own"]
        Agent["apps/agent — CLI"]
        WebChat["apps/web — chat API route"]
        Bot["apps/telegram-bot"]
    end

    subgraph OnChain["LeashMandate.sol — Base Sepolia"]
        Register["registerMandate<br/>sessionKey · maxAmount · validUntil · targets[]"]
        Authorize{{"authorizePayment<br/>mandateId · target · amount · paymentRef"}}
        Revoke["revokeMandate — one-way"]
    end

    subgraph BackendGroup["apps/backend — independent poller"]
        Listener["confirmed-block listener<br/>watches AuthorizationGranted only"]
        Mock["mock BaaS settlement<br/>idempotent on event id + paymentRef"]
    end

    Owner -->|"1"| Register
    Owner -.->|"one-way"| Revoke
    Agent --> Authorize
    WebChat --> Authorize
    Bot --> Authorize

    Authorize -->|"exists → sessionKey → !revoked →<br/>!expired → allowlisted → amount≠0 → within cap"| Valid{"Every check passes?"}
    Valid -->|yes| Granted["spentAmount += amount<br/>emit AuthorizationGranted"]
    Valid -->|no| Reverted["revert — one of:<br/>InvalidMandate · NotOwner · Revoked · Expired ·<br/>TargetNotAllowed · ZeroAmount · AmountExceedsCap<br/>atomic — no state change, no log"]

    Granted -.-> Listener
    Listener --> Mock
    Mock -->|"mock VCC"| Merchant["Merchant — mocked"]
~~~

Full check-by-check breakdown: `docs/ARCHITECTURE.md`.

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

The current suite contains 26 passing tests covering registration, MandateRegistered target logs, authorization, cumulative cap, allowlist, expiry boundary, revocation, wrong session key, zero amount, state preservation, and absence of authorization logs for attacks.

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

## AI Agent

Copy apps/agent/.env.example to .env. `pay_merchant` performs no allowlist, cap, or expiry check of its own — it calls the contract and reports back whatever the chain says. The agent is meant to be manipulable; the contract is the only real gate.

~~~bash
cd apps/agent
npm install
npm run typecheck
npm run agent -- "order me a burger from Rock Burger"
~~~

`npm run agent` requires an already-registered mandate (`MANDATE_ID` in .env). `npm run scenario` registers its own mandate and runs a two-turn transcript: a normal order, then a message with an injected instruction trying to redirect payment to an unlisted merchant. The agent actually attempts the redirected payment; the contract actually reverts it. Nothing about the injection is scripted or faked.

## Telegram

Copy apps/telegram-bot/.env.example to .env:

~~~bash
cd apps/telegram-bot
npm install
npm run typecheck
npm run dev
~~~

Commands and natural chat:

~~~text
/start
/mandate_food
/normal
/attack_target
/attack_amount
/revoke
/status

belikan burger 52 ribu
bayar rock burger 52000
bayar evil store 50000
bayar rock burger 500000
cek status
batalkan mandate
carikan burger murah dan bayar kalau aman
buka halaman promo burger
~~~

Runtime requires TELEGRAM_BOT_TOKEN. Without a token, source compilation can still be verified. Reverted attacks are simulated by default; set BROADCAST_REVERTS=true only on a funded test network when actual reverted receipts are desired.

## Base Sepolia

The deployment script is contracts/script/DeployLeashMandate.s.sol. Required environment variables are documented in contracts/.env.example.

Latest confirmed deployment:

- network: Base Sepolia;
- chain ID: 84532;
- contract: 0x4D74d9469de72B9aACBe0a696e769EEA817D4988;
- deployment transaction: 0x0804141b25c2eb758c2bd2c6a9236ef6e346a0cef33bb9f7e69d2ca662c58b9c;
- deployment block: 45423055;
- explorer: https://sepolia.basescan.org/address/0x4D74d9469de72B9aACBe0a696e769EEA817D4988;
- source verification: not recorded in this repo.

See docs/DEPLOYMENT.md for deployment and verification details.

## Mocked Components

- fiat movement;
- BaaS integration;
- virtual-card issuance;
- merchant identity verification.

## Limitations

- not a production payment system;
- backend fiat remains trusted to follow the protocol;
- prompt injection is contained, not fully solved — apps/agent/src/scenario.ts demonstrates a real agent actually being fooled, not a scripted stand-in;
- private and session keys still need production custody, and so does ANTHROPIC_API_KEY;
- idempotency is process-local;
- no KYC, AML, compliance, disputes, refunds, or chargebacks;
- no gas abstraction, ERC-4337, privacy, or multichain;
- Base Sepolia is a testnet;
- AuthorizationGranted is authorization evidence, not settlement finality.

## Documentation

- docs/PRD_Leash_EN.md — full product narrative, problem framing, and pitch
- docs/ARCHITECTURE.md — system flow, trust model, production roadmap
- docs/DEMO_SCRIPT.md
- docs/RISK_AND_LIMITATIONS.md
- docs/DEPLOYMENT.md
- docs/VERIFICATION.md
- docs/deck.md — Marp slide deck

## Hackathon Alignment

Leash targets **Track 2: Web3 Applications, AI Agents and Real-World Use Cases**.

- **Technical quality** — the enforcement core is real, not mocked: a Solidity contract, 26 passing Foundry tests, and real reverted EVM receipts for every rejection.
- **Innovation** — most agentic-payments work answers *how an agent pays* or *who the agent is*. Leash answers *what the agent is allowed to do, and who can prove it*, and separates that authority from settlement.
- **Real-world impact** — the core claim (prompt injection and hallucination are payments problems, not just AI problems) generalizes past food delivery to any agent-initiated spend: procurement, treasury, subscriptions.
- **Demo** — a manipulated agent genuinely attempts a redirected payment (`apps/agent/src/scenario.ts`); the contract rejects it live, with a public, checkable revert.
- **Track relevance** — an agentic workflow with an intelligent on-chain enforcement layer, addressing a real-world need (agent spending abuse) that existing payment infrastructure does not cover.
