"use client";
import Link from "next/link";
import { useState } from "react";

const categories = [
  { name: "Phones",      slug: "phones",      icon: "📱", color: "#ff4d00", rgb: "255,77,0" },
  { name: "Laptops",     slug: "laptops",     icon: "💻", color: "#0066ff", rgb: "0,102,255" },
  { name: "Tablets",     slug: "tablets",     icon: "📟", color: "#00cc66", rgb: "0,204,102" },
  { name: "Gaming",      slug: "gaming",      icon: "🎮", color: "#aa00ff", rgb: "170,0,255" },
  { name: "Reviews",     slug: "reviews",     icon: "⭐", color: "#ff8800", rgb: "255,136,0" },
  { name: "Accessories", slug: "accessories", icon: "🎧", color: "#00ccff", rgb: "0,204,255" },
];

// Duplicate for seamless loop
const tickerItems = [...categories, ...categories, ...categories];

function CategoryCard({ cat }: { cat: typeof categories[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/category/${cat.slug}`} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 160,
          position: "relative",
          background: hovered
            ? `linear-gradient(135deg, rgba(${cat.rgb},0.12) 0%, #0f0f0f 100%)`
            : "linear-gradient(135deg, #111111, #0d0d0d)",
          border: `1px solid ${hovered ? cat.color : "rgba(255,255,255,0.06)"}`,
          borderRadius: "20px",
          padding: "36px 16px 30px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          overflow: "hidden",
          boxShadow: hovered
            ? `0 20px 56px rgba(${cat.rgb},0.25), 0 0 0 1px rgba(${cat.rgb},0.15), inset 0 1px 0 rgba(255,255,255,0.06)`
            : "0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
          transform: hovered ? "translateY(-10px) scale(1.04)" : "translateY(0) scale(1)",
        }}
      >
        {/* Corner accents */}
        {(["tl","tr","bl","br"] as const).map((pos) => (
          <div key={pos} style={{
            position: "absolute",
            top: pos.startsWith("t") ? 0 : "auto",
            bottom: pos.startsWith("b") ? 0 : "auto",
            left: pos.endsWith("l") ? 0 : "auto",
            right: pos.endsWith("r") ? 0 : "auto",
            width: 20, height: 20,
            borderTop: pos.startsWith("t") ? `2px solid ${cat.color}` : "none",
            borderBottom: pos.startsWith("b") ? `2px solid ${cat.color}` : "none",
            borderLeft: pos.endsWith("l") ? `2px solid ${cat.color}` : "none",
            borderRight: pos.endsWith("r") ? `2px solid ${cat.color}` : "none",
            borderRadius:
              pos === "tl" ? "18px 0 0 0" :
              pos === "tr" ? "0 18px 0 0" :
              pos === "bl" ? "0 0 0 18px" : "0 0 18px 0",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }} />
        ))}

        {/* Hologram grid lines */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(${cat.rgb},0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(${cat.rgb},0.04) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
          borderRadius: "20px",
        }} />

        {/* Glow orb */}
        <div style={{
          position: "absolute", top: "40%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 120, height: 120, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${cat.rgb},0.3), transparent 70%)`,
          filter: "blur(20px)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }} />

        {/* Scan line shimmer */}
        <div style={{
          position: "absolute", top: 0,
          left: hovered ? "150%" : "-100%",
          width: "60%", height: "100%",
          background: `linear-gradient(90deg, transparent, rgba(${cat.rgb},0.08), transparent)`,
          transform: "skewX(-20deg)",
          transition: "left 0.65s ease",
          pointerEvents: "none",
        }} />

        {/* Top shimmer line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${cat.rgb},0.6), transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }} />

        {/* Icon */}
        <div style={{
          fontSize: 44, marginBottom: 16, display: "block",
          transform: hovered ? "scale(1.3) translateY(-4px)" : "scale(1) translateY(0)",
          transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          filter: hovered
            ? `drop-shadow(0 0 14px rgba(${cat.rgb},0.9)) drop-shadow(0 0 28px rgba(${cat.rgb},0.4))`
            : "none",
          position: "relative", lineHeight: 1,
        }}>
          {cat.icon}
        </div>

        {/* Name */}
        <div style={{
          color: hovered ? cat.color : "#666",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "2.5px", textTransform: "uppercase",
          fontFamily: "'DM Sans', sans-serif",
          transition: "color 0.35s ease", position: "relative",
          textShadow: hovered ? `0 0 12px rgba(${cat.rgb},0.5)` : "none",
        }}>
          {cat.name}
        </div>

        {/* Explore arrow */}
        <div style={{
          marginTop: 10, fontSize: 10, color: cat.color,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.3s ease",
          fontWeight: 700, letterSpacing: 1.5,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Explore →
        </div>

        {/* Bottom bar */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: `translateX(-50%) scaleX(${hovered ? 1 : 0})`,
          width: "70%", height: 2,
          background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
          transition: "transform 0.4s ease",
          borderRadius: 2,
          boxShadow: `0 0 8px rgba(${cat.rgb},0.6)`,
        }} />
      </div>
    </Link>
  );
}

export default function CategoryGrid() {
  return (
    <div style={{ padding: "32px 0 0", position: "relative", zIndex: 1 }}>
      <style>{`
        @keyframes categoryShimmer {
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
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .ticker-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: ticker 18s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        .ticker-fade-left {
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 80px;
          background: linear-gradient(90deg, #060606, transparent);
          pointer-events: none;
          z-index: 2;
        }
        .ticker-fade-right {
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 80px;
          background: linear-gradient(270deg, #060606, transparent);
          pointer-events: none;
          z-index: 2;
        }
      `}</style>

      {/* Section header */}
      <div style={{ marginBottom: 40 }}>
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
          animation: "categoryShimmer 4s linear infinite",
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
      <div style={{ position: "relative", overflow: "hidden", paddingBottom: 12 }}>
        <div className="ticker-fade-left" />
        <div className="ticker-fade-right" />
        <div className="ticker-track">
          {tickerItems.map((cat, i) => (
            <CategoryCard key={`${cat.slug}-${i}`} cat={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}