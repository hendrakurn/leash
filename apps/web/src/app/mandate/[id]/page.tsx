"use client";

import { use } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import type { Hex } from "viem";
import { Shell, Rule, Meter, Field, Button, Stamp, IconClock, IconKey } from "@/components/primitives";
import { Undeployed } from "@/components/undeployed";
import { contractAddress, explorerAddress, merchants } from "@/lib/chain";
import {
  leashAbi,
  toMandate,
  mandateExists,
  formatRupiah,
  shortHex,
  revertName,
  ERROR_COPY,
  type MandateTuple,
} from "@/lib/leash";

export default function MandatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const mandateId = id as Hex;
  const { address } = useAccount();

  const { data, isLoading, refetch } = useReadContract({
    address: contractAddress,
    abi: leashAbi,
    functionName: "mandates",
    args: [mandateId],
    query: { enabled: !!contractAddress, refetchInterval: 6000 },
  });

  const { writeContract, data: hash, isPending, error: revokeError } = useWriteContract();
  const { isLoading: revoking } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });

  if (!contractAddress) return <Undeployed surface="Viewing a mandate" />;

  if (isLoading || !data) {
    return (
      <Shell className="py-24">
        <span className="mono-label caret">Reading contract state</span>
      </Shell>
    );
  }

  const mandate = toMandate(data as MandateTuple);

  if (!mandateExists(mandate)) {
    return (
      <Shell className="py-24">
        <h1 className="display max-w-[20ch] text-[clamp(1.75rem,5vw,3rem)]">
          No mandate is registered under this identifier.
        </h1>
        <p className="mt-6 max-w-[45ch] leading-relaxed" style={{ color: "var(--wt-65)" }}>
          The contract returned a zero owner, which means nothing was ever registered
          here. Check the identifier, or register the mandate first.
        </p>
        <div className="mt-8 font-mono text-xs break-all" style={{ color: "var(--wt-45)" }}>
          {mandateId}
        </div>
      </Shell>
    );
  }

  const remaining = mandate.maxAmount - mandate.spentAmount;
  const now = BigInt(Math.floor(Date.now() / 1000));
  const expired = now >= mandate.validUntil;
  const exhausted = remaining === 0n;
  const isOwner = !!address && address.toLowerCase() === mandate.owner.toLowerCase();
  const dead = mandate.revoked || expired;

  const revert = revertName(revokeError);
  const copy = revert ? ERROR_COPY[revert] : undefined;

  return (
    <Shell className="py-16 sm:py-20">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <span className="mono-label">Mandate</span>
          <div className="mt-2 font-mono text-sm break-all" style={{ color: "var(--wt-65)" }}>
            {mandateId}
          </div>
        </div>

        {mandate.revoked ? (
          <Stamp word="Revoked" errorName="MandateRevoked" />
        ) : expired ? (
          <Stamp word="Expired" errorName="Expired" />
        ) : (
          <div className="press flex items-center gap-2 pt-1" style={{ color: "var(--green-deep)" }}>
            <IconKey className="h-4 w-4" />
            <span className="font-mono text-xs tracking-[0.12em] uppercase">Active</span>
          </div>
        )}
      </div>

      <Rule className="my-10" />

      <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div
                className="font-mono text-[clamp(2.25rem,7vw,4rem)] leading-none"
                style={{ color: dead || exhausted ? "var(--wt-45)" : "var(--ink)" }}
              >
                {formatRupiah(remaining)}
              </div>
              <div className="mono-label mt-2">
                Remaining of {formatRupiah(mandate.maxAmount)}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-lg">{formatRupiah(mandate.spentAmount)}</div>
              <div className="mono-label mt-1">Authorized to date</div>
            </div>
          </div>

          <div className="mt-5">
            <Meter spent={mandate.spentAmount} cap={mandate.maxAmount} exhausted={exhausted || dead} />
          </div>

          {dead ? (
            <p className="mt-5 max-w-[60ch] text-sm leading-relaxed" style={{ color: "var(--wt-65)" }}>
              {mandate.revoked
                ? "This mandate was revoked. Every further payment reverts with Revoked, and revocation cannot be undone."
                : "This mandate has passed its expiry. Every further payment reverts with Expired."}
            </p>
          ) : null}

          <dl className="mt-12 border-t">
            <Field label="Owner">
              <a
                href={explorerAddress(mandate.owner)}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                {shortHex(mandate.owner, 10, 6)}
              </a>
            </Field>
            <Field label="Session key">{shortHex(mandate.sessionKey, 10, 6)}</Field>
            <Field label="Expiry">
              {new Date(Number(mandate.validUntil) * 1000).toISOString().replace("T", " ").slice(0, 19)}Z
            </Field>
            <Field label="Revoked">{mandate.revoked ? "true" : "false"}</Field>
          </dl>

          {/* Allowlist: constrained by the contract, stated plainly. */}
          <section className="mt-12">
            <h2 className="mono-label">Allowlist</h2>
            <div className="mt-4 border-t">
              {merchants.map((merchant) => (
                <AllowlistRow
                  key={merchant.name}
                  mandateId={mandateId}
                  name={merchant.name}
                  address={merchant.address}
                />
              ))}
            </div>
            <p className="mt-5 max-w-[45ch] text-sm leading-relaxed" style={{ color: "var(--wt-45)" }}>
              Only merchants this interface already knows can be checked.{" "}
              <span className="font-mono text-[0.95em]">allowedTargets</span> is a nested
              mapping and{" "}
              <span className="font-mono text-[0.95em]">MandateRegistered</span> does not
              carry the targets array, so the full allowlist cannot be read back from
              chain state or logs. Adding{" "}
              <span className="font-mono text-[0.95em]">address[] targets</span> to the event
              would fix this.
            </p>
          </section>
        </div>

        <aside>
          <div className="border p-6">
            <h2 className="mono-label">Revoke</h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--wt-65)" }}>
              Ends this mandate immediately and permanently. Nothing restores it.
            </p>

            <div className="mt-5">
              {mandate.revoked ? (
                <span className="mono-label">Already revoked</span>
              ) : !isOwner ? (
                <span className="mono-label">
                  Owner only · connect {shortHex(mandate.owner, 6, 4)}
                </span>
              ) : (
                <Button
                  variant="danger"
                  disabled={isPending || revoking}
                  onClick={() => {
                    writeContract({
                      address: contractAddress!,
                      abi: leashAbi,
                      functionName: "revokeMandate",
                      args: [mandateId],
                    });
                    setTimeout(() => refetch(), 4000);
                  }}
                >
                  {isPending ? "Confirm in wallet…" : revoking ? "Revoking…" : "Revoke permanently"}
                </Button>
              )}
            </div>

            {revokeError ? (
              <div className="mt-4 text-xs leading-relaxed" style={{ color: "var(--wt-65)" }}>
                <span className="font-mono" style={{ color: "var(--refuse)" }}>
                  {revert ?? "Failed"}
                </span>
                {copy ? ` — ${copy.problem}` : ""}
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex items-start gap-3 text-xs leading-relaxed" style={{ color: "var(--wt-45)" }}>
            <IconClock className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Expiry is exclusive: the contract reverts once the timestamp is reached,
              not after it passes.
            </span>
          </div>
        </aside>
      </div>
    </Shell>
  );
}

function AllowlistRow({
  mandateId,
  name,
  address,
}: {
  mandateId: Hex;
  name: string;
  address?: `0x${string}`;
}) {
  const { data } = useReadContract({
    address: contractAddress!,
    abi: leashAbi,
    functionName: "allowedTargets",
    args: address ? [mandateId, address] : undefined,
    query: { enabled: !!contractAddress && !!address },
  });

  return (
    <div className="flex items-baseline justify-between gap-6 border-b py-3">
      <span className="text-sm">{name}</span>
      <span className="font-mono text-xs" style={{ color: data ? "var(--green-deep)" : "var(--wt-45)" }}>
        {address ? (data ? "allowed" : "not allowed") : "address not configured"}
      </span>
    </div>
  );
}
