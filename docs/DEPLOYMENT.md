# Deployment

## Local Anvil

Status: verified.

The deterministic script deployed LeashMandate through DeployLeashMandate.s.sol on chain ID 31337.

Latest verified local run:

- contract: 0x5fbdb2315678afecb367f032d93f642f64180aa3;
- deployment transaction: 0xb15a573dcf9ccddc9d290edcdbc13cf1bb92a42902261d56d9403e2f30f85fa9;
- deployment block: 1.

These values are ephemeral local-chain evidence and are not public deployment claims.

## Base Sepolia

Status: SKIPPED_CREDENTIALS.

At verification time, BASE_SEPOLIA_RPC_URL, PRIVATE_KEY, BASESCAN_API_KEY, and CONFIRM_TESTNET_ONLY_WALLET were absent. No public broadcast was attempted, so there is no Base contract address, transaction hash, block, or explorer URL.

Before deployment:

1. use a testnet-only wallet with no mainnet funds;
2. fund it with Base Sepolia ETH;
3. set CONFIRM_TESTNET_ONLY_WALLET=true;
4. verify the RPC chain ID is 84532;
5. rerun all contract tests.

Command from contracts:

~~~bash
forge script script/DeployLeashMandate.s.sol:DeployLeashMandateScript \
  --rpc-url "$BASE_SEPOLIA_RPC_URL" \
  --broadcast \
  --verify \
  --etherscan-api-key "$BASESCAN_API_KEY"
~~~

Record an address or explorer link here only after checking it on Base Sepolia.

