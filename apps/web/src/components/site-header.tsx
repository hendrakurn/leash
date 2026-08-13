import Link from "next/link";
import { WalletButton } from "./wallet";
import { Shell } from "./primitives";
import { activeChain, contractAddress } from "@/lib/chain";
import { shortHex } from "@/lib/leash";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--paper) 88%, transparent)" }}>
      {/* Two rows on phones. The nav used to be sm:flex, which left a 390px
          visitor with no route to the agent console at all. */}
      <Shell className="flex flex-col gap-2 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-0">
        <div className="flex items-center justify-between gap-6 sm:items-baseline sm:justify-start">
          <Link href="/" className="display text-xl tracking-[-0.04em]">
            Leash
          </Link>
          <div className="sm:hidden">
            <WalletButton />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:contents">
          <nav className="flex items-center gap-4 sm:gap-5">
            <Link href="/agent" className="mono-label transition-colors duration-150 hover:text-[var(--ink)]">
              Agent
            </Link>
            <Link href="/mandate/new" className="mono-label transition-colors duration-150 hover:text-[var(--ink)]">
              New mandate
            </Link>
            <Link href="/feed" className="mono-label transition-colors duration-150 hover:text-[var(--ink)]">
              Feed
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Shown at every width. PRODUCT.md requires the unbuilt state to be
                disclosed prominently, and hiding it on phones while keeping a
                loud wallet CTA offered an action against a chain with no
                contract on it. */}
            <span className="mono-label">
              <span className="hidden md:inline">{activeChain.name} · </span>
              {contractAddress ? shortHex(contractAddress, 6, 4) : "not deployed"}
            </span>
            <div className="hidden sm:block">
              <WalletButton />
            </div>
          </div>
        </div>
      </Shell>
    </header>
  );
}
