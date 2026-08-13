import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Leash · A spending firewall for AI agents",
  description:
    "Leash puts spending authority on-chain, not money. Every agent payment passes an allowlist, a cumulative cap, an expiry and a revocation state — or it reverts, emits nothing, and settles nowhere.",
};

const DIRECTION_CONTRACT = `<!--
THESIS: Spending authority is posted on-chain and the refusal is the product; this page refuses the dark-neon protocol landing and its feature triptych.
OWN-WORLD: Paper #f2f1ec on ink #171818, ultramarine #1520b8, 1px hairline rules, 4px dot ground. Geist Sans, Geist Mono, Archivo semi-condensed display. No green anywhere in the system; red exists only as the refusal stamp.
STORY: The visitor reads what a mandate is, watches an agent get prompt-injected and the chain refuse it, believes the boundary is real, and connects a wallet to set their own.
FIRST VIEWPORT: Full-bleed statement in squeezed display over the dot ground, the live demo mandate directly beneath as a hairline-ruled instrument with its remaining balance metered, primary action left-aligned under the statement.
FORM: Pinned reference (agentcard.sh), recorded as a brand commitment in PRODUCT.md; the pin supersedes the roll. Last seed key 4e39b919.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${archivo.variable}`}
      suppressHydrationWarning
    >
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        <Providers>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
