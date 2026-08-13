# Graph Report - leash  (2026-08-13)

## Corpus Check
- 63 files · ~86,683 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 937 nodes · 1187 edges · 63 communities (56 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2fdb66fd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AgentSafe
- CheatcodesPrinter
- Contributing to Foundry
- listener.ts
- Kelemahan dan Risiko Model B: On-chain Authorization untuk AI Agent Fiat Spending
- Leash Implementation Prompt for Codex or Hermes
- 7. Milestone M1: Mandate Smart Contract
- Leash One-Shot Execution Plan
- package.json
- PRD Leash
- 8. Milestone M2: Smart Contract Security Tests
- Must-Have Features
- 10. Stage 1 — Smart Contract Core
- 14. Stage 5 — Confirmed Event Listener and Mock BaaS
- 9. Milestone M3: Local CLI Demo
- 18. Stage 9 — Documentation
- 19. Stage 10 — Final Verification
- Leash Implementation Plan
- 10. Milestone M4: Base Sepolia Deployment
- 11. Milestone M5: Backend Listener and Mock Settlement
- CmpCheatcode
- 13. Stage 4 — TypeScript Demo Runner
- 12. Milestone M6: Telegram Interface
- 13. Milestone M7: Documentation and Submission Assets
- 6. Milestone M0: Repository and Tooling Setup
- Risk and Limitations
- 11. Stage 2 — Foundry Security Proof
- 15. Stage 6 — Deterministic Local End-to-End Gate
- 9. Stage 0 — Safe Setup and Document Baseline
- 14. Milestone M8: Final Verification
- 12. Stage 3 — Deployment Script Readiness
- 16. Stage 7 — Base Sepolia Deployment
- 17. Stage 8 — Telegram Interface
- 2. Product Boundary
- `/`
- Smart Contracts
- Release checklist
- backend/package.json
- AGENTS.md
- README.md
- demo-runner/package.json
- Function
- compilerOptions
- compilerOptions
- demo.ts
- run-local-demo.sh
- CORE DIRECTIVE: PREMIUM MOBILE APP IMAGE DIRECTION
- High-Agency Frontend Skill
- Appendix B - Canonical Sources (read these before reinventing)
- package.json
- Leash — Team Workflow
- Design Audit
- Analysis & Synthesis Instructions
- Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)
- Leash Architecture
- CORE DIRECTIVE: AWWWARDS-LEVEL IMAGE ART DIRECTION
- layout.tsx
- compilerOptions
- bot.ts
- Verification
- Leash Demo Script
- Deployment
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `AgentSafe` - 98 edges
2. `CheatcodesPrinter` - 29 edges
3. `Kelemahan dan Risiko Model B: On-chain Authorization untuk AI Agent Fiat Spending` - 24 edges
4. `Leash One-Shot Execution Plan` - 24 edges
5. `Leash Implementation Plan` - 17 edges
6. `Leash` - 17 edges
7. `Leash Architecture` - 17 edges
8. `compilerOptions` - 16 edges
9. `Leash Implementation Prompt for Codex or Hermes` - 15 edges
10. `formatRupiah()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `LandingPage()` --calls--> `formatRupiah()`  [EXTRACTED]
  apps/web/src/app/page.tsx → apps/web/src/lib/leash.ts
- `StepView()` --calls--> `explorerTx()`  [EXTRACTED]
  apps/web/src/app/agent/page.tsx → apps/web/src/lib/chain.ts
- `StepView()` --calls--> `shortHex()`  [EXTRACTED]
  apps/web/src/app/agent/page.tsx → apps/web/src/lib/leash.ts
- `FeedPage()` --calls--> `explorerTx()`  [EXTRACTED]
  apps/web/src/app/feed/page.tsx → apps/web/src/lib/chain.ts
- `FeedPage()` --calls--> `formatRupiah()`  [EXTRACTED]
  apps/web/src/app/feed/page.tsx → apps/web/src/lib/leash.ts

## Import Cycles
- None detected.

## Communities (63 total, 7 thin omitted)

### Community 0 - "AgentSafe"
Cohesion: 0.02
Nodes (96): 10. Nice-to-Have Features, 11. Features to Skip for Hackathon, 12. Technical Architecture, 13. Recommended Tech Stack, 14. Smart Contract Design, 15. Risk Engine Design, 16. Frontend Pages, 17. Expected Outputs for Hackathon Submission (+88 more)

### Community 1 - "CheatcodesPrinter"
Cohesion: 0.06
Nodes (23): Cheatcode, Cheatcodes, CheatcodesPrinter, cmp_cheatcode(), CmpCheatcode, Enum, EnumVariant, Error (+15 more)

### Community 2 - "Contributing to Foundry"
Cohesion: 0.06
Nodes (33): Abandoned or stale pull requests, Adding cheatcodes, Asking for help, Be aware of the person behind the code, Code of Conduct, Commits, Contributing to Foundry, Contributions Related to Spelling and Grammar (+25 more)

### Community 3 - "listener.ts"
Cohesion: 0.14
Nodes (15): AppConfig, ListenerMode, loadConfig(), nonnegativeBigInt(), optionalNonnegativeInteger(), positiveInteger(), required(), ListenerSummary (+7 more)

### Community 4 - "Kelemahan dan Risiko Model B: On-chain Authorization untuk AI Agent Fiat Spending"
Cohesion: 0.08
Nodes (24): 10. Gas Fee dan Latency Bisa Mengganggu, 11. Refund, Cancellation, dan Partial Capture Belum Jelas, 12. Currency dan Amount Representation, 13. Authorization Event Bukan Settlement Final, 14. EIP-712 Tidak Menjamin User Paham, 15. Smart Contract Scope Bisa Terlihat Terlalu Sederhana, 16. Narasi Autonomy Bisa Berisiko Secara Regulasi, 17. Model Bisnis Consumer Belum Kuat (+16 more)

### Community 5 - "Leash Implementation Prompt for Codex or Hermes"
Cohesion: 0.11
Nodes (18): 10. Stage 3: Backend Listener and Mock BaaS, 11. Stage 4: Telegram Interface, 12. Stage 5: Documentation, 13. Final Verification, 14. Required Final Report, 1. Product Context, 2. Target Outcome, 3. Engineering Rules (+10 more)

### Community 6 - "7. Milestone M1: Mandate Smart Contract"
Cohesion: 0.13
Nodes (15): 7. Milestone M1: Mandate Smart Contract, Acceptance criteria, `authorizePayment`, Contract, Mandate state, Objective, Outputs, `registerMandate` (+7 more)

### Community 7 - "Leash One-Shot Execution Plan"
Cohesion: 0.14
Nodes (13): 1. Mission, 20. Failure Handling, 21. Definition of Done, 22. Required Final Report, 23. Strict Execution Order, 2. Source-of-Truth Order, 3. What One-Shot Means, 4. Completion States (+5 more)

### Community 8 - "package.json"
Cohesion: 0.15
Nodes (12): author, bugs, description, files, homepage, license, name, repository (+4 more)

### Community 9 - "PRD Leash"
Cohesion: 0.20
Nodes (9): Demo Utama, Masalah, Non-goals, P0, P1, Pengguna Awal, PRD Leash, Ringkasan (+1 more)

### Community 10 - "8. Milestone M2: Smart Contract Security Tests"
Cohesion: 0.20
Nodes (10): 8. Milestone M2: Smart Contract Security Tests, Acceptance criteria, Invalid authorization tests, Objective, Registration tests, Required attack scenario, Revocation tests, Test file (+2 more)

### Community 11 - "Must-Have Features"
Cohesion: 0.22
Nodes (9): 1. Wallet Connect, 2. Treasury Dashboard, 3. Create Payout Plan, 4. Risk Engine, 5. AI Summary, 6. Approve / Reject Payout, 7. Execute Payment, 8. Audit Log (+1 more)

### Community 12 - "10. Stage 1 — Smart Contract Core"
Cohesion: 0.22
Nodes (9): 10.1 Foundry configuration, 10.2 Contract API, 10.3 Deterministic validation order, 10.4 Explicit exclusions, 10. Stage 1 — Smart Contract Core, authorizePayment, Gate 1, registerMandate (+1 more)

### Community 13 - "14. Stage 5 — Confirmed Event Listener and Mock BaaS"
Cohesion: 0.25
Nodes (8): 14.1 Package, 14.2 Environment, 14.3 config.ts, 14.4 listener.ts, 14.5 mockBaas.ts, 14.6 Backend tests, 14. Stage 5 — Confirmed Event Listener and Mock BaaS, Gate 5

### Community 14 - "9. Milestone M3: Local CLI Demo"
Cohesion: 0.25
Nodes (8): 9. Milestone M3: Local CLI Demo, Acceptance criteria, Demo flow, Dependencies, Example output, Files, Objective, Required environment

### Community 15 - "18. Stage 9 — Documentation"
Cohesion: 0.29
Nodes (7): 18.1 docs/PRD_Leash_ID.md, 18.2 docs/ARCHITECTURE.md, 18.3 docs/DEMO_SCRIPT.md, 18.4 docs/RISK_AND_LIMITATIONS.md, 18.5 README.md, 18.6 docs/VERIFICATION.md and docs/DEPLOYMENT.md, 18. Stage 9 — Documentation

### Community 16 - "19. Stage 10 — Final Verification"
Cohesion: 0.29
Nodes (7): 19. Stage 10 — Final Verification, Backend, Contract, Demo runner, End to end, Final behavior matrix, Telegram

### Community 17 - "Leash Implementation Plan"
Cohesion: 0.20
Nodes (9): 15. Definition of Done, 16. Execution Priority When Time Is Limited, 1. Project Summary, 3. Technical Stack, 4. Repository Structure, 5. Milestone Overview, Hackathon Track, Leash Implementation Plan (+1 more)

### Community 18 - "10. Milestone M4: Base Sepolia Deployment"
Cohesion: 0.29
Nodes (7): 10. Milestone M4: Base Sepolia Deployment, Acceptance criteria, Deployment command, Environment, Files, Objective, Outputs

### Community 19 - "11. Milestone M5: Backend Listener and Mock Settlement"
Cohesion: 0.29
Nodes (7): 11. Milestone M5: Backend Listener and Mock Settlement, Acceptance criteria, Files, Listener behavior, Mock BaaS behavior, Objective, Required safeguards

### Community 20 - "CmpCheatcode"
Cohesion: 0.09
Nodes (51): PRESETS, Step, StepView(), Turn, json(), POST(), Step, tools (+43 more)

### Community 21 - "13. Stage 4 — TypeScript Demo Runner"
Cohesion: 0.33
Nodes (6): 13.1 Package, 13.2 Environment, 13.3 Demo transaction flow, 13.4 Required output semantics, 13. Stage 4 — TypeScript Demo Runner, Gate 4

### Community 22 - "12. Milestone M6: Telegram Interface"
Cohesion: 0.33
Nodes (6): 12. Milestone M6: Telegram Interface, Acceptance criteria, Behavior, Commands, Files, Objective

### Community 23 - "13. Milestone M7: Documentation and Submission Assets"
Cohesion: 0.33
Nodes (6): 13. Milestone M7: Documentation and Submission Assets, Acceptance criteria, `docs/ARCHITECTURE.md`, `docs/DEMO_SCRIPT.md`, `docs/RISK_AND_LIMITATIONS.md`, `README.md`

### Community 24 - "6. Milestone M0: Repository and Tooling Setup"
Cohesion: 0.33
Nodes (6): 6. Milestone M0: Repository and Tooling Setup, Acceptance criteria, Objective, Outputs, Tasks, Verification

### Community 25 - "Risk and Limitations"
Cohesion: 0.40
Nodes (4): Limitations, Mocked Components, Risk and Limitations, Trust Boundary

### Community 26 - "11. Stage 2 — Foundry Security Proof"
Cohesion: 0.40
Nodes (5): 11.1 Test setup, 11.2 Required test names, 11.3 Mandatory assertions, 11. Stage 2 — Foundry Security Proof, Gate 2

### Community 27 - "15. Stage 6 — Deterministic Local End-to-End Gate"
Cohesion: 0.40
Nodes (5): 15.1 Purpose, 15.2 Script behavior, 15.3 Required proof, 15. Stage 6 — Deterministic Local End-to-End Gate, Gate 6

### Community 28 - "9. Stage 0 — Safe Setup and Document Baseline"
Cohesion: 0.40
Nodes (5): 9. Stage 0 — Safe Setup and Document Baseline, Foundry initialization rule, Gate 0, Objective, Tasks

### Community 29 - "14. Milestone M8: Final Verification"
Cohesion: 0.40
Nodes (5): 14. Milestone M8: Final Verification, Backend verification, Contract verification, Demo verification, Final behavior checklist

### Community 30 - "12. Stage 3 — Deployment Script Readiness"
Cohesion: 0.50
Nodes (4): 12.1 Script, 12.2 Environment template, 12.3 Readiness verification, 12. Stage 3 — Deployment Script Readiness

### Community 31 - "16. Stage 7 — Base Sepolia Deployment"
Cohesion: 0.50
Nodes (4): 16.1 Preconditions, 16.2 Network validation, 16.3 Deployment, 16. Stage 7 — Base Sepolia Deployment

### Community 32 - "17. Stage 8 — Telegram Interface"
Cohesion: 0.50
Nodes (4): 17.1 Package and environment, 17.2 Commands, 17. Stage 8 — Telegram Interface, Gate 8

### Community 33 - "2. Product Boundary"
Cohesion: 0.50
Nodes (4): 2. Product Boundary, Explicitly mocked, Off-chain responsibilities, On-chain responsibilities

### Community 35 - "Smart Contracts"
Cohesion: 0.67
Nodes (3): Option A: Foundry, Option B: Hardhat, Smart Contracts

### Community 37 - "backend/package.json"
Cohesion: 0.10
Nodes (20): dependencies, dotenv, viem, devDependencies, tsx, @types/node, typescript, dotenv (+12 more)

### Community 39 - "README.md"
Cohesion: 0.11
Nodes (17): Architecture, Backend, Base Sepolia, Contract Tests, Default Demo, Documentation, Hackathon Alignment, Leash (+9 more)

### Community 40 - "demo-runner/package.json"
Cohesion: 0.10
Nodes (19): dependencies, dotenv, viem, devDependencies, tsx, @types/node, typescript, dotenv (+11 more)

### Community 41 - "Function"
Cohesion: 0.05
Nodes (42): @anthropic-ai/sdk, dependencies, @anthropic-ai/sdk, geist, next, react, react-dom, @tanstack/react-query (+34 more)

### Community 42 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, lib, module, moduleResolution, noEmit, resolveJsonModule, skipLibCheck, strict (+6 more)

### Community 43 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, lib, module, moduleResolution, noEmit, resolveJsonModule, skipLibCheck, strict (+6 more)

### Community 44 - "demo.ts"
Cohesion: 0.36
Nodes (7): addressEnv(), assert(), loadAbi(), main(), MandateState, privateKeyEnv(), requiredEnv()

### Community 46 - "CORE DIRECTIVE: PREMIUM MOBILE APP IMAGE DIRECTION"
Cohesion: 0.05
Nodes (37): 10.1 The question we will definitely be asked, 10.2 Positioning, 10. Why this wins, 1. The story, 2.1 Prompt injection is a payments problem, not just an AI problem, 2.2 Hallucination doesn't need an attacker, 2.3 Today's defenses have two gaps, 2.4 What's actually missing (+29 more)

### Community 47 - "High-Agency Frontend Skill"
Cohesion: 0.07
Nodes (28): Buttons, Cards / Containers, Colors, Components, Design System: Leash Web, Do:, Do's and Don'ts, Don't: (+20 more)

### Community 48 - "Appendix B - Canonical Sources (read these before reinventing)"
Cohesion: 0.07
Nodes (26): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+18 more)

### Community 49 - "package.json"
Cohesion: 0.09
Nodes (21): dependencies, dotenv, grammy, viem, devDependencies, tsx, @types/node, typescript (+13 more)

### Community 50 - "Leash — Team Workflow"
Cohesion: 0.09
Nodes (21): 1. Where the project actually stands, 2. Lanes, 3. Git workflow, 4. Contract change needed before deployment, 5. The AI agent harness, 6. Frontend, 7. Task list, 8. Sequencing (+13 more)

### Community 51 - "Design Audit"
Cohesion: 0.15
Nodes (12): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+4 more)

### Community 52 - "Analysis & Synthesis Instructions"
Cohesion: 0.20
Nodes (9): A programmable spending firewall for AI agents, Architecture: authority on-chain, fiat off-chain, Leash, Roadmap · Built, In Flight, Next, Technical Quality: the contract is the only gate, The Demo: three acts, and the refusal is the hero, The Problem: an AI agent that can pay is an AI agent that can be fooled, The Solution: authority on-chain, money stays fiat (+1 more)

### Community 54 - "Leash Architecture"
Cohesion: 0.11
Nodes (17): AI-Agent Responsibilities, Authorization and Settlement Boundary, Backend Responsibilities, Leash Architecture, Off-Chain Flow, On-Chain Flow, Problem, Production Roadmap (+9 more)

### Community 56 - "layout.tsx"
Cohesion: 0.24
Nodes (6): metadata, Providers(), wagmiConfig, MOCKED, REAL, SiteFooter()

### Community 58 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, lib, module, moduleResolution, noEmit, resolveJsonModule, skipLibCheck, strict (+6 more)

### Community 68 - "bot.ts"
Cohesion: 0.36
Nodes (7): ActiveMandate, chatId(), loadAbi(), main(), MandateState, privateKey(), required()

### Community 79 - "Verification"
Cohesion: 0.29
Nodes (6): Environment, Local End-to-End, Public Deployment, Smart Contract, TypeScript, Verification

### Community 82 - "Leash Demo Script"
Cohesion: 0.33
Nodes (5): Closing, Demo Sequence, Evidence Checklist, Leash Demo Script, Opening

### Community 96 - "Deployment"
Cohesion: 0.50
Nodes (3): Base Sepolia, Deployment, Local Anvil

## Knowledge Gaps
- **592 isolated node(s):** `name`, `version`, `private`, `type`, `dev` (+587 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AgentSafe` connect `AgentSafe` to `Smart Contracts`, ``/``, `Must-Have Features`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `Leash Implementation Plan` connect `Leash Implementation Plan` to `2. Product Boundary`, `7. Milestone M1: Mandate Smart Contract`, `8. Milestone M2: Smart Contract Security Tests`, `9. Milestone M3: Local CLI Demo`, `10. Milestone M4: Base Sepolia Deployment`, `11. Milestone M5: Backend Listener and Mock Settlement`, `12. Milestone M6: Telegram Interface`, `13. Milestone M7: Documentation and Submission Assets`, `6. Milestone M0: Repository and Tooling Setup`, `14. Milestone M8: Final Verification`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `Leash One-Shot Execution Plan` connect `Leash One-Shot Execution Plan` to `17. Stage 8 — Telegram Interface`, `10. Stage 1 — Smart Contract Core`, `14. Stage 5 — Confirmed Event Listener and Mock BaaS`, `18. Stage 9 — Documentation`, `19. Stage 10 — Final Verification`, `13. Stage 4 — TypeScript Demo Runner`, `11. Stage 2 — Foundry Security Proof`, `15. Stage 6 — Deterministic Local End-to-End Gate`, `9. Stage 0 — Safe Setup and Document Baseline`, `12. Stage 3 — Deployment Script Readiness`, `16. Stage 7 — Base Sepolia Deployment`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _592 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AgentSafe` be split into smaller, more focused modules?**
  _Cohesion score 0.020833333333333332 - nodes in this community are weakly interconnected._
- **Should `CheatcodesPrinter` be split into smaller, more focused modules?**
  _Cohesion score 0.06493506493506493 - nodes in this community are weakly interconnected._
- **Should `Contributing to Foundry` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._