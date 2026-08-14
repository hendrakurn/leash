import "dotenv/config";

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Bot, type Context } from "grammy";
import {
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

import { createMerchantDirectory } from "./merchants.js";
import { customErrorName, paymentReference } from "./payments.js";
import { createLlmSession, type LlmSession } from "./llm-agent.js";
import { formatStepsForTelegram } from "./telegram-format.js";

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

function chatId(ctx: Context): number {
  if (ctx.chat === undefined) throw new Error("Telegram chat is unavailable");
  return ctx.chat.id;
}

async function main(): Promise<void> {
  const token = required("TELEGRAM_BOT_TOKEN");
  const rpcUrl = required("RPC_URL");
  const contractAddress = getAddress(required("CONTRACT_ADDRESS"));
  const merchants = createMerchantDirectory(
    required("ROCK_BURGER_ADDRESS"),
    required("EVIL_STORE_ADDRESS"),
  );
  const rockBurger = merchants.rockBurger.address;
  const evilStore = merchants.evilStore.address;
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
  const llmSessions = new Map<number, { session: LlmSession; mandateId: Hex }>();
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
    const paymentRef = paymentReference(label, active.mandateId, amount);

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
      return `❌ <b>Refused: ${expectedError}</b>\nContract simulation reverted. No settlement eligible.`;
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
      `❌ <b>Refused: ${expectedError}</b>\n` +
      `Tx: <code>${hash}</code> (reverted)\n` +
      "AuthorizationGranted logs: 0"
    );
  }

  function formatAmount(amount: bigint): string {
    return "Rp" + new Intl.NumberFormat("id-ID").format(amount);
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
      "<b>Leash</b> — a programmable spending firewall for AI agents.\n\n" +
        "<b>Commands:</b>\n<code>/mandate_food</code> <code>/normal</code> <code>/attack_target</code> " +
        "<code>/attack_amount</code> <code>/revoke</code> <code>/status</code>\n\n" +
        "Or just chat naturally — free text goes to a real Claude agent that holds the session key.\n" +
        "Mock settlement is downstream of confirmed <code>AuthorizationGranted</code> events only.",
      { parse_mode: "HTML" },
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
      "✅ <b>Mandate created</b>\n" +
        `ID: <code>${mandateId}</code>\n` +
        "Merchant: Rock Burger · Cap: Rp60.000\n" +
        `Tx: <code>${hash}</code>`,
      { parse_mode: "HTML" },
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
      "✅ <b>Authorized</b>\n" +
        "Rock Burger · Rp52.000\n" +
        `Tx: <code>${hash}</code>`,
      { parse_mode: "HTML" },
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
    await ctx.reply(result, { parse_mode: "HTML" });
  });

  registerCommand("attack_amount", async (ctx) => {
    const result = await expectedAttack(
      activeFor(ctx),
      rockBurger,
      500_000n,
      "telegram-over-cap",
      "AmountExceedsCap",
    );
    await ctx.reply(result, { parse_mode: "HTML" });
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
    await ctx.reply(
      `✅ <b>Mandate revoked</b>\nTx: <code>${hash}</code>`,
      { parse_mode: "HTML" },
    );
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
      "<b>Mandate status</b>\n" +
        `Owner: <code>${state[0]}</code>\n` +
        `Session key: <code>${state[1]}</code>\n` +
        `Cap: ${formatAmount(state[2])} · Spent: ${formatAmount(state[3])} · Remaining: ${formatAmount(remaining)}\n` +
        `Expiry: <code>${state[4]}</code> · Revoked: <code>${state[5]}</code>\n` +
        `Rock Burger allowed: <code>${rockAllowed}</code> · Evil Store allowed: <code>${evilAllowed}</code>\n\n` +
        "<i>Target display is limited to targets known by this demo bot because mappings are not enumerable.</i>",
      { parse_mode: "HTML" },
    );
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;
    if (/^\s*\//.test(text)) return;

    try {
      const active = activeFor(ctx);
      const id = chatId(ctx);
      let entry = llmSessions.get(id);
      if (!entry || entry.mandateId !== active.mandateId) {
        entry = {
          session: createLlmSession(
            { publicClient, sessionWallet, sessionAccount, contractAddress, abi, merchants },
            active.mandateId,
          ),
          mandateId: active.mandateId,
        };
        llmSessions.set(id, entry);
      }

      const steps = await entry.session.send(text);
      for (const message of formatStepsForTelegram(steps)) {
        await ctx.reply(message, { parse_mode: "HTML" });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await ctx.reply("ERROR: " + message);
    }
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

