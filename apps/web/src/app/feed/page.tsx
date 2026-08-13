"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http, type Log } from "viem";
import { Shell, Rule, IconCheck } from "@/components/primitives";
import { Undeployed } from "@/components/undeployed";
import { activeChain, contractAddress, deployBlock, explorerTx, rpcUrl } from "@/lib/chain";
import { leashAbi, formatRupiah, shortHex } from "@/lib/leash";

interface Entry {
  txHash: string;
  logIndex: number;
  blockNumber: bigint;
  target: string;
  amount: bigint;
  sessionKey: string;
}

/**
 * Mirrors what apps/backend's listener sees: confirmed AuthorizationGranted
 * events, in deterministic order, and nothing else. Refusals are absent here by
 * construction — that absence is the evidence, so the empty state says so
 * rather than apologising for having no rows.
 */
export default function FeedPage() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!contractAddress) return;
    const client = createPublicClient({ chain: activeChain, transport: http(rpcUrl) });

    let cancelled = false;

    async function load() {
      try {
        const logs = await client.getContractEvents({
          address: contractAddress!,
          abi: leashAbi,
          eventName: "AuthorizationGranted",
          fromBlock: deployBlock,
          toBlock: "latest",
          strict: true,
        });

        const mapped = logs
          .map((log) => {
            const typed = log as Log & {
              args: { target: string; amount: bigint; sessionKey: string };
            };
            return {
              txHash: log.transactionHash ?? "",
              logIndex: log.logIndex ?? 0,
              blockNumber: log.blockNumber ?? 0n,
              target: typed.args.target,
              amount: typed.args.amount,
              sessionKey: typed.args.sessionKey,
            };
          })
          .sort((a, b) =>
            a.blockNumber === b.blockNumber
              ? a.logIndex - b.logIndex
              : a.blockNumber < b.blockNumber
                ? 1
                : -1,
          );

        if (!cancelled) setEntries(mapped);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      }
    }

    void load();
    const timer = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  if (!contractAddress) return <Undeployed surface="The authorisation feed" />;

  return (
    <Shell className="py-16 sm:py-20">
      <h1 className="display max-w-[24ch] text-[clamp(2rem,6vw,3.5rem)]">
        Every authorisation the settlement backend is allowed to act on.
      </h1>
      <p className="mt-6 max-w-[47ch] text-lg leading-relaxed" style={{ color: "var(--wt-65)" }}>
        Confirmed <span className="font-mono text-[0.95em]">AuthorizationGranted</span> events on{" "}
        {activeChain.name}, newest first. Refused payments never appear here — that is
        precisely what refusal means.
      </p>

      <Rule className="my-10" />

      {error ? (
        <div className="font-mono text-sm" style={{ color: "var(--refuse)" }}>
          {error}
        </div>
      ) : entries === null ? (
        <span className="mono-label caret">Reading logs</span>
      ) : entries.length === 0 ? (
        <div className="max-w-[45ch]">
          <div className="mono-label">Nothing to settle</div>
          <p className="mt-3 leading-relaxed" style={{ color: "var(--wt-65)" }}>
            No authorisation events since block {deployBlock.toString()}. A backend
            polling this contract would have issued no cards and moved no money — which
            is the correct behaviour when nothing has been authorised, and the same
            behaviour it shows after a refused payment.
          </p>
        </div>
      ) : (
        <div className="border-t">
          {entries.map((entry) => (
            <div
              key={`${entry.txHash}-${entry.logIndex}`}
              className="grid gap-3 border-b py-5 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8"
            >
              <div className="flex items-center gap-2" style={{ color: "var(--blue)" }}>
                <IconCheck className="h-4 w-4" />
                <span className="font-mono text-xs tracking-[0.12em] uppercase">Settled once</span>
              </div>

              <div className="min-w-0">
                <span className="font-mono text-lg">{formatRupiah(entry.amount)}</span>
                <span className="ml-3 text-sm" style={{ color: "var(--wt-45)" }}>
                  to {shortHex(entry.target, 8, 6)} · signed by {shortHex(entry.sessionKey, 6, 4)}
                </span>
              </div>

              <a
                href={explorerTx(entry.txHash)}
                target="_blank"
                rel="noreferrer"
                className="mono-label underline underline-offset-4"
              >
                block {entry.blockNumber.toString()}
              </a>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}
