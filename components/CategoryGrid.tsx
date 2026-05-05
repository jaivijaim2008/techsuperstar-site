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

function CategoryCard({ cat }: { cat: typeof categories[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ opacity: 1 }}>
      <Link href={`/category/${cat.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: "relative",
            background: hovered
              ? `linear-gradient(135deg, rgba(${cat.rgb},0.1) 0%, #0f0f0f 100%)`
              : "linear-gradient(135deg, #111111, #0d0d0d)",
            border: `1px solid ${hovered ? cat.color : "rgba(255,255,255,0.05)"}`,
            borderRadius: "20px",
            padding: "32px 16px 28px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            overflow: "hidden",
            boxShadow: hovered
              ? `0 16px 48px rgba(${cat.rgb},0.2), 0 0 0 1px rgba(${cat.rgb},0.15), inset 0 1px 0 rgba(255,255,255,0.05)`
              : "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
            transform: hovered ? "translateY(-8px) scale(1.04)" : "translateY(0) scale(1)",
          }}
        >
          {/* Corner accents */}
          {["tl","tr","bl","br"].map((pos) => (
            <div key={pos} style={{
              position: "absolute",
              top: pos.startsWith("t") ? 0 : "auto",
              bottom: pos.startsWith("b") ? 0 : "auto",
              left: pos.endsWith("l") ? 0 : "auto",
              right: pos.endsWith("r") ? 0 : "auto",
              width: 18, height: 18,
              borderTop: pos.startsWith("t") ? `2px solid ${cat.color}` : "none",
              borderBottom: pos.startsWith("b") ? `2px solid ${cat.color}` : "none",
              borderLeft: pos.endsWith("l") ? `2px solid ${cat.color}` : "none",
              borderRight: pos.endsWith("r") ? `2px solid ${cat.color}` : "none",
              borderRadius: pos === "tl" ? "18px 0 0 0" : pos === "tr" ? "0 18px 0 0" : pos === "bl" ? "0 0 0 18px" : "0 0 18px 0",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }} />
          ))}

          {/* Glow orb */}
          <div style={{
            position: "absolute", top: "40%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 100, height: 100,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${cat.rgb},0.25), transparent 70%)`,
            filter: "blur(16px)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            pointerEvents: "none",
          }} />

          {/* Scan line shimmer */}
          <div style={{
            position: "absolute",
            top: 0,
            left: hovered ? "150%" : "-100%",
            width: "60%", height: "100%",
            background: `linear-gradient(90deg, transparent, rgba(${cat.rgb},0.06), transparent)`,
            transform: "skewX(-20deg)",
            transition: "left 0.6s ease",
            pointerEvents: "none",
          }} />

          {/* Icon */}
          <div style={{
            fontSize: 40,
            marginBottom: 14,
            display: "block",
            transform: hovered ? "scale(1.25) translateY(-4px)" : "scale(1) translateY(0)",
            transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            filter: hovered ? `drop-shadow(0 0 12px rgba(${cat.rgb},0.8))` : "none",
            position: "relative",
            lineHeight: 1,
          }}>
            {cat.icon}
          </div>

          {/* Name */}
          <div style={{
            color: hovered ? cat.color : "#777",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
            transition: "color 0.35s ease",
            position: "relative",
          }}>
            {cat.name}
          </div>

          {/* Arrow */}
          <div style={{
            marginTop: 10,
            fontSize: 10,
            color: cat.color,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
            transition: "all 0.3s ease",
            fontWeight: 700,
            letterSpacing: 1,
          }}>
            Explore →
          </div>

          {/* Bottom bar */}
          <div style={{
            position: "absolute", bottom: 0, left: "50%",
            transform: `translateX(-50%) scaleX(${hovered ? 1 : 0})`,
            width: "65%", height: 2,
            background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
            transition: "transform 0.4s ease",
            borderRadius: 2,
          }} />
        </div>
      </Link>
    </div>
  );
}

export default function CategoryGrid() {
  return (
    <div style={{ padding: "32px 0 0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;600;700&display=swap');

        @keyframes categoryShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes lineGrow {
          from { width: 0; }
          to   { width: 50px; }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,77,0,0.25); }
          50%     { box-shadow: 0 0 0 6px rgba(255,77,0,0); }
        }
      `}</style>

      {/* Section header */}
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
          }} />
          Explore Topics
        </div>

        <h2 style={{
          fontSize: "clamp(22px, 3.5vw, 30px)",
          fontWeight: 900,
          margin: "0 0 12px",
          fontFamily: "'Playfair Display', Georgia, serif",
          letterSpacing: "-0.5px",
          lineHeight: 1.15,
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

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 14,
      }}>
        {categories.map((cat, i) => (
          <CategoryCard key={cat.slug} cat={cat} />
        ))}
      </div>
    </div>
  );
}