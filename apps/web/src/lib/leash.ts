import type { Address, Hex } from "viem";

/**
 * Mirror of contracts/src/LeashMandate.sol.
 *
 * The eight custom errors below are the entire refusal vocabulary of this
 * product. The interface never invents a rejection reason and never phrases one
 * in its own words — whatever the chain reverts with is what the visitor reads.
 */
export const leashAbi = [
  {
    type: "function",
    name: "registerMandate",
    stateMutability: "nonpayable",
    inputs: [
      { name: "mandateId", type: "bytes32" },
      { name: "sessionKey", type: "address" },
      { name: "maxAmount", type: "uint256" },
      { name: "validUntil", type: "uint256" },
      { name: "targets", type: "address[]" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "authorizePayment",
    stateMutability: "nonpayable",
    inputs: [
      { name: "mandateId", type: "bytes32" },
      { name: "target", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "paymentRef", type: "bytes32" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "revokeMandate",
    stateMutability: "nonpayable",
    inputs: [{ name: "mandateId", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "mandates",
    stateMutability: "view",
    inputs: [{ name: "mandateId", type: "bytes32" }],
    outputs: [
      { name: "owner", type: "address" },
      { name: "sessionKey", type: "address" },
      { name: "maxAmount", type: "uint256" },
      { name: "spentAmount", type: "uint256" },
      { name: "validUntil", type: "uint256" },
      { name: "revoked", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "allowedTargets",
    stateMutability: "view",
    inputs: [
      { name: "mandateId", type: "bytes32" },
      { name: "target", type: "address" },
    ],
    outputs: [{ name: "allowed", type: "bool" }],
  },
  {
    type: "event",
    name: "MandateRegistered",
    inputs: [
      { name: "mandateId", type: "bytes32", indexed: true },
      { name: "owner", type: "address", indexed: true },
      { name: "sessionKey", type: "address", indexed: true },
      { name: "maxAmount", type: "uint256", indexed: false },
      { name: "validUntil", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "AuthorizationGranted",
    inputs: [
      { name: "mandateId", type: "bytes32", indexed: true },
      { name: "sessionKey", type: "address", indexed: true },
      { name: "target", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "paymentRef", type: "bytes32", indexed: false },
    ],
  },
  {
    type: "event",
    name: "MandateRevoked",
    inputs: [{ name: "mandateId", type: "bytes32", indexed: true }],
  },
  { type: "error", name: "NotOwner", inputs: [] },
  { type: "error", name: "InvalidMandate", inputs: [] },
  { type: "error", name: "Revoked", inputs: [] },
  { type: "error", name: "Expired", inputs: [] },
  { type: "error", name: "TargetNotAllowed", inputs: [] },
  { type: "error", name: "AmountExceedsCap", inputs: [] },
  { type: "error", name: "MandateAlreadyExists", inputs: [] },
  { type: "error", name: "ZeroAmount", inputs: [] },
] as const;

export type MandateTuple = readonly [Address, Address, bigint, bigint, bigint, boolean];

export interface Mandate {
  owner: Address;
  sessionKey: Address;
  maxAmount: bigint;
  spentAmount: bigint;
  validUntil: bigint;
  revoked: boolean;
}

export function toMandate(tuple: MandateTuple): Mandate {
  return {
    owner: tuple[0],
    sessionKey: tuple[1],
    maxAmount: tuple[2],
    spentAmount: tuple[3],
    validUntil: tuple[4],
    revoked: tuple[5],
  };
}

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export function mandateExists(mandate: Mandate): boolean {
  return mandate.owner !== ZERO_ADDRESS;
}

/**
 * What each revert means, in the product's own language.
 *
 * `problem` names what happened. `recovery` names what the visitor can do — or
 * states plainly that nothing can be done, which is the correct answer for a
 * revoked mandate and the whole point of making revocation one-way.
 */
export const ERROR_COPY: Record<string, { problem: string; recovery: string }> = {
  TargetNotAllowed: {
    problem: "This merchant is not on the mandate's allowlist.",
    recovery: "Register a new mandate that includes it. An existing allowlist cannot be extended.",
  },
  AmountExceedsCap: {
    problem: "The amount is larger than the mandate's remaining balance.",
    recovery: "Spend within the remaining balance, or register a new mandate with a higher ceiling.",
  },
  Revoked: {
    problem: "This mandate was revoked. Revocation is permanent.",
    recovery: "Nothing restores it. Register a new mandate to authorise spending again.",
  },
  Expired: {
    problem: "The mandate's expiry has passed.",
    recovery: "Register a new mandate with a future expiry.",
  },
  NotOwner: {
    problem: "The signer is not authorised for this action.",
    recovery: "Payments must come from the session key; revocation must come from the owner.",
  },
  ZeroAmount: {
    problem: "The amount is zero.",
    recovery: "Enter an amount above zero.",
  },
  InvalidMandate: {
    problem: "No mandate exists for this identifier, or its terms are invalid.",
    recovery: "Check the mandate ID, or register the mandate first.",
  },
  MandateAlreadyExists: {
    problem: "A mandate with this identifier is already registered.",
    recovery: "Mandate identifiers are permanent. Use a different one.",
  },
};

export const ALL_ERROR_NAMES = Object.keys(ERROR_COPY);

/** Pulls the custom error name out of a viem revert, if there is one. */
export function revertName(error: unknown): string | undefined {
  const seen = new Set<unknown>();
  let node: unknown = error;
  while (node && typeof node === "object" && !seen.has(node)) {
    seen.add(node);
    const candidate = node as { name?: string; data?: { errorName?: string }; cause?: unknown };
    if (candidate.data?.errorName) return candidate.data.errorName;
    node = candidate.cause;
  }
  return undefined;
}

/**
 * Indonesian rupiah, matching the demo's denomination. The contract itself is
 * currency-agnostic; this is display only.
 */
const RUPIAH = new Intl.NumberFormat("id-ID");

export function formatUnits(value: bigint): string {
  return RUPIAH.format(value);
}

export function formatRupiah(value: bigint): string {
  return `Rp${RUPIAH.format(value)}`;
}

export function shortHex(value: string, lead = 6, tail = 4): string {
  if (value.length <= lead + tail + 2) return value;
  return `${value.slice(0, lead)}…${value.slice(-tail)}`;
}
