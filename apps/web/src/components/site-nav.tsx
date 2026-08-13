import Link from "next/link";
import { WalletButton } from "./wallet";
import { Shell } from "./primitives";
import { activeChain, contractAddress } from "@/lib/chain";
import { shortHex } from "@/lib/leash";

/**
 * The site's navigation, rendered in-flow at the top of every page instead of
 * a floating header. On the landing it sits on the volt hero; everywhere else
 * it sits on paper. `border` adds the hairline that separates it from content
 * on paper pages (the landing hero carries its own border). `hero` raises the
 * type so the wordmark and routes read larger on the first viewport.
 */
export function SiteNav({ border = true, hero = false }: { border?: boolean; hero?: boolean }) {
  const mono = hero ? { fontSize: "0.8125rem" } : undefined;
  return (
    <Shell
      className={`flex flex-col gap-2 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-0 ${border ? "border-b" : ""}`}
    >
      <div className="flex items-center justify-between gap-6 sm:items-baseline sm:justify-start">
        <Link href="/" className={`display ${hero ? "text-2xl" : "text-xl"}`}>
          Leash
        </Link>
        <div className="sm:hidden">
          <WalletButton />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:contents">
        <nav className="flex items-center gap-4 sm:gap-5">
          <Link href="/agent" className="mono-label transition-colors duration-150 hover:text-[var(--ink)]" style={mono}>
            Agent
          </Link>
          <Link href="/mandate/new" className="mono-label transition-colors duration-150 hover:text-[var(--ink)]" style={mono}>
            New mandate
          </Link>
          <Link href="/feed" className="mono-label transition-colors duration-150 hover:text-[var(--ink)]" style={mono}>
            Feed
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Shown at every width. PRODUCT.md requires the unbuilt state to be
              disclosed prominently, and hiding it on phones while keeping a
              loud wallet CTA offered an action against a chain with no
              contract on it. */}
          <span className="mono-label" style={mono}>
            <span className="hidden md:inline">{activeChain.name} · </span>
            {contractAddress ? shortHex(contractAddress, 6, 4) : "not deployed"}
          </span>
          <div className="hidden sm:block">
            <WalletButton />
          </div>
        </div>
      </div>
    </Shell>
  );
}