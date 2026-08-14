# Graph Report - leash  (2026-08-14)

## Corpus Check
- 69 files · ~71,565 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 957 nodes · 1290 edges · 71 communities (60 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

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
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70

## God Nodes (most connected - your core abstractions)
1. `AgentSafe` - 100 edges
2. `Leash` - 29 edges
3. `CheatcodesPrinter` - 29 edges
4. `Kelemahan dan Risiko Model B: On-chain Authorization untuk AI Agent Fiat Spending` - 24 edges
5. `Leash One-Shot Execution Plan` - 24 edges
6. `Leash Implementation Plan` - 20 edges
7. `Leash Architecture` - 17 edges
8. `compilerOptions` - 16 edges
9. `Leash Implementation Prompt for Codex or Hermes` - 15 edges
10. `formatRupiah()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Web Frontend (apps/web)` --references--> `wagmi`  [EXTRACTED]
  TEAM_WORKFLOW.md → apps/web/package.json
- `Web Frontend (apps/web)` --references--> `tailwindcss`  [EXTRACTED]
  TEAM_WORKFLOW.md → apps/web/package.json
- `The Refusal is the Hero` --semantically_similar_to--> `Stamped Ledger Design Concept`  [INFERRED] [semantically similar]
  TEAM_WORKFLOW.md → apps/web/DESIGN.md
- `AgentSafe` --conceptually_related_to--> `Leash`  [INFERRED]
  AGENTSAFE_BRAINSTORM.md → README.md
- `Leash Execution Plan` --references--> `AgentSafe`  [EXTRACTED]
  LEASH_EXECUTION_PLAN.md → AGENTSAFE_BRAINSTORM.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Leash Enforcement Layer Stack** — leashmandate_contract, spending_mandate, session_key, target_allowlist, cumulative_cap, revocation_mechanism, authorization_granted_event [EXTRACTED 0.90]
- **Demo Scenario Components** — demo_runner, rock_burger, evil_store, leashmandate_contract, local_demo_script, backend_listener, mock_baas_settlement [EXTRACTED 0.90]
- **Product Design Identity** — apps_web_design_system, stamped_ledger_design, refusal_stamp_component, refusal_is_hero, volt_green, refusal_red, paper_ground [EXTRACTED 0.85]

## Communities (71 total, 11 thin omitted)

### Community 0 - "AgentSafe Brainstorm"
Cohesion: 0.02
Nodes (96): 10. Nice-to-Have Features, 11. Features to Skip for Hackathon, 12. Technical Architecture, 13. Recommended Tech Stack, 14. Smart Contract Design, 15. Risk Engine Design, 16. Frontend Pages, 17. Expected Outputs for Hackathon Submission (+88 more)

### Community 1 - "Web App Pages"
Cohesion: 0.07
Nodes (60): PRESETS, Step, StepView(), Turn, json(), maxDuration, POST(), runtime (+52 more)

### Community 2 - "Forge-Std VM Scripts"
Cohesion: 0.07
Nodes (21): Cheatcode, Cheatcodes, CheatcodesPrinter, Enum, EnumVariant, Error, Event, Function (+13 more)

### Community 3 - "Leash Product PRD"
Cohesion: 0.05
Nodes (37): 10.1 The question we will definitely be asked, 10.2 Positioning, 10. Why this wins, 1. The story, 2.1 Prompt injection is a payments problem, not just an AI problem, 2.2 Hallucination doesn't need an attacker, 2.3 Today's defenses have two gaps, 2.4 What's actually missing (+29 more)

### Community 4 - "Forge-Std Contributing"
Cohesion: 0.07
Nodes (30): Abandoned or stale pull requests, Adding cheatcodes, Asking for help, Be aware of the person behind the code, Code of Conduct, Commits, Contributing to Foundry, Contributions Related to Spelling and Grammar (+22 more)

### Community 5 - "Web Dependencies"
Cohesion: 0.07
Nodes (29): @anthropic-ai/sdk, dependencies, @anthropic-ai/sdk, geist, next, react, react-dom, @tanstack/react-query (+21 more)

### Community 6 - "Web TypeScript Config"
Cohesion: 0.07
Nodes (26): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+18 more)

