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

Status: deployed.

Latest confirmed deployment:

- network: Base Sepolia;
- chain ID: 84532;
- contract: 0x4D74d9469de72B9aACBe0a696e769EEA817D4988;
- deployment transaction: 0x0804141b25c2eb758c2bd2c6a9236ef6e346a0cef33bb9f7e69d2ca662c58b9c;
- deployment block: 45423055;
- receipt status: success;
- gas used: 527920;
- explorer address: https://sepolia.basescan.org/address/0x4D74d9469de72B9aACBe0a696e769EEA817D4988;
- explorer transaction: https://sepolia.basescan.org/tx/0x0804141b25c2eb758c2bd2c6a9236ef6e346a0cef33bb9f7e69d2ca662c58b9c;
- source verification: not recorded in this repo.

Verified checks before recording this deployment:

~~~bash
cd contracts
forge fmt --check
forge build
forge test -vvv
cast code 0x4D74d9469de72B9aACBe0a696e769EEA817D4988 --rpc-url "$BASE_SEPOLIA_RPC_URL"
cast receipt --rpc-url "$BASE_SEPOLIA_RPC_URL" 0x0804141b25c2eb758c2bd2c6a9236ef6e346a0cef33bb9f7e69d2ca662c58b9c status
cast receipt --rpc-url "$BASE_SEPOLIA_RPC_URL" 0x0804141b25c2eb758c2bd2c6a9236ef6e346a0cef33bb9f7e69d2ca662c58b9c blockNumber
cast receipt --rpc-url "$BASE_SEPOLIA_RPC_URL" 0x0804141b25c2eb758c2bd2c6a9236ef6e346a0cef33bb9f7e69d2ca662c58b9c contractAddress
~~~

Deploy command from contracts:

~~~bash
forge script script/DeployLeashMandate.s.sol:DeployLeashMandateScript \
  --rpc-url "$BASE_SEPOLIA_RPC_URL" \
  --broadcast
~~~

Optional source verification command:

~~~bash
forge verify-contract \
  --chain-id 84532 \
  --etherscan-api-key "$BASESCAN_API_KEY" \
  0x4D74d9469de72B9aACBe0a696e769EEA817D4988 \
  src/LeashMandate.sol:LeashMandate
~~~
