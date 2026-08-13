import Link from "next/link";
import type { ReactNode } from "react";

/* --- icons -------------------------------------------------------------- */
/* Drawn, one stroke weight, one grid. No emoji, no glyph substitutes. */

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden {...strokeProps}>
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  );
}

export function IconBlock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden {...strokeProps}>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M4.1 11.9 11.9 4.1" />
    </svg>
  );
}

export function IconArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden {...strokeProps}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function IconKey({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden {...strokeProps}>
      <circle cx="5.5" cy="5.5" r="2.75" />
      <path d="M7.5 7.5 13 13M11 13.5l1.5-1.5M9.5 11.5 11 10" />
    </svg>
  );
}

export function IconClock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden {...strokeProps}>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 4.75V8l2.25 1.5" />
    </svg>
  );
}

/* --- the stamp ---------------------------------------------------------- */

/**
 * The refusal. Carries the contract's own error name, never a paraphrase.
 * `role="status"` so a screen reader announces it when it lands; the word,
 * the frame and the colour all carry the meaning independently.
 */
export function Stamp({
  word,
  errorName,
  delay = 0,
  animate = true,
  live = false,
}: {
  word: string;
  errorName?: string;
  delay?: number;
  animate?: boolean;
  live?: boolean;
}) {
  return (
    <div
      // Only a refusal that just happened is announced. Historical evidence on
      // the landing page is not a live region.
      role={live ? "status" : undefined}
      className={`stamp inline-flex select-none flex-col items-center gap-0.5 px-5 py-2.5 ${
        animate ? "stamp-in" : ""
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-3xl leading-none sm:text-4xl">{word}</span>
      {/* The contract's own error name. This is the product's entire refusal
          vocabulary, so it is set to be read, not to decorate the stamp. */}
      {errorName ? (
        <span className="font-mono text-[0.78rem] font-semibold tracking-[0.06em] whitespace-nowrap">
          {errorName}
        </span>
      ) : null}
    </div>
  );
}

/* --- ruled instrument rows ---------------------------------------------- */

export function Field({
  label,
  children,
  mono = true,
}: {
  label: string;
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b py-3 last:border-b-0">
      <dt className="mono-label shrink-0">{label}</dt>
      <dd
        className={`min-w-0 truncate text-right text-sm ${mono ? "font-mono" : ""}`}
        style={{ color: "var(--ink)" }}
      >
        {children}
      </dd>
    </div>
  );
}

/* --- remaining-balance meter -------------------------------------------- */

/**
 * Reads *remaining*, not spent. The mandate's promise is a ceiling, so the
 * number that matters is how much authority is left under it.
 */
export function Meter({
  spent,
  cap,
  exhausted = false,
}: {
  spent: bigint;
  cap: bigint;
  exhausted?: boolean;
}) {
  // The bar shows what is LEFT, matching the figure it sits under. Filling it
  // with the amount spent put a nearly-full bar beneath "Rp8.000 remaining",
  // which reads as the opposite of the truth.
  const remaining = cap > spent ? cap - spent : 0n;
  const ratio = cap === 0n ? 0 : Number((remaining * 10000n) / cap) / 10000;
  const clamped = Math.min(Math.max(ratio, 0), 1);

  return (
    <div
      className="relative h-2 w-full overflow-hidden"
      style={{ background: "var(--hair)" }}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={Number(cap)}
      aria-valuenow={Number(remaining)}
      aria-label="Spending authority remaining under the mandate ceiling"
    >
      <div
        className="meter-fill absolute inset-y-0 left-0 w-full"
        style={
          {
            background: exhausted ? "var(--refuse)" : "var(--blue)",
            "--fill": clamped,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

/* --- actions ------------------------------------------------------------ */

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  // Disabled uses a hairline-on-paper treatment rather than a low opacity: a
  // 45%-opacity paper-on-ultramarine label is unreadable, and the Send control
  // on /agent is disabled by default.
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-[background-color,color,border-color,transform] duration-150 disabled:cursor-not-allowed disabled:!bg-transparent disabled:!text-[var(--wt-45)] disabled:border disabled:!border-[var(--hair-strong)]";
  const styles: Record<string, string> = {
    primary: "text-[var(--paper)] hover:bg-[var(--blue-hi)] active:translate-y-px",
    ghost: "border hover:bg-[var(--hair)] active:translate-y-px",
    danger: "border hover:bg-[var(--refuse-wash)] active:translate-y-px",
  };
  const inline: Record<string, React.CSSProperties> = {
    primary: { background: "var(--blue)", transitionTimingFunction: "var(--ease-out-strong)" },
    ghost: { color: "var(--ink)", transitionTimingFunction: "var(--ease-out-strong)" },
    danger: {
      color: "var(--refuse)",
      borderColor: "var(--refuse)",
      transitionTimingFunction: "var(--ease-out-strong)",
    },
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} style={inline[variant]} {...rest}>
      {children}
    </button>
  );
}

/**
 * A link that looks like the primary action. Wrapping a <button> in an <a>
 * nests interactive content — invalid, and two tab stops for one action.
 */
export function ButtonLink({
  href,
  children,
  className = "",
}: {
  href: React.ComponentProps<typeof Link>["href"];
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-[var(--paper)] transition-[background-color,transform] duration-150 hover:bg-[var(--blue-hi)] active:translate-y-px ${className}`}
      style={{ background: "var(--blue)", transitionTimingFunction: "var(--ease-out-strong)" }}
    >
      {children}
    </Link>
  );
}

/* --- section scaffolding ------------------------------------------------ */

export function Rule({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full ${className}`} style={{ background: "var(--hair)" }} />;
}

export function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[76rem] px-5 sm:px-8 ${className}`}>{children}</div>;
}
