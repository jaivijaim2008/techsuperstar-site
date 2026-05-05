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
        body: JSON.stringify({
          email: email,
          listIds: [3],
          updateEnabled: true,
        }),
      });
      if (res.ok || res.status === 204) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div style={{
        background: "linear-gradient(135deg, #0f2e1a, #0a1f10)",
        border: "1px solid #1a5c2e",
        borderRadius: "10px", padding: "14px 16px",
        color: "#4ade80", fontSize: "13px",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        ✅ Subscribed! You'll get notified on new posts.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          disabled={status === "loading"}
          style={{
            flex: 1, background: "#0d0d0d",
            border: "1px solid #222", borderRadius: "8px",
            padding: "10px 14px", color: "#fff",
            fontSize: "13px", outline: "none", minWidth: 0,
            transition: "border-color 0.2s",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "#ff4d00")}
          onBlur={e => (e.currentTarget.style.borderColor = "#222")}
        />
        <button
          onClick={handleSubmit}
          disabled={status === "loading"}
          style={{
            background: "linear-gradient(135deg, #ff4d00, #ff7300)",
            border: "none", borderRadius: "8px",
            padding: "10px 16px", color: "#fff",
            fontWeight: "700", fontSize: "13px",
            cursor: "pointer", whiteSpace: "nowrap",
            opacity: status === "loading" ? 0.7 : 1,
            transition: "opacity 0.2s, transform 0.2s",
            boxShadow: "0 4px 15px rgba(255,77,0,0.3)",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p style={{ color: "#f87171", fontSize: "12px", marginTop: "8px" }}>
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}

export default function Footer() {
  const categories = [
    { name: "Phones", slug: "phones" },
    { name: "Laptops", slug: "laptops" },
    { name: "Tablets", slug: "tablets" },
    { name: "Gaming", slug: "gaming" },
    { name: "Reviews", slug: "reviews" },
    { name: "Accessories", slug: "accessories" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "All Articles", href: "/articles" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer style={{
      background: "#080808",
      borderTop: "1px solid #1a1a1a",
      marginTop: "80px",
      fontFamily: "'Georgia', serif",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Top glow line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, #ff4d00, transparent)",
      }} />

      {/* Background texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(255,77,0,0.03) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(255,100,0,0.02) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 1.5rem 40px", position: "relative" }}>

        {/* Top section - Brand full width */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "20px",
          paddingBottom: "40px",
          borderBottom: "1px solid #161616",
          marginBottom: "40px",
        }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid transparent",
                background: "linear-gradient(#080808, #080808) padding-box, linear-gradient(135deg, #ff4d00, #ff8800) border-box",
                boxShadow: "0 0 20px rgba(255,77,0,0.2)",
              }}>
                <img src="/favicon.jpg" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <span style={{ fontSize: "20px", fontWeight: "700", color: "#fff", fontFamily: "'Georgia', serif" }}>
                  Tech<span style={{ color: "#ff4d00" }}>SuperStar</span>
                </span>
                <div style={{ color: "#444", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginTop: "1px" }}>
                  Tech Reviews & News
                </div>
              </div>
            </div>
          </Link>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { href: "https://www.youtube.com/@TechSuperStarOfficial", icon: <FaYoutube />, color: "#FF0000", bg: "rgba(255,0,0,0.1)", border: "rgba(255,0,0,0.2)" },
              { href: "https://www.instagram.com/techsuperstarofficial/", icon: <FaInstagram />, color: "#e1306c", bg: "rgba(225,48,108,0.1)", border: "rgba(225,48,108,0.2)" },
              { href: "https://x.com/Tech_SuperStar", icon: <FaXTwitter />, color: "#fff", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" },
            ].map((s, i) => (
              <Link key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: s.bg, border: `1px solid ${s.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: s.color, fontSize: "18px", textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 20px ${s.border}`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {s.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 2fr",
          gap: "40px",
        }}>

          {/* About */}
          <div>
            <p style={{ color: "#444", fontSize: "13px", lineHeight: "1.8", margin: "0 0 20px" }}>
              Your ultimate source for honest tech reviews, buying guides, and the latest news in technology. Trusted by thousands of readers.
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.2)",
              borderRadius: "50px", padding: "6px 14px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 6px #4ade80" }} />
              <span style={{ color: "#666", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}>Publishing Weekly</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{
              color: "#fff", fontSize: "11px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "2px",
              margin: "0 0 20px", fontFamily: "'Arial', sans-serif",
            }}>
              Categories
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`}
                  style={{ color: "#444", textDecoration: "none", fontSize: "13px", transition: "color 0.2s", display: "flex", alignItems: "center", gap: "6px" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ff4d00")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                  <span style={{ color: "#ff4d00", fontSize: "10px" }}>▸</span> {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              color: "#fff", fontSize: "11px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "2px",
              margin: "0 0 20px", fontFamily: "'Arial', sans-serif",
            }}>
              Quick Links
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {quickLinks.map((link) => (
                <Link key={link.name} href={link.href}
                  style={{ color: "#444", textDecoration: "none", fontSize: "13px", transition: "color 0.2s", display: "flex", alignItems: "center", gap: "6px" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ff4d00")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                  <span style={{ color: "#ff4d00", fontSize: "10px" }}>▸</span> {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{
              color: "#fff", fontSize: "11px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "2px",
              margin: "0 0 8px", fontFamily: "'Arial', sans-serif",
            }}>
              Newsletter
            </h4>
            <p style={{ color: "#444", fontSize: "13px", lineHeight: "1.6", margin: "0 0 16px" }}>
              Get the latest tech news delivered to your inbox. No spam, ever.
            </p>
            <NewsletterForm />
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid #111", padding: "18px 1.5rem" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "8px",
        }}>
          <p style={{ color: "#333", fontSize: "12px", margin: 0, fontFamily: "'Arial', sans-serif" }}>
            © {new Date().getFullYear()} <span style={{ color: "#ff4d00" }}>TechSuperStar</span>. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms of Use"].map((item) => (
              <Link key={item} href="#"
                style={{ color: "#333", fontSize: "12px", textDecoration: "none", fontFamily: "'Arial', sans-serif", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ff4d00")}
                onMouseLeave={e => (e.currentTarget.style.color = "#333")}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}