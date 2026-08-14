## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## What this is

Leash is a programmable spending firewall for AI agents: a Solidity mandate contract is the *only* enforcement point for an AI agent's spending (allowlist, cumulative cap, expiry, revocation). Everything off-chain — the agent harness, the backend, the bot — is deliberately unauthoritative and can be fully manipulated; only the contract's revert/accept decision is trusted. See README.md for the product pitch and docs/ARCHITECTURE.md / docs/RISK_AND_LIMITATIONS.md for the full design and known limitations.

## Repo layout

- `contracts/` — Foundry project. `src/LeashMandate.sol` is the entire enforcement surface (register/authorize/revoke). `test/LeashMandate.t.sol` is the security test suite. `script/DeployLeashMandate.s.sol` deploys it.
- `apps/web/` — Next.js 15 (App Router, React 19) frontend. Mandate creation/inspection UI, an on-chain attempt feed, and a chat-driven agent demo.
- `apps/backend/` — Node/tsx service that polls confirmed `AuthorizationGranted` logs and drives a mock BaaS settlement (no real money moves, no HTTP settlement endpoint — it only reacts to decoded chain events).
- `apps/demo-runner/` — Standalone script that deploys, runs real successful/reverted transactions against a local/testnet chain, and asserts backend settlement counts.
- `apps/telegram-bot/` — grammy-based Telegram bot exposing mandate/attack/status commands against the same contract.
- `scripts/run-local-demo.sh` — one-shot end-to-end demo: spins up its own Anvil, deploys, runs the attack/success scenarios, replays through the backend, asserts exactly one settlement, tears down.

## Commands

Contracts (from `contracts/`):
```bash
forge fmt --check
forge build
forge test -vvv
```

Web (from `apps/web/`):
```bash
npm install
npm run dev         # next dev --port 3000
npm run build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

Backend (from `apps/backend/`):
```bash
npm install
npm run typecheck
npm test            # tsx --test src/mockBaas.test.ts
npm run dev          # tsx src/index.ts — requires .env from .env.example (RPC_URL, CONTRACT_ADDRESS, LISTENER_MODE=live|once, ...)
```

Demo runner (from `apps/demo-runner/`):
```bash
npm install
npm run typecheck
npm run demo         # tsx src/demo.ts — requires .env with separate funded owner + session-key private keys
```

Telegram bot (from `apps/telegram-bot/`):
```bash
npm install
npm run typecheck
npm run dev           # tsx src/bot.ts — requires TELEGRAM_BOT_TOKEN
```

Full local demo (from repo root, after installing demo-runner and backend deps):
```bash
./scripts/run-local-demo.sh
```

Running a single Foundry test: `forge test --match-test <testName> -vvv` (from `contracts/`).

## Architecture notes

**Contract (`contracts/src/LeashMandate.sol`) is the entire trust boundary.** A `Mandate` is `{owner, sessionKey, maxAmount, spentAmount, validUntil, revoked}` plus a per-mandate target allowlist. Three external functions: `registerMandate`, `authorizePayment` (session-key-only; checks revoked/expiry/allowlist/cap in that order, reverts with a named custom error on failure, emits `AuthorizationGranted` on success), and `revokeMandate` (owner-only, one-way). There are exactly eight custom errors (`NotOwner`, `InvalidMandate`, `Revoked`, `Expired`, `TargetNotAllowed`, `AmountExceedsCap`, `MandateAlreadyExists`, `ZeroAmount`) — this is the whole refusal vocabulary of the product, and it is mirrored (not reimplemented) everywhere else in the repo.

**Nothing off-chain re-validates.** `apps/web/src/app/api/agent/route.ts` (the AI agent harness, using `@anthropic-ai/sdk` with a `pay_merchant` tool) calls `simulateContract`/`writeContract` directly with zero allowlist/cap/expiry checks of its own — this is intentional, documented in that file's header comment: adding an app-layer check would defeat the demonstration that only the chain can be trusted. The Telegram bot and demo-runner follow the same pattern.

**ABI/error mirroring lives in `apps/web/src/lib/leash.ts`.** It re-declares the contract ABI by hand (not generated) and maps each custom error name to user-facing `{problem, recovery}` copy in `ERROR_COPY`. If `LeashMandate.sol`'s functions, events, or errors change, update this file, `apps/backend/src/listener.ts`'s expected event shape, and the bot in tandem — there is no shared codegen step.

**Settlement flow is one-directional and confirmation-gated.** `apps/backend/src/listener.ts` polls `AuthorizationGranted` logs up to `latest - (confirmations - 1)`, sorts them by block/tx/log index, and feeds each to `MockBaasSettlementProcessor` (`apps/backend/src/mockBaas.ts`). It loads the contract ABI from the Foundry build artifact at `contracts/out/LeashMandate.sol/LeashMandate.json` — `forge build` must run before the backend/demo-runner will start. `LISTENER_MODE=once` is deterministic backfill-and-exit (used by the demo script and tests); `live` polls forever.

**Currency display is Indonesian rupiah only** (`formatRupiah` in `apps/web/src/lib/leash.ts`); the contract itself is currency-agnostic — amounts are just `uint256`.

Everything in `docs/` and the root-level `*_PLAN.md` / `*_PROMPT.md` files are planning/spec documents, not source of truth for current code — prefer reading the actual `apps/*/src` and `contracts/src` over them when they might have drifted.
