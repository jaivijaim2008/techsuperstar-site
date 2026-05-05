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
      <div style={{ background: "linear-gradient(135deg, #0f2e1a, #0a1f10)", border: "1px solid #1a5c2e", borderRadius: "10px", padding: "14px 16px", color: "#4ade80", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
        ✅ Subscribed! You'll get notified on new posts.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="email" placeholder="your@email.com" value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          disabled={status === "loading"}
          style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: "8px", padding: "12px 14px", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
          onFocus={e => (e.currentTarget.style.borderColor = "#ff4d00")}
          onBlur={e => (e.currentTarget.style.borderColor = "#222")}
        />
        <button
          onClick={handleSubmit} disabled={status === "loading"}
          style={{ width: "100%", background: "linear-gradient(135deg, #ff4d00, #ff7300)", border: "none", borderRadius: "8px", padding: "12px", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer", opacity: status === "loading" ? 0.7 : 1, boxShadow: "0 4px 15px rgba(255,77,0,0.3)" }}>
          {status === "loading" ? "Subscribing..." : "🔔 Subscribe for Free"}
        </button>
      </div>
      {status === "error" && <p style={{ color: "#f87171", fontSize: "12px", marginTop: "8px" }}>Something went wrong. Try again.</p>}
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
    <footer style={{ background: "#080808", borderTop: "1px solid #1a1a1a", marginTop: "80px", fontFamily: "Arial, sans-serif" }}>

      {/* Orange top glow */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #ff4d00, #ff8800, #ff4d00, transparent)" }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "50px 1.5rem 30px" }}>

        {/* Brand + Social */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px", paddingBottom: "36px", borderBottom: "1px solid #161616", marginBottom: "36px" }}>
          
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", border: "2px solid #ff4d00", boxShadow: "0 0 16px rgba(255,77,0,0.3)" }}>
                <img src="/favicon.jpg" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "#fff", fontFamily: "Georgia, serif" }}>
                  Tech<span style={{ color: "#ff4d00" }}>SuperStar</span>
                </div>
                <div style={{ color: "#444", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" }}>Tech Reviews & News</div>
              </div>
            </div>
          </Link>

          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { href: "https://www.youtube.com/@TechSuperStarOfficial", icon: <FaYoutube size={18} />, color: "#FF0000", bg: "rgba(255,0,0,0.1)", border: "rgba(255,0,0,0.25)" },
              { href: "https://www.instagram.com/techsuperstarofficial/", icon: <FaInstagram size={18} />, color: "#e1306c", bg: "rgba(225,48,108,0.1)", border: "rgba(225,48,108,0.25)" },
              { href: "https://x.com/Tech_SuperStar", icon: <FaXTwitter size={18} />, color: "#fff", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.15)" },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ width: "42px", height: "42px", borderRadius: "10px", background: s.bg, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 20px ${s.border}`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Main grid - responsive */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "36px", marginBottom: "40px" }}>

          {/* About */}
          <div style={{ gridColumn: "span 1" }}>
            <h4 style={{ color: "#fff", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 14px" }}>About</h4>
            <p style={{ color: "#444", fontSize: "13px", lineHeight: "1.8", margin: "0 0 16px" }}>
              Your ultimate source for honest tech reviews, buying guides, and the latest news in technology.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.2)", borderRadius: "50px", padding: "5px 12px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 6px #4ade80" }} />
              <span style={{ color: "#666", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>Publishing Weekly</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: "#fff", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 14px" }}>Categories</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {categories.map(cat => (
                <Link key={cat.slug} href={`/category/${cat.slug}`}
                  style={{ color: "#444", textDecoration: "none", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ff4d00")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                  <span style={{ color: "#ff4d00", fontSize: "10px" }}>▸</span> {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#fff", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 14px" }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {quickLinks.map(link => (
                <Link key={link.name} href={link.href}
                  style={{ color: "#444", textDecoration: "none", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ff4d00")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                  <span style={{ color: "#ff4d00", fontSize: "10px" }}>▸</span> {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: "#fff", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px" }}>Newsletter</h4>
            <p style={{ color: "#444", fontSize: "13px", lineHeight: "1.6", margin: "0 0 16px" }}>
              Get the latest tech news in your inbox. No spam, ever.
            </p>
            <NewsletterForm />
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid #111", paddingTop: "20px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <p style={{ color: "#333", fontSize: "12px", margin: 0 }}>
            © {new Date().getFullYear()} <span style={{ color: "#ff4d00" }}>TechSuperStar</span>. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms of Use"].map(item => (
              <Link key={item} href="#"
                style={{ color: "#333", fontSize: "12px", textDecoration: "none", transition: "color 0.2s" }}
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