### Community 7 - "Architecture & Contract"
Cohesion: 0.08
Nodes (26): Agent is Untrusted by Design, Authorization vs Settlement Boundary, Claim Only What Is Verified, Contract is the Only Gate, AI-Agent Responsibilities, Authorization and Settlement Boundary, Backend Responsibilities, Architecture Document (+18 more)

### Community 8 - "Design System"
Cohesion: 0.09
Nodes (24): Buttons, Cards / Containers, Colors, Components, Design System: Leash Web, Do:, Do's and Don'ts, Don't: (+16 more)

### Community 9 - "Model B Weakness Analysis"
Cohesion: 0.08
Nodes (24): 10. Gas Fee dan Latency Bisa Mengganggu, 11. Refund, Cancellation, dan Partial Capture Belum Jelas, 12. Currency dan Amount Representation, 13. Authorization Event Bukan Settlement Final, 14. EIP-712 Tidak Menjamin User Paham, 15. Smart Contract Scope Bisa Terlihat Terlalu Sederhana, 16. Narasi Autonomy Bisa Berisiko Secara Regulasi, 17. Model Bisnis Consumer Belum Kuat (+16 more)

### Community 10 - "Pitch Deck"
Cohesion: 0.09
Nodes (24): Agentcard (Competitor), Cumulative Spending Cap, A programmable spending firewall for AI agents, Architecture: authority on-chain, fiat off-chain, Pitch Deck Document, Leash, Roadmap · Built, In Flight, Next, Technical Quality: the contract is the only gate (+16 more)

### Community 11 - "Backend Config"
Cohesion: 0.14
Nodes (15): AppConfig, ListenerMode, loadConfig(), nonnegativeBigInt(), optionalNonnegativeInteger(), positiveInteger(), required(), ListenerSummary (+7 more)

### Community 12 - "Codex Implementation Prompt"
Cohesion: 0.11
Nodes (18): 10. Stage 3: Backend Listener and Mock BaaS, 11. Stage 4: Telegram Interface, 12. Stage 5: Documentation, 13. Final Verification, 14. Required Final Report, 1. Product Context, 2. Target Outcome, 3. Engineering Rules (+10 more)

### Community 13 - "Project README"
Cohesion: 0.11
Nodes (17): Architecture, Backend, Base Sepolia, Contract Tests, Default Demo, Documentation, Hackathon Alignment, Leash (+9 more)

### Community 14 - "Team Workflow"
Cohesion: 0.13
Nodes (18): 1. Where the project actually stands, 2. Lanes, 3. Git workflow, 4. Contract change needed before deployment, 5. The AI agent harness, 6. Frontend, 7. Task list, 8. Sequencing (+10 more)

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
Cohesion: 0.14
Nodes (13): 1. Mission, 20. Failure Handling, 21. Definition of Done, 22. Required Final Report, 23. Strict Execution Order, 2. Source-of-Truth Order, 3. What One-Shot Means, 4. Completion States (+5 more)

### Community 19 - "Community 19"
Cohesion: 0.15
Nodes (12): dependencies, dotenv, viem, viem, name, private, scripts, dev (+4 more)

### Community 20 - "Community 20"
Cohesion: 0.17
Nodes (13): devDependencies, tsx, @types/node, typescript, tsx, devDependencies, tsx, @types/node (+5 more)

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (12): author, bugs, description, files, homepage, license, name, repository (+4 more)

### Community 22 - "Community 22"
Cohesion: 0.15
Nodes (12): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+4 more)

### Community 23 - "Community 23"
Cohesion: 0.20
Nodes (12): 10. Milestone M4: Base Sepolia Deployment, 11. Milestone M5: Backend Listener and Mock Settlement, 12. Milestone M6: Telegram Interface, Behavior, Commands, Deployment command, Environment, Files (+4 more)

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (11): dotenv, dependencies, dotenv, viem, viem, dependencies, dotenv, grammy (+3 more)

### Community 25 - "Community 25"
Cohesion: 0.31
Nodes (11): AuthorizationGranted Event, Backend Event Listener (apps/backend), Demo Runner (apps/demo-runner), Verification Document, Forge Standard Library, Foundry (Contract Tooling), Lane A: Contracts & Backend, LeashMandate Contract (+3 more)

### Community 26 - "Community 26"
Cohesion: 0.20
Nodes (11): 6. Milestone M0: Repository and Tooling Setup, 7. Milestone M1: Mandate Smart Contract, Contract, Mandate state, Outputs, Required errors, Required events, Security constraints (+3 more)

