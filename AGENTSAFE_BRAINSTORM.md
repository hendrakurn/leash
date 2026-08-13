# AgentSafe — Product Brainstorm & Hackathon Plan

> **For Hermes:** Use subagent-driven-development skill if this plan is later converted into implementation tasks.

**Goal:** Build a practical Web3 prototype for NTU InnovateX Hackathon 2026 that can also become a startup wedge: AI-assisted payout operations for Web3 teams and small organizations.

**Architecture:** AgentSafe turns messy payout/payment requests into AI-reviewed payout plans. Human reviewers approve the plan, while smart contracts enforce policy and execute stablecoin payments with an auditable trail.

**Tech Stack:** Next.js, TypeScript, Tailwind, wagmi/viem, Solidity, Foundry or Hardhat, mock USDC ERC20, Supabase/SQLite, OpenAI or rule-based AI risk engine.

---

## 1. Product Name

# AgentSafe

## Working tagline

**AI-reviewed, policy-enforced stablecoin payouts for Web3 teams.**

## One-liner

**AgentSafe helps Web3 teams, grant programs, and small organizations safely review, approve, and execute stablecoin payouts using AI risk checks, smart contract policies, and wallet-native audit trails.**

---

## 2. Hackathon Fit

## Target Hackathon

**NTU InnovateX Hackathon 2026**

## Recommended Track

**Track 1: Payments and Financial Infrastructure**

Reason:

- AgentSafe handles payout/payment flows.
- It improves treasury and financial operations.
- It uses Web3 for stablecoin settlement and smart contract enforcement.
- It addresses transaction management, approval, and auditability.

## Why not primarily Track 2?

AgentSafe does use AI/agentic workflows, but the core product is financial infrastructure. AI is a differentiator, not the main category. Track 1 gives stronger alignment with judging expectations.

---

## 3. Core Thesis

Stablecoins make payments fast, but the operational workflow around treasury payments is still fragmented and risky.

Many Web3 teams, DAOs, grant programs, and small organizations still manage payouts across:

- forms
- spreadsheets
- Telegram/Discord approvals
- Notion/GitHub evidence
- multisig wallets
- block explorers
- manual reconciliation

AgentSafe solves the layer before money moves:

> Is this payout valid, safe, approved, within policy, and auditable?

---

## 4. Real-World Problem

## Current Workflow

A Web3 grant program or small organization often pays contributors/grantees like this:

```text
Payout request submitted
        ↓
Manual spreadsheet review
        ↓
Wallet address copied manually
        ↓
Reviewer checks milestone or invoice
        ↓
Ops team creates Safe/wallet transaction
        ↓
Signers approve with limited context
        ↓
Payment settles onchain
        ↓
Tx hash copied back into spreadsheet/report
```

## Friction Points

- Too much manual checking.
- Payment context is scattered across tools.
- Signers often approve without enough context.
- Reconciliation is manual.
- Batch payouts are hard to validate.
- Small teams do not have proper finance tooling.

## Risk Points

- Duplicate payout.
- Wrong wallet address.
- Changed recipient wallet.
- Fake invoice or weak milestone evidence.
- Abnormal amount.
- Payment exceeds policy.
- Payment made without clear approval trail.
- Treasury admin makes irreversible mistake.

## Why This Matters

Stablecoin transfers are fast and irreversible. That is good for settlement, but dangerous when the pre-payment workflow is weak.

AgentSafe does not compete with stablecoins. It makes stablecoin operations safer.

---

## 5. Target Users

## Primary Beachhead User

**Web3 grant programs and ecosystem teams**

Examples:

- ecosystem foundations
- hackathon organizers
- grant managers
- DAO ops teams
- contributor communities
- bounty programs

## Why this user first?

They already understand wallets, stablecoins, and onchain payments. They often pay many recipients and need a clean audit trail.

## Secondary Users

- DAO contributor payout teams
- Web3 startups paying contractors
- student clubs managing sponsor/event funds
- nonprofits using digital payment rails
- SMEs experimenting with stablecoin vendor payments

## Not the Initial Target

Avoid starting with broad SME finance or consumer payments. That market is larger but harder due to compliance, sales, onboarding, and trust.

---

## 6. Product Scope

## What AgentSafe Is

AgentSafe is an **AI-assisted payout operations layer**.

It helps teams:

1. collect payout/payment requests
2. check risk and completeness
3. generate a payout plan
4. approve/reject individual payouts
5. execute approved stablecoin payments
6. keep an audit trail

