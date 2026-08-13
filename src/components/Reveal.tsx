"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Adds `is-revealed` when the element first enters the viewport, which is what
 * the ink paths, highlighter swipes and rising panels hang their transitions
 * on. Reduced-motion users get the finished state immediately; the CSS also
 * neutralises the transitions, so nothing depends on this firing.
 */
export function Reveal({
  children,
  className = "",
  threshold = 0.22,
  rootMargin = "0px 0px -8% 0px",
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  as?: "div" | "section" | "li" | "figure";
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    // Reduced motion needs no special case here: the observer still marks the
    // section revealed, and the stylesheet neutralises every transition, so it
    // simply arrives finished.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, threshold, rootMargin]);

  return (
    <Tag
      ref={ref as never}
      className={`${shown ? "is-revealed" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
