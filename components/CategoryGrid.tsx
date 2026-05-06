"use client";
import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    name: "Phones",
    slug: "phones",
    color: "#ff4d00",
    rgb: "255,77,0",
    label: "Smartphones & More",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <line x1="12" y1="18" x2="12" y2="18.01"/>
      </svg>
    ),
  },
  {
    name: "Laptops",
    slug: "laptops",
    color: "#3b82f6",
    rgb: "59,130,246",
    label: "Notebooks & PCs",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="14" rx="2"/>
        <line x1="1" y1="20" x2="23" y2="20"/>
        <line x1="9" y1="20" x2="15" y2="20"/>
      </svg>
    ),
  },
  {
    name: "Tablets",
    slug: "tablets",
    color: "#10b981",
    rgb: "16,185,129",
    label: "Slates & iPads",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="12" y1="18" x2="12" y2="18.01"/>
      </svg>
    ),
  },
  {
    name: "Gaming",
    slug: "gaming",
    color: "#a855f7",
    rgb: "168,85,247",
    label: "Console & PC",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="12" x2="10" y2="12"/>
        <line x1="8" y1="10" x2="8" y2="14"/>
        <circle cx="15" cy="11" r="1" fill="currentColor" stroke="none"/>
        <circle cx="17" cy="13" r="1" fill="currentColor" stroke="none"/>
        <path d="M6 8h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"/>
        <path d="M6 8l-2 8"/>
        <path d="M18 8l2 8"/>
      </svg>
    ),
  },
  {
    name: "Reviews",
    slug: "reviews",
    color: "#f59e0b",
    rgb: "245,158,11",
    label: "Honest Takes",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    name: "Accessories",
    slug: "accessories",
    color: "#06b6d4",
    rgb: "6,182,212",
    label: "Gear & Gadgets",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    ),
  },
];

const loop = [...categories, ...categories, ...categories, ...categories];

