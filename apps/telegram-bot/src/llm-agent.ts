import Anthropic from "@anthropic-ai/sdk";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { BetaRunnableTool } from "@anthropic-ai/sdk/lib/tools/BetaRunnableTool";
import { encodePacked, keccak256, type Abi, type Address, type Hex, type PublicClient, type WalletClient } from "viem";
import type { PrivateKeyAccount } from "viem/accounts";
import { z } from "zod/v4";
import type { MerchantDirectory } from "./merchants.js";

export interface Step {
  kind: "text" | "tool" | "result";
  name?: string;
  input?: unknown;
  text?: string;
  outcome?: "authorized" | "refused" | "info" | "error" | "pending";
  errorName?: string;
  txHash?: string;
  logs?: number;
}

/**
 * What each revert means, in the product's own language — mirrors
 * apps/web/src/lib/leash.ts's ERROR_COPY. Duplicated per-package: this app has
 * no dependency on apps/web, same reason the Step type above can't be shared.
 */
const ERROR_COPY: Record<string, { problem: string; recovery: string }> = {
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

export function errorCopyFor(errorName: string): { problem: string; recovery: string } | undefined {
  return ERROR_COPY[errorName];
}

/**
 * Same routing toggles as apps/agent/src/agent.ts and apps/web/src/app/api/agent/route.ts —
 * unset all three to go back to Claude directly via ANTHROPIC_API_KEY.
 */
function createAnthropicClient(): { client: Anthropic; model: string } {
  const modelOverride = process.env.AGENT_MODEL?.trim();

  const deepseekKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (deepseekKey) {
    return {
      client: new Anthropic({ apiKey: deepseekKey, baseURL: "https://api.deepseek.com/anthropic" }),
      model: modelOverride ?? "deepseek-v4-flash",
    };
  }
  const aimlKey = process.env.AIML_API_KEY?.trim();
  if (aimlKey) {
    return {
      client: new Anthropic({ apiKey: aimlKey, baseURL: "https://api.aimlapi.com" }),
      model: modelOverride ?? "claude-haiku-4-5-20251001",
    };
  }
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) throw new Error("Set ANTHROPIC_API_KEY, DEEPSEEK_API_KEY, or AIML_API_KEY.");
  return { client: new Anthropic({ apiKey }), model: modelOverride ?? "claude-opus-5" };
}

export interface LlmAgentConfig {
  readonly publicClient: PublicClient;
  readonly sessionWallet: WalletClient;
  readonly sessionAccount: PrivateKeyAccount;
  readonly contractAddress: Address;
  readonly abi: Abi;
  readonly merchants: MerchantDirectory;
}

const SYSTEM = `You are a shopping assistant that can pay merchants on the user's behalf, chatting over Telegram.

You hold a session key scoped by an on-chain mandate. You do not know the mandate's
terms and you cannot read them except through check_mandate_status.

When the user asks you to buy something, use pay_merchant. Resolve the merchant name
against get_merchant_directory. Report the outcome exactly as the tool returns it —
if a payment was refused, say so plainly and name the reason the contract gave.
Never claim a payment succeeded unless the tool says it did.

Keep replies to two or three sentences.`;

