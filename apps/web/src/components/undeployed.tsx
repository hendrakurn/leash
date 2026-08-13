import { Shell, Rule, ButtonLink, Field, IconArrow } from "./primitives";
import { activeChain } from "@/lib/chain";

/**
 * Rendered wherever a surface needs a contract address and there is not one.
 *
 * docs/DEPLOYMENT.md records SKIPPED_CREDENTIALS. Showing a placeholder address
 * here would be the one thing this product cannot do: claim something it has not
 * verified. So this is a real state with the world's own grammar, and it offers
 * the visitor the evidence that does exist rather than leaving them stranded.
 */
export function Undeployed({ surface }: { surface: string }) {
  return (
    <section className="buzz">
      <Shell className="py-20 sm:py-28">
        <h1 className="display max-w-[20ch] text-[clamp(1.75rem,5vw,3rem)]">
          No LeashMandate deployment on {activeChain.name} yet.
        </h1>

        <p className="mt-6 max-w-[48ch] text-lg leading-relaxed" style={{ color: "var(--wt-65)" }}>
          {surface} reads live contract state, so it needs a deployed address. There
          is not one, and this build will not show a placeholder — an address that
          looks real but is not would undo the only claim the product makes.
        </p>

        <Rule className="my-10" />

        <div className="grid gap-10 md:grid-cols-[minmax(0,26rem)_1fr] md:gap-16">
          <dl>
            <Field label="Network" mono={false}>
              {activeChain.name}
            </Field>
            <Field label="Chain ID">{activeChain.id}</Field>
            <Field label="Contract" mono={false}>
              not deployed
            </Field>
            <Field label="Recorded status">SKIPPED_CREDENTIALS</Field>
          </dl>

          <div>
            <p className="max-w-[48ch] leading-relaxed" style={{ color: "var(--wt-65)" }}>
              The enforcement itself is already verified against a local chain: one
              authorised payment, three refused, exactly one settlement. That run is
              on the front page.
            </p>
            <div className="mt-7">
              <ButtonLink href="/">
                See the verified run
                <IconArrow className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
