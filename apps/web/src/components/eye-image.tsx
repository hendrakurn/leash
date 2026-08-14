"use client";

import { useEffect, useRef, useState } from "react";

const OPEN = "/eye-open.png";
const HALF = "/eye-half.png";
const CLOSED = "/eye-closed.png";

/**
 * The eye follows the cursor: fully open while the cursor is above it, half-closed
 * while the cursor is level with it, and fully closed once the cursor drops below.
 * The three frames are separate PNGs shipped in `public/`.
 */
export function EyeImage() {
  const ref = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState(OPEN);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return;
      // Compare the cursor against the vertical span of the eye.
      if (e.clientY < rect.top) setSrc(OPEN);
      else if (e.clientY > rect.bottom) setSrc(CLOSED);
      else setSrc(HALF);
    };

    window.addEventListener("mousemove", update);
    return () => window.removeEventListener("mousemove", update);
  }, []);

  return (
    <div ref={ref} className="rise" style={{ animationDelay: "260ms" }}>
      <img
        src={src}
        alt="Leash eye illustration tracking the cursor"
        className="h-auto w-full select-none"
        draggable={false}
      />
    </div>
  );
}