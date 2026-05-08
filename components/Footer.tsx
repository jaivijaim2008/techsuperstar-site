"use client";
import Link from "next/link";
import { useState } from "react";
import { FaYoutube, FaInstagram, FaXTwitter } from "react-icons/fa6";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.NEXT_PUBLIC_BREVO_API_KEY!,
        },
        body: JSON.stringify({ email, listIds: [3], updateEnabled: true }),
      });
      if (res.ok || res.status === 204) { setStatus("success"); setEmail(""); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  if (status === "success") {
    return (
      <div style={{
        background: "linear-gradient(135deg, #0f2e1a, #0a1f10)",
        border: "1px solid rgba(74,222,128,0.3)",
        borderRadius: "12px", padding: "14px 16px",
        color: "#4ade80", fontSize: "13px",
        display: "flex", alignItems: "center", gap: "8px",
        boxShadow: "0 0 20px rgba(74,222,128,0.1)",
      }}>
        ✅ Subscribed! You&apos;ll get notified on new posts.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          id="email-input"
          name="email"
          autoComplete="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          disabled={status === "loading"}
          className="footer-email-input"
        />
        <button
          onClick={handleSubmit}
          disabled={status === "loading"}
          className="footer-subscribe-btn"
        >
          {status === "loading" ? "Subscribing..." : "🔔 Subscribe for Free"}
        </button>
      </div>
      {status === "error" && (
        <p style={{ color: "#f87171", fontSize: "12px", marginTop: "8px", fontFamily: "var(--font-dm-sans), sans-serif" }}>
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}

export default function Footer() {
  const quickLinks = [
    { name: "Home",         href: "/" },
    { name: "All Articles", href: "/articles" },
    { name: "About",        href: "/about" },
    { name: "Contact",      href: "/contact" },
  ];

  const socials = [
    { href: "https://www.youtube.com/@TechSuperStarOfficial", icon: <FaYoutube size={18} />,  color: "#FF0000", rgb: "255,0,0" },
    { href: "https://www.instagram.com/techsuperstarofficial/", icon: <FaInstagram size={18} />, color: "#e1306c", rgb: "225,48,108" },
    { href: "https://x.com/Tech_SuperStar", icon: <FaXTwitter size={18} />,  color: "#ffffff", rgb: "255,255,255" },
  ];

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes footerShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes footerScan {
          from { left: -60%; }
          to   { left: 110%; }
        }
        @keyframes greenPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
          50%      { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
        }
        @keyframes dotBlink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }

        .footer-email-input {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 14px;
          color: #fff;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          transition: all 0.25s ease;
        }
        .footer-email-input::placeholder { color: #555; }
        .footer-email-input:focus {
          border-color: rgba(255,77,0,0.5);
          box-shadow: 0 0 16px rgba(255,77,0,0.1);
          background: rgba(255,77,0,0.04);
        }

        .footer-subscribe-btn {
          width: 100%;
          background: linear-gradient(135deg, #ff4d00, #ff7300, #ff9500, #ff7300, #ff4d00);
          background-size: 200% auto;
          border: none;
          border-radius: 10px;
          padding: 12px;
          color: #fff;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(255,77,0,0.3);
          transition: all 0.3s ease;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          letter-spacing: 0.5px;
        }
        .footer-subscribe-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .footer-subscribe-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(255,77,0,0.5);
        }

        .footer-quick-link {
          color: #555;
          text-decoration: none;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid transparent;
          transition: all 0.25s ease;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
        }
        .footer-quick-link:hover {
          color: #ff4d00;
          background: rgba(255,77,0,0.07);
          border-color: rgba(255,77,0,0.18);
          transform: translateX(4px);
        }

        .footer-bottom-link {
          color: #444;
          font-size: 12px;
          text-decoration: none;
          transition: color 0.2s ease;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
        }
        .footer-bottom-link:hover { color: #ff4d00; }

        .social-btn {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .social-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.06), transparent);
          border-radius: 12px;
        }
        .social-btn:hover {
          transform: translateY(-4px) scale(1.08);
        }

        /* ── Layout ── */
        .footer-header-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 36px;
          border-bottom: 1px solid rgba(255,77,0,0.08);
          margin-bottom: 40px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-bottom: 44px;
        }

        .footer-quick-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .footer-bottom-row {
          border-top: 1px solid rgba(255,77,0,0.08);
          padding-top: 22px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        /* ── Tablet ── */
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 28px 32px;
          }
        }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .footer-quick-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
          }
          .footer-header-row {
            padding-bottom: 24px;
            margin-bottom: 28px;
          }
          .footer-bottom-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>

      <footer style={{
        background: "linear-gradient(180deg, #070707 0%, #060606 100%)",
        borderTop: "1px solid rgba(255,77,0,0.08)",
        marginTop: "80px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,77,0,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.018) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* Radial glow */}
        <div style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "600px", height: "200px",
          background: "radial-gradient(ellipse, rgba(255,77,0,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* Animated top border */}
        <div style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, #ff4d00 30%, #ffaa44 50%, #ff4d00 70%, transparent 100%)",
          backgroundSize: "200% auto",
          animation: "footerShimmer 3s linear infinite",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0,
            width: "60px", height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            animation: "footerScan 2.5s ease-in-out infinite",
          }} />
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "52px 1.5rem 32px", position: "relative", zIndex: 1 }}>

          {/* ── Header: logo + socials ── */}
          <div className="footer-header-row">
            <Link href="/" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #ff4d00",
                  boxShadow: "0 0 20px rgba(255,77,0,0.35), 0 0 40px rgba(255,77,0,0.1)",
                  flexShrink: 0,
                }}>
                  <img src="/favicon.jpg" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{
                    fontSize: "22px", fontWeight: "900", color: "#fff",
                    fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                    letterSpacing: "-0.5px", lineHeight: 1.1,
                  }}>
                    Tech<span style={{
                      color: "#ff4d00",
                      filter: "drop-shadow(0 0 10px rgba(255,77,0,0.6))",
                    }}>SuperStar</span>
                  </div>
                  <div style={{
                    color: "#444", fontSize: "9px",
                    letterSpacing: "2.5px", textTransform: "uppercase",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontWeight: 600, marginTop: "2px",
                  }}>
                    Tech Reviews & News
                  </div>
                </div>
              </div>
            </Link>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="social-btn"
                  style={{
                    background: `rgba(${s.rgb}, 0.08)`,
                    border: `1px solid rgba(${s.rgb}, 0.22)`,
                    color: s.color,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(${s.rgb},0.3)`;
                    (e.currentTarget as HTMLElement).style.borderColor = `rgba(${s.rgb},0.5)`;
                    (e.currentTarget as HTMLElement).style.background = `rgba(${s.rgb},0.15)`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.borderColor = `rgba(${s.rgb},0.22)`;
                    (e.currentTarget as HTMLElement).style.background = `rgba(${s.rgb},0.08)`;
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── 3-column grid ── */}
          <div className="footer-grid">

            {/* About */}
            <div>
              <h4 style={{
                color: "#ff4d00", fontSize: "10px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "2.5px",
                margin: "0 0 16px",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                display: "flex", alignItems: "center", gap: "7px",
              }}>
                <span style={{ width: 4, height: 14, background: "#ff4d00", borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
                About
              </h4>
              <p style={{
                color: "#555", fontSize: "13px", lineHeight: "1.85",
                margin: "0 0 18px",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}>
                Your ultimate source for honest tech reviews, buying guides, and the latest news in technology.
              </p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(74,222,128,0.06)",
                border: "1px solid rgba(74,222,128,0.2)",
                borderRadius: "50px", padding: "6px 14px",
                animation: "greenPulse 2.5s ease-in-out infinite",
              }}>
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "#4ade80", display: "inline-block",
                  boxShadow: "0 0 8px #4ade80",
                  animation: "dotBlink 1.5s ease-in-out infinite",
                  flexShrink: 0,
                }} />
                <span style={{
                  color: "#4ade80", fontSize: "10px",
                  letterSpacing: "1.5px", textTransform: "uppercase",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 600,
                }}>
                  Publishing Daily
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{
                color: "#ff4d00", fontSize: "10px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "2.5px",
                margin: "0 0 16px",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                display: "flex", alignItems: "center", gap: "7px",
              }}>
                <span style={{ width: 4, height: 14, background: "#ff4d00", borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
                Quick Links
              </h4>
              <div className="footer-quick-list">
                {quickLinks.map(link => (
                  <Link key={link.name} href={link.href} className="footer-quick-link">
                    <span style={{ color: "#ff4d00", fontSize: 10 }}>▸</span>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 style={{
                color: "#ff4d00", fontSize: "10px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "2.5px",
                margin: "0 0 16px",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                display: "flex", alignItems: "center", gap: "7px",
              }}>
                <span style={{ width: 4, height: 14, background: "#ff4d00", borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
                Newsletter
              </h4>
              <p style={{
                color: "#555", fontSize: "13px", lineHeight: "1.7",
                margin: "0 0 16px",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}>
                Get the latest tech news in your inbox. No spam, ever.
              </p>
              <NewsletterForm />
            </div>

          </div>

          {/* ── Bottom bar ── */}
          <div className="footer-bottom-row">
            <p
              suppressHydrationWarning
              style={{
                color: "#444", fontSize: "12px", margin: 0,
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              © {new Date().getFullYear()}{" "}
              <span style={{
                color: "#ff4d00",
                filter: "drop-shadow(0 0 6px rgba(255,77,0,0.4))",
              }}>TechSuperStar</span>. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: "20px" }}>
              <Link href="/privacy-policy" className="footer-bottom-link">Privacy Policy</Link>
              <Link href="/terms" className="footer-bottom-link">Terms of Use</Link>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
