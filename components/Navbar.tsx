"use client";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      <style>{`
        @keyframes logoPulse {
          0%,100%{box-shadow:0 0 8px rgba(255,77,0,0.4),0 0 16px rgba(255,77,0,0.2)}
          50%{box-shadow:0 0 16px rgba(255,77,0,0.8),0 0 32px rgba(255,77,0,0.4)}
        }
        @keyframes navGlow {
          0%,100%{border-color:rgba(255,77,0,0.1)}
          50%{border-color:rgba(255,77,0,0.3)}
        }
        @keyframes slideDown {
          from{opacity:0;transform:translateY(-10px)}
          to{opacity:1;transform:translateY(0)}
        }
        .nav-link {
          padding: 7px 14px;
          color: #888;
          text-decoration: none;
          font-size: 13px;
          font-family: 'Arial', sans-serif;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.25s ease;
          position: relative;
          letter-spacing: 0.3px;
          border: 1px solid transparent;
        }
        .nav-link:hover {
          color: #ff4d00 !important;
          background: rgba(255,77,0,0.08) !important;
          border-color: rgba(255,77,0,0.2) !important;
          box-shadow: 0 0 12px rgba(255,77,0,0.15);
        }
        .mobile-nav-link {
          padding: 12px 16px;
          color: #aaa;
          text-decoration: none;
          font-size: 14px;
          border-radius: 10px;
          font-family: 'Arial', sans-serif;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          display: block;
        }
        .mobile-nav-link:hover {
          color: #ff4d00;
          background: rgba(255,77,0,0.08);
          border-color: rgba(255,77,0,0.2);
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-btn { display: none !important; }
        }
      `}</style>

      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled
          ? "rgba(10,10,10,0.85)"
          : "#0a0a0a",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: "1px solid rgba(255,77,0,0.15)",
        transition: "all 0.3s ease",
        animation: "navGlow 3s ease-in-out infinite",
      }}>
        {/* Top accent line */}
        <div style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent, #ff4d00, #ff8800, #ff4d00, transparent)",
          backgroundSize: "200% auto",
        }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", height: "64px",
          }}>

            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #ff4d00",
                animation: "logoPulse 2.5s ease-in-out infinite",
                flexShrink: 0,
              }}>
                <img src="/favicon.jpg" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.5px", fontFamily: "'Georgia', serif" }}>
                Tech<span style={{
                  color: "#ff4d00",
                  filter: "drop-shadow(0 0 8px rgba(255,77,0,0.5))",
                }}>SuperStar</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }} className="desktop-nav">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug === "all" ? "/articles" : `/category/${cat.slug}`}
                  className="nav-link"
                >
                  {cat.name}
                </Link>
              ))}
              <div style={{ marginLeft: "8px" }}>
                <SearchBar />
              </div>
            </div>

            {/* Mobile buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="mobile-btn">
              <SearchBar />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: menuOpen ? "rgba(255,77,0,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${menuOpen ? "rgba(255,77,0,0.4)" : "rgba(255,255,255,0.1)"}`,
                  color: menuOpen ? "#ff4d00" : "#fff",
                  padding: "8px 12px", borderRadius: "8px",
                  cursor: "pointer", fontSize: "16px",
                  transition: "all 0.2s ease",
                }}
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>

          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div style={{
              paddingBottom: "16px",
              display: "flex", flexDirection: "column", gap: "4px",
              animation: "slideDown 0.2s ease forwards",
              borderTop: "1px solid rgba(255,77,0,0.1)",
              paddingTop: "12px",
            }}>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug === "all" ? "/articles" : `/category/${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="mobile-nav-link"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}