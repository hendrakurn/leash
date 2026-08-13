import "dotenv/config";

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Bot, type Context } from "grammy";
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
  type Abi,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

interface ActiveMandate {
  readonly mandateId: Hex;
  readonly validUntil: bigint;
}

type MandateState = readonly [Address, Address, bigint, bigint, bigint, boolean];

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error("Missing required environment variable: " + name);
  return value;
}

function privateKey(name: string): Hex {
  const value = required(name);
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
    throw new Error(name + " must be a 32-byte 0x-prefixed private key");
  }
  return value as Hex;
}

function loadAbi(): Abi {
  const artifactPath = fileURLToPath(
    new URL("../../../contracts/out/LeashMandate.sol/LeashMandate.json", import.meta.url),
  );
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(artifactPath, "utf8"));
  } catch (error) {
    throw new Error("Cannot read Foundry artifact. Run forge build first.", {
      cause: error,
    });
  }
  const artifact = parsed as { abi?: unknown };
  if (!Array.isArray(artifact.abi)) throw new Error("Foundry artifact ABI is missing");
  return artifact.abi as Abi;
}

function customErrorName(error: unknown): string | undefined {
  if (!(error instanceof BaseError)) return undefined;
  const reverted = error.walk(
    (candidate) => candidate instanceof ContractFunctionRevertedError,
  );
  return reverted instanceof ContractFunctionRevertedError
    ? reverted.data?.errorName
    : undefined;
}

function chatId(ctx: Context): number {
  if (ctx.chat === undefined) throw new Error("Telegram chat is unavailable");
  return ctx.chat.id;
}

