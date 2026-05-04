"use client";
import Link from "next/link";

const categories = [
  { name: "Phones", slug: "phones", icon: "📱", color: "#ff4d00" },
  { name: "Laptops", slug: "laptops", icon: "💻", color: "#0066ff" },
  { name: "Tablets", slug: "tablets", icon: "📟", color: "#00aa44" },
  { name: "Gaming", slug: "gaming", icon: "🎮", color: "#aa00ff" },
  { name: "Reviews", slug: "reviews", icon: "⭐", color: "#ff6600" },
  { name: "Accessories", slug: "accessories", icon: "🎧", color: "#0099cc" },
];

export default function CategoryGrid() {
  return (
    <div style={{ padding: "48px 0 0" }}>
      <h2 style={{
        color: "#ffffff", fontSize: "20px", fontWeight: "700",
        margin: "0 0 20px", fontFamily: "'Georgia', serif",
        letterSpacing: "-0.3px",
      }}>
        Browse by Category
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "12px",
      }}>
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "#141414", border: "1px solid #1e1e1e",
                borderRadius: "10px", padding: "20px 16px",
                textAlign: "center", transition: "all 0.2s", cursor: "pointer",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = cat.color;
                el.style.background = "#1a1a1a";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#1e1e1e";
                el.style.background = "#141414";
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{cat.icon}</div>
              <div style={{
                color: "#dddddd", fontSize: "13px", fontWeight: "600",
                letterSpacing: "0.3px",
              }}>
                {cat.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}