## What AgentSafe Is Not

AgentSafe is not:

- a generic crypto payment app
- a replacement for Safe
- a fully autonomous AI money manager
- a custodial treasury product
- a bank replacement
- a complete accounting suite

## Safety Positioning

Use this principle everywhere:

> AI recommends. Policy enforces. Humans approve.

The AI should never have unlimited authority to move funds.

---

## 7. Core Innovation

## Innovation 1: Payout Plan, Not Raw Payment

Instead of approving isolated transfers, AgentSafe creates a structured **Payout Plan**.

A Payout Plan contains:

- recipients
- wallet addresses
- amounts
- reason/milestone/invoice
- evidence hash
- risk flags
- policy result
- approval state
- execution status

This makes approval more informed.

## Innovation 2: AI Risk Review Before Settlement

AI helps reviewers quickly understand payment context.

AI can:

- summarize payout purpose
- detect missing information
- explain suspicious patterns
- classify payment risk
- generate human-readable approval notes

## Innovation 3: Deterministic Smart Contract Policy

Important payment constraints are enforced by code, not by AI.

Examples:

- max payout amount
- approved reviewer required
- payment cannot execute twice
- treasury can be paused
- only approved payout can execute
- payment status is recorded

## Innovation 4: Wallet-Native Audit Trail

Every executed payment is linked to:

- payout plan ID
- recipient
- amount
- reason/evidence hash
- approver
- transaction hash
- execution timestamp

This reduces manual reconciliation.

## Innovation 5: Startup Wedge for Web3 Ops

AgentSafe can start as a narrow payout tool for grant/contributor payments, then expand into:

- vendor payments
- recurring payroll
- milestone escrow
- reimbursement
- bounty payouts
- treasury policy automation

---

## 8. MVP Demo Scenario

## Recommended Demo Story

**Scenario:** A Web3 ecosystem grant program needs to pay 5 builders after milestone review.

## Demo Data

| Recipient | Amount | Reason | Risk |
|---|---:|---|---|
| Alice | 500 USDC | Milestone 1 completed | Low |
| Bob | 700 USDC | Contributor payout | Low |
| Carol | 500 USDC | Grant milestone | Low |
| Dave | 1,500 USDC | Grant milestone | High: exceeds policy limit |
| Eve | 700 USDC | Contributor payout | High: duplicate wallet with Bob |

## Demo Flow

1. Admin connects wallet.
2. Admin creates or selects a treasury.
3. Admin uploads/manual-enters payout requests.
4. AgentSafe generates a Payout Plan.
5. AI flags risky payouts:
   - Dave exceeds max payout limit.
   - Eve uses duplicate wallet.
6. Admin approves safe payouts.
7. Smart contract executes approved mock USDC payments.
8. Dashboard displays:
   - paid status
   - rejected/flagged status
   - tx hash
   - audit trail

## Demo Message

The demo should clearly show:

> Without AgentSafe, payout ops are manual and risky. With AgentSafe, the team gets AI context, deterministic policy checks, human approval, and onchain execution in one workflow.

---

## 9. MVP Features

## Must-Have Features

### 1. Wallet Connect

- Connect wallet as treasury admin/reviewer.
- Show connected address.

### 2. Treasury Dashboard

- Show treasury balance in mock USDC.
- Show active payout plans.
- Show pending/approved/executed/rejected counts.

### 3. Create Payout Plan

For MVP, form-based input is enough.

Fields:

- recipient name
- wallet address
- amount
- reason
- evidence link or text
- milestone/invoice ID

Optional CSV upload can be added later.

### 4. Risk Engine

Minimum deterministic checks:

- duplicate wallet address
- duplicate milestone/invoice ID
- amount exceeds max payout limit
- missing reason/evidence
- invalid wallet format

### 5. AI Summary

Use AI or mocked LLM response to summarize:

- overall risk
- flagged payouts
- recommended action
- plain-English explanation

### 6. Approve / Reject Payout

Admin can approve or reject each payout.

### 7. Execute Payment

Smart contract transfers mock USDC to approved recipients.

### 8. Audit Log

Show:

- payout ID
- recipient
- amount
- approval status
- tx hash
- timestamp

---

## 10. Nice-to-Have Features

Only add if time allows:

