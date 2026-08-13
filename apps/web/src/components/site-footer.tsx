import { Shell, Rule } from "./primitives";

/**
 * The mocked list is load-bearing, not a disclaimer. PRODUCT.md fixes the
 * disclosure posture as prominent: naming what is simulated is what makes the
 * enforcement claim credible.
 */
const MOCKED = [
  "Fiat movement",
  "BaaS provider",
  "Virtual-card issuance",
  "Merchant identity",
];

const REAL = [
  "Solidity enforcement",
  "Reverted receipts",
  "Confirmed-block listener",
  "Idempotent settlement",
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t py-12">
      <Shell>
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="mono-label mb-4">Real in this build</h2>
            <ul className="space-y-1.5 text-sm" style={{ color: "var(--wt-65)" }}>
              {REAL.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mono-label mb-4">Mocked in this build</h2>
            <ul className="space-y-1.5 text-sm" style={{ color: "var(--wt-65)" }}>
              {MOCKED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <Rule className="my-8" />

        <p className="max-w-[48ch] text-sm leading-relaxed" style={{ color: "var(--wt-45)" }}>
          Leash proves a protocol in which a conforming backend settles only after
          confirmed on-chain authorisation. It does not make a fiat backend
          trustless, and an <span className="font-mono">AuthorizationGranted</span> event is
          authorisation evidence, not settlement finality.
        </p>
      </Shell>
    </footer>
  );
}
