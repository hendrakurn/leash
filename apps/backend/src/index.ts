import { loadConfig } from "./config.js";
import { runListener } from "./listener.js";

runListener(loadConfig()).catch((error: unknown) => {
  console.error("LISTENER FAILED");
  console.error(error);
  process.exitCode = 1;
});

