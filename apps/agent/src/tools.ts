import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { BetaRunnableTool } from "@anthropic-ai/sdk/lib/tools/BetaRunnableTool";
import { encodePacked, keccak256, type Address, type Hex } from "viem";
import { z } from "zod/v4";
import type { AgentConfig } from "./config.js";
import { customErrorName } from "./errors.js";
import type { Step } from "./types.js";

export interface ToolSink {
  steps: Step[];
}

/**
 * `pay_merchant` performs no allowlist, cap, expiry or revocation check of its
 * own. It builds the call and asks the chain. Whatever the contract answers is
 * the answer.
 *
 * Validating here would move the firewall into the application layer — the
 * exact layer this product argues you cannot trust. The agent is meant to be
 * manipulable. The contract is the part that is not.
 */
export function createTools(
  config: AgentConfig,
  mandateId: Hex,
  sink: ToolSink,
): BetaRunnableTool<any>[] {
  const merchants: { name: string; address: Address }[] = [
    { name: "Rock Burger", address: config.rockBurger },
    { name: "Evil Store", address: config.evilStore },
  ];

  const getMerchantDirectory = betaZodTool({
    name: "get_merchant_directory",
    description:
      "List every merchant this assistant can pay, with their on-chain addresses. Call this before paying anyone.",
    inputSchema: z.object({}),
    run: async () => {
      const listed = merchants.map((m) => `${m.name}: ${m.address}`).join("\n");
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
      const merchant = merchants.find((m) => m.name.toLowerCase() === merchantName.toLowerCase());

      if (!merchant) {
        const text = `Unknown merchant: ${merchantName}. Call get_merchant_directory.`;
        sink.steps.push({ kind: "tool", name: "pay_merchant", outcome: "error", text });
        return text;
      }

      const paymentRef = keccak256(
        encodePacked(["string", "bytes32", "uint256"], ["leash-agent", mandateId, BigInt(Date.now())]),
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
        const errorName = customErrorName(error) ?? "Reverted";
        sink.steps.push({
          kind: "tool",
          name: "pay_merchant",
          input: { merchant: merchant.name, amount_idr },
          outcome: "refused",
          errorName,
          logs: 0,
        });
        return [
          `REFUSED by the contract: ${errorName}`,
          `AuthorizationGranted logs: 0`,
          `Settlement eligibility: NONE`,
          `The payment did not happen and the amount already spent is unchanged.`,
        ].join("\n");
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
        kind: "tool",
        name: "pay_merchant",
        input: { merchant: merchant.name, amount_idr },
        outcome: receipt.status === "success" ? "authorized" : "refused",
        txHash: hash,
        logs: receipt.logs.length,
      });

      return receipt.status === "success"
        ? `AUTHORIZED. Transaction ${hash}. AuthorizationGranted emitted; the backend may settle this once.`
        : `REFUSED. Transaction ${hash} reverted. No authorization event, nothing to settle.`;
    },
  });

  return [getMerchantDirectory, checkMandateStatus, payMerchant];
}
