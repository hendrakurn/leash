import { BaseError, ContractFunctionRevertedError } from "viem";

/** Pulls the LeashMandate custom error name out of a viem simulation/revert error, if there is one. */
export function customErrorName(error: unknown): string | undefined {
  if (!(error instanceof BaseError)) return undefined;
  const reverted = error.walk((candidate) => candidate instanceof ContractFunctionRevertedError);
  if (!(reverted instanceof ContractFunctionRevertedError)) return undefined;
  return reverted.data?.errorName;
}
