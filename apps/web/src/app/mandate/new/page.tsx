"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { encodePacked, isAddress, keccak256, type Address } from "viem";
import { Shell, Rule, Button, Field, IconArrow } from "@/components/primitives";
import { SiteNav } from "@/components/site-nav";
import { Undeployed } from "@/components/undeployed";
import { WalletButton } from "@/components/wallet";
import { contractAddress, merchants } from "@/lib/chain";
import { leashAbi, revertName, ERROR_COPY, formatRupiah } from "@/lib/leash";

export default function NewMandatePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [sessionKey, setSessionKey] = useState("");
  const [cap, setCap] = useState("60000");
  const [hours, setHours] = useState("1");
  const [targets, setTargets] = useState<string[]>(
    merchants.filter((m) => m.allowlisted).map((m) => m.address ?? ""),
  );

  const mandateId = useMemo(() => {
    if (!address) return undefined;
    return keccak256(
      encodePacked(
        ["string", "address", "uint256"],
        ["LEASH_WEB", address, BigInt(Math.floor(Date.now() / 1000))],
      ),
    );
  }, [address]);

  if (!contractAddress) return (<><SiteNav /><Undeployed surface="Registering a mandate" /></>);
  const contract = contractAddress;

  const capValue = /^\d+$/.test(cap) ? BigInt(cap) : 0n;
  const cleanTargets = targets.map((t) => t.trim()).filter((t) => isAddress(t)) as Address[];

  const problems: string[] = [];
  if (!isConnected) problems.push("Connect the owner wallet.");
  if (sessionKey && !isAddress(sessionKey)) problems.push("Session key is not a valid address.");
  if (isConnected && sessionKey && address && sessionKey.toLowerCase() === address.toLowerCase())
    problems.push("The session key must differ from the owner. An agent holding the owner key can revoke its own leash.");
  if (capValue <= 0n) problems.push("The ceiling must be above zero.");
  if (cleanTargets.length === 0) problems.push("Add at least one allowlisted merchant address.");
  if (!/^\d+$/.test(hours) || Number(hours) <= 0) problems.push("Expiry must be a positive number of hours.");

  const ready = problems.length === 0 && !!sessionKey && !!mandateId;

  const revert = revertName(writeError);
  const copy = revert ? ERROR_COPY[revert] : undefined;

  if (isSuccess && mandateId) {
    return (
      <Shell className="py-24">
        <span className="mono-label">Registered</span>
        <h1 className="display mt-4 max-w-[18ch] text-[clamp(1.75rem,5vw,3rem)]">
          The mandate is on chain.
        </h1>
        <Rule className="my-8" />
        <dl className="max-w-[46rem]">
          <Field label="Mandate ID">{mandateId}</Field>
          <Field label="Ceiling">{formatRupiah(capValue)}</Field>
          <Field label="Session key">{sessionKey}</Field>
          <Field label="Allowlisted">{cleanTargets.length} merchant{cleanTargets.length === 1 ? "" : "s"}</Field>
        </dl>
        <div className="mt-9 flex flex-wrap gap-4">
          <Button onClick={() => router.push(`/mandate/${mandateId}`)}>
            Open the mandate
            <IconArrow className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={() => reset()}>
            Register another
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <>
      <SiteNav />
      <Shell className="py-16 sm:py-24">
        <h1 className="display max-w-[20ch] text-[clamp(2rem,6vw,3.5rem)]">
        Set the boundary before the agent gets a key.
      </h1>
      <p className="mt-6 max-w-[46ch] text-lg leading-relaxed" style={{ color: "var(--wt-65)" }}>
        Everything here is fixed at registration. A mandate cannot be widened later —
        no merchant added, no ceiling raised. To change any of it you register a new
        one and revoke this.
      </p>

      <Rule className="my-10" />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,32rem)_1fr] lg:gap-16">
        <form
          className="space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            if (!ready || !mandateId) return;
            writeContract({
              address: contract,
              abi: leashAbi,
              functionName: "registerMandate",
              args: [
                mandateId,
                sessionKey as Address,
                capValue,
                BigInt(Math.floor(Date.now() / 1000) + Number(hours) * 3600),
                cleanTargets,
              ],
            });
          }}
        >
          <label className="block">
            <span className="mono-label">Session key</span>
            <input
              value={sessionKey}
              onChange={(e) => setSessionKey(e.target.value)}
              placeholder="0x…"
              spellCheck={false}
              className="mt-2 w-full border bg-transparent px-4 py-3 font-mono text-sm outline-none transition-colors duration-150 focus:border-[var(--green-deep)]"
            />
            <span className="mt-2 block text-xs" style={{ color: "var(--wt-45)" }}>
              The address the agent signs with. It may spend inside this mandate and
              can never modify it.
            </span>
          </label>

          <label className="block">
            <span className="mono-label">Cumulative ceiling</span>
            <div className="mt-2 flex items-center border focus-within:border-[var(--green-deep)]">
              <span className="pl-4 font-mono text-sm" style={{ color: "var(--wt-45)" }}>
                Rp
              </span>
              <input
                value={cap}
                onChange={(e) => setCap(e.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
                className="w-full bg-transparent px-2 py-3 font-mono text-sm outline-none"
              />
            </div>
            <span className="mt-2 block text-xs" style={{ color: "var(--wt-45)" }}>
              Total across every payment, not per transaction.
            </span>
          </label>

          <label className="block">
            <span className="mono-label">Expires in</span>
            <div className="mt-2 flex items-center border focus-within:border-[var(--green-deep)]">
              <input
                value={hours}
                onChange={(e) => setHours(e.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
                className="w-full bg-transparent px-4 py-3 font-mono text-sm outline-none"
              />
              <span className="pr-4 font-mono text-sm" style={{ color: "var(--wt-45)" }}>
                hours
              </span>
            </div>
          </label>

          <fieldset>
            <legend className="mono-label">Allowlisted merchants</legend>
            <div className="mt-2 space-y-2">
              {targets.map((target, index) => (
                <input
                  key={index}
                  value={target}
                  onChange={(e) => {
                    const next = [...targets];
                    next[index] = e.target.value;
                    setTargets(next);
                  }}
                  placeholder="0x…"
                  spellCheck={false}
                  className="w-full border bg-transparent px-4 py-3 font-mono text-sm outline-none transition-colors duration-150 focus:border-[var(--green-deep)]"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTargets([...targets, ""])}
              className="mono-label mt-3 underline underline-offset-4"
            >
              Add another
            </button>
          </fieldset>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {isConnected ? (
              <Button type="submit" disabled={!ready || isPending || confirming}>
                {isPending ? "Confirm in wallet…" : confirming ? "Registering…" : "Register mandate"}
              </Button>
            ) : (
              <WalletButton />
            )}
          </div>

          {problems.length > 0 && (isConnected || sessionKey) ? (
            <ul className="space-y-1.5 text-xs" style={{ color: "var(--wt-45)" }}>
              {problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          ) : null}

          {writeError ? (
            <div className="border p-4" style={{ borderColor: "var(--refuse)" }}>
              <div className="font-mono text-sm" style={{ color: "var(--refuse)" }}>
                {revert ?? "Transaction failed"}
              </div>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--wt-65)" }}>
                {copy ? `${copy.problem} ${copy.recovery}` : writeError.message.slice(0, 220)}
              </p>
            </div>
          ) : null}
        </form>

        <aside>
          <h2 className="mono-label">What cannot change afterwards</h2>
          <dl className="mt-4 border-t">
            <Field label="Allowlist" mono={false}>
              fixed at registration
            </Field>
            <Field label="Ceiling" mono={false}>
              fixed at registration
            </Field>
            <Field label="Expiry" mono={false}>
              fixed at registration
            </Field>
            <Field label="Revocation" mono={false}>
              one-way, permanent
            </Field>
          </dl>
          <p className="mt-6 max-w-[46ch] text-sm leading-relaxed" style={{ color: "var(--wt-45)" }}>
            This is deliberate. A mandate an agent could negotiate with is not a
            boundary, and a mandate the operator could quietly widen is just a
            database row.
          </p>
        </aside>
      </div>
      </Shell>
    </>
  );
}
