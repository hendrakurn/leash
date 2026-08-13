#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONTRACTS_DIR="$REPO_ROOT/contracts"
DEMO_DIR="$REPO_ROOT/apps/demo-runner"
BACKEND_DIR="$REPO_ROOT/apps/backend"
TASK_TMP="$(mktemp -d -t leash-local-demo.XXXXXX)"
ANVIL_PORT="$(printenv ANVIL_PORT 2>/dev/null || printf 8545)"
RPC_URL="http://127.0.0.1:$ANVIL_PORT"
ANVIL_PID=""

# These are Anvil development keys. Never use them on a public network.
OWNER_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
SESSION_KEY_PRIVATE_KEY="0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
ROCK_BURGER_ADDRESS="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
EVIL_STORE_ADDRESS="0x90F79bf6EB2c4f870365E785982E1f101E93b906"

cleanup() {
  if [[ -n "$ANVIL_PID" ]] && kill -0 "$ANVIL_PID" 2>/dev/null; then
    kill "$ANVIL_PID" 2>/dev/null || true
    wait "$ANVIL_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

for command_name in forge anvil cast node npm rg; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Missing required command: $command_name" >&2
    exit 1
  fi
done

if cast chain-id --rpc-url "$RPC_URL" >/dev/null 2>&1; then
  echo "Port $ANVIL_PORT already serves an Ethereum RPC. Choose another ANVIL_PORT." >&2
  exit 1
fi

echo "Starting deterministic Anvil on $RPC_URL"
anvil --silent --port "$ANVIL_PORT" --chain-id 31337 >"$TASK_TMP/anvil.log" 2>&1 &
ANVIL_PID=$!

for _ in $(seq 1 50); do
  if cast chain-id --rpc-url "$RPC_URL" >/dev/null 2>&1; then
    break
  fi
  sleep 0.1
done

if ! kill -0 "$ANVIL_PID" 2>/dev/null; then
  echo "Anvil failed to start" >&2
  sed -n '1,160p' "$TASK_TMP/anvil.log" >&2
  exit 1
fi

if [[ "$(cast chain-id --rpc-url "$RPC_URL")" != "31337" ]]; then
  echo "Unexpected local chain ID" >&2
  exit 1
fi

echo "Building and testing LeashMandate"
(
  cd "$CONTRACTS_DIR"
  forge fmt --check
  forge build
  forge test
)

echo "Deploying LeashMandate through the Foundry deployment script"
(
  cd "$CONTRACTS_DIR"
  PRIVATE_KEY="$OWNER_PRIVATE_KEY" forge script \
    script/DeployLeashMandate.s.sol:DeployLeashMandateScript \
    --rpc-url "$RPC_URL" \
    --broadcast
)

BROADCAST_FILE="$CONTRACTS_DIR/broadcast/DeployLeashMandate.s.sol/31337/run-latest.json"
if [[ ! -f "$BROADCAST_FILE" ]]; then
  echo "Foundry broadcast artifact not found: $BROADCAST_FILE" >&2
  exit 1
fi

CONTRACT_ADDRESS="$(
  node -e '
    const fs = require("node:fs");
    const run = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const deployment = run.transactions.find((transaction) => transaction.transactionType === "CREATE");
    if (!deployment || !deployment.contractAddress) process.exit(1);
    process.stdout.write(deployment.contractAddress);
  ' "$BROADCAST_FILE"
)"

DEPLOYMENT_HASH="$(
  node -e '
    const fs = require("node:fs");
    const run = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const deployment = run.transactions.find((transaction) => transaction.transactionType === "CREATE");
    if (!deployment || !deployment.hash) process.exit(1);
    process.stdout.write(deployment.hash);
  ' "$BROADCAST_FILE"
)"

DEPLOYMENT_BLOCK="$(
  node -e '
    const fs = require("node:fs");
    const run = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const receipt = run.receipts[0];
    if (!receipt || receipt.blockNumber === undefined) process.exit(1);
    process.stdout.write(BigInt(receipt.blockNumber).toString());
  ' "$BROADCAST_FILE"
)"

echo "Local contract: $CONTRACT_ADDRESS"
echo "Deployment transaction: $DEPLOYMENT_HASH"
echo "Deployment block: $DEPLOYMENT_BLOCK"

DEMO_LOG="$TASK_TMP/demo.log"
echo "Running deterministic normal and attack flows"
set +e
(
  cd "$DEMO_DIR"
  RPC_URL="$RPC_URL" \
    CONTRACT_ADDRESS="$CONTRACT_ADDRESS" \
    OWNER_PRIVATE_KEY="$OWNER_PRIVATE_KEY" \
    SESSION_KEY_PRIVATE_KEY="$SESSION_KEY_PRIVATE_KEY" \
    ROCK_BURGER_ADDRESS="$ROCK_BURGER_ADDRESS" \
    EVIL_STORE_ADDRESS="$EVIL_STORE_ADDRESS" \
    npm run demo
) >"$DEMO_LOG" 2>&1
DEMO_STATUS=$?
set -e
sed -n '1,240p' "$DEMO_LOG"
if [[ "$DEMO_STATUS" -ne 0 ]]; then
  echo "Demo runner failed" >&2
  exit "$DEMO_STATUS"
fi

BACKEND_LOG="$TASK_TMP/backend.log"
echo "Replaying confirmed authorization events through the mock BaaS listener"
set +e
(
  cd "$BACKEND_DIR"
  RPC_URL="$RPC_URL" \
    CONTRACT_ADDRESS="$CONTRACT_ADDRESS" \
    START_BLOCK="$DEPLOYMENT_BLOCK" \
    CONFIRMATIONS=1 \
    LISTENER_MODE=once \
    EXPECTED_SETTLEMENTS=1 \
    npm run dev
) >"$BACKEND_LOG" 2>&1
BACKEND_STATUS=$?
set -e
sed -n '1,200p' "$BACKEND_LOG"
if [[ "$BACKEND_STATUS" -ne 0 ]]; then
  echo "Backend listener failed" >&2
  exit "$BACKEND_STATUS"
fi

rg -q "^SUCCESS AuthorizationGranted$" "$DEMO_LOG"
rg -q "^REJECTED TargetNotAllowed$" "$DEMO_LOG"
rg -q "^REJECTED AmountExceedsCap$" "$DEMO_LOG"
rg -q "^REJECTED Revoked$" "$DEMO_LOG"
rg -q "^Final spent amount: 52000$" "$DEMO_LOG"
rg -q "^Authorization events processed: 1$" "$BACKEND_LOG"
rg -q "^Mock settlements: 1$" "$BACKEND_LOG"

SETTLEMENT_COUNT="$(rg -c "^Settlement status: SUCCESS$" "$BACKEND_LOG")"
if [[ "$SETTLEMENT_COUNT" != "1" ]]; then
  echo "Expected exactly one settlement log, observed $SETTLEMENT_COUNT" >&2
  exit 1
fi

echo ""
echo "LEASH LOCAL END-TO-END: PASS"
echo "AuthorizationGranted events: 1"
echo "Mock settlements: 1"
echo "Invalid-target settlements: 0"
echo "Over-cap settlements: 0"
echo "Post-revocation settlements: 0"
echo "Final spent amount: 52000"
echo "Evidence logs: $TASK_TMP"

