"use client";
import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
}

// ✅ FIX: Initial hidden state is defined purely in CSS (.scroll-reveal-hidden).
// The server renders the div with that class — no inline styles that could
// differ between server and client. The useEffect/IntersectionObserver then
// toggles the class on the client. Zero hydration mismatch.

const STYLE = `
  .scroll-reveal-hidden {
    opacity: 0;
    will-change: opacity, transform;
  }
  .scroll-reveal-hidden[data-dir="up"]    { transform: translateY(16px); }
  .scroll-reveal-hidden[data-dir="left"]  { transform: translateX(-16px); }
  .scroll-reveal-hidden[data-dir="right"] { transform: translateX(16px); }
  .scroll-reveal-hidden[data-dir="fade"]  { transform: none; }
`;

export default function ScrollReveal({ children, delay = 0, direction = "up" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Apply transition only on client (avoids flash during SSR)
    el.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove("scroll-reveal-hidden");
          el.style.transform = "translateY(0) translateX(0)";
          el.style.opacity = "1";
        } else {
          el.classList.add("scroll-reveal-hidden");
          el.style.transform = "";
          el.style.opacity = "";
        }
      },
      { threshold: 0.06 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, delay]);

  return (
    <>
      {/* Inject the CSS once — safe for SSR */}
      <style>{STYLE}</style>
      <div
        ref={ref}
        className="scroll-reveal-hidden"
        data-dir={direction}
      >
        {children}
      </div>
    </>
  );
}