- CSV payout upload
- Safe integration
- batch payment execution
- PDF invoice upload
- OCR invoice parsing
- GitHub evidence check
- Discord/Telegram notification
- multiple reviewer approval
- export audit report as PDF/CSV
- policy templates
- role-based access

---

## 11. Features to Skip for Hackathon

Do not build these in MVP:

- real USDC mainnet payment
- fiat off-ramp
- bank integration
- production accounting
- full compliance/KYC
- multi-chain support
- complex DAO governance
- fully autonomous AI execution
- advanced fraud ML model
- custom multisig from scratch if Safe integration is too slow

---

## 12. Technical Architecture

```text
User / Reviewer
      ↓
Next.js Frontend
      ↓
API Routes / Backend
      ↓
Risk Engine + AI Summary
      ↓
Database / Local Store
      ↓
Smart Contract Treasury
      ↓
Mock USDC Transfer
      ↓
Audit Log + Tx Hash
```

## Onchain Responsibilities

- hold mock USDC treasury balance
- store payout status or emit payout events
- enforce approved-before-execute
- prevent double execution
- enforce max payout limit if implemented onchain
- emit audit events

## Offchain Responsibilities

- store payout metadata
- run AI/risk checks
- store evidence links
- generate human-readable summaries
- provide dashboard UX
- handle CSV/manual form inputs

## Why Offchain + Onchain Split?

Not everything should be onchain.

Put onchain:

- payment execution
- immutable payment events
- core policy enforcement

Keep offchain:

- invoice text
- evidence documents
- AI analysis
- explanations
- UI state
- large metadata

---

## 13. Recommended Tech Stack

## Frontend

- **Next.js** — fast full-stack app setup
- **TypeScript** — safer implementation
- **Tailwind CSS** — fast UI
- **shadcn/ui** optional — clean dashboard components
- **wagmi + viem** — wallet and contract interaction
- **RainbowKit** optional — wallet connect UI

## Smart Contracts

Choose one:

### Option A: Foundry

Best for contract testing and fast Solidity workflow.

### Option B: Hardhat

Best if frontend/dev team is more comfortable with JS/TS.

Recommended for speed: **Hardhat** if building mostly in Next.js, **Foundry** if contract testing is priority.

## Contracts

- `MockUSDC.sol`
- `AgentSafeTreasury.sol`

## Backend

For MVP:

- Next.js API routes
- local JSON / SQLite / Supabase

Recommended simple choice:

- **Supabase** if team wants hosted DB quickly
- **SQLite/Prisma** if working local-first

## AI Layer

Options:

- OpenAI API for summary/explanation
- rule-based risk engine for deterministic checks
- mock AI response if API setup becomes blocker

Recommended:

- deterministic checks first
- LLM only for explanation

## Chain

Use an EVM testnet with low friction.

Possible options:

- Sepolia
- Base Sepolia
- Polygon Amoy
- Arbitrum Sepolia

Recommended default:

**Base Sepolia or Sepolia**

Reason:

- mature EVM tooling
- easy wallet support
- easy explorer demo
- enough for hackathon prototype

---

## 14. Smart Contract Design

## `MockUSDC.sol`

Simple ERC20 token for demo stablecoin.

Required features:

- mint initial supply to treasury/admin
- standard transfer behavior

## `AgentSafeTreasury.sol`

Purpose:

- create payout records
- approve/reject payouts
- execute approved payouts
- emit events for audit trail

## Suggested Solidity Struct

```solidity
struct Payout {
    address recipient;
    uint256 amount;
    bytes32 evidenceHash;
    string reason;
    bool approved;
    bool rejected;
    bool executed;
}
```

## Suggested Events

```solidity
event PayoutCreated(uint256 indexed payoutId, address indexed recipient, uint256 amount, bytes32 evidenceHash);
event PayoutApproved(uint256 indexed payoutId, address indexed approver);
event PayoutRejected(uint256 indexed payoutId, address indexed reviewer, string reason);
event PayoutExecuted(uint256 indexed payoutId, address indexed recipient, uint256 amount, bytes32 txRef);
event TreasuryPaused(address indexed admin);
event TreasuryUnpaused(address indexed admin);
```

## Policy Rules for MVP

- only admin can create payout
- only reviewer/admin can approve
- rejected payout cannot be executed
- payout must be approved before execute
- payout cannot be executed twice
- amount must be below `maxPayoutAmount`
- contract must not be paused

## Security Notes

For demo only:

- mock USDC is acceptable
- simple admin role is acceptable
- no need production-grade multisig

