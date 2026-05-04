import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Arial', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: "#0f0f0f",
        borderBottom: "1px solid #1a1a1a",
        padding: "60px 1.5rem",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "#ff4d00", color: "#fff",
            fontSize: "11px", fontWeight: "700",
            padding: "4px 12px", borderRadius: "4px",
            letterSpacing: "1.5px", textTransform: "uppercase",
            marginBottom: "20px",
          }}>
            About Us
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: "800", color: "#ffffff",
            lineHeight: "1.15", margin: "0 0 16px",
            fontFamily: "'Georgia', serif", letterSpacing: "-1px",
          }}>
            We are <span style={{ color: "#ff4d00" }}>TechSuperStar</span>
          </h1>
          <p style={{ color: "#777", fontSize: "16px", lineHeight: "1.7", margin: 0 }}>
            Your ultimate source for honest tech reviews, buying guides, and the latest news in technology.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 1.5rem" }}>

        {/* Who We Are */}
        <div style={{
          background: "#141414", border: "1px solid #1e1e1e",
          borderRadius: "16px", padding: "40px",
          marginBottom: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              overflow: "hidden", border: "2px solid #ff4d00", flexShrink: 0,
            }}>
              <img src="/favicon.jpg" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <h2 style={{
              color: "#fff", fontSize: "22px", fontWeight: "700",
              fontFamily: "'Georgia', serif", margin: 0,
            }}>
              Who We Are
            </h2>
          </div>
          <p style={{ color: "#888", fontSize: "15px", lineHeight: "1.8", margin: "0 0 16px" }}>
            TechSuperStar is a Tamil tech YouTube channel and blog dedicated to bringing you the most honest and detailed tech reviews in Tamil Nadu and across India.
          </p>
          <p style={{ color: "#888", fontSize: "15px", lineHeight: "1.8", margin: 0 }}>
            From budget smartphones to high-end laptops, gaming gear to accessories — we cover it all so you can make the best buying decisions without wasting your hard-earned money.
          </p>
        </div>

        {/* What We Cover */}
        <div style={{
          background: "#141414", border: "1px solid #1e1e1e",
          borderRadius: "16px", padding: "40px",
          marginBottom: "24px",
        }}>
          <h2 style={{
            color: "#fff", fontSize: "22px", fontWeight: "700",
            fontFamily: "'Georgia', serif", margin: "0 0 24px",
          }}>
            What We Cover
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}>
            {[
              { icon: "📱", title: "Phones", desc: "Budget to flagship smartphone reviews" },
              { icon: "💻", title: "Laptops", desc: "Gaming and work laptop buying guides" },
              { icon: "📟", title: "Tablets", desc: "Tablet reviews and comparisons" },
              { icon: "🎮", title: "Gaming", desc: "Gaming hardware and accessories" },
              { icon: "⭐", title: "Reviews", desc: "In-depth honest product reviews" },
              { icon: "🎧", title: "Accessories", desc: "Earbuds, chargers and more" },
            ].map((item) => (
              <div key={item.title} style={{
                background: "#0f0f0f", border: "1px solid #2a2a2a",
                borderRadius: "12px", padding: "20px",
              }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
                <div style={{ color: "#fff", fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>{item.title}</div>
                <div style={{ color: "#666", fontSize: "12px", lineHeight: "1.5" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* YouTube */}
        <div style={{
          background: "linear-gradient(135deg, #1a0a00, #2a1000)",
          border: "1px solid #ff4d0033",
          borderRadius: "16px", padding: "40px",
          marginBottom: "24px", textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>▶</div>
          <h2 style={{
            color: "#fff", fontSize: "22px", fontWeight: "700",
            fontFamily: "'Georgia', serif", margin: "0 0 12px",
          }}>
            Watch on YouTube
          </h2>
          <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.7", margin: "0 0 24px" }}>
            Subscribe to our YouTube channel for video reviews, unboxings, and tech news in Tamil. New videos every week!
          </p>
          <Link
            href="https://youtube.com/@TechSuperStar"
            target="_blank"
            style={{
              display: "inline-block",
              background: "#ff4d00", color: "#fff",
              padding: "12px 32px", borderRadius: "8px",
              textDecoration: "none", fontWeight: "700", fontSize: "14px",
            }}
          >
            Subscribe Now →
          </Link>
        </div>

        {/* Contact */}
        <div style={{
          background: "#141414", border: "1px solid #1e1e1e",
          borderRadius: "16px", padding: "40px",
          textAlign: "center",
        }}>
          <h2 style={{
            color: "#fff", fontSize: "22px", fontWeight: "700",
            fontFamily: "'Georgia', serif", margin: "0 0 12px",
          }}>
            Get In Touch
          </h2>
          <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.7", margin: "0 0 24px" }}>
            For business inquiries, collaborations, or just to say hi — reach out to us!
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            {[
              { label: "YouTube", icon: "▶", url: "https://youtube.com" },
              { label: "Instagram", icon: "📸", url: "https://instagram.com" },
              { label: "Twitter", icon: "🐦", url: "https://twitter.com" },
            ].map((social) => (
              <Link
                key={social.label}
                href={social.url}
                target="_blank"
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "#0f0f0f", border: "1px solid #2a2a2a",
                  borderRadius: "8px", padding: "10px 20px",
                  color: "#ccc", textDecoration: "none",
                  fontSize: "13px", fontWeight: "600",
                }}
              >
                {social.icon} {social.label}
              </Link>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}