import Link from "next/link";
import { Shell, Rule, IconArrow, ButtonLink } from "@/components/primitives";
import { SiteNav } from "@/components/site-nav";
import { LandingNav } from "@/components/landing-nav";
import { AttemptLedger } from "@/components/attempt-ledger";
import { ERROR_COPY, ALL_ERROR_NAMES } from "@/lib/leash";
import { activeChain, contractAddress } from "@/lib/chain";

export default function LandingPage() {
  return (
    <>
      <LandingNav />

      {/* --- first viewport: the navigation, then the statement ------------ */}
      {/* There is no floating header. The nav rules straight onto the volt
          hero: wordmark, routes, wallet and deployment status all live here. */}
      <section className="on-green buzz border-b">
        <div className="pt-3 sm:pt-5">
          <SiteNav border={false} hero />
        </div>
        <Shell className="pt-16 pb-24 sm:pt-24 sm:pb-36">
          <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
            <div>
              <h1
                className="display rise max-w-[20ch] text-[clamp(2.5rem,6vw,4.75rem)]"
                style={{ animationDelay: "40ms" }}
              >
                Money stays in fiat rails. Spending authority is enforced on-chain.
              </h1>

              <p
                className="rise mt-7 max-w-[45ch] text-lg leading-relaxed"
                style={{ color: "var(--wt-65)", animationDelay: "140ms" }}
              >
                An AI agent with a payment method can be talked into paying the wrong
                merchant. Leash puts the boundary somewhere the agent cannot reach and
                the operator cannot quietly edit.
              </p>

              <div className="rise mt-9" style={{ animationDelay: "220ms" }}>
                <div className="flex flex-wrap items-center gap-4">
                  <ButtonLink href="/agent">
                    Try to break it
                    <IconArrow className="h-4 w-4" />
                  </ButtonLink>
                  <Link
                    href="/mandate/new"
                    className="text-sm underline decoration-1 underline-offset-4 transition-colors duration-150"
                    style={{ color: "var(--wt-65)" }}
                  >
                    Set your own mandate
                  </Link>
                </div>

                {/* The action must not promise a live console the deployment cannot
                    back. Stated at the control, not discovered after the click. */}
                {!contractAddress ? (
                  <p className="mono-label mt-3">
                    Both need a deployed contract · none on {activeChain.name} yet
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rise" style={{ animationDelay: "260ms" }}>
              <img
                src="/hero.png"
                alt="Leash hero illustration"
                className="h-auto w-full select-none"
                draggable={false}
              />
            </div>
          </div>

        </Shell>
      </section>

      {/* the accent field burns out into the paper demonstration */}
      <div className="sfade sfade--from-green" aria-hidden />

      {/* --- the demonstration ------------------------------------------- */}
      <section>
        <Shell className="py-20 sm:py-28">
          <h2 className="display max-w-[20ch] text-[clamp(1.75rem,4.5vw,3rem)]">
            Four payment attempts. One got through.
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed" style={{ color: "var(--wt-65)" }}>
            Every rejection below is a real transaction that reverted on chain. Each
            one produced a receipt, emitted no{" "}
            <span className="font-mono text-[0.95em]">AuthorizationGranted</span> event, and left
            the amount already spent untouched. A backend watching for confirmed
            authorisations sees nothing to settle.
          </p>

          <div className="mt-14 border-t">
            <AttemptLedger />
          </div>

          <p className="mt-8 max-w-[48ch] text-sm" style={{ color: "var(--wt-45)" }}>
            Transaction hashes for this run are reproducible local-chain evidence, not
            a public testnet claim. See{" "}
            <a href="https://github.com/hendrakurn/leash/blob/main/docs/VERIFICATION.md" target="_blank" rel="noreferrer" className="font-mono underline underline-offset-4">docs/VERIFICATION.md</a>.
          </p>
        </Shell>
      </section>

      {/* --- the vocabulary ---------------------------------------------- */}
      <section className="border-t border-b" style={{ background: "var(--refuse-wash)" }}>
        <Shell className="py-20 sm:py-28">
          <h2 className="display max-w-[24ch] text-[clamp(1.75rem,4.5vw,3rem)]">
            The contract can refuse in eight ways. It cannot be talked out of any of
            them.
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed" style={{ color: "var(--wt-65)" }}>
            This is the whole refusal vocabulary. Nothing in this interface invents a
            reason a payment failed — it prints the error the contract raised.
          </p>

          <dl className="mt-12 border-t">
            {ALL_ERROR_NAMES.map((name) => (
              <div key={name} className="grid gap-2 border-b py-6 md:grid-cols-[16rem_1fr] md:gap-8">
                <dt className="font-mono text-sm" style={{ color: "var(--refuse)" }}>
                  {name}
                </dt>
                <dd className="max-w-[46ch] text-sm leading-relaxed" style={{ color: "var(--wt-65)" }}>
                  {ERROR_COPY[name].problem}{" "}
                  <span style={{ color: "var(--wt-45)" }}>{ERROR_COPY[name].recovery}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Shell>
      </section>

      {/* the paper field gives way back to the accent */}
      <div className="sfade sfade--to-green" aria-hidden />

      {/* --- the boundary -------------------------------------------------- */}
      <section className="on-green">
        <Shell className="py-20 sm:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-20">
            <div>
              <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
                Authorisation is not settlement.
              </h2>
              <p className="mt-6 max-w-[42ch] leading-relaxed" style={{ color: "var(--wt-65)" }}>
                The contract decides whether a payment is <em>eligible</em>. A backend
                polls confirmed blocks, finds the authorisation event, and only then
                issues a card. There is no endpoint an agent can call to ask for money
                directly — the confirmed event is the only trigger that exists.
              </p>
              <p className="mt-4 max-w-[42ch] leading-relaxed" style={{ color: "var(--wt-45)" }}>
                That boundary is what makes a reverted transaction final. No event, no
                settlement, nothing to dispute later.
              </p>
            </div>

            <div className="border p-6 font-mono text-sm sm:p-8" style={{ background: "var(--paper)" }}>
              {/* Labelled in place. The mocked list is 3,000px away in the
                  footer, and "Settlement status: SUCCESS" printed under a
                  heading that says settlement is separate must not read as a
                  real card being issued. */}
              {/* Not in the refusal hue: this section contains no refusal, and
                  red is reserved for the stamp. */}
              <div className="mono-label mb-4">Mock BaaS · no card, no money</div>
              <div className="mono-label">Backend output, valid payment</div>
              <Rule className="my-4" />
              <pre className="overflow-x-auto leading-relaxed" style={{ color: "var(--wt-65)" }}>
{`AuthorizationGranted detected
Issuing mock VCC
Amount: Rp52.000
Mock card: **** **** **** 4242
Settlement status: SUCCESS`}
              </pre>
              <Rule className="my-4" />
              <div className="mono-label">Backend output, all three refusals</div>
              <Rule className="my-4" />
              <pre className="leading-relaxed" style={{ color: "var(--wt-45)" }}>
{`(no output)`}
              </pre>
            </div>
          </div>
        </Shell>
      </section>

      {/* --- close --------------------------------------------------------- */}
      <section className="on-green border-t">
        <Shell className="py-20 text-center sm:py-28">
          <h2 className="display mx-auto max-w-[16ch] text-[clamp(2rem,6vw,4rem)]">
            Try to make it pay the wrong merchant.
          </h2>
          <p className="mx-auto mt-6 max-w-[40ch] leading-relaxed" style={{ color: "var(--wt-65)" }}>
            The agent on the next page runs on a real model with a real session key.
            It can be talked into anything. The contract is the part that cannot.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3">
            <ButtonLink href="/agent">
              Open the agent console
              <IconArrow className="h-4 w-4" />
            </ButtonLink>
            {!contractAddress ? (
              <p className="mono-label">
                Console opens once a contract is deployed on {activeChain.name}
              </p>
            ) : null}
          </div>
        </Shell>
      </section>

      {/* the accent field burns out into the paper footer */}
      <div className="sfade sfade--from-green" aria-hidden />
    </>
  );
}
