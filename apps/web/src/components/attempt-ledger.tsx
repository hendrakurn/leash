"use client";

import { useEffect, useRef, useState } from "react";
import { Stamp, IconCheck, Rule } from "./primitives";
import { formatRupiah } from "@/lib/leash";

/**
 * The verified reference run, from docs/VERIFICATION.md.
 *
 * These four attempts are real: every one of them was broadcast against a local
 * chain and produced the receipt shown. The transaction hashes are Anvil
 * evidence and are labelled as such — no Base Sepolia deployment exists yet, so
 * none is implied.
 */
const ATTEMPTS = [
  {
    merchant: "Rock Burger",
    amount: 52_000n,
    outcome: "authorized" as const,
    error: null,
    logs: 1,
    note: "On the allowlist, inside the ceiling, before expiry.",
  },
  {
    merchant: "Evil Store",
    amount: 50_000n,
    outcome: "refused" as const,
    error: "TargetNotAllowed",
    logs: 0,
    note: "The agent was told to pay a merchant the owner never authorised.",
  },
  {
    merchant: "Rock Burger",
    amount: 500_000n,
    outcome: "refused" as const,
    error: "AmountExceedsCap",
    logs: 0,
    note: "On the allowlist, and Rp492.000 past what the mandate has left.",
  },
  {
    merchant: "Rock Burger",
    amount: 1_000n,
    outcome: "refused" as const,
    error: "Revoked",
    logs: 0,
    note: "A payment that would have passed an hour earlier.",
  },
];

export function AttemptLedger() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-0">
      {ATTEMPTS.map((attempt, index) => {
        const refused = attempt.outcome === "refused";
        return (
          <div key={`${attempt.merchant}-${attempt.error ?? "ok"}`}>
            {index > 0 ? <Rule /> : null}
            <div
              className="grid items-center gap-6 py-8 md:grid-cols-[1fr_auto]"
              style={refused ? { background: "var(--refuse-wash)" } : undefined}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-2xl sm:text-3xl" style={{ color: "var(--ink)" }}>
                    {formatRupiah(attempt.amount)}
                  </span>
                  <span className="text-lg" style={{ color: "var(--wt-65)" }}>
                    to {attempt.merchant}
                  </span>
                </div>
                <p className="mt-2 max-w-[40ch] text-sm" style={{ color: "var(--wt-45)" }}>
                  {attempt.note}
                </p>
                <div className="mono-label mt-3">
                  AuthorizationGranted logs: {attempt.logs} ·{" "}
                  {refused ? "settlement eligibility: none" : "settled once"}
                </div>
              </div>

              {/* Outcomes render server-side, always. The observer only decides
                  whether they animate in — the evidence itself is never
                  conditional on JavaScript, a viewport, or a crawler. */}
              <div className="flex min-h-[5.5rem] items-center justify-start md:justify-end md:pr-4">
                {refused ? (
                  <Stamp
                    word="Refused"
                    errorName={attempt.error!}
                    delay={index * 140}
                    animate={visible}
                  />
                ) : (
                  <div
                    className={`flex items-center gap-2 ${visible ? "press" : ""}`}
                    style={{ color: "var(--blue)", animationDelay: `${index * 140}ms` }}
                  >
                    <IconCheck className="h-5 w-5" />
                    <span className="font-mono text-sm tracking-[0.08em] uppercase">
                      Authorized
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