### Community 27 - "Community 27"
Cohesion: 0.40
Nodes (9): addressEnv(), assert(), authorizationLogCount(), customErrorName(), loadAbi(), main(), MandateState, privateKeyEnv() (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.20
Nodes (10): devDependencies, tailwindcss, @tailwindcss/postcss, @types/react, @types/react-dom, typescript, tailwindcss, @tailwindcss/postcss (+2 more)

### Community 29 - "Community 29"
Cohesion: 0.20
Nodes (9): 15. Definition of Done, 16. Execution Priority When Time Is Limited, 1. Project Summary, 3. Technical Stack, 4. Repository Structure, 5. Milestone Overview, Hackathon Track, Leash Implementation Plan (+1 more)

### Community 30 - "Community 30"
Cohesion: 0.22
Nodes (9): 1. Wallet Connect, 2. Treasury Dashboard, 3. Create Payout Plan, 4. Risk Engine, 5. AI Summary, 6. Approve / Reject Payout, 7. Execute Payment, 8. Audit Log (+1 more)

### Community 31 - "Community 31"
Cohesion: 0.39
Nodes (8): ActiveMandate, chatId(), customErrorName(), loadAbi(), main(), MandateState, privateKey(), required()

### Community 32 - "Community 32"
Cohesion: 0.25
Nodes (9): Leash Web Design System, Next.js, Paper Ground (#F2F1EC), The Refusal is the Hero, Refusal Red (#C0201A), Refusal Stamp Component, Stamped Ledger Design Concept, Volt Green (#CCFF00) (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.22
Nodes (9): Demo Utama, Masalah, Non-goals, P0, P1, Pengguna Awal, PRD Leash, Ringkasan (+1 more)

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (9): 10.1 Foundry configuration, 10.2 Contract API, 10.3 Deterministic validation order, 10.4 Explicit exclusions, 10. Stage 1 — Smart Contract Core, authorizePayment, Gate 1, registerMandate (+1 more)

### Community 35 - "Community 35"
Cohesion: 0.25
Nodes (8): AI Agent Harness (apps/agent), Anthropic SDK (@anthropic-ai/sdk), Claude Opus 5, Codex/Hermes Implementation Prompt, PRD Leash (Indonesian), Leash Execution Plan, Lane B: Frontend & Agent, Team Workflow

### Community 36 - "Community 36"
Cohesion: 0.25
Nodes (7): name, private, scripts, demo, typecheck, type, version

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): name, private, scripts, dev, typecheck, type, version

### Community 38 - "Community 38"
Cohesion: 0.25
Nodes (8): Closing, Demo Sequence, Demo Script Document, Evidence Checklist, Leash Demo Script, Opening, Evil Store (Attack Target), Rock Burger (Demo Merchant)

### Community 39 - "Community 39"
Cohesion: 0.25
Nodes (8): 14.1 Package, 14.2 Environment, 14.3 config.ts, 14.4 listener.ts, 14.5 mockBaas.ts, 14.6 Backend tests, 14. Stage 5 — Confirmed Event Listener and Mock BaaS, Gate 5

### Community 40 - "Community 40"
Cohesion: 0.29
Nodes (7): 18.1 docs/PRD_Leash_ID.md, 18.2 docs/ARCHITECTURE.md, 18.3 docs/DEMO_SCRIPT.md, 18.4 docs/RISK_AND_LIMITATIONS.md, 18.5 README.md, 18.6 docs/VERIFICATION.md and docs/DEPLOYMENT.md, 18. Stage 9 — Documentation

### Community 41 - "Community 41"
Cohesion: 0.29
Nodes (7): 19. Stage 10 — Final Verification, Backend, Contract, Demo runner, End to end, Final behavior matrix, Telegram

### Community 42 - "Community 42"
Cohesion: 0.29
Nodes (7): 8. Milestone M2: Smart Contract Security Tests, Invalid authorization tests, Registration tests, Required attack scenario, Revocation tests, Test file, Valid authorization tests

### Community 44 - "Community 44"
Cohesion: 0.33
Nodes (6): Environment, Local End-to-End, Public Deployment, Smart Contract, TypeScript, Verification

### Community 45 - "Community 45"
Cohesion: 0.33
Nodes (6): 13.1 Package, 13.2 Environment, 13.3 Demo transaction flow, 13.4 Required output semantics, 13. Stage 4 — TypeScript Demo Runner, Gate 4

### Community 46 - "Community 46"
Cohesion: 0.33
Nodes (6): 13. Milestone M7: Documentation and Submission Assets, Acceptance criteria, `docs/ARCHITECTURE.md`, `docs/DEMO_SCRIPT.md`, `docs/RISK_AND_LIMITATIONS.md`, `README.md`

### Community 47 - "Community 47"
Cohesion: 0.40
Nodes (5): devDependencies, tsx, @types/node, typescript, tsx

### Community 48 - "Community 48"
Cohesion: 0.40
Nodes (5): Base Sepolia Testnet, Base Sepolia, Deployment, Deployment Document, Local Anvil

### Community 49 - "Community 49"
Cohesion: 0.40
Nodes (4): Limitations, Mocked Components, Risk and Limitations, Trust Boundary

### Community 50 - "Community 50"
Cohesion: 0.40
Nodes (5): 11.1 Test setup, 11.2 Required test names, 11.3 Mandatory assertions, 11. Stage 2 — Foundry Security Proof, Gate 2

### Community 51 - "Community 51"
Cohesion: 0.40
Nodes (5): 15.1 Purpose, 15.2 Script behavior, 15.3 Required proof, 15. Stage 6 — Deterministic Local End-to-End Gate, Gate 6

### Community 52 - "Community 52"
Cohesion: 0.40
Nodes (5): 9. Stage 0 — Safe Setup and Document Baseline, Foundry initialization rule, Gate 0, Objective, Tasks

### Community 53 - "Community 53"
Cohesion: 0.40
Nodes (5): 14. Milestone M8: Final Verification, Backend verification, Contract verification, Demo verification, Final behavior checklist

### Community 54 - "Community 54"
Cohesion: 0.40
Nodes (5): 9. Milestone M3: Local CLI Demo, Demo flow, Dependencies, Example output, Required environment

### Community 55 - "Community 55"
Cohesion: 0.50
Nodes (4): 12.1 Script, 12.2 Environment template, 12.3 Readiness verification, 12. Stage 3 — Deployment Script Readiness

### Community 56 - "Community 56"
Cohesion: 0.50
Nodes (4): 16.1 Preconditions, 16.2 Network validation, 16.3 Deployment, 16. Stage 7 — Base Sepolia Deployment

### Community 57 - "Community 57"
Cohesion: 0.50
Nodes (4): 17.1 Package and environment, 17.2 Commands, 17. Stage 8 — Telegram Interface, Gate 8

### Community 58 - "Community 58"
Cohesion: 0.50
Nodes (4): 2. Product Boundary, Explicitly mocked, Off-chain responsibilities, On-chain responsibilities

### Community 59 - "Community 59"
Cohesion: 0.50
Nodes (4): `authorizePayment`, `registerMandate`, Required functions, `revokeMandate`

### Community 61 - "Community 61"
Cohesion: 0.67
Nodes (3): Option A: Foundry, Option B: Hardhat, Smart Contracts

## Knowledge Gaps
- **558 isolated node(s):** `graphify`, `1. Product Name`, `Working tagline`, `One-liner`, `2. Hackathon Fit` (+553 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Leash` connect `Project README` to `AgentSafe Brainstorm`, `Community 32`, `Community 35`, `Community 38`, `Architecture & Contract`, `Pitch Deck`, `Community 25`, `Community 29`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `AgentSafe` connect `AgentSafe Brainstorm` to `Community 35`, `Project README`, `Community 60`, `Community 61`, `Community 30`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `Web Frontend (apps/web)` connect `Community 32` to `Community 35`, `Web Dependencies`, `Project README`, `Community 25`, `Community 28`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `graphify`, `1. Product Name`, `Working tagline` to the rest of the system?**
  _558 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AgentSafe Brainstorm` be split into smaller, more focused modules?**
  _Cohesion score 0.020833333333333332 - nodes in this community are weakly interconnected._
- **Should `Web App Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.06798623063683305 - nodes in this community are weakly interconnected._
- **Should `Forge-Std VM Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.07081377151799687 - nodes in this community are weakly interconnected._