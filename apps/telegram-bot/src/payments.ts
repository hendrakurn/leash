import {
  BaseError,
  ContractFunctionRevertedError,
  encodePacked,
  keccak256,
  parseEventLogs,
  type Abi,
  type Address,
  type Hex,
} from "viem";

export interface PaymentClients {
  readonly publicClient: {
    simulateContract: (args: any) => Promise<unknown>;
    waitForTransactionReceipt: (args: { hash: Hex }) => Promise<{
      readonly status: "success" | "reverted";
      readonly logs: readonly unknown[];
    }>;
  };
  readonly sessionWallet: {
    writeContract: (args: any) => Promise<Hex>;
  };
}

export interface PaymentClientOptions {
  readonly publicClient: PaymentClients["publicClient"];
  readonly sessionWallet: PaymentClients["sessionWallet"];
  readonly sessionAccount: Address;
  readonly contractAddress: Address;
  readonly abi: Abi;
  readonly broadcastReverts: boolean;
}

export type PaymentOutcome =
  | {
      readonly status: "approved";
      readonly transactionHash: Hex;
      readonly amount: bigint;
      readonly target: Address;
    }
  | {
      readonly status: "rejected";
      readonly reason: string;
      readonly transactionHash?: Hex;
      readonly authorizationLogs: number;
    };

export function customErrorName(error: unknown): string | undefined {
  if (!(error instanceof BaseError)) return undefined;
  const reverted = error.walk(
    (candidate) => candidate instanceof ContractFunctionRevertedError,
  );
  return reverted instanceof ContractFunctionRevertedError
    ? reverted.data?.errorName
    : undefined;
}

export function userFacingErrorName(error: unknown): string {
  const name = customErrorName(error);
  if (name === "NotOwner") return "UnauthorizedSessionKey";
  if (name) return name;
  return "TransactionRejected";
}

export function paymentReference(
  label: string,
  mandateId: Hex,
  amount: bigint,
): Hex {
  return keccak256(
    encodePacked(
      ["string", "bytes32", "uint256", "uint256"],
      [label, mandateId, amount, BigInt(Date.now())],
    ),
  );
}

export class LeashPaymentClient {
  readonly #options: PaymentClientOptions;

  constructor(options: PaymentClientOptions) {
    this.#options = options;
  }

  async authorizePayment(
    mandateId: Hex,
    target: Address,
    amount: bigint,
    label: string,
  ): Promise<PaymentOutcome> {
    const paymentRef = paymentReference(label, mandateId, amount);
    const request = {
      account: this.#options.sessionAccount,
      address: this.#options.contractAddress,
      abi: this.#options.abi,
      functionName: "authorizePayment",
      args: [mandateId, target, amount, paymentRef],
    };

    try {
      await this.#options.publicClient.simulateContract(request);
    } catch (error) {
      const reason = userFacingErrorName(error);
      if (!this.#options.broadcastReverts) {
        return { status: "rejected", reason, authorizationLogs: 0 };
      }

      try {
        const transactionHash = await this.#options.sessionWallet.writeContract({
          ...request,
          chain: null,
          gas: 300_000n,
        });
        const receipt = await this.#options.publicClient.waitForTransactionReceipt({
          hash: transactionHash,
        });
        const logs = parseEventLogs({
          abi: this.#options.abi,
          logs: receipt.logs as never,
          eventName: "AuthorizationGranted",
          strict: true,
        });
        if (receipt.status !== "reverted" || logs.length !== 0) {
          throw new Error("Rejected payment unexpectedly produced authorization");
        }
        return { status: "rejected", reason, transactionHash, authorizationLogs: 0 };
      } catch (broadcastError) {
        // The original simulation error is the useful policy result. The second
        // error is only transport/RPC context and must not become settlement.
        return { status: "rejected", reason, authorizationLogs: 0 };
      }
    }

    try {
      const transactionHash = await this.#options.sessionWallet.writeContract({
        ...request,
        chain: null,
      });
      const receipt = await this.#options.publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      });
      if (receipt.status !== "success") {
        return {
          status: "rejected",
          reason: "TransactionRejected",
          transactionHash,
          authorizationLogs: 0,
        };
      }
      const logs = parseEventLogs({
        abi: this.#options.abi,
        logs: receipt.logs as never,
        eventName: "AuthorizationGranted",
        strict: true,
      });
      if (logs.length !== 1) {
        return { status: "rejected", reason: "AuthorizationEventMissing", transactionHash, authorizationLogs: logs.length };
      }
      return { status: "approved", transactionHash, amount, target };
    } catch (error) {
      return {
        status: "rejected",
        reason: userFacingErrorName(error),
        authorizationLogs: 0,
      };
    }
  }
}
