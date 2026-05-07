"use client";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { FaMobileAlt, FaLaptop, FaTabletAlt, FaGamepad, FaStar, FaHeadphones } from "react-icons/fa";

const categories = [
  { name: "Phones",      slug: "phones",      color: "#ff4d00", rgb: "255,77,0",    label: "Smartphones & More", icon: <FaMobileAlt size={28} /> },
  { name: "Laptops",     slug: "laptops",     color: "#3b82f6", rgb: "59,130,246",  label: "Notebooks & PCs",    icon: <FaLaptop size={28} /> },
  { name: "Tablets",     slug: "tablets",     color: "#10b981", rgb: "16,185,129",  label: "Slates & iPads",     icon: <FaTabletAlt size={28} /> },
  { name: "Gaming",      slug: "gaming",      color: "#a855f7", rgb: "168,85,247",  label: "Console & PC",       icon: <FaGamepad size={28} /> },
  { name: "Reviews",     slug: "reviews",     color: "#f59e0b", rgb: "245,158,11",  label: "Honest Takes",       icon: <FaStar size={28} /> },
  { name: "Accessories", slug: "accessories", color: "#06b6d4", rgb: "6,182,212",   label: "Gear & Gadgets",     icon: <FaHeadphones size={28} /> },
];

// 4 copies for seamless infinite loop
const loop = [...categories, ...categories, ...categories, ...categories];

type Particle = { id: number; angle: number; speed: number; size: number };

