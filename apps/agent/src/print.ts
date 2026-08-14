import type { Step } from "./types.js";

export function printSteps(steps: Step[]): void {
  for (const step of steps) {
    if (step.kind === "text") {
      console.log("Agent: " + step.text);
      continue;
    }

    const parts = [`Tool: ${step.name}`];
    if (step.input) parts.push(`input=${JSON.stringify(step.input)}`);
    if (step.outcome) parts.push(`outcome=${step.outcome}`);
    if (step.errorName) parts.push(`error=${step.errorName}`);
    if (step.txHash) parts.push(`tx=${step.txHash}`);
    if (step.logs !== undefined) parts.push(`AuthorizationGranted logs=${step.logs}`);
    console.log(parts.join(" "));

    if (step.text && step.outcome === "info") {
      console.log(
        step.text
          .split("\n")
          .map((line) => "  " + line)
          .join("\n"),
      );
    }
  }
}