For future startup:

- integrate Safe instead of custom custody
- do not custody user funds directly
- add audited permission module or use established smart account infra

---

## 15. Risk Engine Design

## Input

```ts
type PayoutInput = {
  recipientName: string;
  walletAddress: string;
  amount: number;
  reason: string;
  evidenceUrl?: string;
  milestoneId?: string;
};
```

## Output

```ts
type RiskResult = {
  riskLevel: 'low' | 'medium' | 'high';
  flags: RiskFlag[];
  recommendation: 'approve' | 'review' | 'reject';
  summary: string;
};
```

## Risk Flags

```ts
type RiskFlag = {
  code:
    | 'DUPLICATE_WALLET'
    | 'DUPLICATE_MILESTONE'
    | 'AMOUNT_EXCEEDS_LIMIT'
    | 'MISSING_EVIDENCE'
    | 'INVALID_WALLET'
    | 'NEW_RECIPIENT';
  severity: 'low' | 'medium' | 'high';
  message: string;
};
```

## Deterministic Rules

- If amount > max policy limit → high risk.
- If wallet appears twice in same payout plan → high risk.
- If milestone ID already paid → high risk.
- If evidence missing → medium risk.
- If recipient is new → low/medium risk.
- If wallet format invalid → high risk.

## AI Summary Prompt

Use a short prompt:

```text
You are a treasury risk assistant. Summarize the payout plan for a human reviewer.
Do not approve payments yourself. Explain the key risks, flagged payouts, and recommended next action.
Use concise, professional language.
```

---

## 16. Frontend Pages

## `/`

Landing page.

Sections:

- problem
- product value
- demo CTA
- hackathon one-liner

## `/dashboard`

Treasury overview.

Show:

- treasury balance
- active payout plans
- pending approvals
- executed payouts
- risk summary

## `/payouts/new`

Create payout plan.

Fields:

- recipient name
- wallet
- amount
- reason
- milestone/invoice ID
- evidence link

## `/payouts/[id]`

Payout plan detail.

Show:

- recipients
- risk flags
- AI summary
- approve/reject buttons
- execute payment button
- tx hash after execution

## `/audit`

Audit log.

Show:

- payment history
- approval history
- tx hashes
- evidence hashes

---

## 17. Expected Outputs for Hackathon Submission

## Stage 1 Required Outputs

Create these materials:

1. **Devpost project page**
2. **Short description**
3. **Project overview**
4. **Architecture diagram**
5. **Mockup or screenshots**
6. **Slide deck**
7. **GitHub repository** recommended

## Recommended Files in Repo

```text
README.md
AGENTSAFE_BRAINSTORM.md
ARCHITECTURE.md
contracts/
frontend/
docs/
  pitch.md
  demo-script.md
  architecture-diagram.png or .svg
```

## Demo Video Output

For final/on-site:

- max 3–5 minute demo
- show normal payout
- show suspicious payout
- show smart contract execution
- show tx hash/audit trail

## Slide Deck Outline

1. Title: AgentSafe
2. Problem: stablecoin settlement is fast, payout ops are risky
3. Target users: Web3 grant/contributor payout teams
4. Solution: AI-reviewed payout plans + smart contract policy
5. Demo flow
6. Architecture
7. Innovation
8. Market/startup potential
9. Roadmap
10. Team

---

## 18. Pitch Draft

## Short Description

**AgentSafe is an AI-assisted payout operations layer for Web3 teams. It helps grant programs and small organizations review payout requests, flag risky payments, approve with context, and execute stablecoin payouts through smart contract-enforced policies and auditable onchain records.**

## Problem Statement

Stablecoin payments settle quickly, but Web3 payout operations are still fragmented across forms, spreadsheets, chats, multisigs, and block explorers. This creates duplicate payments, wrong-wallet risk, unclear approvals, and messy audit trails.

## Solution Statement

AgentSafe turns payout requests into structured payout plans. AI summarizes payment context and flags risks, deterministic policies enforce limits, and human reviewers approve final execution through a Web3 treasury contract.

## Value Proposition

- Faster payout review
- Safer stablecoin execution
- Better signer context
- Fewer operational mistakes
- Clear audit trail
- Web3-native treasury workflow

---

## 19. Startup Potential

## Beachhead Market

Start with:

- Web3 grant programs
- DAO contributor payouts
- ecosystem bounty programs
- hackathon prize distribution

