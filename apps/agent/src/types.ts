export interface Step {
  kind: "text" | "tool";
  name?: string;
  input?: unknown;
  text?: string;
  outcome?: "authorized" | "refused" | "info" | "error";
  errorName?: string;
  txHash?: string;
  logs?: number;
}
