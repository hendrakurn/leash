# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js App Router + TypeScript + Tailwind, with wagmi/viem for chain access. Chosen for wagmi ecosystem support and to match the repository's existing TypeScript ESM + viem convention (`apps/backend`, `apps/demo-runner`, `apps/telegram-bot` all use viem). Server components serve the landing surface; wallet-dependent routes stay client-side.

A second new app, `apps/agent`, is a Node service rather than a UI: TypeScript ESM, `@anthropic-ai/sdk` on `claude-opus-5` driving the Tool Runner loop, viem for chain calls.

## Users

**Primary: a person delegating limited spending power to an AI agent.** They want the agent's convenience — "order me lunch" — without granting it unbounded access to their money. They set the boundary once and expect it to hold even if the agent is later manipulated, buggy, or compromised.

The web surface is built as the real product for this person. Hackathon judges evaluate by stepping into that role and using it, not through a separate demo mode or evaluator view.

Secondary audiences named in `docs/PRD_Leash_EN.md`, not the design target: payments and BaaS teams needing verifiable authorization evidence, and Track 2 hackathon reviewers.

## Product Purpose

Leash is a programmable spending firewall for AI agents. A user registers an on-chain mandate — authorized session key, target allowlist, cumulative cap, expiry, revocation — and every agent payment request must pass it.

Money never moves on-chain. Spending *authority* does. Fiat settlement stays on existing rails; the contract decides whether a payment is eligible to reach them.

Success is that a manipulated agent cannot spend outside the boundary, and that anyone can independently verify this from chain state rather than trusting the operator's database.

## Positioning

The enforceable policy, revocation state, cumulative usage, and authorization trail live on an independently verifiable execution layer, not solely inside the application that also executes settlement. A backend-only spending rule is written, audited, and enforced by the same party that moves the money; Leash separates those.

The MVP does not make the fiat backend trustless. It proves a protocol in which a *conforming* backend settles only after confirmed on-chain authorization, and in which deviations are auditable by third parties.

## Operating Context

- **The mandate.** Owner registers `mandateId`, session key, `maxAmount`, `validUntil`, and an address allowlist. Owner and session key are different keys — the agent never holds the owner key.
- **The agent acts.** The session key submits `authorizePayment`. Valid requests increment `spentAmount` and emit `AuthorizationGranted`. Invalid requests revert atomically, emit nothing, and change no state.
- **Settlement is downstream.** A backend polls confirmed blocks for `AuthorizationGranted` only. There is no HTTP endpoint an agent can call to request settlement — the confirmed event is the sole trigger.
- **Revocation is one-way.** Once revoked, a mandate cannot be un-revoked.

Reference scenario used throughout the repo and demo: cap 60,000 units, allowlist contains "Rock Burger", valid payment 52,000, remaining 8,000. Three attacks are rejected — a payment to non-allowlisted "Evil Store" (`TargetNotAllowed`), a 500,000 over-cap payment (`AmountExceedsCap`), and a post-revocation payment (`Revoked`). Exactly one mock settlement results.

Amounts are currency-agnostic in the contract; the demo displays one unit as one Indonesian rupiah (Rp).

## Capabilities and Constraints

**Real and verified today**
- `contracts/src/LeashMandate.sol` — `registerMandate`, `authorizePayment`, `revokeMandate`; eight custom errors; 25 passing Foundry tests.
- Successful and reverted EVM receipts, with zero `AuthorizationGranted` logs on every rejection.
- Confirmed-block listener with deterministic event ordering (`apps/backend`).
- Idempotent mock settlement, deduplicating on both event identity and non-zero `paymentRef`.
- Deterministic local end-to-end script (`scripts/run-local-demo.sh`), verified passing.

**Mocked**
- Fiat movement, BaaS provider, virtual-card issuance, merchant identity verification.
- AI natural-language interpretation — *currently*. `apps/agent` replaces this with a real LLM; the demo's "prompt injection attack" is presently a hardcoded call, not an actual injection.

**Hard constraints**
- Policy enforcement happens on-chain only. No client-side allowlist, cap, or expiry check anywhere in the frontend or the agent's tools — duplicating the gate off-chain would relocate trust to the exact layer the product argues against.
- The agent is meant to be manipulable. A successful prompt injection that the contract rejects is the demonstration, not a bug.
- `AuthorizationGranted` is the only settlement trigger.
- Idempotency is process-local; a backend restart replays.
- Expiry is exclusive: `block.timestamp >= validUntil` reverts.

**Open / undecided**
- No Base Sepolia deployment exists. `docs/DEPLOYMENT.md` records `SKIPPED_CREDENTIALS`; no public address, transaction, or explorer link may be claimed until one does.
- `MandateRegistered` omits the targets array and `allowedTargets` is a non-enumerable mapping, so a mandate's allowlist cannot currently be reconstructed from chain state or logs. `apps/telegram-bot/src/bot.ts:337` discloses this limitation to the user. A pending contract change adds `address[] targets` to the event; any allowlist display depends on it.

