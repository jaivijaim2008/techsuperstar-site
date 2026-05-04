"use client";
import Link from "next/link";
import { useState } from "react";
import { FaYoutube, FaInstagram, FaXTwitter } from "react-icons/fa6";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    try {
      await fetch(
        `https://gmail.us4.list-manage.com/subscribe/post?u=6a9b4262dc26ee1a01c143bb8&id=fc7a505bd7&f_id=007400eaf0&EMAIL=${encodeURIComponent(email)}&b_6a9b4262dc26ee1a01c143bb8_fc7a505bd7=`,
        { method: "GET", mode: "no-cors" }
      );
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div style={{
        background: "#0f2e1a", border: "1px solid #1a5c2e",
        borderRadius: "8px", padding: "12px 16px",
        color: "#4ade80", fontSize: "13px",
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
          style={{
            flex: 1, background: "#141414",
            border: "1px solid #2a2a2a", borderRadius: "6px",
            padding: "8px 12px", color: "#fff",
            fontSize: "13px", outline: "none", minWidth: 0,
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "#ff4d00")}
          onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
        />
        <button
          onClick={handleSubmit}
          style={{
            background: "#ff4d00", border: "none",
            borderRadius: "6px", padding: "8px 14px",
            color: "#fff", fontWeight: "700",
            fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Subscribe
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
      background: "#0f0f0f",
      borderTop: "1px solid #1e1e1e",
      marginTop: "80px",
      fontFamily: "'Arial', sans-serif",
    }}>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 1.5rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
        }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  overflow: "hidden", border: "2px solid #ff4d00",
                }}>
                  <img src="/favicon.jpg" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span style={{ fontSize: "18px", fontWeight: "700", color: "#fff" }}>
                  Tech<span style={{ color: "#ff4d00" }}>SuperStar</span>
                </span>
              </div>
            </Link>
            <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.7", margin: "0 0 20px" }}>
              Your ultimate source for honest tech reviews, buying guides, and the latest news in technology.
            </p>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <Link
                href="https://www.youtube.com/@TechSuperStarOfficial"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: "#FF0000", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  textDecoration: "none", color: "#fff", fontSize: "18px",
                }}
              >
                <FaYoutube />
              </Link>
              <Link
                href="https://www.instagram.com/techsuperstarofficial/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none", color: "#fff", fontSize: "18px",
                }}
              >
                <FaInstagram />
              </Link>
              <Link
                href="https://x.com/Tech_SuperStar"
                target="_blank"
                rel="noopener noreferrer"
                title="X / Twitter"
                style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: "#000", border: "1px solid #333",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none", color: "#fff", fontSize: "18px",
                }}
              >
                <FaXTwitter />
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{
              color: "#fff", fontSize: "13px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "1px",
              margin: "0 0 16px",
            }}>
              Categories
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  style={{ color: "#555", textDecoration: "none", fontSize: "13px", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ff4d00")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#555")}
                >
                  → {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              color: "#fff", fontSize: "13px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "1px",
              margin: "0 0 16px",
            }}>
              Quick Links
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{ color: "#555", textDecoration: "none", fontSize: "13px", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ff4d00")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#555")}
                >
                  → {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{
              color: "#fff", fontSize: "13px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "1px",
              margin: "0 0 16px",
            }}>
              Newsletter
            </h4>
            <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.6", margin: "0 0 14px" }}>
              Get the latest tech news delivered to your inbox.
            </p>
            <NewsletterForm />
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid #1a1a1a", padding: "16px 1.5rem" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "8px",
        }}>
          <p style={{ color: "#444", fontSize: "12px", margin: 0 }}>
            © {new Date().getFullYear()} TechSuperStar. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            {["Privacy Policy", "Terms of Use"].map((item) => (
              <Link
                key={item}
                href="#"
                style={{ color: "#444", fontSize: "12px", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ff4d00")}
                onMouseLeave={e => (e.currentTarget.style.color = "#444")}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}