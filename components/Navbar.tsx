"use client";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const categories = [
    { name: "All Articles", slug: "all" },
    { name: "Phones", slug: "phones" },
    { name: "Laptops", slug: "laptops" },
    { name: "Tablets", slug: "tablets" },
    { name: "Gaming", slug: "gaming" },
    { name: "Reviews", slug: "reviews" },
    { name: "Accessories", slug: "accessories" },
  ];

  return (
    <nav style={{
      background: "#0f0f0f",
      borderBottom: "1px solid #1e1e1e",
      position: "sticky",
      top: 0,
      zIndex: 100,
      fontFamily: "'Georgia', serif",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              overflow: "hidden", border: "2px solid #ff4d00",
            }}>
              <img src="/favicon.jpg" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{
              fontSize: "20px", fontWeight: "700", color: "#ffffff",
              letterSpacing: "-0.5px",
            }}>
              Tech<span style={{ color: "#ff4d00" }}>SuperStar</span>
            </span>
          </Link>

          {/* Desktop Nav + Search */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="desktop-nav">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug === "all" ? "/articles" : `/category/${cat.slug}`}
                style={{
                  padding: "6px 14px",
                  color: "#aaaaaa",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontFamily: "'Arial', sans-serif",
                  fontWeight: "500",
                  borderRadius: "6px",
                  transition: "all 0.2s",
                  letterSpacing: "0.3px",
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.color = "#ffffff";
                  (e.target as HTMLElement).style.background = "#1a1a1a";
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.color = "#aaaaaa";
                  (e.target as HTMLElement).style.background = "transparent";
                }}
              >
                {cat.name}
              </Link>
            ))}

            {/* 👇 Search bar added here — right after nav links */}
            <SearchBar />
          </div>

          {/* Mobile: Search + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="mobile-btn">
            <SearchBar />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none", border: "1px solid #333", color: "#fff",
                padding: "6px 10px", borderRadius: "6px", cursor: "pointer",
              }}
            >
              ☰
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            paddingBottom: "1rem",
            display: "flex", flexDirection: "column", gap: "4px",
          }}>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug === "all" ? "/articles" : `/category/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "10px 12px", color: "#cccccc",
                  textDecoration: "none", fontSize: "14px",
                  borderRadius: "6px", fontFamily: "'Arial', sans-serif",
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-btn { display: none !important; }
        }
      `}</style>
    </nav>
  );
}