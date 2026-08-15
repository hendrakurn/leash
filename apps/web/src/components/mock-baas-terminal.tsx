"use client";

import { useEffect, useRef, useState } from "react";
import { Rule } from "./primitives";

/**
 * Illustrative only — this text is not derived from a live backend run (see
 * AttemptLedger for that). The window chrome and typing are decoration on top
 * of static copy, so gating them behind JS/IntersectionObserver carries none
 * of the "evidence must render without JS" weight that AttemptLedger does.
 */
const BLOCKS = [
  {
    label: "Backend output, valid payment",
    content: `AuthorizationGranted detected
Issuing mock VCC
Amount: Rp52.000
Mock card: **** **** **** 4242
Settlement status: SUCCESS`,
  },
  {
    label: "Backend output, all three refusals",
    content: `(no output)`,
    dim: true,
  },
];

const MS_PER_CHAR = 14;
const MS_PER_CHAR_ERASE = 8;
const PAUSE_BETWEEN_BLOCKS = 500;
const LOOP_DELAY = 8000;
const REDUCED_MOTION_BLANK = 400;

export function MockBaasTerminal() {
  const [typed, setTyped] = useState<string[]>(BLOCKS.map(() => ""));
  const [activeBlock, setActiveBlock] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const cancelled = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();
          runLoop();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelled.current = true;
      if (timer.current) clearTimeout(timer.current as ReturnType<typeof setTimeout>);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runLoop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      // No character-by-character reveal, but the cycle still runs so a
      // resting cursor and a refresh both remain visible.
      function cycleReduced() {
        if (cancelled.current) return;
        setTyped(BLOCKS.map((b) => b.content));
        setActiveBlock(BLOCKS.length - 1);
        timer.current = setTimeout(() => {
          if (cancelled.current) return;
          setTyped(BLOCKS.map(() => ""));
          setActiveBlock(-1);
          timer.current = setTimeout(cycleReduced, REDUCED_MOTION_BLANK);
        }, LOOP_DELAY);
      }
      cycleReduced();
      return;
    }

    // The cursor's position always tracks activeBlock: it types forward at
    // the growing end, rests at the last block while idle, then backs up
    // block by block on the way out. It only ever disappears for the instant
    // between full erasure and the next cycle's first keystroke.
    function typeBlock(index: number) {
      if (cancelled.current) return;
      setActiveBlock(index);
      const content = BLOCKS[index].content;
      let charIndex = 0;

      const interval = setInterval(() => {
        if (cancelled.current) {
          clearInterval(interval);
          return;
        }
        charIndex += 1;
        setTyped((prev) => {
          const next = [...prev];
          next[index] = content.slice(0, charIndex);
          return next;
        });

        if (charIndex >= content.length) {
          clearInterval(interval);
          const nextIndex = index + 1;
          if (nextIndex < BLOCKS.length) {
            timer.current = setTimeout(() => typeBlock(nextIndex), PAUSE_BETWEEN_BLOCKS);
          } else {
            timer.current = setTimeout(() => eraseBlock(BLOCKS.length - 1), LOOP_DELAY);
          }
        }
      }, MS_PER_CHAR);
      timer.current = interval;
    }

    function eraseBlock(index: number) {
      if (cancelled.current) return;
      setActiveBlock(index);
      const content = BLOCKS[index].content;
      let charIndex = content.length;

      const interval = setInterval(() => {
        if (cancelled.current) {
          clearInterval(interval);
          return;
        }
        charIndex -= 1;
        setTyped((prev) => {
          const next = [...prev];
          next[index] = content.slice(0, Math.max(charIndex, 0));
          return next;
        });

        if (charIndex <= 0) {
          clearInterval(interval);
          const prevIndex = index - 1;
          if (prevIndex >= 0) {
            timer.current = setTimeout(() => eraseBlock(prevIndex), PAUSE_BETWEEN_BLOCKS);
          } else {
            setActiveBlock(-1);
            timer.current = setTimeout(() => typeBlock(0), PAUSE_BETWEEN_BLOCKS);
          }
        }
      }, MS_PER_CHAR_ERASE);
      timer.current = interval;
    }

    typeBlock(0);
  }

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-[14px] border shadow-[0_1px_2px_rgba(23,24,24,0.06),0_12px_32px_rgba(23,24,24,0.10)]"
      style={{ background: "var(--paper)" }}
    >
      {/* --- title bar ------------------------------------------------------ */}
      <div className="relative flex items-center gap-2 border-b px-4 py-3">
        <span className="h-[11px] w-[11px] rounded-full" style={{ background: "#ff5f57" }} aria-hidden />
        <span className="h-[11px] w-[11px] rounded-full" style={{ background: "#febc2e" }} aria-hidden />
        <span className="h-[11px] w-[11px] rounded-full" style={{ background: "#28c840" }} aria-hidden />
        <div className="mono-label pointer-events-none absolute inset-x-0 text-center">
          Mock BaaS · no card, no money
        </div>
      </div>

      {/* --- body ------------------------------------------------------------ */}
      <div className="buzz p-6 font-mono text-sm sm:p-8">
        <div className="mono-label mb-4">{BLOCKS[0].label}</div>
        <Rule className="my-4" />
        <pre
          className={`overflow-x-auto leading-relaxed ${activeBlock === 0 ? "caret" : ""}`}
          style={{ color: "var(--wt-65)" }}
        >
          {typed[0]}
        </pre>
        <Rule className="my-4" />
        <div className="mono-label">{BLOCKS[1].label}</div>
        <Rule className="my-4" />
        <pre
          className={`leading-relaxed ${activeBlock === 1 ? "caret" : ""}`}
          style={{ color: "var(--wt-45)" }}
        >
          {typed[1]}
        </pre>
      </div>
    </div>
  );
}
