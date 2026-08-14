import { getAddress, type Address } from "viem";

export type MerchantId = "rockBurger" | "evilStore";

export interface Merchant {
  readonly id: MerchantId;
  readonly name: string;
  readonly address: Address;
  readonly aliases: readonly string[];
}

export interface MerchantDirectory {
  readonly rockBurger: Merchant;
  readonly evilStore: Merchant;
}

export function createMerchantDirectory(
  rockBurgerAddress: string,
  evilStoreAddress: string,
): MerchantDirectory {
  const rockBurger = getAddress(rockBurgerAddress);
  const evilStore = getAddress(evilStoreAddress);
  if (rockBurger === evilStore) throw new Error("Merchant addresses must differ");

  return {
    rockBurger: {
      id: "rockBurger",
      name: "Rock Burger",
      address: rockBurger,
      aliases: ["rock burger", "rockburger", "burger"],
    },
    evilStore: {
      id: "evilStore",
      name: "Evil Store",
      address: evilStore,
      aliases: ["evil store", "evilstore"],
    },
  };
}

export function resolveMerchant(
  text: string,
  directory: MerchantDirectory,
): Merchant | undefined {
  const normalized = text.toLocaleLowerCase("id-ID").replace(/\s+/g, " ").trim();
  if (directory.evilStore.aliases.some((alias) => normalized.includes(alias))) {
    return directory.evilStore;
  }
  if (directory.rockBurger.aliases.some((alias) => normalized.includes(alias))) {
    return directory.rockBurger;
  }
  return undefined;
}
