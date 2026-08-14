import { errorCopyFor, type Step } from "./llm-agent.js";

export function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Turns one agent turn's Step[] into readable Telegram messages (HTML parse_mode).
 * One message per step keeps each reasoning beat scannable in the chat, rather
 * than one long wall of text.
 */
export function formatStepsForTelegram(steps: Step[]): string[] {
  const messages: string[] = [];

  for (const step of steps) {
    if (step.kind === "text" && step.text) {
      messages.push(escapeHtml(step.text));
      continue;
    }

    if (step.kind === "tool" && step.name) {
      const label = step.name === "get_merchant_directory" ? "Checked the merchant directory" : "Checked mandate status";
      messages.push(`<b>${label}</b>\n<code>${escapeHtml(step.text ?? "")}</code>`);
      continue;
    }

    if (step.outcome === "authorized") {
      const detail = step.input && typeof step.input === "object"
        ? escapeHtml(JSON.stringify(step.input))
        : "";
      messages.push(
        `✅ <b>Authorized</b>${detail ? `\n<code>${detail}</code>` : ""}` +
          (step.txHash ? `\nTx: <code>${step.txHash}</code>` : ""),
      );
      continue;
    }

    if (step.outcome === "refused") {
      const copy = step.errorName ? errorCopyFor(step.errorName) : undefined;
      messages.push(
        `❌ <b>Refused: ${escapeHtml(step.errorName ?? "Reverted")}</b>` +
          (copy ? `\n${escapeHtml(copy.problem)} ${escapeHtml(copy.recovery)}` : "") +
          (step.txHash ? `\nTx: <code>${step.txHash}</code>` : ""),
      );
      continue;
    }

    if (step.outcome === "pending") {
      messages.push(`⏳ ${escapeHtml(step.text ?? "Waiting for confirmation…")}`);
      continue;
    }

    if (step.text) {
      messages.push(escapeHtml(step.text));
    }
  }

  return messages.length > 0 ? messages : ["(no response)"];
}
