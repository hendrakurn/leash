import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Abi } from "viem";

export function loadAbi(): Abi {
  const artifactPath = fileURLToPath(
    new URL("../../../contracts/out/LeashMandate.sol/LeashMandate.json", import.meta.url),
  );

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(artifactPath, "utf8"));
  } catch (error) {
    throw new Error("Cannot read Foundry artifact. Run forge build in contracts first.", {
      cause: error,
    });
  }

  const artifact = parsed as { abi?: unknown };
  if (!Array.isArray(artifact.abi)) {
    throw new Error("Foundry artifact does not contain an ABI");
  }
  return artifact.abi as Abi;
}
