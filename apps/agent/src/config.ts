import "dotenv/config";

import { createPublicClient, createWalletClient, http, type Address, type PublicClient, type WalletClient } from "viem";
import { privateKeyToAccount, type PrivateKeyAccount } from "viem/accounts";
import { loadAbi } from "./abi.js";
import { addressEnv, privateKeyEnv, requiredEnv } from "./env.js";

export interface AgentConfig {
  readonly rpcUrl: string;
  readonly contractAddress: Address;
  readonly rockBurger: Address;
  readonly evilStore: Address;
  readonly abi: ReturnType<typeof loadAbi>;
  readonly publicClient: PublicClient;
  readonly sessionAccount: PrivateKeyAccount;
  readonly sessionWallet: WalletClient;
}

export function loadConfig(): AgentConfig {
  const rpcUrl = requiredEnv("RPC_URL");
  const contractAddress = addressEnv("CONTRACT_ADDRESS");
  const rockBurger = addressEnv("ROCK_BURGER_ADDRESS");
  const evilStore = addressEnv("EVIL_STORE_ADDRESS");
  const sessionAccount = privateKeyToAccount(privateKeyEnv("SESSION_KEY_PRIVATE_KEY"));
  const abi = loadAbi();

  const publicClient = createPublicClient({ transport: http(rpcUrl) });
  const sessionWallet = createWalletClient({ account: sessionAccount, transport: http(rpcUrl) });

  return {
    rpcUrl,
    contractAddress,
    rockBurger,
    evilStore,
    abi,
    publicClient,
    sessionAccount,
    sessionWallet,
  };
}

/** Only needed by the scenario script, which registers its own mandate. */
export function loadOwnerAccount(): PrivateKeyAccount {
  return privateKeyToAccount(privateKeyEnv("OWNER_PRIVATE_KEY"));
}