function PillCard({ cat, idx }: { cat: typeof categories[0]; idx: number }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [ripples, setRipples] = useState<{ id: number }[]>([]);

  const handleClick = () => {
    const id = Date.now();
    setClicked(true);
    setRipples(prev => [...prev, { id }]);
    setTimeout(() => setClicked(false), 400);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
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
        onMouseDown={handleClick}
        onTouchStart={handleClick}
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
          border: `1px solid ${hovered ? `rgba(${cat.rgb},0.5)` : "rgba(255,255,255,0.05)"}`,
          background: hovered
            ? `linear-gradient(160deg, rgba(${cat.rgb},0.12), rgba(${cat.rgb},0.04) 60%, #0a0a0a)`
            : "linear-gradient(160deg, #111, #0a0a0a)",
          boxShadow: hovered
            ? `0 0 0 1px rgba(${cat.rgb},0.2), 0 20px 50px rgba(${cat.rgb},0.2), inset 0 1px 0 rgba(255,255,255,0.05)`
            : "0 2px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          animation: hovered
            ? "none"
            : `${floatAnim} ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
          transform: hovered
            ? "translateY(-10px) scale(1.05)"
            : clicked
              ? "scale(0.94)"
              : "scale(1)",
          transition: "border 0.3s ease, background 0.3s ease, box-shadow 0.3s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}>

          {/* Ripple effects on click */}
          {ripples.map(r => (
            <span key={r.id} style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: 10, height: 10,
              borderRadius: "50%",
              background: `rgba(${cat.rgb}, 0.35)`,
              transform: "translate(-50%, -50%)",
              animation: "rippleOut 0.7s ease-out forwards",
              pointerEvents: "none",
              zIndex: 10,
            }} />
          ))}

          {/* Ambient glow bg */}
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 50% 30%, rgba(${cat.rgb},${hovered ? 0.15 : 0}), transparent 70%)`,
            transition: "all 0.4s ease",
            pointerEvents: "none",
          }} />

          {/* Top highlight line */}
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
            background: `linear-gradient(90deg, transparent, rgba(${cat.rgb},0.8), transparent)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }} />

          {/* Scan shimmer */}
          <div style={{
            position: "absolute", top: 0,
            left: hovered ? "120%" : "-80%",
            width: "50%", height: "100%",
            background: `linear-gradient(90deg, transparent, rgba(${cat.rgb},0.06), transparent)`,
            transform: "skewX(-15deg)",
            transition: "left 0.7s ease",
            pointerEvents: "none",
          }} />

          {/* Icon box */}
          <div style={{
            width: 60, height: 60,
            borderRadius: 16,
            background: hovered
              ? `linear-gradient(135deg, rgba(${cat.rgb},0.25), rgba(${cat.rgb},0.08))`
              : `rgba(${cat.rgb},0.08)`,
            border: `1px solid rgba(${cat.rgb},${hovered ? 0.4 : 0.15})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: cat.color,
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            transform: clicked
              ? "scale(0.85) rotate(-8deg)"
              : hovered
                ? "scale(1.15) rotate(-4deg)"
                : "scale(1) rotate(0deg)",
            boxShadow: clicked
              ? `0 0 30px rgba(${cat.rgb},0.7), 0 0 60px rgba(${cat.rgb},0.3)`
              : hovered
                ? `0 0 20px rgba(${cat.rgb},0.4), 0 0 40px rgba(${cat.rgb},0.15)`
                : "none",
            position: "relative",
            zIndex: 1,
            flexShrink: 0,
            animation: clicked ? "iconPop 0.35s cubic-bezier(0.34,1.56,0.64,1)" : "none",
            overflow: "hidden",
          }}>
            {/* Icon ripple rings on click */}
            {ripples.map(r => (
              <span key={r.id} style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: 8, height: 8,
                borderRadius: "50%",
                border: `2px solid rgba(${cat.rgb},0.8)`,
                transform: "translate(-50%, -50%)",
                animation: "iconRipple 0.6s ease-out forwards",
                pointerEvents: "none",
              }} />
            ))}
            {cat.icon}
          </div>

          {/* Name */}
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{
              color: hovered ? "#fff" : "#888",
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
              color: hovered ? cat.color : "transparent",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.5px",
              fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.3s ease",
              textShadow: hovered ? `0 0 10px rgba(${cat.rgb},0.5)` : "none",
            }}>
              {cat.label}
            </div>
          </div>

          {/* Bottom glow bar */}
          <div style={{
            position: "absolute", bottom: 0, left: "50%",
            transform: `translateX(-50%) scaleX(${hovered ? 1 : 0})`,
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
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float0 { 0%,100% { transform: translateY(0px);   } 50% { transform: translateY(-9px);  } }
        @keyframes float1 { 0%,100% { transform: translateY(-5px);  } 50% { transform: translateY(5px);   } }
        @keyframes float2 { 0%,100% { transform: translateY(-2px);  } 50% { transform: translateY(-11px); } }
        @keyframes float3 { 0%,100% { transform: translateY(3px);   } 50% { transform: translateY(-7px);  } }
        @keyframes float4 { 0%,100% { transform: translateY(-7px);  } 50% { transform: translateY(3px);   } }
        @keyframes float5 { 0%,100% { transform: translateY(1px);   } 50% { transform: translateY(-10px); } }
        @keyframes rippleOut {
          0%   { width: 10px; height: 10px; opacity: 0.6; }
          100% { width: 180px; height: 180px; opacity: 0; }
        }
        @keyframes iconRipple {
          0%   { width: 8px; height: 8px; opacity: 1; }
          100% { width: 90px; height: 90px; opacity: 0; }
        }
        @keyframes iconPop {
          0%   { transform: scale(0.85) rotate(-8deg); }
          60%  { transform: scale(1.25) rotate(6deg);  }
          100% { transform: scale(1.15) rotate(-4deg); }
        }
        .cat-track {
          display: flex;
          gap: 14px;
          width: max-content;
          animation: scrollLeft 30s linear infinite;
          will-change: transform;
          padding: 20px 0;
        }
        .cat-track.paused { animation-play-state: paused; }
        .cat-outer {
          position: relative;
          overflow: hidden;
          margin: 0 -1.5rem;
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
      >
        <div className="cat-fade-l" />
        <div className="cat-fade-r" />
        <div className="cat-inner">
          <div className={`cat-track${paused ? " paused" : ""}`}>
            {loop.map((cat, i) => (
              <PillCard key={`${cat.slug}-${i}`} cat={cat} idx={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}