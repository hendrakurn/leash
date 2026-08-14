import Anthropic from "@anthropic-ai/sdk";
import {
  createPublicClient,
  createWalletClient,
  encodePacked,
  http,
  keccak256,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { activeChain, contractAddress, merchants, rpcUrl } from "@/lib/chain";
import { leashAbi, revertName, formatRupiah } from "@/lib/leash";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * The agent harness.
 *
 * The single rule this file exists to honour: `pay_merchant` performs no
 * allowlist, ceiling, expiry or revocation check of its own. It builds the call
 * and asks the chain. Whatever the contract answers is the answer.
 *
 * Validating here would move the firewall into the application layer — the exact
 * layer this product argues you cannot trust — and the demonstration would prove
 * nothing. The agent is meant to be manipulable. The contract is the part that
 * is not.
 */

const SYSTEM = `You are a shopping assistant that can pay merchants on the user's behalf.

You hold a session key scoped by an on-chain mandate. You do not know the mandate's
terms and you cannot read them except through check_mandate_status.

When the user asks you to buy something, use pay_merchant. Resolve the merchant name
against get_merchant_directory. Report the outcome exactly as the tool returns it —
if a payment was refused, say so plainly and name the reason the contract gave.
Never claim a payment succeeded unless the tool says it did.

Keep replies to two or three sentences.`;

const tools: Anthropic.Tool[] = [
  {
    name: "get_merchant_directory",
    description:
      "List every merchant this assistant can pay, with their on-chain addresses. Call this before paying anyone.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "pay_merchant",
    description:
      "Pay a merchant from the user's mandate. Resolve the merchant name with get_merchant_directory first. Returns the on-chain outcome, including refusals.",
    input_schema: {
      type: "object",
      properties: {
        merchant: { type: "string", description: "Merchant name from the directory." },
        amount_idr: { type: "integer", description: "Amount in Indonesian rupiah." },
      },
      required: ["merchant", "amount_idr"],
    },
  },
  {
    name: "check_mandate_status",
    description: "Read the mandate's current ceiling, amount already spent, expiry and revocation state.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
];

interface Step {
  kind: "text" | "tool" | "result";
  name?: string;
  input?: unknown;
  text?: string;
  outcome?: "authorized" | "refused" | "info" | "error" | "pending";
  errorName?: string;
  txHash?: string;
  logs?: number;
}

type StreamEvent = { type: "step"; step: Step } | { type: "error"; error: string };

/**
 * Testing-only routing toggles — same SDK, same tool loop, unmodified. Mirrors
 * apps/agent/src/agent.ts's createAnthropicClient(); unset all three to go back
 * to Claude directly via ANTHROPIC_API_KEY.
 *
 * - DEEPSEEK_API_KEY: DeepSeek ships an Anthropic-wire-compatible endpoint
 *   (api.deepseek.com/anthropic). It's DeepSeek's own model behind that wire format,
 *   not Claude — model must be a DeepSeek model id, not a claude-* id.
 * - AIML_API_KEY: AI/ML API proxies real Anthropic infra (api.aimlapi.com), so Claude
 *   model ids stay valid.
 *
 * Both toggles default to the cheapest model on that provider to conserve test credits;
 * AGENT_MODEL overrides the default on whichever provider ends up selected.
 */
function createAnthropicClient(): { client: Anthropic; model: string } | undefined {
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
  if (apiKey) {
    return { client: new Anthropic({ apiKey }), model: modelOverride ?? "claude-opus-5" };
  }
  return undefined;
}

export async function POST(request: Request) {
  const anthropicConfig = createAnthropicClient();
  const sessionKeyRaw = process.env.SESSION_KEY_PRIVATE_KEY;

  if (!anthropicConfig)
    return errorResponse("Set ANTHROPIC_API_KEY, DEEPSEEK_API_KEY, or AIML_API_KEY.", 500);
  if (!sessionKeyRaw) return errorResponse("SESSION_KEY_PRIVATE_KEY is not set.", 500);
  if (!contractAddress) return errorResponse("No LeashMandate deployment is configured.", 503);

  const body = (await request.json()) as { message?: string; mandateId?: string };
  const message = body.message?.trim();
  const mandateId = body.mandateId as Hex | undefined;
  if (!message) return errorResponse("message is required", 400);
  if (!mandateId) return errorResponse("mandateId is required", 400);

  const account = privateKeyToAccount(sessionKeyRaw as Hex);
  const publicClient = createPublicClient({ chain: activeChain, transport: http(rpcUrl) });
  const walletClient = createWalletClient({ account, chain: activeChain, transport: http(rpcUrl) });
  const { client: anthropic, model } = anthropicConfig;

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      function emit(event: StreamEvent) {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      }
      function emitStep(step: Step) {
        emit({ type: "step", step });
      }

      async function runTool(name: string, input: Record<string, unknown>): Promise<string> {
        if (name === "get_merchant_directory") {
          const listed = merchants
            .filter((m) => m.address)
            .map((m) => `${m.name}: ${m.address}`)
            .join("\n");
          emitStep({ kind: "result", name, outcome: "info", text: listed });
          return listed || "No merchants are configured.";
        }

        if (name === "check_mandate_status") {
          const state = (await publicClient.readContract({
            address: contractAddress!,
            abi: leashAbi,
            functionName: "mandates",
            args: [mandateId!],
          })) as readonly [Address, Address, bigint, bigint, bigint, boolean];

          const summary = [
            `ceiling: ${state[2]}`,
            `spent: ${state[3]}`,
            `remaining: ${state[2] - state[3]}`,
            `expires_at: ${state[4]}`,
            `revoked: ${state[5]}`,
          ].join("\n");
          emitStep({ kind: "result", name, outcome: "info", text: summary });
          return summary;
        }

        if (name === "pay_merchant") {
          const merchantName = String(input.merchant ?? "");
          const amount = BigInt(Math.trunc(Number(input.amount_idr ?? 0)));
          const merchant = merchants.find(
            (m) => m.name.toLowerCase() === merchantName.toLowerCase(),
          );

          if (!merchant?.address) {
            const text = `Unknown merchant: ${merchantName}. Call get_merchant_directory.`;
            emitStep({ kind: "result", name, outcome: "error", text });
            return text;
          }

          const paymentRef = keccak256(
            encodePacked(
              ["string", "bytes32", "uint256"],
              ["leash-web-agent", mandateId!, BigInt(Date.now())],
            ),
          );

          // No checks precede this call. The chain is the only gate.
          try {
            await publicClient.simulateContract({
              account,
              address: contractAddress!,
              abi: leashAbi,
              functionName: "authorizePayment",
              args: [mandateId!, merchant.address, amount, paymentRef],
            });
          } catch (error) {
            const errorName = revertName(error) ?? "Reverted";
            emitStep({
              kind: "result",
              name,
              outcome: "refused",
              errorName,
              logs: 0,
              text: `${formatRupiah(amount)} to ${merchant.name}`,
            });
            return [
              `REFUSED by the contract: ${errorName}`,
              `AuthorizationGranted logs: 0`,
              `Settlement eligibility: NONE`,
              `The payment did not happen and the amount already spent is unchanged.`,
            ].join("\n");
          }

          emitStep({ kind: "result", name, outcome: "pending", text: "Transaction sent, waiting for confirmation…" });

          const hash = await walletClient.writeContract({
            address: contractAddress!,
            abi: leashAbi,
            functionName: "authorizePayment",
            args: [mandateId!, merchant.address, amount, paymentRef],
          });
          const receipt = await publicClient.waitForTransactionReceipt({ hash });

          emitStep({
            kind: "result",
            name,
            outcome: receipt.status === "success" ? "authorized" : "refused",
            txHash: hash,
            logs: receipt.logs.length,
            text: `${formatRupiah(amount)} to ${merchant.name}`,
          });

          return receipt.status === "success"
            ? `AUTHORIZED. Transaction ${hash}. AuthorizationGranted emitted; the backend may settle this once.`
            : `REFUSED. Transaction ${hash} reverted. No authorization event, nothing to settle.`;
        }

        return `Unknown tool: ${name}`;
      }

      const messages: Anthropic.MessageParam[] = [{ role: "user", content: message }];

      try {
        for (let turn = 0; turn < 6; turn += 1) {
          const response = await anthropic.messages.create({
            model,
            max_tokens: 4096,
            system: SYSTEM,
            tools,
            messages,
          });

          if (response.stop_reason === "refusal") {
            emitStep({ kind: "text", text: "The model declined this request." });
            break;
          }

          for (const block of response.content) {
            if (block.type === "text" && block.text.trim()) {
              emitStep({ kind: "text", text: block.text });
            } else if (block.type === "tool_use") {
              emitStep({ kind: "tool", name: block.name, input: block.input });
            }
          }

          if (response.stop_reason !== "tool_use") break;

          messages.push({ role: "assistant", content: response.content });

          const results: Anthropic.ToolResultBlockParam[] = [];
          for (const block of response.content) {
            if (block.type !== "tool_use") continue;
            try {
              const output = await runTool(block.name, block.input as Record<string, unknown>);
              results.push({ type: "tool_result", tool_use_id: block.id, content: output });
            } catch (error) {
              results.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: error instanceof Error ? error.message : String(error),
                is_error: true,
              });
            }
          }
          messages.push({ role: "user", content: results });
        }
      } catch (error) {
        emit({ type: "error", error: error instanceof Error ? error.message : String(error) });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "content-type": "application/x-ndjson" },
  });
}

function errorResponse(message: string, status: number) {
  const body = JSON.stringify({ type: "error", error: message } satisfies StreamEvent) + "\n";
  return new Response(body, { status, headers: { "content-type": "application/x-ndjson" } });
}
