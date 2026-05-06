"use client";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { FaMobileAlt, FaLaptop, FaTabletAlt, FaGamepad, FaStar, FaHeadphones } from "react-icons/fa";

const categories = [
  { name: "Phones", slug: "phones", color: "#ff4d00", rgb: "255,77,0", label: "Smartphones & More", icon: <FaMobileAlt size={30} /> },
  { name: "Laptops", slug: "laptops", color: "#3b82f6", rgb: "59,130,246", label: "Notebooks & PCs", icon: <FaLaptop size={30} /> },
  { name: "Tablets", slug: "tablets", color: "#10b981", rgb: "16,185,129", label: "Slates & iPads", icon: <FaTabletAlt size={30} /> },
  { name: "Gaming", slug: "gaming", color: "#a855f7", rgb: "168,85,247", label: "Console & PC", icon: <FaGamepad size={30} /> },
  { name: "Reviews", slug: "reviews", color: "#f59e0b", rgb: "245,158,11", label: "Honest Takes", icon: <FaStar size={30} /> },
  { name: "Accessories", slug: "accessories", color: "#06b6d4", rgb: "6,182,212", label: "Gear & Gadgets", icon: <FaHeadphones size={30} /> },
];

const loop = [...categories, ...categories, ...categories, ...categories];

