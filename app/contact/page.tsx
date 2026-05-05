"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus("loading");
    await new Promise(r => setTimeout(r, 1500));
    setStatus("success");
  };

  const contactInfo = [
    
  { icon: "📺", label: "YouTube", value: "@TechSuperStarOfficial", link: "https://www.youtube.com/@TechSuperStarOfficial", color: "#ff0000" },
  { icon: "📸", label: "Instagram", value: "@techsuperstarofficial", link: "https://www.instagram.com/techsuperstarofficial/", color: "#e1306c" },
  { icon: "🐦", label: "Twitter/X", value: "@Tech_SuperStar", link: "https://x.com/Tech_SuperStar", color: "#1da1f2" },
  ];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Arial', sans-serif" }}>
      <Navbar />

      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(15px)} }
        @keyframes shimmer {
          0%{background-position:-200% center}
          100%{background-position:200% center}
        }
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(20px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes pulse {
          0%,100%{box-shadow:0 0 10px rgba(255,77,0,0.3)}
          50%{box-shadow:0 0 25px rgba(255,77,0,0.6)}
        }
        .input-field {
          width: 100%;
          background: #111;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 16px;
          color: #fff;
          font-size: 14px;
          font-family: 'Arial', sans-serif;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .input-field:focus {
          border-color: #ff4d00;
          box-shadow: 0 0 0 3px rgba(255,77,0,0.1);
          background: #141414;
        }
        .input-field::placeholder { color: #444; }
        .contact-card:hover {
          transform: translateY(-4px) !important;
          border-color: rgba(255,77,0,0.4) !important;
          box-shadow: 0 12px 40px rgba(255,77,0,0.15) !important;
        }
      `}</style>

      {/* Hero */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0a0a0a, #0f0800, #0a0a0a)",
        padding: "80px 1.5rem 60px",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,77,0,0.1)",
      }}>
        {/* Orbs */}
        <div style={{ position:"absolute", width:300, height:300, top:"0%", left:"5%", borderRadius:"50%", background:"rgba(255,77,0,0.06)", filter:"blur(60px)", animation:"float1 8s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:200, height:200, bottom:"0%", right:"10%", borderRadius:"50%", background:"rgba(255,100,0,0.05)", filter:"blur(50px)", animation:"float2 10s ease-in-out infinite" }} />

        {/* Grid */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"linear-gradient(rgba(255,77,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.02) 1px, transparent 1px)",
          backgroundSize:"50px 50px", pointerEvents:"none",
        }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:"600px", margin:"0 auto" }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:"8px",
            background:"rgba(255,77,0,0.1)", border:"1px solid rgba(255,77,0,0.3)",
            color:"#ff4d00", fontSize:"11px", fontWeight:"700",
            padding:"6px 16px", borderRadius:"50px",
            letterSpacing:"2px", textTransform:"uppercase",
            marginBottom:"24px", animation:"pulse 2s ease-in-out infinite",
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#ff4d00", display:"inline-block" }} />
            Get In Touch
          </div>

          <h1 style={{
            fontSize:"clamp(2rem, 5vw, 3.5rem)",
            fontWeight:"900", margin:"0 0 16px",
            fontFamily:"'Georgia', serif", letterSpacing:"-1px",
            background:"linear-gradient(135deg, #fff 0%, #ff4d00 50%, #fff 100%)",
            backgroundSize:"200% auto",
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",
            animation:"shimmer 3s linear infinite",
          }}>
            Contact Us
          </h1>

          <p style={{ color:"#666", fontSize:"16px", lineHeight:"1.7", margin:0 }}>
            Have a question, collaboration idea, or just want to say hi? We'd love to hear from you!
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"60px 1.5rem" }}>
        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr 1.6fr",
          gap:"40px",
          alignItems:"start",
        }}>

          {/* Left — Contact Info */}
          <div style={{ animation:"fadeUp 0.6s ease forwards" }}>
            <h2 style={{
              color:"#fff", fontSize:"18px", fontWeight:"700",
              fontFamily:"'Georgia', serif", margin:"0 0 8px",
            }}>
              Let's Connect
            </h2>
            <p style={{ color:"#555", fontSize:"13px", lineHeight:"1.7", margin:"0 0 28px" }}>
              Follow us on social media or reach out directly. We reply to every message!
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="contact-card"
                  style={{
                    background:"#111",
                    border:"1px solid rgba(255,255,255,0.06)",
                    borderRadius:"14px",
                    padding:"16px 20px",
                    display:"flex", alignItems:"center", gap:"14px",
                    transition:"all 0.3s ease",
                    cursor:"default",
                  }}
                >
                  <div style={{
                    width:"44px", height:"44px", borderRadius:"12px",
                    background:`${info.color}15`,
                    border:`1px solid ${info.color}33`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"20px", flexShrink:0,
                  }}>
                    {info.icon}
                  </div>
                  <div>
                    <div style={{ color:"#555", fontSize:"11px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"2px" }}>
                      {info.label}
                    </div>
<div style={{ color:"#ccc", fontSize:"13px", fontWeight:"500" }}>
  {info.label === "Email" ? (
    <a href={`mailto:${info.value}`} style={{ color: info.color }}>
      {info.value}
    </a>
  ) : (
    info.value
  )}
</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div style={{ marginTop:"28px" }}>
              <p style={{ color:"#444", fontSize:"12px", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"12px" }}>Follow us</p>
              <div style={{ display:"flex", gap:"10px" }}>
                {[
                  { label:"YT", color:"#ff0000", href:"https://www.youtube.com/@TechSuperStarOfficial" },
                  { label:"IG", color:"#e1306c", href:"https://www.instagram.com/techsuperstarofficial/" },
                  { label:"X", color:"#fff", href:"https://x.com/Tech_SuperStar" },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                    width:"40px", height:"40px", borderRadius:"10px",
                    background:`${s.color}15`,
                    border:`1px solid ${s.color}33`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:s.color, fontSize:"12px", fontWeight:"800",
                    textDecoration:"none", transition:"all 0.2s ease",
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = `${s.color}30`;
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = `${s.color}15`;
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div style={{
            background:"#111",
            border:"1px solid rgba(255,77,0,0.15)",
            borderRadius:"20px",
            padding:"36px",
            animation:"fadeUp 0.6s ease 0.2s both",
            boxShadow:"0 0 60px rgba(255,77,0,0.05)",
          }}>
            {status === "success" ? (
              <div style={{ textAlign:"center", padding:"40px 0" }}>
                <div style={{ fontSize:"64px", marginBottom:"16px" }}>🎉</div>
                <h3 style={{ color:"#fff", fontSize:"22px", fontWeight:"700", fontFamily:"'Georgia', serif", margin:"0 0 8px" }}>
                  Message Sent!
                </h3>
                <p style={{ color:"#666", fontSize:"14px", margin:"0 0 24px" }}>
                  Thanks for reaching out! We'll get back to you soon.
                </p>
                <button
                  onClick={() => { setStatus("idle"); setFormData({ name:"", email:"", subject:"", message:"" }); }}
                  style={{
                    background:"rgba(255,77,0,0.1)", border:"1px solid rgba(255,77,0,0.3)",
                    color:"#ff4d00", padding:"10px 24px", borderRadius:"50px",
                    cursor:"pointer", fontSize:"13px", fontWeight:"600",
                  }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ color:"#fff", fontSize:"20px", fontWeight:"700", fontFamily:"'Georgia', serif", margin:"0 0 24px" }}>
                  Send a Message
                </h3>

                <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                    <div>
                      <label style={{ color:"#555", fontSize:"11px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:"6px" }}>Name</label>
                      <input
                        className="input-field"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ color:"#555", fontSize:"11px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:"6px" }}>Email</label>
                      <input
                        className="input-field"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ color:"#555", fontSize:"11px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:"6px" }}>Subject</label>
                    <input
                      className="input-field"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ color:"#555", fontSize:"11px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:"6px" }}>Message</label>
                    <textarea
                      className="input-field"
                      placeholder="Write your message here..."
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      style={{ resize:"vertical", minHeight:"120px" }}
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                    style={{
                      background: status === "loading"
                        ? "rgba(255,77,0,0.5)"
                        : "linear-gradient(135deg, #ff4d00, #ff8800)",
                      border:"none", borderRadius:"12px",
                      padding:"16px", color:"#fff",
                      fontSize:"15px", fontWeight:"700",
                      cursor: status === "loading" ? "not-allowed" : "pointer",
                      transition:"all 0.3s ease",
                      boxShadow: status === "loading" ? "none" : "0 0 20px rgba(255,77,0,0.3)",
                      letterSpacing:"0.5px",
                    }}
                    onMouseEnter={e => {
                      if (status !== "loading") {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(255,77,0,0.5)";
                      }
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(255,77,0,0.3)";
                    }}
                  >
                    {status === "loading" ? "Sending..." : "Send Message 🚀"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}