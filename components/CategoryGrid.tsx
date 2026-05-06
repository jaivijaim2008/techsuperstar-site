"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FaMobileAlt, FaLaptop, FaTabletAlt, FaGamepad } from "react-icons/fa";

const categories = [
  { name: "Phones", slug: "phones", color: "#ff4d00", icon: <FaMobileAlt /> },
  { name: "Laptops", slug: "laptops", color: "#3b82f6", icon: <FaLaptop /> },
  { name: "Tablets", slug: "tablets", color: "#10b981", icon: <FaTabletAlt /> },
  { name: "Gaming", slug: "gaming", color: "#a855f7", icon: <FaGamepad /> },
];

// duplicate for infinite scroll
const loop = [...categories, ...categories, ...categories];

export default function CategoryGrid() {
  const trackRef = useRef<HTMLDivElement>(null);
  const currentX = useRef(0);
  const velocity = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const widthRef = useRef(0);

  // ─── AUTO SCROLL (SMOOTH ENGINE) ───
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    widthRef.current = el.scrollWidth / 3;

    let raf: number;

    const animate = () => {
      if (!isDragging.current) {
        currentX.current -= 0.4; // base speed
      }

      // wrap
      if (currentX.current <= -widthRef.current) {
        currentX.current = 0;
      }

      el.style.transform = `translate3d(${currentX.current}px,0,0)`;

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, []);

  // ─── TOUCH HANDLERS ───
  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    lastX.current = e.touches[0].clientX;
    velocity.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;

    const x = e.touches[0].clientX;
    const dx = x - lastX.current;

    currentX.current += dx;
    velocity.current = dx;

    lastX.current = x;
  };

  const onTouchEnd = () => {
    isDragging.current = false;

    let v = velocity.current;

    const glide = () => {
      v *= 0.95;

      currentX.current += v;

      if (currentX.current <= -widthRef.current) {
        currentX.current = 0;
      }

      if (trackRef.current) {
        trackRef.current.style.transform =
          `translate3d(${currentX.current}px,0,0)`;
      }

      if (Math.abs(v) > 0.2) {
        requestAnimationFrame(glide);
      }
    };

    requestAnimationFrame(glide);
  };

  return (
    <div style={{ overflow: "hidden", padding: "20px 0" }}>
      <div
        ref={trackRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          display: "flex",
          gap: 16,
          width: "max-content",
          transform: "translate3d(0,0,0)",
          willChange: "transform",
        }}
      >
        {loop.map((cat, i) => (
          <Link
            key={i}
            href={`/category/${cat.slug}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                width: 100,
                padding: "16px",
                borderRadius: 16,
                background: "#111",
                color: "#fff",
                textAlign: "center",
                flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  marginBottom: 8,
                  color: cat.color,
                }}
              >
                {cat.icon}
              </div>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                {cat.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}