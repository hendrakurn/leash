import { baseSepolia } from "viem/chains";
import { defineChain, isAddress, type Address, type Chain } from "viem";

const anvil = defineChain({
  id: 31337,
  name: "Anvil",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
});

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 84532);

export const activeChain: Chain = chainId === 31337 ? anvil : baseSepolia;

export const rpcUrl =
  process.env.NEXT_PUBLIC_RPC_URL ?? activeChain.rpcUrls.default.http[0];

function optionalAddress(raw: string | undefined): Address | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  return isAddress(trimmed) ? (trimmed as Address) : undefined;
}

/**
 * Undefined until a real deployment exists.
 *
 * docs/DEPLOYMENT.md records SKIPPED_CREDENTIALS: there is no public address
 * yet. Every surface that needs one renders an explicit undeployed state rather
 * than a placeholder that could be mistaken for a real contract.
 */
export const contractAddress = optionalAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

export const deployBlock = BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK ?? "0");

export const merchants: { name: string; address: Address | undefined; allowlisted: boolean }[] = [
  {
    name: "Rock Burger",
    address: optionalAddress(process.env.NEXT_PUBLIC_ROCK_BURGER_ADDRESS),
    allowlisted: true,
  },
  {
    name: "Maple Kitchen",
    address: optionalAddress(process.env.NEXT_PUBLIC_EVIL_STORE_ADDRESS),
    allowlisted: false,
  },
];

export function explorerTx(hash: string): string | undefined {
  const base = activeChain.blockExplorers?.default.url;
  return base ? `${base}/tx/${hash}` : undefined;
}

export function explorerAddress(address: string): string | undefined {
  const base = activeChain.blockExplorers?.default.url;
  return base ? `${base}/address/${address}` : undefined;
}
