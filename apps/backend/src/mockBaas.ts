import { zeroHash, type Address, type Hex } from "viem";

export interface AuthorizationEvent {
  readonly chainId: number;
  readonly contractAddress: Address;
  readonly mandateId: Hex;
  readonly sessionKey: Address;
  readonly target: Address;
  readonly amount: bigint;
  readonly paymentRef: Hex;
  readonly transactionHash: Hex;
  readonly logIndex: number;
}

export type SettlementResult =
  | "settled"
  | "duplicate-event"
  | "duplicate-payment-reference";

export class MockBaasSettlementProcessor {
  readonly #processedEvents = new Set<string>();
  readonly #processedPaymentRefs = new Set<string>();
  readonly #log: (message: string) => void;
  #settlementCount = 0;

  constructor(log: (message: string) => void = console.log) {
    this.#log = log;
  }

  get settlementCount(): number {
    return this.#settlementCount;
  }

  process(event: AuthorizationEvent): SettlementResult {
    const eventId = [
      event.chainId,
      event.contractAddress.toLowerCase(),
      event.transactionHash.toLowerCase(),
      event.logIndex,
    ].join(":");

    if (this.#processedEvents.has(eventId)) {
      this.#log("Duplicate AuthorizationGranted ignored: " + eventId);
      return "duplicate-event";
    }

    const paymentRef = event.paymentRef.toLowerCase();
    if (event.paymentRef !== zeroHash && this.#processedPaymentRefs.has(paymentRef)) {
      this.#log("Duplicate payment reference ignored: " + event.paymentRef);
      return "duplicate-payment-reference";
    }

    this.#processedEvents.add(eventId);
    if (event.paymentRef !== zeroHash) this.#processedPaymentRefs.add(paymentRef);
    this.#settlementCount += 1;

    this.#log("AuthorizationGranted detected");
    this.#log("Issuing mock VCC");
    this.#log("Amount: Rp" + new Intl.NumberFormat("id-ID").format(event.amount));
    this.#log("Mock card: **** **** **** 4242");
    this.#log("Settlement status: SUCCESS");
    return "settled";
  }
}

