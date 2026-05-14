"use client";
import Link from "next/link";
import SearchBar from "./SearchBar";
import TiltCard from "./TiltCard";
import { useState, useEffect, useRef } from "react";
import {
  MdPhoneAndroid,
  MdLaptop,
  MdTablet,
  MdSportsEsports,
  MdStar,
  MdHeadphones,
  MdArticle,
} from "react-icons/md";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const handleScroll = () => {
      if (window.scrollY > 20) nav.classList.add("nav-scrolled");
      else nav.classList.remove("nav-scrolled");
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { name: "All Articles", filter: null,          icon: MdArticle       },
    { name: "Phones",       filter: "phones",      icon: MdPhoneAndroid  },
    { name: "Laptops",      filter: "laptops",     icon: MdLaptop        },
    { name: "Tablets",      filter: "tablets",     icon: MdTablet        },
    { name: "Gaming",       filter: "gaming",      icon: MdSportsEsports },
    { name: "Comparisons",  filter: "comparisons", icon: MdStar          },
    { name: "Accessories",  filter: "accessories", icon: MdHeadphones    },
  ];

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes logoPulse {
          0%,100% { box-shadow: 0 0 8px rgba(255,77,0,0.4), 0 0 16px rgba(255,77,0,0.2); }
          50%      { box-shadow: 0 0 20px rgba(255,77,0,0.9), 0 0 40px rgba(255,77,0,0.4); }
        }
        @keyframes topBarShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes navScan {
          from { left: -60%; }
          to   { left: 110%; }
        }
        @keyframes dotPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.6); }
        }

        .site-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(6,6,6,0.98);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,77,0,0.1);
          transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
          box-shadow: none;
        }
        .site-nav.nav-scrolled {
          background: rgba(6,6,6,0.92);
          border-bottom-color: rgba(255,77,0,0.2);
          box-shadow: 0 4px 32px rgba(0,0,0,0.6);
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 13px;
          color: #666;
          text-decoration: none;
          font-size: 11px;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.25s ease;
          border: 1px solid transparent;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .nav-link:hover {
          color: #ff4d00;
          background: rgba(255,77,0,0.08);
          border-color: rgba(255,77,0,0.25);
          box-shadow: 0 0 16px rgba(255,77,0,0.12), inset 0 1px 0 rgba(255,255,255,0.04);
          transform: translateY(-1px);
        }
        .nav-link.active {
          color: #ff4d00;
          background: rgba(255,77,0,0.1);
          border-color: rgba(255,77,0,0.3);
        }

        .mobile-nav-link {
          padding: 13px 16px;
          color: #666;
          text-decoration: none;
          font-size: 13px;
          border-radius: 10px;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          font-weight: 600;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: 0.5px;
        }
        .mobile-nav-link:hover {
          color: #ff4d00;
          background: rgba(255,77,0,0.08);
          border-color: rgba(255,77,0,0.2);
          transform: translateX(4px);
        }

        .hamburger-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #888;
          padding: 9px 13px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hamburger-btn:hover, .hamburger-btn.open {
          background: rgba(255,77,0,0.1);
          border-color: rgba(255,77,0,0.35);
          color: #ff4d00;
          box-shadow: 0 0 16px rgba(255,77,0,0.15);
        }

        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-btn  { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-btn { display: none !important; }
        }
      `}</style>

      <nav ref={navRef} className="site-nav">
        {/* Animated top accent line */}
        <div style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, #ff4d00 30%, #ffaa44 50%, #ff4d00 70%, transparent 100%)",
          backgroundSize: "200% auto",
          animation: "topBarShimmer 3s linear infinite",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0,
            width: "60px", height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            animation: "navScan 2.5s ease-in-out infinite",
          }} />
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>

            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
              <TiltCard>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    overflow: "hidden", border: "2px solid #ff4d00",
                    animation: "logoPulse 2.5s ease-in-out infinite",
                    flexShrink: 0,
                  }}>
                    <img src="/favicon.jpg" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: "19px", fontWeight: "900", color: "#ffffff",
                      letterSpacing: "-0.5px",
                      fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                      lineHeight: 1.1,
                    }}>
                      Tech<span style={{ color: "#ff4d00", filter: "drop-shadow(0 0 10px rgba(255,77,0,0.6))" }}>SuperStar</span>
                    </div>
                    <div style={{
                      fontSize: "8px", color: "#444",
                      letterSpacing: "2.5px", textTransform: "uppercase",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 600,
                    }}>
                      <span style={{
                        display: "inline-block", width: 5, height: 5,
                        borderRadius: "50%", background: "#ff4d00",
                        marginRight: 5, verticalAlign: "middle",
                        animation: "dotPulse 2s ease-in-out infinite",
                      }} />
                      Tamil Tech Reviews
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Link>

            {/* Desktop Nav */}
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }} className="desktop-nav">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const href = cat.filter ? `/?filter=${cat.filter}` : "/";
                return (
                  <Link
                    key={cat.name}
                    href={href}
                    className={`nav-link${activeLink === (cat.filter || "all") ? " active" : ""}`}
                    onClick={() => setActiveLink(cat.filter || "all")}
                  >
                    <Icon size={13} />
                    {cat.name}
                  </Link>
                );
              })}
              <div style={{ marginLeft: "10px" }}>
                <SearchBar />
              </div>
            </div>

            {/* Mobile buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="mobile-btn">
              <SearchBar />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`hamburger-btn${menuOpen ? " open" : ""}`}
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div style={{
              paddingBottom: "16px",
              display: "flex", flexDirection: "column", gap: "3px",
              animation: "slideDown 0.25s ease forwards",
              borderTop: "1px solid rgba(255,77,0,0.1)",
              paddingTop: "12px",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", left: 0, right: 0, top: 0, bottom: 0,
                backgroundImage: "linear-gradient(rgba(255,77,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.03) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
                pointerEvents: "none", zIndex: 0,
              }} />
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                const href = cat.filter ? `/?filter=${cat.filter}` : "/";
                return (
                  <Link
                    key={cat.name}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="mobile-nav-link"
                    style={{ animationDelay: `${i * 0.04}s`, position: "relative", zIndex: 1 }}
                  >
                    <Icon size={16} />
                    {cat.name}
                    <span style={{ marginLeft: "auto", color: "#333", fontSize: 12 }}>→</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