async function main(): Promise<void> {
  const token = required("TELEGRAM_BOT_TOKEN");
  const rpcUrl = required("RPC_URL");
  const contractAddress = getAddress(required("CONTRACT_ADDRESS"));
  const rockBurger = getAddress(required("ROCK_BURGER_ADDRESS"));
  const evilStore = getAddress(required("EVIL_STORE_ADDRESS"));
  const ownerAccount = privateKeyToAccount(privateKey("OWNER_PRIVATE_KEY"));
  const sessionAccount = privateKeyToAccount(privateKey("SESSION_KEY_PRIVATE_KEY"));
  const broadcastReverts = process.env.BROADCAST_REVERTS?.toLowerCase() === "true";
  const abi = loadAbi();

  if (ownerAccount.address === sessionAccount.address) {
    throw new Error("Owner and session key must be different");
  }
  if (rockBurger === evilStore) throw new Error("Merchant addresses must differ");

  const publicClient = createPublicClient({ transport: http(rpcUrl) });
  const ownerWallet = createWalletClient({
    account: ownerAccount,
    transport: http(rpcUrl),
  });
  const sessionWallet = createWalletClient({
    account: sessionAccount,
    transport: http(rpcUrl),
  });
  const activeMandates = new Map<number, ActiveMandate>();
  const bot = new Bot(token);

  function activeFor(ctx: Context): ActiveMandate {
    const active = activeMandates.get(chatId(ctx));
    if (!active) throw new Error("No active mandate. Run /mandate_food first.");
    return active;
  }

  async function mandateState(mandateId: Hex): Promise<MandateState> {
    return (await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "mandates",
      args: [mandateId],
    })) as MandateState;
  }

  async function expectedAttack(
    active: ActiveMandate,
    target: Address,
    amount: bigint,
    label: string,
    expectedError: string,
  ): Promise<string> {
    const paymentRef = keccak256(
      encodePacked(
        ["string", "bytes32", "uint256"],
        [label, active.mandateId, BigInt(Date.now())],
      ),
    );

    try {
      await publicClient.simulateContract({
        account: sessionAccount,
        address: contractAddress,
        abi,
        functionName: "authorizePayment",
        args: [active.mandateId, target, amount, paymentRef],
      });
      throw new Error("Attack unexpectedly passed simulation");
    } catch (error) {
      const actual = customErrorName(error);
      if (actual !== expectedError) {
        throw new Error(
          "Expected " + expectedError + " but received " + String(actual),
          { cause: error },
        );
      }
    }

    if (!broadcastReverts) {
      return "REJECTED " + expectedError + "\nContract simulation reverted. No settlement eligible.";
    }

    const hash = await sessionWallet.writeContract({
      chain: null,
      address: contractAddress,
      abi,
      functionName: "authorizePayment",
      args: [active.mandateId, target, amount, paymentRef],
      gas: 300_000n,
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status !== "reverted") throw new Error("Attack transaction did not revert");
    const authorizationLogs = parseEventLogs({
      abi,
      logs: receipt.logs,
      eventName: "AuthorizationGranted",
      strict: true,
    });
    if (authorizationLogs.length !== 0) {
      throw new Error("Reverted attack produced AuthorizationGranted");
    }
    return (
      "REJECTED " +
      expectedError +
      "\nTransaction: " +
      hash +
      "\nStatus: reverted\nAuthorizationGranted logs: 0"
    );
  }

  function registerCommand(
    name: string,
    handler: (ctx: Context) => Promise<void>,
  ): void {
    bot.command(name, async (ctx) => {
      try {
        await handler(ctx);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await ctx.reply("ERROR: " + message);
      }
    });
  }

  registerCommand("start", async (ctx) => {
    await ctx.reply(
      "Leash is a programmable spending firewall for AI agents.\n\n" +
        "Commands:\n/mandate_food\n/normal\n/attack_target\n/attack_amount\n/revoke\n/status\n\n" +
        "Mock settlement is downstream of confirmed AuthorizationGranted events only.",
    );
  });

  registerCommand("mandate_food", async (ctx) => {
    const currentBlock = await publicClient.getBlock();
    const ownerNonce = await publicClient.getTransactionCount({
      address: ownerAccount.address,
    });
    const mandateId = keccak256(
      encodePacked(
        ["string", "int256", "uint256"],
        ["LEASH_TELEGRAM_FOOD", BigInt(chatId(ctx)), BigInt(ownerNonce)],
      ),
    );
    const validUntil = currentBlock.timestamp + 3_600n;
    const hash = await ownerWallet.writeContract({
      chain: null,
      address: contractAddress,
      abi,
      functionName: "registerMandate",
      args: [mandateId, sessionAccount.address, 60_000n, validUntil, [rockBurger]],
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status !== "success") throw new Error("Mandate registration failed");
    activeMandates.set(chatId(ctx), { mandateId, validUntil });
    await ctx.reply(
      "Mandate created\nID: " +
        mandateId +
        "\nMerchant: Rock Burger\nCap: Rp60.000\nTransaction: " +
        hash,
    );
  });

  registerCommand("normal", async (ctx) => {
    const active = activeFor(ctx);
    const paymentRef = keccak256(
      encodePacked(
        ["string", "bytes32", "uint256"],
        ["telegram-normal", active.mandateId, BigInt(Date.now())],
      ),
    );
    const hash = await sessionWallet.writeContract({
      chain: null,
      address: contractAddress,
      abi,
      functionName: "authorizePayment",
      args: [active.mandateId, rockBurger, 52_000n, paymentRef],
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status !== "success") throw new Error("Normal authorization failed");
    const events = parseEventLogs({
      abi,
      logs: receipt.logs,
      eventName: "AuthorizationGranted",
      strict: true,
    });
    if (events.length !== 1) throw new Error("Authorization event missing");
    await ctx.reply(
      "SUCCESS AuthorizationGranted\nTarget: Rock Burger\nAmount: Rp52.000\nTransaction: " +
        hash,
    );
  });

  registerCommand("attack_target", async (ctx) => {
    const result = await expectedAttack(
      activeFor(ctx),
      evilStore,
      50_000n,
      "telegram-evil-store",
      "TargetNotAllowed",
    );
    await ctx.reply(result);
  });

  registerCommand("attack_amount", async (ctx) => {
    const result = await expectedAttack(
      activeFor(ctx),
      rockBurger,
      500_000n,
      "telegram-over-cap",
      "AmountExceedsCap",
    );
    await ctx.reply(result);
  });

  registerCommand("revoke", async (ctx) => {
    const active = activeFor(ctx);
    const hash = await ownerWallet.writeContract({
      chain: null,
      address: contractAddress,
      abi,
      functionName: "revokeMandate",
      args: [active.mandateId],
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status !== "success") throw new Error("Revocation failed");
    await ctx.reply("SUCCESS mandate revoked\nTransaction: " + hash);
  });

  registerCommand("status", async (ctx) => {
    const active = activeFor(ctx);
    const state = await mandateState(active.mandateId);
    const rockAllowed = await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "allowedTargets",
      args: [active.mandateId, rockBurger],
    });
    const evilAllowed = await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "allowedTargets",
      args: [active.mandateId, evilStore],
    });
    const remaining = state[2] - state[3];
    await ctx.reply(
      "Mandate status\n" +
        "Owner: " +
        state[0] +
        "\nSession key: " +
        state[1] +
        "\nCap: " +
        state[2] +
        "\nSpent: " +
        state[3] +
        "\nRemaining: " +
        remaining +
        "\nExpiry: " +
        state[4] +
        "\nRevoked: " +
        state[5] +
        "\nRock Burger allowed: " +
        String(rockAllowed) +
        "\nEvil Store allowed: " +
        String(evilAllowed) +
        "\n\nTarget display is limited to targets known by this demo bot because mappings are not enumerable.",
    );
  });

  bot.catch((error) => {
    console.error("Telegram bot update failed", error.error);
  });

  console.log("Leash Telegram bot starting");
  await bot.start();
}

main().catch((error: unknown) => {
  console.error("TELEGRAM BOT FAILED");
  console.error(error);
  process.exitCode = 1;
});

