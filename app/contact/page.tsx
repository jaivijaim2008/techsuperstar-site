"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useState } from "react";
import { FaYoutube, FaInstagram, FaXTwitter } from "react-icons/fa6";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) { setStatus("success"); setFormData({ name: "", email: "", subject: "", message: "" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <div style={{ background: "#060606", minHeight: "100vh", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", overflowX: "hidden" }}>
      <Navbar />

      <style>{`
        @keyframes shimmerText {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes gridPan {
          from { background-position: 0 0; }
          to   { background-position: 50px 50px; }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,77,0,0.3); }
          50%     { box-shadow: 0 0 0 8px rgba(255,77,0,0); }
        }
        @keyframes orbFloat1 {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-20px); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(15px); }
        }
        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 16px;
          color: #fff;
          font-size: 14px;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .input-field:focus {
          border-color: rgba(255,77,0,0.5);
          box-shadow: 0 0 0 3px rgba(255,77,0,0.08), 0 0 20px rgba(255,77,0,0.05);
          background: rgba(255,77,0,0.03);
        }
        .input-field::placeholder { color: #333; }
        .contact-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .contact-card:hover {
          background: rgba(255,77,0,0.05);
          border-color: rgba(255,77,0,0.25);
          transform: translateX(6px);
          box-shadow: 0 8px 30px rgba(255,77,0,0.08);
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 40px;
          align-items: start;
        }
        .name-email-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .input-label {
          color: #444;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 7px;
          font-family: var(--font-dm-sans), sans-serif;
        }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .name-email-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Hero */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #060606 0%, #0f0600 50%, #060606 100%)",
        padding: "70px 1.5rem 60px",
        borderBottom: "1px solid rgba(255,77,0,0.1)",
        textAlign: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,77,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.025) 1px, transparent 1px)", backgroundSize: "55px 55px", animation: "gridPan 20s linear infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 300, height: 300, top: "-60px", left: "5%", borderRadius: "50%", background: "rgba(255,77,0,0.06)", filter: "blur(60px)", animation: "orbFloat1 8s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 200, height: 200, bottom: "-40px", right: "10%", borderRadius: "50%", background: "rgba(255,100,0,0.04)", filter: "blur(50px)", animation: "orbFloat2 10s ease-in-out infinite", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.28)",
            color: "#ff6622", fontSize: "10px", fontWeight: "700",
            padding: "6px 18px", borderRadius: "50px",
            letterSpacing: "2.5px", textTransform: "uppercase",
            marginBottom: "24px",
            animation: "badgePulse 2.5s ease infinite",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4d00", display: "inline-block" }} />
            Get In Touch
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: "900", margin: "0 0 16px",
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            letterSpacing: "-1px",
            background: "linear-gradient(135deg, #ffffff 0%, #ff4d00 50%, #ffaa44 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmerText 4s linear infinite",
          }}>
            Contact Us
          </h1>

          <p style={{ color: "#555", fontSize: "clamp(13px, 2vw, 16px)", lineHeight: "1.7", margin: 0, fontFamily: "var(--font-dm-sans), sans-serif" }}>
            Have a question, collaboration idea, or just want to say hi?{" "}
            <span style={{ color: "#ff6622" }}>We'd love to hear from you!</span>
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "56px 1.5rem 80px" }}>
        <div className="contact-grid">

          {/* Left — socials */}
          <ScrollReveal direction="left">
            <h2 style={{
              color: "#fff", fontSize: "20px", fontWeight: "900",
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              margin: "0 0 8px",
            }}>
              Let's Connect
            </h2>
            <p style={{ color: "#444", fontSize: "13px", lineHeight: "1.8", margin: "0 0 28px" }}>
              Follow us on social media or reach out directly. We reply to every message!
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              {[
                { icon: <FaYoutube size={22} />, label: "YouTube", value: "@TechSuperStarOfficial", link: "https://www.youtube.com/@TechSuperStarOfficial", color: "#ff0000", rgb: "255,0,0" },
                { icon: <FaInstagram size={22} />, label: "Instagram", value: "@techsuperstarofficial", link: "https://www.instagram.com/techsuperstarofficial/", color: "#e1306c", rgb: "225,48,108" },
                { icon: <FaXTwitter size={22} />, label: "Twitter / X", value: "@Tech_SuperStar", link: "https://x.com/Tech_SuperStar", color: "#ffffff", rgb: "255,255,255" },
              ].map((s) => (
                <a key={s.label} href={s.link} target="_blank" rel="noopener noreferrer"
                  className="contact-card" style={{ textDecoration: "none" }}>
                  <div style={{
                    width: "46px", height: "46px", borderRadius: "12px",
                    background: `rgba(${s.rgb},0.1)`,
                    border: `1px solid rgba(${s.rgb},0.25)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: s.color, flexShrink: 0,
                    boxShadow: `0 0 16px rgba(${s.rgb},0.1)`,
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ color: "#444", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "3px" }}>{s.label}</div>
                    <div style={{ color: s.color, fontSize: "13px", fontWeight: "600" }}>{s.value}</div>
                  </div>
                  <div style={{ marginLeft: "auto", color: "#333", fontSize: 12 }}>→</div>
                </a>
              ))}
            </div>

            {/* Info box */}
            <div style={{
              background: "rgba(255,77,0,0.04)",
              border: "1px solid rgba(255,77,0,0.12)",
              borderRadius: "16px", padding: "20px",
            }}>
              <div style={{ color: "#ff4d00", fontSize: "10px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Response Time</div>
              <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.7", margin: 0 }}>
                We typically respond within <span style={{ color: "#fff", fontWeight: 600 }}>24–48 hours</span>. For urgent queries, reach us via YouTube or Instagram DMs.
              </p>
            </div>
          </ScrollReveal>

          {/* Right — form */}
          <ScrollReveal direction="right" delay={100}>
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,77,0,0.15)",
              borderRadius: "24px",
              padding: "clamp(20px, 4vw, 40px)",
              boxShadow: "0 0 60px rgba(255,77,0,0.05)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Card glow */}
              <div style={{ position: "absolute", top: "-60px", right: "-60px", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,77,0,0.05)", filter: "blur(40px)", pointerEvents: "none" }} />

              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "48px 0", position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
                  <h3 style={{ color: "#fff", fontSize: "22px", fontWeight: "900", fontFamily: "var(--font-playfair), serif", margin: "0 0 10px" }}>Message Sent!</h3>
                  <p style={{ color: "#555", fontSize: "14px", margin: "0 0 28px" }}>Thanks for reaching out! We'll get back to you soon.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    style={{
                      background: "rgba(255,77,0,0.1)", border: "1px solid rgba(255,77,0,0.3)",
                      color: "#ff4d00", padding: "12px 28px", borderRadius: "50px",
                      cursor: "pointer", fontSize: "13px", fontWeight: "700",
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,77,0,0.18)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,77,0,0.1)"; }}
                  >
                    Send Another →
                  </button>
                </div>
              ) : (
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h3 style={{
                    color: "#fff", fontSize: "20px", fontWeight: "900",
                    fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                    margin: "0 0 6px",
                  }}>
                    Send a Message
                  </h3>
                  <p style={{ color: "#444", fontSize: "13px", margin: "0 0 28px" }}>Fill out the form and we'll get back to you.</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div className="name-email-grid">
                      <div>
                        <label className="input-label">Name *</label>
                        <input className="input-field" placeholder="Your name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="input-label">Email *</label>
                        <input className="input-field" type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                      </div>
                    </div>

                    <div>
                      <label className="input-label">Subject</label>
                      <input className="input-field" placeholder="What's this about?" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                    </div>

                    <div>
                      <label className="input-label">Message *</label>
                      <textarea className="input-field" placeholder="Write your message here..." rows={5} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} style={{ resize: "vertical", minHeight: "130px" }} />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={status === "loading"}
                      style={{
                        background: status === "loading" ? "rgba(255,77,0,0.4)" : "linear-gradient(135deg, #ff4d00, #ff7300, #ff9900, #ff7300, #ff4d00)",
                        backgroundSize: "200% auto",
                        border: "none", borderRadius: "12px",
                        padding: "16px", color: "#fff",
                        fontSize: "15px", fontWeight: "700",
                        cursor: status === "loading" ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: status === "loading" ? "none" : "0 4px 24px rgba(255,77,0,0.35)",
                        letterSpacing: "0.5px", width: "100%",
                        fontFamily: "var(--font-dm-sans), sans-serif",
                      }}
                      onMouseEnter={e => { if (status !== "loading") { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(255,77,0,0.5)"; } }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(255,77,0,0.35)"; }}
                    >
                      {status === "loading" ? "Sending..." : "Send Message 🚀"}
                    </button>

                    {status === "error" && (
                      <p style={{ color: "#f87171", fontSize: "13px", textAlign: "center", margin: 0 }}>
                        Something went wrong. Please try again.
                      </p>
                    )}
                    <p style={{ color: "#333", fontSize: "12px", margin: 0 }}>* Required fields</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

        </div>
      </div>

      <Footer />
    </div>
  );
}