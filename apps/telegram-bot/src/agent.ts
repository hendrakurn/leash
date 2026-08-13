import {
  resolveMerchant,
  type Merchant,
  type MerchantDirectory,
} from "./merchants.js";

export type AgentIntent =
  | { readonly kind: "status" }
  | { readonly kind: "revoke" }
  | { readonly kind: "pay"; readonly merchant: Merchant; readonly amount: bigint }
  | { readonly kind: "browseAndPay" }
  | { readonly kind: "openPromo" }
  | { readonly kind: "unknown" };

function normalize(text: string): string {
  return text.toLocaleLowerCase("id-ID").replace(/\s+/g, " ").trim();
}

function parseNumber(raw: string): number {
  // Indonesian chat commonly writes 500.000 or 500,000 as a whole amount.
  if (/^[\d]{1,3}([.,][\d]{3})+$/.test(raw)) {
    return Number(raw.replace(/[.,]/g, ""));
  }
  return Number(raw.replace(",", "."));
}

export function parseAmount(text: string): bigint | undefined {
  const suffixed = text.match(/(\d+(?:[.,]\d+)?)\s*(ribu|rb|k)\b/i);
  if (suffixed) {
    const value = Number(suffixed[1].replace(",", "."));
    if (Number.isFinite(value) && value > 0) return BigInt(Math.round(value * 1_000));
  }

  const plain = text.match(/\b\d{1,3}(?:[.,]\d{3})+\b|\b\d+\b/);
  if (!plain) return undefined;
  const value = parseNumber(plain[0]);
  if (!Number.isSafeInteger(value) || value <= 0) return undefined;
  return BigInt(value);
}

export function parseAgentIntent(text: string, directory: MerchantDirectory): AgentIntent {
  const normalized = normalize(text);

  if (
    normalized === "status" ||
    /\b(cek|lihat|tampilkan)\s+(status|mandate)\b/.test(normalized)
  ) {
    return { kind: "status" };
  }

  if (
    /\b(batalkan|cabut|revoke)\b/.test(normalized) &&
    /\b(mandate|izin|otorisasi)\b/.test(normalized)
  ) {
    return { kind: "revoke" };
  }

  if (
    /\b(carikan|cari|temukan)\b/.test(normalized) &&
    /\b(burger|makanan)\b/.test(normalized) &&
    /\bmurah\b/.test(normalized) &&
    /\bbayar\b/.test(normalized)
  ) {
    return { kind: "browseAndPay" };
  }

  if (
    /\b(buka|lihat|akses)\b/.test(normalized) &&
    /\bpromo\b/.test(normalized) &&
    /\b(burger|makanan)\b/.test(normalized)
  ) {
    return { kind: "openPromo" };
  }

  const merchant = resolveMerchant(normalized, directory);
  const amount = parseAmount(normalized);
  if (
    merchant &&
    amount !== undefined &&
    /\b(bayar|belikan|beli|pay|purchase)\b/.test(normalized)
  ) {
    return { kind: "pay", merchant, amount };
  }

  return { kind: "unknown" };
}
