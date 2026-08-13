# Graph Report - NTUhackathon  (2026-08-13)

## Corpus Check
- 17 files · ~22,964 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 464 nodes · 564 edges · 40 communities (35 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- AgentSafe
- vm.py
- Contributing to Foundry
- CheatcodesPrinter
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
- 1. Project Summary
- AGENTS.md
- README.md

## God Nodes (most connected - your core abstractions)
1. `AgentSafe` - 97 edges
2. `CheatcodesPrinter` - 29 edges
3. `Kelemahan dan Risiko Model B: On-chain Authorization untuk AI Agent Fiat Spending` - 24 edges
4. `Leash One-Shot Execution Plan` - 24 edges
5. `Leash Implementation Plan` - 17 edges
6. `Leash Implementation Prompt for Codex or Hermes` - 15 edges
7. `7. Milestone M1: Mandate Smart Contract` - 12 edges
8. `8. Milestone M2: Smart Contract Security Tests` - 10 edges
9. `Cheatcodes` - 9 edges
10. `Must-Have Features` - 9 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `CheatcodesPrinter`  [EXTRACTED]
  contracts/lib/forge-std/scripts/vm.py → contracts/lib/forge-std/scripts/vm.py  _Bridges community 1 → community 3_

## Import Cycles
- None detected.

## Communities (40 total, 5 thin omitted)

### Community 0 - "AgentSafe"
Cohesion: 0.02
Nodes (95): 10. Nice-to-Have Features, 11. Features to Skip for Hackathon, 12. Technical Architecture, 13. Recommended Tech Stack, 14. Smart Contract Design, 15. Risk Engine Design, 16. Frontend Pages, 17. Expected Outputs for Hackathon Submission (+87 more)

### Community 1 - "vm.py"
Cohesion: 0.08
Nodes (19): Cheatcode, Cheatcodes, Enum, EnumVariant, Error, Event, Function, group() (+11 more)

### Community 2 - "Contributing to Foundry"
Cohesion: 0.06
Nodes (33): Abandoned or stale pull requests, Adding cheatcodes, Asking for help, Be aware of the person behind the code, Code of Conduct, Commits, Contributing to Foundry, Contributions Related to Spelling and Grammar (+25 more)

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
Cohesion: 0.29
Nodes (6): 15. Definition of Done, 16. Execution Priority When Time Is Limited, 3. Technical Stack, 4. Repository Structure, 5. Milestone Overview, Leash Implementation Plan

### Community 18 - "10. Milestone M4: Base Sepolia Deployment"
Cohesion: 0.29
Nodes (7): 10. Milestone M4: Base Sepolia Deployment, Acceptance criteria, Deployment command, Environment, Files, Objective, Outputs

### Community 19 - "11. Milestone M5: Backend Listener and Mock Settlement"
Cohesion: 0.29
Nodes (7): 11. Milestone M5: Backend Listener and Mock Settlement, Acceptance criteria, Files, Listener behavior, Mock BaaS behavior, Objective, Required safeguards

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

### Community 34 - "`/`"
Cohesion: 0.67
Nodes (3): `/`, 1. Product Name, AgentSafe — Product Brainstorm & Hackathon Plan

### Community 35 - "Smart Contracts"
Cohesion: 0.67
Nodes (3): Option A: Foundry, Option B: Hardhat, Smart Contracts

### Community 37 - "1. Project Summary"
Cohesion: 0.67
Nodes (3): 1. Project Summary, Hackathon Track, Primary Demo Scenario

## Knowledge Gaps
- **326 isolated node(s):** `name`, `version`, `description`, `homepage`, `bugs` (+321 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AgentSafe` connect `AgentSafe` to `Smart Contracts`, ``/``, `Must-Have Features`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `Leash Implementation Plan` connect `Leash Implementation Plan` to `2. Product Boundary`, `1. Project Summary`, `7. Milestone M1: Mandate Smart Contract`, `8. Milestone M2: Smart Contract Security Tests`, `9. Milestone M3: Local CLI Demo`, `10. Milestone M4: Base Sepolia Deployment`, `11. Milestone M5: Backend Listener and Mock Settlement`, `12. Milestone M6: Telegram Interface`, `13. Milestone M7: Documentation and Submission Assets`, `6. Milestone M0: Repository and Tooling Setup`, `14. Milestone M8: Final Verification`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `Leash One-Shot Execution Plan` connect `Leash One-Shot Execution Plan` to `17. Stage 8 — Telegram Interface`, `10. Stage 1 — Smart Contract Core`, `14. Stage 5 — Confirmed Event Listener and Mock BaaS`, `18. Stage 9 — Documentation`, `19. Stage 10 — Final Verification`, `13. Stage 4 — TypeScript Demo Runner`, `11. Stage 2 — Foundry Security Proof`, `15. Stage 6 — Deterministic Local End-to-End Gate`, `9. Stage 0 — Safe Setup and Document Baseline`, `12. Stage 3 — Deployment Script Readiness`, `16. Stage 7 — Base Sepolia Deployment`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _326 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AgentSafe` be split into smaller, more focused modules?**
  _Cohesion score 0.021052631578947368 - nodes in this community are weakly interconnected._
- **Should `vm.py` be split into smaller, more focused modules?**
  _Cohesion score 0.07716701902748414 - nodes in this community are weakly interconnected._
- **Should `Contributing to Foundry` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._