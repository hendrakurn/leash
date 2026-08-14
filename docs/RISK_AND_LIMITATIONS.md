# Risk and Limitations

MVP boundaries that must be disclosed alongside any demo or pitch.

## Trust Boundary

Leash provides an authorization policy and an independently verifiable audit trail. The fiat backend is still trusted to follow the protocol. This MVP does not stop a malicious backend from calling the payment provider directly, outside the system.

## Mocked Components

- fiat settlement;
- BaaS and virtual-card issuance;
- merchant identity verification.

`apps/agent` runs a real Claude tool-calling agent, not a script, so natural-language interpretation is no longer mocked — see `docs/ARCHITECTURE.md`.

## Limitations

- Not a production payment system.
- Prompt injection is contained, not solved. `apps/agent/src/scenario.ts` demonstrates a real agent that is genuinely manipulated (not a hardcoded stand-in) and is still stopped by the contract.
- The agent can still make bad decisions inside an allowed scope.
- `pay_merchant` deliberately performs no validation before calling the contract — this is the product's point, not a bug. The agent may be fully manipulated; the contract is the only gate.
- `ANTHROPIC_API_KEY` is a new credential that needs securing, separate from the private key and the on-chain session key.
- Agent demo transcripts depend on non-deterministic LLM responses — exact wording can vary between runs even though the on-chain outcome (revert/authorized) stays consistent.
- Private keys and session keys still require custody.
- Payment reference and event idempotency are process-local.
- Merchant allowlisting is simplified to an address.
- On-chain amounts store no currency metadata.
- No KYC, AML, compliance, disputes, refunds, or chargebacks.
- No gas abstraction, ERC-4337, privacy, or multichain.
- Base Sepolia is a testnet.
- `AuthorizationGranted` is authorization evidence, not fiat settlement finality.
