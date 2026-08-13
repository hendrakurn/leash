import "dotenv/config";

import { getAddress, type Address } from "viem";

export type ListenerMode = "live" | "once";

export interface AppConfig {
  readonly rpcUrl: string;
  readonly contractAddress: Address;
  readonly startBlock: bigint;
  readonly confirmations: number;
  readonly pollIntervalMs: number;
  readonly listenerMode: ListenerMode;
  readonly expectedSettlements?: number;
}

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error("Missing required environment variable: " + name);
  return value;
}

function nonnegativeBigInt(name: string, fallback: string): bigint {
  const value = process.env[name]?.trim() || fallback;
  if (!/^\d+$/.test(value)) throw new Error(name + " must be a nonnegative integer");
  return BigInt(value);
}

function positiveInteger(name: string, fallback: string): number {
  const value = process.env[name]?.trim() || fallback;
  if (!/^\d+$/.test(value)) throw new Error(name + " must be a positive integer");
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(name + " must be a positive safe integer");
  }
  return parsed;
}

function optionalNonnegativeInteger(name: string): number | undefined {
  const value = process.env[name]?.trim();
  if (!value) return undefined;
  if (!/^\d+$/.test(value)) throw new Error(name + " must be a nonnegative integer");
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) throw new Error(name + " is too large");
  return parsed;
}

export function loadConfig(): AppConfig {
  const listenerMode = (process.env.LISTENER_MODE?.trim() || "live") as ListenerMode;
  if (listenerMode !== "live" && listenerMode !== "once") {
    throw new Error("LISTENER_MODE must be live or once");
  }

  return Object.freeze({
    rpcUrl: required("RPC_URL"),
    contractAddress: getAddress(required("CONTRACT_ADDRESS")),
    startBlock: nonnegativeBigInt("START_BLOCK", "0"),
    confirmations: positiveInteger("CONFIRMATIONS", "1"),
    pollIntervalMs: positiveInteger("POLL_INTERVAL_MS", "1000"),
    listenerMode,
    expectedSettlements: optionalNonnegativeInteger("EXPECTED_SETTLEMENTS"),
  });
}

