"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{
      position:"relative", overflow:"hidden",
      background:"linear-gradient(135deg, #0a0a0a 0%, #0f0a00 50%, #0a0a0a 100%)",
      padding:"100px 1.5rem 80px",
      textAlign:"center",
      borderBottom:"1px solid rgba(255,77,0,0.15)",
    }}>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-30px) translateX(15px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(20px) translateX(-20px)} }
        @keyframes glow { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }
        @keyframes titleGlow {
          0%,100%{filter:drop-shadow(0 0 20px rgba(255,77,0,0.5))}
          50%{filter:drop-shadow(0 0 40px rgba(255,77,0,0.8))}
        }
        @keyframes badgePulse {
          0%,100%{box-shadow:0 0 10px rgba(255,77,0,0.3)}
          50%{box-shadow:0 0 25px rgba(255,77,0,0.6)}
        }
        @keyframes btnHolo {
          0%{background-position:0% 50%}
          50%{background-position:100% 50%}
          100%{background-position:0% 50%}
        }
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(30px)}
          to{opacity:1;transform:translateY(0)}
        }
        .holo-btn:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 0 40px rgba(255,77,0,0.7) !important;
        }
      `}</style>

      {/* Floating orbs */}
      {[
        { w:300, h:300, top:"10%", left:"5%", color:"rgba(255,77,0,0.08)", anim:"float1 8s ease-in-out infinite" },
        { w:200, h:200, top:"60%", right:"10%", color:"rgba(255,100,0,0.06)", anim:"float2 10s ease-in-out infinite" },
        { w:400, h:400, bottom:"10%", left:"20%", color:"rgba(255,50,0,0.04)", anim:"float1 12s ease-in-out infinite reverse" },
      ].map((orb, i) => (
        <div key={i} style={{
          position:"absolute", width:orb.w, height:orb.h,
          borderRadius:"50%", background:orb.color,
          filter:"blur(60px)", animation:orb.anim,
          top:orb.top, left:(orb as any).left, right:(orb as any).right, bottom:(orb as any).bottom,
        }} />
      ))}

      {/* Grid overlay */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"linear-gradient(rgba(255,77,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.03) 1px, transparent 1px)",
        backgroundSize:"50px 50px",
        pointerEvents:"none",
      }} />

      <div style={{ maxWidth:"800px", margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* Badge */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:"8px",
          background:"rgba(255,77,0,0.1)", border:"1px solid rgba(255,77,0,0.3)",
          color:"#ff4d00", fontSize:"11px", fontWeight:"700",
          padding:"6px 16px", borderRadius:"50px",
          letterSpacing:"2px", textTransform:"uppercase",
          marginBottom:"28px",
          animation: mounted ? "badgePulse 2s ease-in-out infinite, fadeUp 0.6s ease forwards" : "none",
        }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#ff4d00", display:"inline-block", animation:"glow 1.5s ease-in-out infinite" }} />
          Tech Reviews & News
        </div>

        {/* Title */}
        <h1 style={{
          fontSize:"clamp(2.5rem, 7vw, 5rem)",
          fontWeight:"900", color:"#ffffff",
          lineHeight:"1.1", margin:"0 0 8px",
          fontFamily:"'Georgia', serif", letterSpacing:"-2px",
          animation: mounted ? "fadeUp 0.8s ease 0.2s both" : "none",
        }}>
          Welcome to
        </h1>
        <h1 style={{
          fontSize:"clamp(2.5rem, 7vw, 5rem)",
          fontWeight:"900", lineHeight:"1.1", margin:"0 0 24px",
          fontFamily:"'Georgia', serif", letterSpacing:"-2px",
          background:"linear-gradient(135deg, #ff4d00, #ff8800, #ff4d00)",
          backgroundSize:"200% auto",
          WebkitBackgroundClip:"text",
          WebkitTextFillColor:"transparent",
          animation: mounted ? "titleGlow 3s ease-in-out infinite, btnHolo 3s linear infinite, fadeUp 0.8s ease 0.3s both" : "none",
        }}>
          TechSuperStar
        </h1>

        <p style={{
          color:"#666", fontSize:"18px", lineHeight:"1.7",
          margin:"0 auto 40px", maxWidth:"500px",
          animation: mounted ? "fadeUp 0.8s ease 0.4s both" : "none",
        }}>
          Your ultimate source for honest tech reviews, buying guides, and the latest news
        </p>

        <div style={{ animation: mounted ? "fadeUp 0.8s ease 0.5s both" : "none" }}>
          <Link href="/articles" className="holo-btn" style={{
            display:"inline-block",
            background:"linear-gradient(135deg, #ff4d00, #ff6600, #ff8800, #ff6600, #ff4d00)",
            backgroundSize:"300% auto",
            color:"#fff", padding:"16px 40px", borderRadius:"50px",
            textDecoration:"none", fontWeight:"700", fontSize:"15px",
            boxShadow:"0 0 20px rgba(255,77,0,0.4)",
            transition:"all 0.3s ease",
            animation:"btnHolo 3s linear infinite",
          }}>
            Browse All Articles →
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display:"flex", justifyContent:"center", gap:"48px",
          marginTop:"60px", flexWrap:"wrap",
          animation: mounted ? "fadeUp 0.8s ease 0.6s both" : "none",
        }}>
          {[
                { num:"2.06M", label:"YouTube Subscribers" },
                { num:"3.2M+", label:"Video Views" },
                { num:"203K", label:"Likes" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:"28px", fontWeight:"800", color:"#ff4d00", fontFamily:"'Georgia', serif" }}>{stat.num}</div>
              <div style={{ fontSize:"11px", color:"#555", letterSpacing:"1px", textTransform:"uppercase", marginTop:"4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}