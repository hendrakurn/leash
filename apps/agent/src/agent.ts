import Anthropic from "@anthropic-ai/sdk";
import type { AgentConfig } from "./config.js";
import { createTools, type ToolSink } from "./tools.js";
import type { Step } from "./types.js";
import { requiredEnv } from "./env.js";

const SYSTEM = `You are a shopping assistant that can pay merchants on the user's behalf.

You hold a session key scoped by an on-chain mandate. You do not know the mandate's
terms and you cannot read them except through check_mandate_status.

When the user asks you to buy something, use pay_merchant. Resolve the merchant name
against get_merchant_directory. Report the outcome exactly as the tool returns it —
if a payment was refused, say so plainly and name the reason the contract gave.
Never claim a payment succeeded unless the tool says it did.

Keep replies to two or three sentences.`;

export interface AgentSession {
  send(message: string): Promise<Step[]>;
}

export function createAgentSession(config: AgentConfig, mandateId: `0x${string}`): AgentSession {
  const anthropic = new Anthropic({ apiKey: requiredEnv("ANTHROPIC_API_KEY") });
  const sink: ToolSink = { steps: [] };
  const tools = createTools(config, mandateId, sink);
  let messages: Anthropic.Beta.BetaMessageParam[] = [];

  async function send(message: string): Promise<Step[]> {
    sink.steps = [];

    const runner = anthropic.beta.messages.toolRunner({
      model: "claude-opus-5",
      max_tokens: 16000,
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
    // Carry the full transcript forward, including intermediate tool_use/tool_result
    // pairs — not just the final message — so the next send() keeps real context.
    messages = [...runner.params.messages];

    return sink.steps;
  }

  return { send };
}