## Why This Can Become a Startup

These users already have:

- stablecoin treasuries
- repeated payouts
- multiple recipients
- approval workflows
- audit needs
- operational risk

## Expansion Path

1. Grant payouts
2. Contributor payroll
3. Vendor payments
4. Reimbursement
5. Recurring subscriptions
6. Stablecoin treasury ops for global SMEs

## Business Model

Possible pricing:

- free tier for small teams
- monthly SaaS plan per treasury
- per payout batch fee
- enterprise plan for foundations/ecosystems
- paid audit/export/reporting features

## Moat Over Time

- integrations with Safe, Request Finance, GitHub, Discord, Notion
- payout risk history
- recipient/vendor registry
- treasury policy templates
- recurring workflow data
- audit/reporting layer

---

## 20. Competitive / Inspiration Map

AgentSafe is inspired by patterns seen in Web3 hackathon/startup products, but should not copy them directly.

## Relevant Patterns

| Pattern | Meaning for AgentSafe |
|---|---|
| Approve a plan, not a raw payment | Human reviews structured payout plan before funds move |
| Scoped AI permissions | AI never gets unlimited treasury access |
| Policy engine | Deterministic rules enforce payment safety |
| Offchain risk scoring | AI/risk engine evaluates context before execution |
| Onchain audit receipts | Payment execution and status are verifiable |
| Human-in-the-loop approval | AI assists, humans decide |

## Differentiation

AgentSafe is not a generic multisig or generic payment app.

It is focused on:

> payout operations before stablecoin settlement.

---

## 21. Development Plan

## Phase 0 — Setup

- Create repo structure.
- Initialize Next.js app.
- Initialize contracts workspace.
- Add README.
- Add this brainstorm doc.

## Phase 1 — Smart Contract MVP

Build:

- `MockUSDC.sol`
- `AgentSafeTreasury.sol`

Test:

- create payout
- approve payout
- reject payout
- execute payout
- prevent double execution
- block over-limit payout

## Phase 2 — Frontend MVP

Build:

- dashboard
- create payout form
- payout detail page
- risk result display
- approve/reject/execute buttons

## Phase 3 — Risk Engine

Build:

- deterministic risk checker
- duplicate wallet check
- amount limit check
- missing evidence check
- duplicate milestone check
- AI summary generation

## Phase 4 — Contract Integration

Build:

- wallet connect
- read treasury data
- submit payout to contract
- approve payout
- execute payout
- display tx hash

## Phase 5 — Demo Polish

Build:

- seeded demo data
- clean UI states
- demo script
- architecture diagram
- screenshots
- README setup instructions

---

## 22. Suggested Folder Structure

```text
~/projects/NTUhackathon/
  AGENTSAFE_BRAINSTORM.md
  README.md
  docs/
    pitch.md
    demo-script.md
    architecture.md
  apps/
    web/
      app/
      components/
      lib/
      package.json
  packages/
    contracts/
      contracts/
        AgentSafeTreasury.sol
        MockUSDC.sol
      test/
      scripts/
      package.json
```

If speed matters, simpler structure:

```text
~/projects/NTUhackathon/
  README.md
  AGENTSAFE_BRAINSTORM.md
  frontend/
  contracts/
  docs/
```

---

## 23. Acceptance Criteria

AgentSafe MVP is demo-ready when:

- User can connect wallet.
- User can create a payout request/plan.
- Risk engine flags at least two risky cases.
- AI summary explains the payout plan.
- Admin can approve safe payout.
- Contract executes mock USDC payment.
- Executed payout shows tx hash.
- Audit log shows payment history.
- Demo can be completed in under 5 minutes.

---

## 24. Recommended Next Actions

1. Create repo structure.
2. Write README with product one-liner.
3. Build contract MVP first.
4. Build deterministic risk engine second.
5. Build frontend dashboard third.
6. Add AI summary once the core flow works.
7. Prepare Devpost materials.

## Priority Rule

Do not optimize AI before the payment flow works.

Recommended build order:

```text
Smart contract payment flow
        ↓
Risk engine
        ↓
Frontend dashboard
        ↓
AI summary
        ↓
Demo polish
```

---

## 25. Final Product Definition

**AgentSafe is an AI-assisted stablecoin payout operations platform for Web3 teams and small organizations. It converts messy payment requests into structured payout plans, flags risky transactions, enforces policy through smart contracts, and creates an auditable onchain payment trail.**
