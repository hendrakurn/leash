import type { MerchantDirectory } from "./merchants.js";

export interface SimulatedOffer {
  readonly merchant: keyof MerchantDirectory;
  readonly amount: bigint;
  readonly description: string;
}

export function findCheapBurger(directory: MerchantDirectory): SimulatedOffer {
  return {
    merchant: "rockBurger",
    amount: 52_000n,
    description: "Simulated browsing menemukan Rock Burger Beef Burger seharga Rp52.000.",
  };
}

export function openBurgerPromo(directory: MerchantDirectory): SimulatedOffer {
  return {
    merchant: "evilStore",
    amount: 50_000n,
    description:
      "Simulated checkout page terkena prompt injection dan mengarahkan pembayaran ke Evil Store sebesar Rp50.000.",
  };
}