function PillCard({ cat, idx, paused }: { cat: typeof categories[0]; idx: number; paused: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [flash, setFlash] = useState(false);
  const [ripples, setRipples] = useState<{ id: number }[]>([]);

  const handleInteract = () => {
    const id = Date.now();
    setClicked(true);
    setFlash(true);
    setRipples(prev => [...prev, { id }]);
    setTimeout(() => setClicked(false), 500);
    setTimeout(() => setFlash(false), 500);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 800);
  };

  const floatDuration = 2.4 + (idx % 6) * 0.35;
  const floatDelay = (idx % 6) * 0.3;
  const floatAnim = `float${idx % 6}`;

  return (
    <div
      style={{ flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/category/${cat.slug}`}
        style={{ textDecoration: "none", display: "block" }}
        onMouseDown={handleInteract}
        onTouchStart={handleInteract}
      >
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          width: 130,
          padding: "28px 12px 22px",
          borderRadius: 24,
          border: `1px solid ${hovered || clicked ? `rgba(${cat.rgb},0.6)` : "rgba(255,255,255,0.05)"}`,
          background: hovered
            ? `linear-gradient(160deg, rgba(${cat.rgb},0.12), rgba(${cat.rgb},0.04) 60%, #0a0a0a)`
            : clicked
              ? `linear-gradient(160deg, rgba(${cat.rgb},0.2), rgba(${cat.rgb},0.08) 60%, #0a0a0a)`
              : "linear-gradient(160deg, #111, #0a0a0a)",
          boxShadow: clicked
            ? `0 0 0 2px rgba(${cat.rgb},0.5), 0 20px 60px rgba(${cat.rgb},0.35), inset 0 1px 0 rgba(255,255,255,0.1)`
            : hovered
              ? `0 0 0 1px rgba(${cat.rgb},0.2), 0 20px 50px rgba(${cat.rgb},0.2), inset 0 1px 0 rgba(255,255,255,0.05)`
              : "0 2px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          animation: (hovered || paused || clicked)
            ? "none"
            : `${floatAnim} ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
          transform: clicked
            ? "scale(0.88) rotate(2deg) skewX(-3deg)"
            : hovered
              ? "translateY(-10px) scale(1.05)"
              : "scale(1)",
          transition: "border 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          willChange: "transform",
        }}>

          {/* Flash overlay on click */}
          {flash && (
            <div style={{
              position: "absolute", inset: 0,
              background: `rgba(${cat.rgb}, 0.22)`,
              borderRadius: 24,
              animation: "flashFade 0.5s ease-out forwards",
              pointerEvents: "none",
              zIndex: 5,
            }} />
          )}

          {/* Ripple from center */}
          {ripples.map(r => (
            <span key={r.id} style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: 10, height: 10,
              borderRadius: "50%",
              background: `rgba(${cat.rgb}, 0.35)`,
              transform: "translate(-50%, -50%)",
              animation: "rippleOut 0.8s ease-out forwards",
              pointerEvents: "none",
              zIndex: 10,
            }} />
          ))}

          {/* Radial glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 50% 30%, rgba(${cat.rgb},${hovered ? 0.15 : clicked ? 0.25 : 0}), transparent 70%)`,
            transition: "all 0.3s ease",
            pointerEvents: "none",
          }} />

          {/* Top shine line */}
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
            background: `linear-gradient(90deg, transparent, rgba(${cat.rgb},0.8), transparent)`,
            opacity: hovered || clicked ? 1 : 0,
            transition: "opacity 0.3s ease",
          }} />

          {/* Sweep shimmer */}
          <div style={{
            position: "absolute", top: 0,
            left: hovered ? "120%" : clicked ? "120%" : "-80%",
            width: "50%", height: "100%",
            background: `linear-gradient(90deg, transparent, rgba(${cat.rgb},0.08), transparent)`,
            transform: "skewX(-15deg)",
            transition: "left 0.6s ease",
            pointerEvents: "none",
          }} />

          {/* Icon box */}
          <div style={{
            width: 60, height: 60,
            borderRadius: 16,
            background: hovered
              ? `linear-gradient(135deg, rgba(${cat.rgb},0.25), rgba(${cat.rgb},0.08))`
              : clicked
                ? `linear-gradient(135deg, rgba(${cat.rgb},0.4), rgba(${cat.rgb},0.15))`
                : `rgba(${cat.rgb},0.08)`,
            border: `1px solid rgba(${cat.rgb},${hovered ? 0.4 : clicked ? 0.7 : 0.15})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: cat.color,
            transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            transform: clicked
              ? "scale(0.8) rotate(-12deg)"
              : hovered
                ? "scale(1.15) rotate(-4deg)"
                : "scale(1) rotate(0deg)",
            boxShadow: clicked
              ? `0 0 35px rgba(${cat.rgb},0.8), 0 0 70px rgba(${cat.rgb},0.4)`
              : hovered
                ? `0 0 20px rgba(${cat.rgb},0.4), 0 0 40px rgba(${cat.rgb},0.15)`
                : "none",
            position: "relative",
            zIndex: 1,
            flexShrink: 0,
            animation: clicked ? "iconPop 0.45s cubic-bezier(0.34,1.56,0.64,1)" : "none",
            overflow: "hidden",
          }}>
            {ripples.map(r => (
              <span key={r.id} style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: 8, height: 8,
                borderRadius: "50%",
                border: `2px solid rgba(${cat.rgb},0.9)`,
                transform: "translate(-50%, -50%)",
                animation: "iconRipple 0.6s ease-out forwards",
                pointerEvents: "none",
              }} />
            ))}
            {cat.icon}
          </div>

          {/* Text */}
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{
              color: hovered || clicked ? "#fff" : "#888",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.3s ease",
              marginBottom: 4,
            }}>
              {cat.name}
            </div>
            <div style={{
              color: hovered || clicked ? cat.color : "transparent",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.5px",
              fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.3s ease",
              textShadow: hovered || clicked ? `0 0 10px rgba(${cat.rgb},0.5)` : "none",
            }}>
              {cat.label}
            </div>
          </div>

          {/* Bottom glow bar */}
          <div style={{
            position: "absolute", bottom: 0, left: "50%",
            transform: `translateX(-50%) scaleX(${hovered || clicked ? 1 : 0})`,
            width: "60%", height: 2,
            background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
            borderRadius: 2,
            boxShadow: `0 0 12px rgba(${cat.rgb},0.8)`,
            transition: "transform 0.4s ease",
          }} />
        </div>
      </Link>
    </div>
  );
}

export default function CategoryGrid() {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const animOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const isDragging = useRef(false);
  const dragOffset = useRef(0);
  const lastTouchX = useRef(0);
  const lastTouchTime = useRef(0);
  const prevTouchX = useRef(0);
  const rafRef = useRef<number | null>(null);

  const getAnimatedX = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 0;
    const matrix = new DOMMatrix(window.getComputedStyle(el).transform);
    return matrix.m41;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    lastTouchX.current = touch.clientX;
    prevTouchX.current = touch.clientX;
    lastTouchTime.current = performance.now();
    isDragging.current = true;
    velocityRef.current = 0;

    const currentX = getAnimatedX();
    animOffsetRef.current = currentX;
    dragOffset.current = 0;

    const el = trackRef.current;
    if (el) {
      el.style.animation = "none";
      el.style.transform = `translateX(${currentX}px) translateZ(0)`;
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPaused(true);
  }, [getAnimatedX]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    e.stopPropagation();

    const touch = e.touches[0];
    const now = performance.now();
    const dt = now - lastTouchTime.current;
    const dx = touch.clientX - lastTouchX.current;

    // Rolling velocity average for smoothness
    if (dt > 0) {
      velocityRef.current = velocityRef.current * 0.6 + (dx / dt) * 16 * 0.4;
    }

    prevTouchX.current = lastTouchX.current;
    lastTouchX.current = touch.clientX;
    lastTouchTime.current = now;
    dragOffset.current += dx;

    const el = trackRef.current;
    if (el) {
      el.style.transform = `translateX(${animOffsetRef.current + dragOffset.current}px) translateZ(0)`;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    let velocity = velocityRef.current;
    let currentX = animOffsetRef.current + dragOffset.current;

    const el = trackRef.current;
    if (!el) return;

    const glide = () => {
      velocity *= 0.93; // smooth friction
      currentX += velocity;

      const trackWidth = el.scrollWidth / 2;

      // Seamless loop wrapping
      if (currentX <= -trackWidth) currentX += trackWidth;
      if (currentX > 0) currentX -= trackWidth;

      el.style.transform = `translateX(${currentX}px) translateZ(0)`;

      if (Math.abs(velocity) > 0.3) {
        rafRef.current = requestAnimationFrame(glide);
      } else {
        // Hand back to CSS animation seamlessly
        const trackTotalWidth = el.scrollWidth / 2;
        const normalizedX = ((currentX % trackTotalWidth) + trackTotalWidth) % trackTotalWidth;
        const progress = normalizedX / trackTotalWidth;
        const duration = 30;
        const elapsed = progress * duration;

        el.style.transform = "";
        el.style.animation = `scrollLeft ${duration}s linear ${-elapsed}s infinite`;
        setPaused(false);
      }
    };

    rafRef.current = requestAnimationFrame(glide);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{ padding: "32px 0 0", position: "relative", zIndex: 1 }}>
      <style>{`
        @keyframes catShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,77,0,0.25); }
          50%     { box-shadow: 0 0 0 6px rgba(255,77,0,0); }
        }
        @keyframes floatDot {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-4px); }
        }
        @keyframes scrollLeft {
          0%   { transform: translateX(0) translateZ(0); }
          100% { transform: translateX(-50%) translateZ(0); }
        }
        @keyframes float0 { 0%,100% { transform: translateY(0px);   } 50% { transform: translateY(-9px);  } }
        @keyframes float1 { 0%,100% { transform: translateY(-5px);  } 50% { transform: translateY(5px);   } }
        @keyframes float2 { 0%,100% { transform: translateY(-2px);  } 50% { transform: translateY(-11px); } }
        @keyframes float3 { 0%,100% { transform: translateY(3px);   } 50% { transform: translateY(-7px);  } }
        @keyframes float4 { 0%,100% { transform: translateY(-7px);  } 50% { transform: translateY(3px);   } }
        @keyframes float5 { 0%,100% { transform: translateY(1px);   } 50% { transform: translateY(-10px); } }
        @keyframes rippleOut {
          0%   { width: 10px; height: 10px; opacity: 0.7; }
          100% { width: 200px; height: 200px; opacity: 0; }
        }
        @keyframes iconRipple {
          0%   { width: 8px; height: 8px; opacity: 1; }
          100% { width: 100px; height: 100px; opacity: 0; }
        }
        @keyframes iconPop {
          0%   { transform: scale(0.8) rotate(-12deg); }
          35%  { transform: scale(1.4) rotate(9deg);   }
          65%  { transform: scale(0.92) rotate(-5deg); }
          100% { transform: scale(1.15) rotate(-4deg); }
        }
        @keyframes flashFade {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        .cat-track {
          display: flex;
          gap: 14px;
          width: max-content;
          animation: scrollLeft 30s linear infinite;
          will-change: transform;
          padding: 20px 0;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .cat-track.paused { animation-play-state: paused; }
        .cat-outer {
          position: relative;
          overflow: hidden;
          margin: 0 -1.5rem;
          touch-action: pan-y;
          -webkit-overflow-scrolling: touch;
        }
        .cat-fade-l {
          position: absolute; left: 0; top: 0; bottom: 0; width: 160px;
          background: linear-gradient(to right, #060606 0%, #060606 15%, rgba(6,6,6,0.85) 50%, transparent 100%);
          pointer-events: none; z-index: 3;
        }
        .cat-fade-r {
          position: absolute; right: 0; top: 0; bottom: 0; width: 160px;
          background: linear-gradient(to left, #060606 0%, #060606 15%, rgba(6,6,6,0.85) 50%, transparent 100%);
          pointer-events: none; z-index: 3;
        }
        .cat-inner { padding: 0 160px; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "rgba(255,77,0,0.07)",
          border: "1px solid rgba(255,77,0,0.22)",
          color: "#ff6622",
          fontSize: 10, fontWeight: 700,
          padding: "5px 14px", borderRadius: 50,
          letterSpacing: "2px", textTransform: "uppercase",
          marginBottom: 14,
          fontFamily: "'DM Sans', sans-serif",
          animation: "badgePulse 2.5s ease infinite",
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "#ff4d00", display: "inline-block",
            animation: "floatDot 2s ease infinite",
          }} />
          Explore Topics
        </div>

        <h2 style={{
          fontSize: "clamp(22px, 3.5vw, 30px)",
          fontWeight: 900, margin: "0 0 12px",
          fontFamily: "'Playfair Display', Georgia, serif",
          letterSpacing: "-0.5px", lineHeight: 1.15,
          background: "linear-gradient(90deg, #ffffff 0%, #ff4d00 40%, #ffaa55 60%, #ffffff 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "catShimmer 4s linear infinite",
        }}>
          Browse by Category
        </h2>

        <div style={{
          height: 2,
          background: "linear-gradient(90deg, #ff4d00, rgba(255,77,0,0.1))",
          borderRadius: 2,
        }} />
      </div>

      {/* Ticker */}
      <div
        className="cat-outer"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="cat-fade-l" />
        <div className="cat-fade-r" />
        <div className="cat-inner">
          <div
            ref={trackRef}
            className={`cat-track${paused ? " paused" : ""}`}
          >
            {loop.map((cat, i) => (
              <PillCard key={`${cat.slug}-${i}`} cat={cat} idx={i} paused={paused} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}