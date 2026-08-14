# Graph Report - leash  (2026-08-14)

## Corpus Check
- 86 files · ~104,045 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 759 nodes · 1127 edges · 50 communities (43 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `be657409`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AgentSafe Brainstorm
- Web App Pages
- Forge-Std VM Scripts
- Leash Product PRD
- Forge-Std Contributing
- Web Dependencies
- Web TypeScript Config
- Architecture & Contract
- Design System
- Model B Weakness Analysis
- Pitch Deck
- Backend Config
- Codex Implementation Prompt
- Project README
- Team Workflow
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 25
- Community 26
- Community 27
- Leash Web Design System
- Community 29
- opencode.json
- Community 31
- PRD_Leash_ID.md
- Community 33
- Community 36
- Community 37
- Community 42
- Community 46
- Community 53
- Community 54
- Community 58
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 69
- Community 70

## God Nodes (most connected - your core abstractions)
1. `CheatcodesPrinter` - 29 edges
2. `Leash` - 29 edges
3. `Leash Implementation Plan` - 20 edges
4. `compilerOptions` - 16 edges
5. `7. Milestone M1: Mandate Smart Contract` - 12 edges
6. `LeashMandate Contract` - 12 edges
7. `main()` - 11 edges
8. `formatRupiah()` - 11 edges
9. `shortHex()` - 11 edges
10. `PRD — Leash (English)` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Web Frontend (apps/web)` --references--> `wagmi`  [EXTRACTED]
  TEAM_WORKFLOW.md → apps/web/package.json
- `Web Frontend (apps/web)` --references--> `tailwindcss`  [EXTRACTED]
  TEAM_WORKFLOW.md → apps/web/package.json
- `The Refusal is the Hero` --semantically_similar_to--> `Stamped Ledger Design Concept`  [INFERRED] [semantically similar]
  TEAM_WORKFLOW.md → apps/web/DESIGN.md
- `Architecture Document` --references--> `Leash`  [EXTRACTED]
  docs/ARCHITECTURE.md → README.md
- `Pitch Deck Document` --references--> `Leash`  [EXTRACTED]
  docs/deck.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Product Design Identity** — apps_web_design_system, stamped_ledger_design, refusal_stamp_component, refusal_is_hero, volt_green, refusal_red, paper_ground [EXTRACTED 0.85]
- **Demo Scenario Components** — demo_runner, rock_burger, evil_store, leashmandate_contract, local_demo_script, backend_listener, mock_baas_settlement [EXTRACTED 0.90]
- **Leash Enforcement Layer Stack** — leashmandate_contract, spending_mandate, session_key, target_allowlist, cumulative_cap, revocation_mechanism, authorization_granted_event [EXTRACTED 0.90]

## Communities (50 total, 7 thin omitted)

### Community 0 - "AgentSafe Brainstorm"
Cohesion: 0.20
Nodes (18): loadAbi(), AgentSession, createAgentSession(), createAnthropicClient(), main(), AgentConfig, loadConfig(), loadOwnerAccount() (+10 more)

### Community 1 - "Web App Pages"
Cohesion: 0.07
Nodes (55): PRESETS, Step, StepView(), Turn, createAnthropicClient(), errorResponse(), POST(), Step (+47 more)

### Community 2 - "Forge-Std VM Scripts"
Cohesion: 0.06
Nodes (23): Cheatcode, Cheatcodes, CheatcodesPrinter, cmp_cheatcode(), CmpCheatcode, Enum, EnumVariant, Error (+15 more)

### Community 3 - "Leash Product PRD"
Cohesion: 0.05
Nodes (37): 10.1 The question we will definitely be asked, 10.2 Positioning, 10. Why this wins, 1. The story, 2.1 Prompt injection is a payments problem, not just an AI problem, 2.2 Hallucination doesn't need an attacker, 2.3 Today's defenses have two gaps, 2.4 What's actually missing (+29 more)

### Community 4 - "Forge-Std Contributing"
Cohesion: 0.06
Nodes (33): Abandoned or stale pull requests, Adding cheatcodes, Asking for help, Be aware of the person behind the code, Code of Conduct, Commits, Contributing to Foundry, Contributions Related to Spelling and Grammar (+25 more)

### Community 5 - "Web Dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @anthropic-ai/sdk, geist, next, react, react-dom, @tanstack/react-query, viem (+31 more)

### Community 6 - "Web TypeScript Config"
Cohesion: 0.07
Nodes (26): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+18 more)

### Community 7 - "Architecture & Contract"
Cohesion: 0.40
Nodes (6): Agent is Untrusted by Design, Claim Only What Is Verified, Contract is the Only Gate, Fiat Stays Off-Chain, No Client-Side Policy Enforcement, Product Definition

### Community 8 - "Design System"
Cohesion: 0.08
Nodes (24): dependencies, @anthropic-ai/sdk, dotenv, viem, zod, devDependencies, tsx, @types/node (+16 more)

### Community 9 - "Model B Weakness Analysis"
Cohesion: 0.13
Nodes (14): compilerOptions, lib, module, moduleResolution, noEmit, resolveJsonModule, skipLibCheck, strict (+6 more)

### Community 10 - "Pitch Deck"
Cohesion: 0.12
Nodes (17): Agentcard (Competitor), Authorization vs Settlement Boundary, Cumulative Spending Cap, Architecture Document, Pitch Deck Document, EIP-712 Typed Data Signing, ERC-4337 Account Abstraction, Kelemahan Model B Risk Analysis (+9 more)

### Community 11 - "Backend Config"
Cohesion: 0.14
Nodes (15): AppConfig, ListenerMode, loadConfig(), nonnegativeBigInt(), optionalNonnegativeInteger(), positiveInteger(), required(), ListenerSummary (+7 more)

### Community 12 - "Codex Implementation Prompt"
Cohesion: 0.33
Nodes (4): metadata, Providers(), wagmiConfig, SiteFooter()

### Community 13 - "Project README"
Cohesion: 0.11
Nodes (18): AI Agent, Architecture, Backend, Base Sepolia, Contract Tests, Default Demo, Documentation, Hackathon Alignment (+10 more)

### Community 14 - "Team Workflow"
Cohesion: 0.29
Nodes (7): 10. Milestone M4: Base Sepolia Deployment, Acceptance criteria, Deployment command, Environment, Files, Objective, Outputs

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (14): compilerOptions, lib, module, moduleResolution, noEmit, resolveJsonModule, skipLibCheck, strict (+6 more)

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (14): compilerOptions, lib, module, moduleResolution, noEmit, resolveJsonModule, skipLibCheck, strict (+6 more)

### Community 17 - "Community 17"
Cohesion: 0.13
Nodes (14): compilerOptions, lib, module, moduleResolution, noEmit, resolveJsonModule, skipLibCheck, strict (+6 more)

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (6): 12. Milestone M6: Telegram Interface, Acceptance criteria, Behavior, Commands, Files, Objective

### Community 19 - "Community 19"
Cohesion: 0.10
Nodes (20): dependencies, dotenv, viem, devDependencies, tsx, @types/node, typescript, dotenv (+12 more)

### Community 20 - "Community 20"
Cohesion: 0.33
Nodes (6): 6. Milestone M0: Repository and Tooling Setup, Acceptance criteria, Objective, Outputs, Tasks, Verification

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (12): author, bugs, description, files, homepage, license, name, repository (+4 more)

### Community 22 - "Community 22"
Cohesion: 0.22
Nodes (9): AI Agent Harness (apps/agent), Anthropic SDK (@anthropic-ai/sdk), wagmi, Claude Opus 5, Lane B: Frontend & Agent, Next.js, tailwindcss, wagmi (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.29
Nodes (7): 11. Milestone M5: Backend Listener and Mock Settlement, Acceptance criteria, Files, Listener behavior, Mock BaaS behavior, Objective, Required safeguards

### Community 25 - "Community 25"
Cohesion: 0.20
Nodes (15): AuthorizationGranted Event, Backend Event Listener (apps/backend), Base Sepolia Testnet, Demo Runner (apps/demo-runner), Demo Script Document, Deployment Document, Verification Document, Evil Store (Attack Target) (+7 more)

### Community 26 - "Community 26"
Cohesion: 0.13
Nodes (15): 7. Milestone M1: Mandate Smart Contract, Acceptance criteria, `authorizePayment`, Contract, Mandate state, Objective, Outputs, `registerMandate` (+7 more)

### Community 27 - "Community 27"
Cohesion: 0.31
Nodes (7): addressEnv(), assert(), loadAbi(), main(), MandateState, privateKeyEnv(), requiredEnv()

### Community 28 - "Leash Web Design System"
Cohesion: 0.33
Nodes (7): Leash Web Design System, Paper Ground (#F2F1EC), The Refusal is the Hero, Refusal Red (#C0201A), Refusal Stamp Component, Stamped Ledger Design Concept, Volt Green (#CCFF00)

### Community 29 - "Community 29"
Cohesion: 0.20
Nodes (9): 15. Definition of Done, 16. Execution Priority When Time Is Limited, 1. Project Summary, 3. Technical Stack, 4. Repository Structure, 5. Milestone Overview, Hackathon Track, Leash Implementation Plan (+1 more)

### Community 30 - "opencode.json"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 31 - "Community 31"
Cohesion: 0.12
Nodes (27): AgentIntent, normalize(), parseAgentIntent(), parseAmount(), parseNumber(), ActiveMandate, chatId(), loadAbi() (+19 more)

### Community 32 - "PRD_Leash_ID.md"
Cohesion: 0.40
Nodes (4): Codex/Hermes Implementation Prompt, Leash Execution Plan, Lane A: Contracts & Backend, Team Workflow

### Community 33 - "Community 33"
Cohesion: 0.22
Nodes (9): Demo Utama, Masalah, Non-goals, P0, P1, Pengguna Awal, PRD Leash, Ringkasan (+1 more)

### Community 36 - "Community 36"
Cohesion: 0.10
Nodes (19): dependencies, dotenv, viem, devDependencies, tsx, @types/node, typescript, dotenv (+11 more)

### Community 37 - "Community 37"
Cohesion: 0.09
Nodes (21): dependencies, dotenv, grammy, viem, devDependencies, tsx, @types/node, typescript (+13 more)

### Community 42 - "Community 42"
Cohesion: 0.20
Nodes (10): 8. Milestone M2: Smart Contract Security Tests, Acceptance criteria, Invalid authorization tests, Objective, Registration tests, Required attack scenario, Revocation tests, Test file (+2 more)

### Community 46 - "Community 46"
Cohesion: 0.33
Nodes (6): 13. Milestone M7: Documentation and Submission Assets, Acceptance criteria, `docs/ARCHITECTURE.md`, `docs/DEMO_SCRIPT.md`, `docs/RISK_AND_LIMITATIONS.md`, `README.md`

### Community 53 - "Community 53"
Cohesion: 0.40
Nodes (5): 14. Milestone M8: Final Verification, Backend verification, Contract verification, Demo verification, Final behavior checklist

### Community 54 - "Community 54"
Cohesion: 0.25
Nodes (8): 9. Milestone M3: Local CLI Demo, Acceptance criteria, Demo flow, Dependencies, Example output, Files, Objective, Required environment

### Community 58 - "Community 58"
Cohesion: 0.50
Nodes (4): 2. Product Boundary, Explicitly mocked, Off-chain responsibilities, On-chain responsibilities

### Community 65 - "Community 65"
Cohesion: 0.33
Nodes (5): Architecture notes, Commands, graphify, Repo layout, What this is

## Knowledge Gaps
- **346 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `version`, `private` (+341 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Leash` connect `Project README` to `PRD_Leash_ID.md`, `Architecture & Contract`, `Pitch Deck`, `Community 22`, `Community 25`, `Community 29`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `Leash Implementation Plan` connect `Community 29` to `PRD_Leash_ID.md`, `Community 26`, `Community 42`, `Project README`, `Community 46`, `Team Workflow`, `Community 18`, `Community 20`, `Community 53`, `Community 54`, `Community 23`, `Community 58`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `Web Frontend (apps/web)` connect `Community 22` to `Community 25`, `Leash Web Design System`, `Project README`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `name` to the rest of the system?**
  _346 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Web App Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.07382091592617908 - nodes in this community are weakly interconnected._
- **Should `Forge-Std VM Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.06493506493506493 - nodes in this community are weakly interconnected._
- **Should `Leash Product PRD` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._