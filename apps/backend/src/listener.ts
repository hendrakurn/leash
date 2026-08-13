import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  createPublicClient,
  http,
  type Abi,
  type Address,
  type Hex,
} from "viem";

import type { AppConfig } from "./config.js";
import {
  MockBaasSettlementProcessor,
  type AuthorizationEvent,
} from "./mockBaas.js";

export interface ListenerSummary {
  readonly authorizationEvents: number;
  readonly settlements: number;
  readonly fromBlock: bigint;
  readonly toBlock?: bigint;
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

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function runListener(
  config: AppConfig,
  processor = new MockBaasSettlementProcessor(),
): Promise<ListenerSummary> {
  const abi = loadAbi();
  const client = createPublicClient({ transport: http(config.rpcUrl) });
  const chainId = await client.getChainId();
  let cursor = config.startBlock;
  let authorizationEvents = 0;

  console.log("Leash listener started");
  console.log("Contract: " + config.contractAddress);
  console.log("Start block: " + cursor.toString());
  console.log("Confirmations: " + config.confirmations.toString());
  console.log("Mode: " + config.listenerMode);

  while (true) {
    const latest = await client.getBlockNumber();
    const confirmationOffset = BigInt(config.confirmations - 1);
    const safeBlock = latest >= confirmationOffset ? latest - confirmationOffset : undefined;

    if (safeBlock !== undefined && cursor <= safeBlock) {
      const logs = await client.getContractEvents({
        address: config.contractAddress,
        abi,
        eventName: "AuthorizationGranted",
        fromBlock: cursor,
        toBlock: safeBlock,
        strict: true,
      });

      logs.sort((left, right) => {
        const leftBlock = left.blockNumber ?? 0n;
        const rightBlock = right.blockNumber ?? 0n;
        if (leftBlock !== rightBlock) return leftBlock < rightBlock ? -1 : 1;
        const leftTransaction = left.transactionIndex ?? 0;
        const rightTransaction = right.transactionIndex ?? 0;
        if (leftTransaction !== rightTransaction) return leftTransaction - rightTransaction;
        return (left.logIndex ?? 0) - (right.logIndex ?? 0);
      });

      for (const log of logs) {
        if (log.transactionHash === null || log.logIndex === null) {
          throw new Error("Confirmed log is missing transaction identity");
        }
        const args = log.args as {
          mandateId?: Hex;
          sessionKey?: Address;
          target?: Address;
          amount?: bigint;
          paymentRef?: Hex;
        };
        if (
          args.mandateId === undefined ||
          args.sessionKey === undefined ||
          args.target === undefined ||
          args.amount === undefined ||
          args.paymentRef === undefined
        ) {
          throw new Error("AuthorizationGranted log has incomplete arguments");
        }

        const event: AuthorizationEvent = {
          chainId,
          contractAddress: config.contractAddress,
          mandateId: args.mandateId,
          sessionKey: args.sessionKey,
          target: args.target,
          amount: args.amount,
          paymentRef: args.paymentRef,
          transactionHash: log.transactionHash,
          logIndex: log.logIndex,
        };
        processor.process(event);
        authorizationEvents += 1;
      }

      cursor = safeBlock + 1n;
    }

    if (config.listenerMode === "once") {
      const summary: ListenerSummary = {
        authorizationEvents,
        settlements: processor.settlementCount,
        fromBlock: config.startBlock,
        toBlock: safeBlock,
      };
      console.log("Authorization events processed: " + summary.authorizationEvents);
      console.log("Mock settlements: " + summary.settlements);

      if (
        config.expectedSettlements !== undefined &&
        summary.settlements !== config.expectedSettlements
      ) {
        throw new Error(
          "Expected " +
            config.expectedSettlements +
            " settlements but observed " +
            summary.settlements,
        );
      }
      return summary;
    }

    await sleep(config.pollIntervalMs);
  }
}

