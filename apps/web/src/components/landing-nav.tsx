"use client";

import { useEffect, useRef, useState } from "react";
import { SiteNav } from "./site-nav";

/**
 * The paper navbar that returns once the landing's volt hero has scrolled out.
 * It is fixed to the top and slides down when the hero's bottom clears the
 * header band — which is exactly where the "Four payment attempts" section
 * begins — and slides back up if the visitor scrolls up into the hero again.
 */
export function LandingNav() {
  const navRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("main > section.on-green");
    const navEl = navRef.current;
    if (!(hero instanceof HTMLElement) || !navEl) return;

    let io: IntersectionObserver | undefined;
    const setup = () => {
      io?.disconnect();
      io = new IntersectionObserver(
        ([entry]) => setVisible(!entry.isIntersecting),
        { rootMargin: `-${navEl.offsetHeight}px 0px 0px 0px`, threshold: 0 },
      );
      io.observe(hero);
    };
    setup();
    window.addEventListener("resize", setup);
    return () => {
      window.removeEventListener("resize", setup);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      ref={navRef}
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md transition-[transform,visibility] duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full invisible"
      }`}
      style={{ background: "color-mix(in srgb, var(--paper) 88%, transparent)" }}
    >
      <SiteNav border={false} hero />
    </div>
  );
}