**Terminology (load-bearing — do not use interchangeably)**
- *Mandate* — the on-chain policy object.
- *Session key* — the agent's key; may spend within the mandate, may not modify it.
- *Authorization* — the contract accepted a request at a given block. Not payment.
- *Settlement* — a downstream fiat action. Only ever follows a confirmed authorization.

## Brand Commitments

Name: **Leash**. Established and in use across contract, docs, and scripts.

No visual identity exists — no logo, wordmark, palette, typeface, or image assets anywhere in the repository.

An established **voice** does exist across `README.md` and `docs/`, and is binding: declarative, unhedged, technically exact, free of marketing inflation, and scrupulous about the line between proven and unproven. Representative lines:

> We do not put money on-chain. We put spending authority on-chain.

> Money stays in fiat rails. Spending authority is enforced on-chain.

Rejections are stated plainly and without euphemism (`REJECTED TargetNotAllowed`, `Settlement eligibility: NONE`). Future surfaces preserve this register.

**Pinned visual reference (binding):** `https://www.agentcard.sh/` — its typography, style, and animation are the standing preference for `apps/web`, and its craft level is the bar. Decoded from source:

- Type: Geist Sans (UI), Geist Mono (all on-chain values), `OT Neue Montreal Semi Squeezed` (display), Geist Pixel Circle/Grid/Line/Square/Triangle as texture faces.
- Ground and ink: `--paper #f2f1ec` / `--n900 #171818`, inverting for dark mode.
- Accent: ultramarine `--blue #1520b8`, `--blue-hi #2e3ae8`, `--b300 #ccdbff`. Hairlines `rgba(23,24,24,.16)`; dot ground at `.09`.
- Motion: UI transitions `.15–.2s` on `cubic-bezier(.22,1,.36,1)`; staged entrances (`wkIn`, `wkDraw`, `wkStamp`, `wkPress`) at `.34–.48s`; ambient loops `aurora 8s`, `twinkle 3.2s`, `ctaHalo 3.6s`, `mq-scroll 74s`, `caretBlink .95s steps(1)`. Radii 10–16px alongside hard 0.

Two constraints attach to this reference:

1. **agentcard.sh is a direct adjacent competitor** ("Let agents buy things", same problem space). Leash inherits its craft level and system grammar, never its identity. The differentiating signature is the refusal: approval is quiet, refusal lands as a full-field stamp on `wkStamp` timing carrying the contract's own error name. Without that inversion the surface reads as a reskin.
2. **`OT Neue Montreal Semi Squeezed` is commercial** (Pangram Pangram) and must be licensed by the user, or substituted. Geist Sans / Mono / Pixel are free from Vercel.

## Evidence on Hand

- **Verified local run** — `docs/VERIFICATION.md`: 25/25 contract tests, 5/5 backend tests, full end-to-end `PASS`, with seven local transaction hashes covering deploy, register, valid payment, three reverted attacks, and revoke. Explicitly labeled reproducible Anvil evidence, not Base Sepolia evidence.
- **Demo script** — `docs/DEMO_SCRIPT.md`, a 15-step sequence with an evidence checklist.
- **Architecture, risk, and product docs** — `docs/ARCHITECTURE.md`, `docs/RISK_AND_LIMITATIONS.md`, `docs/PRD_Leash_EN.md`.
- **Team** — two people. Contracts and backend are owned by one; `apps/web` and `apps/agent` by the other. Lanes and workflow in `TEAM_WORKFLOW.md`.

**Absences future work must not fabricate:** no public testnet deployment, no real users, no testimonials, no benchmarks, no pricing, no partner or BaaS relationship, no security audit, no press. The repository's existing standard is to record an absence rather than approximate it; that standard holds.

## Product Principles

1. **Authorization is not settlement.** The two are never conflated in code, copy, or interface. An `AuthorizationGranted` event is evidence that a request satisfied a policy at a block — not that money moved.
2. **The contract is the only gate.** Enforcement never moves off-chain for convenience. Any client-side check that duplicates the contract's logic conceals whether the real gate works.
3. **The refusal is the product.** Successes prove nothing; a green result is available from any payments system. What Leash demonstrates is what it declines, and rejections earn the most deliberate treatment in every surface.
4. **The agent is untrusted by design.** It is expected to be wrong, manipulated, or compromised. Hardening the agent rather than the boundary would defend at the wrong layer.
5. **Claim only what is verified.** Mocked components are named as mocked, unbuilt things stay unclaimed, and the gap between "we proved this" and "this would work in production" is stated rather than blurred.

## Accessibility & Inclusion

Interface and documentation language is English. The Telegram bot additionally accepts Indonesian natural-language chat (`belikan burger 52 ribu`, `cek status`), and the demo denominates amounts in Indonesian rupiah. No specific accessibility standard has been established as a requirement.
