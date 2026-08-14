import "dotenv/config";

import { createAgentSession } from "./agent.js";
import { loadConfig } from "./config.js";
import { hexEnv } from "./env.js";
import { printSteps } from "./print.js";

async function main(): Promise<void> {
  const message = process.argv.slice(2).join(" ").trim();
  if (!message) {
    throw new Error('Usage: npm run agent -- "<message>"');
  }

  const config = loadConfig();
  const mandateId = hexEnv("MANDATE_ID");
  const session = createAgentSession(config, mandateId);

  console.log("User: " + message);
  const steps = await session.send(message);
  printSteps(steps);
}

main().catch((error: unknown) => {
  console.error("AGENT FAILED");
  console.error(error);
  process.exitCode = 1;
});