function createTools(config: LlmAgentConfig, mandateId: Hex, sink: { steps: Step[] }): BetaRunnableTool<any>[] {
  const merchantList = [config.merchants.rockBurger, config.merchants.evilStore];

  const getMerchantDirectory = betaZodTool({
    name: "get_merchant_directory",
    description:
      "List every merchant this assistant can pay, with their on-chain addresses. Call this before paying anyone.",
    inputSchema: z.object({}),
    run: async () => {
      const listed = merchantList.map((m) => `${m.name}: ${m.address}`).join("\n");
      sink.steps.push({ kind: "tool", name: "get_merchant_directory", outcome: "info", text: listed });
      return listed;
    },
  });

  const checkMandateStatus = betaZodTool({
    name: "check_mandate_status",
    description: "Read the mandate's current ceiling, amount already spent, expiry and revocation state.",
    inputSchema: z.object({}),
    run: async () => {
      const state = (await config.publicClient.readContract({
        address: config.contractAddress,
        abi: config.abi,
        functionName: "mandates",
        args: [mandateId],
      })) as readonly [Address, Address, bigint, bigint, bigint, boolean];

      const summary = [
        `ceiling: ${state[2]}`,
        `spent: ${state[3]}`,
        `remaining: ${state[2] - state[3]}`,
        `expires_at: ${state[4]}`,
        `revoked: ${state[5]}`,
      ].join("\n");
      sink.steps.push({ kind: "tool", name: "check_mandate_status", outcome: "info", text: summary });
      return summary;
    },
  });

  const payMerchant = betaZodTool({
    name: "pay_merchant",
    description:
      "Pay a merchant from the user's mandate. Resolve the merchant name with get_merchant_directory first. Returns the on-chain outcome, including refusals.",
    inputSchema: z.object({
      merchant: z.string().describe("Merchant name from the directory."),
      amount_idr: z.number().int().describe("Amount in Indonesian rupiah."),
    }),
    run: async ({ merchant: merchantName, amount_idr }) => {
      const amount = BigInt(Math.trunc(amount_idr));
      const merchant = merchantList.find((m) => m.name.toLowerCase() === merchantName.toLowerCase());

      if (!merchant) {
        const text = `Unknown merchant: ${merchantName}. Call get_merchant_directory.`;
        sink.steps.push({ kind: "tool", name: "pay_merchant", outcome: "error", text });
        return text;
      }

      const paymentRef = keccak256(
        encodePacked(["string", "bytes32", "uint256"], ["leash-telegram-llm", mandateId, BigInt(Date.now())]),
      );

      // No checks precede this call. The chain is the only gate.
      try {
        await config.publicClient.simulateContract({
          account: config.sessionAccount,
          address: config.contractAddress,
          abi: config.abi,
          functionName: "authorizePayment",
          args: [mandateId, merchant.address, amount, paymentRef],
        });
      } catch (error) {
        const errorName = (error as { cause?: { data?: { errorName?: string } } })?.cause?.data?.errorName ?? "Reverted";
        sink.steps.push({
          kind: "result",
          name: "pay_merchant",
          input: { merchant: merchant.name, amount_idr },
          outcome: "refused",
          errorName,
          logs: 0,
        });
        return `REFUSED by the contract: ${errorName}. The payment did not happen.`;
      }

      const hash = await config.sessionWallet.writeContract({
        chain: null,
        account: config.sessionAccount,
        address: config.contractAddress,
        abi: config.abi,
        functionName: "authorizePayment",
        args: [mandateId, merchant.address, amount, paymentRef],
      });
      const receipt = await config.publicClient.waitForTransactionReceipt({ hash });

      sink.steps.push({
        kind: "result",
        name: "pay_merchant",
        input: { merchant: merchant.name, amount_idr },
        outcome: receipt.status === "success" ? "authorized" : "refused",
        txHash: hash,
        logs: receipt.logs.length,
      });

      return receipt.status === "success"
        ? `AUTHORIZED. Transaction ${hash}.`
        : `REFUSED. Transaction ${hash} reverted.`;
    },
  });

  return [getMerchantDirectory, checkMandateStatus, payMerchant];
}

export interface LlmSession {
  send(message: string): Promise<Step[]>;
}

export function createLlmSession(config: LlmAgentConfig, mandateId: Hex): LlmSession {
  const { client: anthropic, model } = createAnthropicClient();
  const sink: { steps: Step[] } = { steps: [] };
  const tools = createTools(config, mandateId, sink);
  let messages: Anthropic.Beta.BetaMessageParam[] = [];

  async function send(message: string): Promise<Step[]> {
    sink.steps = [];

    const runner = anthropic.beta.messages.toolRunner({
      model,
      max_tokens: 4096,
      system: SYSTEM,
      tools,
      messages: [...messages, { role: "user", content: message }],
      max_iterations: 6,
    });

    for await (const response of runner) {
      for (const block of response.content) {
        if (block.type === "text" && block.text.trim()) {
          sink.steps.push({ kind: "text", text: block.text });
        }
      }
    }

    await runner.done();
    messages = [...runner.params.messages];

    return sink.steps;
  }

  return { send };
}
