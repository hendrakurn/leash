import "dotenv/config";

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  BaseError,
  ContractFunctionRevertedError,
  createPublicClient,
  createWalletClient,
  encodePacked,
  getAddress,
  http,
  keccak256,
  parseEventLogs,
  zeroAddress,
  type Abi,
  type Address,
  type Hex,
  type TransactionReceipt,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

type MandateState = readonly [Address, Address, bigint, bigint, bigint, boolean];

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error("Missing required environment variable: " + name);
  }
  return value;
}

function privateKeyEnv(name: string): Hex {
  const value = requiredEnv(name);
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
    throw new Error(name + " must be a 32-byte 0x-prefixed private key");
  }
  return value as Hex;
}

function addressEnv(name: string): Address {
  return getAddress(requiredEnv(name));
}

function loadAbi(): Abi {
  const artifactPath = fileURLToPath(
    new URL("../../../contracts/out/LeashMandate.sol/LeashMandate.json", import.meta.url),
  );

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(artifactPath, "utf8"));
  } catch (error) {
    throw new Error("Cannot read Foundry artifact. Run forge build in contracts first.", {
      cause: error,
    });
  }

  const artifact = parsed as { abi?: unknown };
  if (!Array.isArray(artifact.abi)) {
    throw new Error("Foundry artifact does not contain an ABI");
  }
  return artifact.abi as Abi;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function customErrorName(error: unknown): string | undefined {
  if (!(error instanceof BaseError)) return undefined;
  const reverted = error.walk(
    (candidate) => candidate instanceof ContractFunctionRevertedError,
  );
  if (!(reverted instanceof ContractFunctionRevertedError)) return undefined;
  return reverted.data?.errorName;
}

function authorizationLogCount(receipt: TransactionReceipt, abi: Abi): number {
  return parseEventLogs({
    abi,
    logs: receipt.logs,
    eventName: "AuthorizationGranted",
    strict: true,
  }).length;
}

