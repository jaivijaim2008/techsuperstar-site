"use client";
import Link from "next/link";
import { useState } from "react";

const categories = [
  { name: "Phones", slug: "phones", icon: "📱", color: "#ff4d00", glow: "rgba(255,77,0,0.3)" },
  { name: "Laptops", slug: "laptops", icon: "💻", color: "#0066ff", glow: "rgba(0,102,255,0.3)" },
  { name: "Tablets", slug: "tablets", icon: "📟", color: "#00cc66", glow: "rgba(0,204,102,0.3)" },
  { name: "Gaming", slug: "gaming", icon: "🎮", color: "#aa00ff", glow: "rgba(170,0,255,0.3)" },
  { name: "Reviews", slug: "reviews", icon: "⭐", color: "#ff8800", glow: "rgba(255,136,0,0.3)" },
  { name: "Accessories", slug: "accessories", icon: "🎧", color: "#00ccff", glow: "rgba(0,204,255,0.3)" },
];

function CategoryCard({ cat }: { cat: typeof categories[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/category/${cat.slug}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: hovered
            ? `linear-gradient(135deg, rgba(${cat.color === "#ff4d00" ? "255,77,0" : cat.color === "#0066ff" ? "0,102,255" : cat.color === "#00cc66" ? "0,204,102" : cat.color === "#aa00ff" ? "170,0,255" : cat.color === "#ff8800" ? "255,136,0" : "0,204,255"},0.12) 0%, #141414 100%)`
            : "#111111",
          border: `1px solid ${hovered ? cat.color : "rgba(255,255,255,0.06)"}`,
          borderRadius: "16px",
          padding: "28px 16px 24px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.35s ease",
          overflow: "hidden",
          boxShadow: hovered ? `0 8px 32px ${cat.glow}, 0 0 0 1px ${cat.color}22` : "none",
          transform: hovered ? "translateY(-6px) scale(1.03)" : "translateY(0) scale(1)",
        }}
      >
        {/* Hologram corner accents */}
        {hovered && (
          <>
            <div style={{
              position: "absolute", top: 0, left: 0,
              width: "20px", height: "20px",
              borderTop: `2px solid ${cat.color}`,
              borderLeft: `2px solid ${cat.color}`,
              borderRadius: "16px 0 0 0",
            }} />
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: "20px", height: "20px",
              borderTop: `2px solid ${cat.color}`,
              borderRight: `2px solid ${cat.color}`,
              borderRadius: "0 16px 0 0",
            }} />
            <div style={{
              position: "absolute", bottom: 0, left: 0,
              width: "20px", height: "20px",
              borderBottom: `2px solid ${cat.color}`,
              borderLeft: `2px solid ${cat.color}`,
              borderRadius: "0 0 0 16px",
            }} />
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              width: "20px", height: "20px",
              borderBottom: `2px solid ${cat.color}`,
              borderRight: `2px solid ${cat.color}`,
              borderRadius: "0 0 16px 0",
            }} />
          </>
        )}

        {/* Glow orb behind icon */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -60%)",
          width: "80px", height: "80px",
          borderRadius: "50%",
          background: cat.glow,
          filter: "blur(20px)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.35s ease",
          pointerEvents: "none",
        }} />

        {/* Icon */}
        <div style={{
          fontSize: "36px",
          marginBottom: "12px",
          transform: hovered ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.35s ease",
          filter: hovered ? `drop-shadow(0 0 8px ${cat.color})` : "none",
          position: "relative",
        }}>
          {cat.icon}
        </div>

        {/* Name */}
        <div style={{
          color: hovered ? cat.color : "#aaaaaa",
          fontSize: "13px",
          fontWeight: "700",
          letterSpacing: "1px",
          textTransform: "uppercase",
          transition: "color 0.35s ease",
          position: "relative",
        }}>
          {cat.name}
        </div>

        {/* Bottom line */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: `translateX(-50%) scaleX(${hovered ? 1 : 0})`,
          width: "60%", height: "2px",
          background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
          transition: "transform 0.35s ease",
          borderRadius: "2px",
        }} />
      </div>
    </Link>
  );
}

export default function CategoryGrid() {
  return (
    <div style={{ padding: "56px 0 0" }}>
      <style>{`
        @keyframes shimmer {
          0%{background-position:-200% center}
          100%{background-position:200% center}
        }
      `}</style>

      <div style={{ marginBottom: "28px" }}>
        <h2 style={{
          color: "#ffffff",
          fontSize: "22px",
          fontWeight: "800",
          margin: "0 0 6px",
          fontFamily: "'Georgia', serif",
          letterSpacing: "-0.5px",
        }}>
          Browse by{" "}
          <span style={{
            background: "linear-gradient(90deg, #ff4d00, #ff8800, #ff4d00)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 3s linear infinite",
          }}>
            Category
          </span>
        </h2>
        <div style={{
          width: "50px", height: "3px",
          background: "linear-gradient(90deg, #ff4d00, transparent)",
          borderRadius: "2px",
        }} />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "14px",
      }}>
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} cat={cat} />
        ))}
      </div>
    </div>
  );
}