// ─── PillCard ────────────────────────────────────────────────────────────────
function PillCard({
  cat, idx, isMobile, isDragging,
}: {
  cat: typeof categories[0];
  idx: number;
  isMobile: boolean;
  isDragging: React.MutableRefObject<boolean>;
}) {
  const [hovered,   setHovered]   = useState(false);
  const [clicked,   setClicked]   = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shockwave, setShockwave] = useState(false);
  const [flash,     setFlash]     = useState(false);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const floatDuration = 2.4 + (idx % 6) * 0.35;
  const floatDelay    = (idx % 6) * 0.3;
  const floatAnim     = `float${idx % 6}`;

  const triggerEffects = useCallback(() => {
    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id:    Date.now() + i,
      angle: (i / 12) * 360,
      speed: 35 + Math.random() * 40,
      size:  3 + Math.random() * 5,
    }));
    setClicked(true);
    setShockwave(true);
    setFlash(true);
    setParticles(newParticles);
    setTimeout(() => setClicked(false),   450);
    setTimeout(() => setShockwave(false), 600);
    setTimeout(() => setFlash(false),     400);
    setTimeout(() => setParticles([]),    700);
  }, []);

  const handleCardTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleCardTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isDragging.current) return;
    const dx = Math.abs(e.changedTouches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (dx < 8 && dy < 8) triggerEffects();
  }, [isDragging, triggerEffects]);

  const cardWidth   = isMobile ? 100 : 130;
  const cardPadding = isMobile ? "20px 8px 16px" : "28px 12px 22px";
  const iconSize    = isMobile ? 50 : 60;

  return (
    <div
      style={{ flexShrink: 0, perspective: "800px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/category/${cat.slug}`}
        style={{ textDecoration: "none", display: "block" }}
        onMouseDown={triggerEffects}
        onTouchStart={handleCardTouchStart}
        onTouchEnd={handleCardTouchEnd}
        onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
        draggable={false}
      >
        <div style={{
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          gap:            isMobile ? 10 : 14,
          width:          cardWidth,
          padding:        cardPadding,
          borderRadius:   24,
          border: `1px solid ${
            clicked  ? `rgba(${cat.rgb},0.9)` :
            hovered  ? `rgba(${cat.rgb},0.5)` :
                       "rgba(255,255,255,0.05)"
          }`,
          background: hovered
            ? `linear-gradient(160deg, rgba(${cat.rgb},0.14), rgba(${cat.rgb},0.05) 60%, #0a0a0a)`
            : "linear-gradient(160deg, #111, #0a0a0a)",
          boxShadow: clicked
            ? `0 0 0 3px rgba(${cat.rgb},0.6), 0 0 80px rgba(${cat.rgb},0.5), 0 30px 80px rgba(${cat.rgb},0.3), inset 0 0 30px rgba(${cat.rgb},0.1)`
            : hovered
              ? `0 0 0 1px rgba(${cat.rgb},0.2), 0 20px 50px rgba(${cat.rgb},0.2), inset 0 1px 0 rgba(255,255,255,0.05)`
              : "0 2px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
          position:  "relative",
          overflow:  "visible",
          cursor:    "pointer",
          animation: clicked || hovered
            ? "none"
            : `${floatAnim} ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
          transform: clicked
            ? "scale(0.82) translateY(4px)"
            : hovered
              ? "translateY(-12px) scale(1.06)"
              : "scale(1) translateY(0px)",
          transition: clicked
            ? "transform 0.12s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.15s ease, border 0.15s ease"
            : "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border 0.3s ease, background 0.3s ease",
          willChange: "transform, opacity",
        }}>

          {/* ── Clipped inner effects ── */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: 24,
            overflow: "hidden",
            pointerEvents: "none",
          }}>
            {flash && (
              <div style={{
                position:   "absolute", inset: 0,
                background: `radial-gradient(circle at 50% 50%, rgba(${cat.rgb},0.6) 0%, rgba(${cat.rgb},0.1) 60%, transparent 100%)`,
                animation:  "flashBurst 0.4s ease-out forwards",
                zIndex:     8,
              }} />
            )}
            {shockwave && (
              <div style={{
                position:     "absolute",
                top: "50%", left: "50%",
                width: 20, height: 20,
                borderRadius: "50%",
                border:       `3px solid rgba(${cat.rgb},0.9)`,
                transform:    "translate(-50%, -50%)",
                animation:    "shockwaveExpand 0.6s ease-out forwards",
                zIndex:       9,
              }} />
            )}
            <div style={{
              position:   "absolute", inset: 0,
              background: `radial-gradient(ellipse at 50% 30%, rgba(${cat.rgb},${hovered ? 0.15 : 0}), transparent 70%)`,
              transition: "all 0.4s ease",
            }} />
            <div style={{
              position:   "absolute", top: 0, left: "15%", right: "15%", height: 1,
              background: `linear-gradient(90deg, transparent, rgba(${cat.rgb},0.9), transparent)`,
              opacity:    hovered || clicked ? 1 : 0,
              transition: "opacity 0.3s ease",
            }} />
            <div style={{
              position:   "absolute", top: 0,
              left:       hovered ? "120%" : "-80%",
              width:      "60%", height: "100%",
              background: `linear-gradient(90deg, transparent, rgba(${cat.rgb},0.07), transparent)`,
              transform:  "skewX(-15deg)",
              transition: "left 0.8s ease",
            }} />
          </div>

          {/* ── Burst particles ── */}
          {particles.map(p => {
            const rad = (p.angle * Math.PI) / 180;
            const tx  = Math.cos(rad) * p.speed;
            const ty  = Math.sin(rad) * p.speed;
            return (
              <span key={p.id} style={{
                position:     "absolute",
                top: "50%", left: "50%",
                width:        p.size, height: p.size,
                borderRadius: "50%",
                background:   cat.color,
                boxShadow:    `0 0 ${p.size * 2}px ${cat.color}`,
                transform:    "translate(-50%, -50%)",
                animation:    "particleFly 0.7s ease-out forwards",
                ["--tx" as string]: `${tx}px`,
                ["--ty" as string]: `${ty}px`,
                pointerEvents: "none",
                zIndex:        20,
              }} />
            );
          })}

          {/* ── Icon ── */}
          <div style={{
            width: iconSize, height: iconSize,
            borderRadius: 16,
            background: hovered
              ? `linear-gradient(135deg, rgba(${cat.rgb},0.25), rgba(${cat.rgb},0.08))`
              : `rgba(${cat.rgb},0.08)`,
            border:   `1px solid rgba(${cat.rgb},${hovered ? 0.4 : 0.15})`,
            display:  "flex",
            alignItems:     "center",
            justifyContent: "center",
            color:     cat.color,
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            transform: clicked
              ? "scale(0.7) rotate(-20deg)"
              : hovered
                ? "scale(1.18) rotate(-5deg)"
                : "scale(1) rotate(0deg)",
            boxShadow: clicked
              ? `0 0 40px rgba(${cat.rgb},1), 0 0 80px rgba(${cat.rgb},0.5)`
              : hovered
                ? `0 0 20px rgba(${cat.rgb},0.4), 0 0 40px rgba(${cat.rgb},0.15)`
                : "none",
            position:  "relative",
            zIndex:    1,
            flexShrink: 0,
            animation: clicked ? "iconBounce 0.5s cubic-bezier(0.34,1.56,0.64,1)" : "none",
            overflow:  "hidden",
          }}>
            {cat.icon}
          </div>

          {/* ── Text ── */}
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{
              color:         hovered || clicked ? "#fff" : "#888",
              fontSize:      isMobile ? 10 : 12,
              fontWeight:    700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              fontFamily:    "'DM Sans', sans-serif",
              transition:    "color 0.3s ease",
              marginBottom:  4,
              animation:     clicked ? "textPop 0.4s ease-out" : "none",
            }}>
              {cat.name}
            </div>
            <div style={{
              color:         hovered || clicked ? cat.color : "transparent",
              fontSize:      isMobile ? 8 : 9,
              fontWeight:    600,
              letterSpacing: "0.5px",
              fontFamily:    "'DM Sans', sans-serif",
              transition:    "color 0.3s ease",
              textShadow:    hovered || clicked ? `0 0 10px rgba(${cat.rgb},0.5)` : "none",
            }}>
              {cat.label}
            </div>
          </div>

          {/* ── Bottom glow bar ── */}
          <div style={{
            position:  "absolute", bottom: 0, left: "50%",
            transform: `translateX(-50%) scaleX(${hovered || clicked ? 1 : 0})`,
            width: "70%", height: 2,
            background:   `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
            borderRadius: 2,
            boxShadow:    `0 0 16px rgba(${cat.rgb},0.9)`,
            transition:   "transform 0.4s ease",
          }} />
        </div>
      </Link>
    </div>
  );
}

// ─── CategoryGrid ─────────────────────────────────────────────────────────────
export default function CategoryGrid() {
  // ✅ Safe to use false here — this component is loaded with ssr:false in CategoryGrid.tsx
  // so it never runs on the server. No hydration = no mismatch possible.
  const [isMobile, setIsMobile] = useState(false);

  const trackRef       = useRef<HTMLDivElement>(null);
  const currentXRef    = useRef(0);
  const trackWidthRef  = useRef(0);

  const isDragging      = useRef(false);
  const dragStartX      = useRef(0);
  const lastTouchX      = useRef(0);
  const lastTouchTime   = useRef(0);
  const velocityRef     = useRef(0);
  const rafRef          = useRef<number | null>(null);
  const isHorizDrag     = useRef(false);
  const touchStartY     = useRef(0);

  // ── Responsive ──────────────────────────────────────────────────────────────
  useEffect(() => {
    // ✅ FIX: runs only on client after hydration — safe to read window here
    const check = () => setIsMobile(window.innerWidth <= 480);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const cancelRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const wrap = useCallback((x: number) => {
    const w = trackWidthRef.current;
    if (w === 0) return x;
    return ((x % w) - w) % w;
  }, []);

  const setX = useCallback((x: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${x}px) translateZ(0)`;
    }
    currentXRef.current = x;
  }, []);

  const handOffToCSS = useCallback(() => {
    cancelRaf();
    const el = trackRef.current;
    if (!el) return;

    const w = trackWidthRef.current;
    if (w === 0) { el.style.animation = ""; return; }

    const x        = wrap(currentXRef.current);
    const progress = Math.abs(x) / w;
    const duration = 30;
    const delay    = -(progress * duration);

    el.style.transform = "";
    el.style.animation = `scrollLeft ${duration}s linear ${delay}s infinite`;
  }, [cancelRaf, wrap]);

  const handOffToJS = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    cancelRaf();

    if (trackWidthRef.current === 0 && el.scrollWidth > 0) {
      trackWidthRef.current = el.scrollWidth / 4;
    }

    const matrix = new DOMMatrix(window.getComputedStyle(el).transform);
    const x      = wrap(matrix.m41);

    el.style.animation = "none";
    setX(x);
  }, [cancelRaf, setX, wrap]);

  // ── Auto-scroll on mount ──────────────────────────────────────────────────
  useEffect(() => {
    let id1: number, id2: number;
    id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => {
        const el = trackRef.current;
        if (!el || el.scrollWidth === 0) return;
        trackWidthRef.current = el.scrollWidth / 4;
        el.style.animation = "scrollLeft 30s linear 0s infinite";
      });
    });
    return () => { cancelAnimationFrame(id1); cancelAnimationFrame(id2); cancelRaf(); };
  }, [cancelRaf]);

  // ── Touch handlers ────────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    lastTouchX.current    = touch.clientX;
    touchStartY.current   = touch.clientY;
    lastTouchTime.current = performance.now();
    velocityRef.current   = 0;
    isDragging.current    = false;
    isHorizDrag.current   = false;
    dragStartX.current    = touch.clientX;

    handOffToJS();
  }, [handOffToJS]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const dx    = touch.clientX - lastTouchX.current;
    const dy    = touch.clientY - touchStartY.current;

    if (!isHorizDrag.current && !isDragging.current) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(touch.clientX - dragStartX.current) > 5) {
        isHorizDrag.current = true;
        isDragging.current  = true;
      } else if (Math.abs(dy) > 10) {
        handOffToCSS();
        return;
      } else {
        return;
      }
    }

    if (!isHorizDrag.current) return;

    const now = performance.now();
    const dt  = Math.max(now - lastTouchTime.current, 1);

    velocityRef.current = velocityRef.current * 0.45 + (dx / dt) * 16 * 0.55;

    lastTouchX.current    = touch.clientX;
    lastTouchTime.current = now;

    setX(wrap(currentXRef.current + dx));
  }, [handOffToCSS, setX, wrap]);

  const handleTouchEnd = useCallback(() => {
    if (!isHorizDrag.current) {
      isDragging.current = false;
      return;
    }

    let velocity  = velocityRef.current;
    let x         = currentXRef.current;

    const glide = () => {
      velocity *= 0.92;
      x = wrap(x + velocity);
      setX(x);

      if (Math.abs(velocity) > 0.3) {
        rafRef.current = requestAnimationFrame(glide);
      } else {
        handOffToCSS();
        setTimeout(() => { isDragging.current = false; }, 50);
      }
    };

    rafRef.current = requestAnimationFrame(glide);
  }, [handOffToCSS, setX, wrap]);

  // ── Mouse hover pause ────────────────────────────────────────────────────────
  const handleMouseEnter = useCallback(() => {
    const el = trackRef.current;
    if (el) el.style.animationPlayState = "paused";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = trackRef.current;
    if (el) el.style.animationPlayState = "running";
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
          from { transform: translateX(0) translateZ(0); }
          to   { transform: translateX(-25%) translateZ(0); }
        }
        @keyframes float0 { 0%,100%{transform:translateY(0px)}   50%{transform:translateY(-9px)}  }
        @keyframes float1 { 0%,100%{transform:translateY(-5px)}  50%{transform:translateY(5px)}   }
        @keyframes float2 { 0%,100%{transform:translateY(-2px)}  50%{transform:translateY(-11px)} }
        @keyframes float3 { 0%,100%{transform:translateY(3px)}   50%{transform:translateY(-7px)}  }
        @keyframes float4 { 0%,100%{transform:translateY(-7px)}  50%{transform:translateY(3px)}   }
        @keyframes float5 { 0%,100%{transform:translateY(1px)}   50%{transform:translateY(-10px)} }

        @keyframes flashBurst {
          0%   { opacity: 1; transform: scale(1); }
          50%  { opacity: 0.8; transform: scale(1.4); }
          100% { opacity: 0; transform: scale(2); }
        }
        @keyframes shockwaveExpand {
          0%   { width: 20px; height: 20px; opacity: 1; border-width: 3px; }
          100% { width: 220px; height: 220px; opacity: 0; border-width: 1px; }
        }
        @keyframes particleFly {
          0%   { transform: translate(-50%,-50%) translate(0,0) scale(1); opacity: 1; }
          60%  { opacity: 0.8; transform: translate(-50%,-50%) translate(var(--tx),var(--ty)) scale(1.2); }
          100% { transform: translate(-50%,-50%) translate(calc(var(--tx)*1.5),calc(var(--ty)*1.5)) scale(0); opacity: 0; }
        }
        @keyframes iconBounce {
          0%   { transform: scale(0.7) rotate(-20deg); }
          40%  { transform: scale(1.45) rotate(12deg); }
          70%  { transform: scale(0.9) rotate(-6deg); }
          100% { transform: scale(1.18) rotate(-5deg); }
        }
        @keyframes textPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }

        .cat-track {
          display: flex;
          gap: 14px;
          width: max-content;
          will-change: transform;
          padding: 20px 0;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .cat-outer {
          position: relative;
          overflow: hidden;
          margin: 0 -1.5rem;
          touch-action: pan-y;
          cursor: grab;
          -webkit-user-select: none;
          user-select: none;
        }
        .cat-outer:active { cursor: grabbing; }
        .cat-fade-l {
          position: absolute; left: 0; top: 0; bottom: 0; width: 120px;
          background: linear-gradient(to right, #060606 0%, #060606 10%, rgba(6,6,6,0.85) 50%, transparent 100%);
          pointer-events: none; z-index: 3;
        }
        .cat-fade-r {
          position: absolute; right: 0; top: 0; bottom: 0; width: 120px;
          background: linear-gradient(to left, #060606 0%, #060606 10%, rgba(6,6,6,0.85) 50%, transparent 100%);
          pointer-events: none; z-index: 3;
        }
        .cat-inner { padding: 0 120px; }

        @media (max-width: 480px) {
          .cat-outer  { margin: 0 -1rem; }
          .cat-inner  { padding: 0 60px; }
          .cat-fade-l, .cat-fade-r { width: 60px; }
          .cat-track  { gap: 10px; padding: 16px 0; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          display:        "inline-flex", alignItems: "center", gap: 7,
          background:     "rgba(255,77,0,0.07)",
          border:         "1px solid rgba(255,77,0,0.22)",
          color:          "#ff6622",
          fontSize:       10, fontWeight: 700,
          padding:        "5px 14px", borderRadius: 50,
          letterSpacing:  "2px", textTransform: "uppercase",
          marginBottom:   14,
          fontFamily:     "'DM Sans', sans-serif",
          animation:      "badgePulse 2.5s ease infinite",
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "#ff4d00", display: "inline-block",
            animation: "floatDot 2s ease infinite",
          }} />
          Explore Topics
        </div>

        <h2 style={{
          fontSize:      "clamp(22px, 3.5vw, 30px)",
          fontWeight:    900, margin: "0 0 12px",
          fontFamily:    "'Playfair Display', Georgia, serif",
          letterSpacing: "-0.5px", lineHeight: 1.15,
          background:    "linear-gradient(90deg, #ffffff 0%, #ff4d00 40%, #ffaa55 60%, #ffffff 100%)",
          backgroundSize:"200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor:  "transparent",
          animation:     "catShimmer 4s linear infinite",
        }}>
          Browse by Category
        </h2>

        <div style={{
          height:     2,
          background: "linear-gradient(90deg, #ff4d00, rgba(255,77,0,0.1))",
          borderRadius: 2,
        }} />
      </div>

      {/* ── Carousel ── */}
      <div
        className="cat-outer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="cat-fade-l" />
        <div className="cat-fade-r" />
        <div className="cat-inner">
          <div ref={trackRef} className="cat-track">
            {loop.map((cat, i) => (
              <PillCard
                key={`${cat.slug}-${i}`}
                cat={cat}
                idx={i}
                isMobile={isMobile}
                isDragging={isDragging}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
