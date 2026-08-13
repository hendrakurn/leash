# Verification

Date: 2026-08-13  
Timezone: Asia/Jakarta

## Environment

- repository path: /home/hendra/projects/NTUhackathon;
- Git status: directory is not a Git repository;
- forge/anvil: 1.5.1-stable;
- solc: 0.8.24;
- node: 24.12.0;
- npm: 11.6.2.

## Smart Contract

Commands:

~~~bash
cd contracts
forge fmt --check
forge build
forge test -vvv
~~~

Result:

- build successful;
- 26 tests passed;
- 0 failed;
- 0 skipped.

Coverage includes all required registration, MandateRegistered target logs, valid flow, rejection, cumulative cap, expiry, revocation, wrong-key, zero-amount, event, state-preservation, and attack-no-event cases.

## TypeScript

Demo runner:

- npm install: success, lockfile created;
- npm run typecheck: success.

Backend:

- npm install: success, lockfile created;
- npm run typecheck: success;
- npm test: 5 passed, 0 failed.

Telegram:

- npm install: success, lockfile created;
- npm run typecheck: success;
- runtime: SKIPPED_CREDENTIALS because TELEGRAM_BOT_TOKEN was absent.

## Local End-to-End

Command:

~~~bash
./scripts/run-local-demo.sh
~~~

Result: PASS.

Local evidence from the verified run:

| Step | Transaction | Status |
|---|---|---|
| Deploy | 0xb15a573dcf9ccddc9d290edcdbc13cf1bb92a42902261d56d9403e2f30f85fa9 | success |
| Register | 0x50df5306f77c7f145dbdfbfd4446ce9a2d6d7392a8ed1d260c7947e6379a268a | success |
| Valid 52,000 | 0x9e712b31aa2600d5692cee13f2d41f0fd1b912245267ba58e2fbbc803f6313e7 | success |
| Evil Store | 0x92171c2cfde2887a5f7e42981feda24bb9fe5a9506f3e56b6da6dda3019ca8c1 | reverted |
| 500,000 | 0xbe794059991be07b4be0d1681739ca14f930e1385f6adfafdad44d588753bedd | reverted |
| Revoke | 0x92a7bf9455197faac3a73be8a2f71b2e28e1e8c04b0cbbeb0349f818a3712fac | success |
| Post-revoke | 0x1e6456c647f604f431512fd5967a1f3addbaadba694a09f3716fb1005d56ebde | reverted |

Aggregate assertions:

- AuthorizationGranted events: 1;
- mock settlements: 1;
- invalid-target settlements: 0;
- over-cap settlements: 0;
- post-revocation settlements: 0;
- final spent amount: 52,000;
- remaining amount: 8,000;
- final revoked state: true.

Local transaction hashes are reproducible Anvil evidence, not Base Sepolia evidence.

## Public Deployment

Base Sepolia deployment is recorded.

- network: Base Sepolia;
- chain ID: 84532;
- contract: 0x4D74d9469de72B9aACBe0a696e769EEA817D4988;
- deployment transaction: 0x0804141b25c2eb758c2bd2c6a9236ef6e346a0cef33bb9f7e69d2ca662c58b9c;
- deployment block: 45423055;
- receipt status: success;
- explorer address: https://sepolia.basescan.org/address/0x4D74d9469de72B9aACBe0a696e769EEA817D4988;
- explorer transaction: https://sepolia.basescan.org/tx/0x0804141b25c2eb758c2bd2c6a9236ef6e346a0cef33bb9f7e69d2ca662c58b9c;
- source verification: not recorded in this repo.

Receipt and code checks were run with cast against BASE_SEPOLIA_RPC_URL. The contract code exists at the recorded address, and the deployment receipt status is success.