async function main(): Promise<void> {
  const rpcUrl = requiredEnv("RPC_URL");
  const contractAddress = addressEnv("CONTRACT_ADDRESS");
  const rockBurger = addressEnv("ROCK_BURGER_ADDRESS");
  const evilStore = addressEnv("EVIL_STORE_ADDRESS");
  const ownerAccount = privateKeyToAccount(privateKeyEnv("OWNER_PRIVATE_KEY"));
  const sessionAccount = privateKeyToAccount(privateKeyEnv("SESSION_KEY_PRIVATE_KEY"));
  const attackGasLimit = BigInt(process.env.ATTACK_GAS_LIMIT ?? "300000");
  const abi = loadAbi();

  assert(ownerAccount.address !== sessionAccount.address, "Owner and session key must differ");
  assert(rockBurger !== evilStore, "Rock Burger and Evil Store must differ");
  assert(rockBurger !== zeroAddress && evilStore !== zeroAddress, "Targets must be nonzero");
  assert(attackGasLimit > 0n, "ATTACK_GAS_LIMIT must be positive");

  const publicClient = createPublicClient({ transport: http(rpcUrl) });
  const ownerWallet = createWalletClient({
    account: ownerAccount,
    transport: http(rpcUrl),
  });
  const sessionWallet = createWalletClient({
    account: sessionAccount,
    transport: http(rpcUrl),
  });

  const chainId = await publicClient.getChainId();
  const ownerNonce = await publicClient.getTransactionCount({
    address: ownerAccount.address,
  });
  const latestBlock = await publicClient.getBlock();
  const validUntil = latestBlock.timestamp + 3_600n;
  const mandateId = keccak256(
    encodePacked(
      ["string", "address", "uint256", "uint256"],
      ["LEASH_DEMO", ownerAccount.address, BigInt(chainId), BigInt(ownerNonce)],
    ),
  );
  const validPaymentRef = keccak256(
    encodePacked(["string", "bytes32"], ["rock-burger-order", mandateId]),
  );
  const invalidTargetRef = keccak256(
    encodePacked(["string", "bytes32"], ["evil-store-attack", mandateId]),
  );
  const overCapRef = keccak256(
    encodePacked(["string", "bytes32"], ["over-cap-attack", mandateId]),
  );
  const revokedRef = keccak256(
    encodePacked(["string", "bytes32"], ["revoked-attempt", mandateId]),
  );

  async function mandateState(): Promise<MandateState> {
    return (await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "mandates",
      args: [mandateId],
    })) as MandateState;
  }

  async function assertExpectedSimulationRevert(
    target: Address,
    amount: bigint,
    paymentRef: Hex,
    expectedError: string,
  ): Promise<void> {
    try {
      await publicClient.simulateContract({
        account: sessionAccount,
        address: contractAddress,
        abi,
        functionName: "authorizePayment",
        args: [mandateId, target, amount, paymentRef],
      });
      throw new Error("Expected simulation to revert with " + expectedError);
    } catch (error) {
      const actualError = customErrorName(error);
      if (actualError !== expectedError) {
        throw new Error(
          "Expected " + expectedError + " but simulation returned " + String(actualError),
          { cause: error },
        );
      }
    }
  }

  async function broadcastExpectedRevert(
    target: Address,
    amount: bigint,
    paymentRef: Hex,
    expectedError: string,
  ): Promise<TransactionReceipt> {
    await assertExpectedSimulationRevert(target, amount, paymentRef, expectedError);

    const hash = await sessionWallet.writeContract({
      chain: null,
      address: contractAddress,
      abi,
      functionName: "authorizePayment",
      args: [mandateId, target, amount, paymentRef],
      gas: attackGasLimit,
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    assert(receipt.status === "reverted", expectedError + " transaction must revert");
    assert(
      authorizationLogCount(receipt, abi) === 0,
      expectedError + " transaction must emit no AuthorizationGranted",
    );
    assert((await mandateState())[3] === 52_000n, expectedError + " changed spentAmount");

    console.log("Transaction hash: " + hash);
    console.log("Transaction status: " + receipt.status);
    console.log("AuthorizationGranted logs: 0");
    console.log("Settlement eligibility: NONE");
    return receipt;
  }

  console.log("[1] Register mandate");
  console.log("Mandate ID: " + mandateId);
  console.log("Session key: " + sessionAccount.address);
  console.log("Allowed merchant: Rock Burger (" + rockBurger + ")");
  const registerHash = await ownerWallet.writeContract({
    chain: null,
    address: contractAddress,
    abi,
    functionName: "registerMandate",
    args: [mandateId, sessionAccount.address, 60_000n, validUntil, [rockBurger]],
  });
  const registerReceipt = await publicClient.waitForTransactionReceipt({
    hash: registerHash,
  });
  assert(registerReceipt.status === "success", "Mandate registration failed");
  console.log("SUCCESS mandate registered");
  console.log("Transaction hash: " + registerHash);

  console.log("");
  console.log("[2] Normal payment");
  const validHash = await sessionWallet.writeContract({
    chain: null,
    address: contractAddress,
    abi,
    functionName: "authorizePayment",
    args: [mandateId, rockBurger, 52_000n, validPaymentRef],
  });
  const validReceipt = await publicClient.waitForTransactionReceipt({ hash: validHash });
  assert(validReceipt.status === "success", "Valid authorization transaction failed");
  const validLogs = parseEventLogs({
    abi,
    logs: validReceipt.logs,
    eventName: "AuthorizationGranted",
    strict: true,
  });
  assert(validLogs.length === 1, "Expected exactly one AuthorizationGranted event");
  const validArgs = validLogs[0]?.args as unknown as {
    mandateId: Hex;
    sessionKey: Address;
    target: Address;
    amount: bigint;
    paymentRef: Hex;
  };
  assert(validArgs.mandateId === mandateId, "Event mandate ID mismatch");
  assert(validArgs.sessionKey === sessionAccount.address, "Event session key mismatch");
  assert(validArgs.target === rockBurger, "Event target mismatch");
  assert(validArgs.amount === 52_000n, "Event amount mismatch");
  assert(validArgs.paymentRef === validPaymentRef, "Event paymentRef mismatch");
  assert((await mandateState())[3] === 52_000n, "Valid payment did not update spentAmount");
  console.log("SUCCESS AuthorizationGranted");
  console.log("Target: Rock Burger");
  console.log("Amount: 52000");
  console.log("Transaction hash: " + validHash);
  console.log("Transaction status: " + validReceipt.status);

  console.log("");
  console.log("[3] Prompt injection attack");
  console.log("REJECTED TargetNotAllowed");
  await broadcastExpectedRevert(evilStore, 50_000n, invalidTargetRef, "TargetNotAllowed");

  console.log("");
  console.log("[4] Overspending attack");
  console.log("REJECTED AmountExceedsCap");
  await broadcastExpectedRevert(rockBurger, 500_000n, overCapRef, "AmountExceedsCap");

  console.log("");
  console.log("[5] Revoke");
  const revokeHash = await ownerWallet.writeContract({
    chain: null,
    address: contractAddress,
    abi,
    functionName: "revokeMandate",
    args: [mandateId],
  });
  const revokeReceipt = await publicClient.waitForTransactionReceipt({ hash: revokeHash });
  assert(revokeReceipt.status === "success", "Revocation failed");
  assert((await mandateState())[5], "Mandate did not become revoked");
  console.log("SUCCESS mandate revoked");
  console.log("Transaction hash: " + revokeHash);

  console.log("");
  console.log("[6] Post-revocation payment");
  console.log("REJECTED Revoked");
  await broadcastExpectedRevert(rockBurger, 1_000n, revokedRef, "Revoked");

  const finalState = await mandateState();
  assert(finalState[3] === 52_000n, "Unexpected final spent amount");
  assert(finalState[2] - finalState[3] === 8_000n, "Unexpected final remaining amount");
  assert(finalState[5], "Mandate should remain revoked");

  console.log("");
  console.log("Final spent amount: " + finalState[3].toString());
  console.log("Final remaining amount: " + (finalState[2] - finalState[3]).toString());
  console.log("Final revoked state: true");
}

main().catch((error: unknown) => {
  console.error("DEMO FAILED");
  console.error(error);
  process.exitCode = 1;
});
