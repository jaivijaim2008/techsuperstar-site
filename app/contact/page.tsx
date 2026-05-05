"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus("loading");
    await new Promise(r => setTimeout(r, 1500));
    setStatus("success");
  };

  // ✅ UPDATED CONTACT INFO WITH LINKS
  const contactInfo = [
    { icon: "📧", label: "Email", value: "collab@techsuperstar.in", link: "mailto:collab@techsuperstar.in", color: "#ff4d00" },
    { icon: "📺", label: "YouTube", value: "@TechSuperStarOfficial", link: "https://www.youtube.com/@TechSuperStarOfficial", color: "#ff0000" },
    { icon: "📸", label: "Instagram", value: "@techsuperstarofficial", link: "https://www.instagram.com/techsuperstarofficial/", color: "#e1306c" },
    { icon: "🐦", label: "Twitter/X", value: "@Tech_SuperStar", link: "https://x.com/Tech_SuperStar", color: "#1da1f2" },
  ];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Arial', sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"60px 1.5rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:"40px" }}>

          {/* LEFT SIDE */}
          <div>
            <h2 style={{ color:"#fff" }}>Let's Connect</h2>

            <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginTop:"20px" }}>
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  style={{
                    background:"#111",
                    border:"1px solid rgba(255,255,255,0.06)",
                    borderRadius:"14px",
                    padding:"16px 20px",
                    display:"flex",
                    alignItems:"center",
                    gap:"14px",
                  }}
                >
                  <div style={{
                    width:"44px",
                    height:"44px",
                    borderRadius:"12px",
                    background:`${info.color}15`,
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontSize:"20px",
                  }}>
                    {info.icon}
                  </div>

                  <div>
                    <div style={{ color:"#555", fontSize:"11px" }}>
                      {info.label}
                    </div>

                    {/* ✅ CLICKABLE LINK */}
                    <div style={{ fontSize:"13px" }}>
                      <a
                        href={info.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: info.color, textDecoration: "none" }}
                      >
                        {info.value}
                      </a>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div style={{
            background:"#111",
            padding:"30px",
            borderRadius:"20px"
          }}>
            {status === "success" ? (
              <h3 style={{ color:"#fff" }}>Message Sent 🎉</h3>
            ) : (
              <>
                <input
                  placeholder="Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width:"100%", marginBottom:"10px", padding:"10px" }}
                />
                <input
                  placeholder="Email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width:"100%", marginBottom:"10px", padding:"10px" }}
                />
                <textarea
                  placeholder="Message"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{ width:"100%", marginBottom:"10px", padding:"10px" }}
                />
                <button onClick={handleSubmit} style={{ padding:"10px 20px" }}>
                  Send
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}