import { getAddress, type Address, type Hex } from "viem";

export function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error("Missing required environment variable: " + name);
  }
  return value;
}

export function addressEnv(name: string): Address {
  return getAddress(requiredEnv(name));
}

export function privateKeyEnv(name: string): Hex {
  const value = requiredEnv(name);
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
    throw new Error(name + " must be a 32-byte 0x-prefixed private key");
  }
  return value as Hex;
}

export function hexEnv(name: string): Hex {
  const value = requiredEnv(name);
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
    throw new Error(name + " must be a 32-byte 0x-prefixed hex value");
  }
  return value as Hex;
}
