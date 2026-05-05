"use client";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import CategoryGrid from "@/components/CategoryGrid";
import { getPosts } from "@/lib/query";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";

// Hologram animated background particles
function Particles() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-30px) translateX(15px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(20px) translateX(-20px)} }
        @keyframes float3 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-15px) translateX(25px)} }
        @keyframes hologram {
          0%{background-position:0% 50%}
          50%{background-position:100% 50%}
          100%{background-position:0% 50%}
        }
        @keyframes scanline {
          0%{transform:translateY(-100%)}
          100%{transform:translateY(100vh)}
        }
        @keyframes glow {
          0%,100%{opacity:0.4;transform:scale(1)}
          50%{opacity:0.8;transform:scale(1.05)}
        }
        @keyframes titleGlow {
          0%,100%{text-shadow:0 0 20px #ff4d00,0 0 40px #ff4d00,0 0 80px #ff6600}
          50%{text-shadow:0 0 40px #ff4d00,0 0 80px #ff6600,0 0 120px #ff8800}
        }
        @keyframes badgePulse {
          0%,100%{box-shadow:0 0 10px #ff4d00,0 0 20px #ff4d00}
          50%{box-shadow:0 0 20px #ff4d00,0 0 40px #ff6600,0 0 60px #ff8800}
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
        @keyframes shimmer {
          0%{background-position:-200% center}
          100%{background-position:200% center}
        }
        @keyframes borderGlow {
          0%,100%{border-color:rgba(255,77,0,0.3)}
          50%{border-color:rgba(255,77,0,0.8)}
        }
        .holo-card:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 20px 60px rgba(255,77,0,0.3), 0 0 30px rgba(255,77,0,0.1) !important;
          border-color: rgba(255,77,0,0.6) !important;
        }
        .holo-btn:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 0 30px rgba(255,77,0,0.6), 0 0 60px rgba(255,77,0,0.3) !important;
        }
        .section-title {
          background: linear-gradient(90deg, #fff 0%, #ff4d00 50%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Floating orbs */}
      {[
        { w:300, h:300, top:"10%", left:"5%", color:"rgba(255,77,0,0.08)", anim:"float1 8s ease-in-out infinite" },
        { w:200, h:200, top:"60%", right:"10%", color:"rgba(255,100,0,0.06)", anim:"float2 10s ease-in-out infinite" },
        { w:150, h:150, top:"30%", right:"25%", color:"rgba(255,150,0,0.05)", anim:"float3 6s ease-in-out infinite" },
        { w:400, h:400, bottom:"10%", left:"20%", color:"rgba(255,50,0,0.04)", anim:"float1 12s ease-in-out infinite reverse" },
      ].map((orb, i) => (
        <div key={i} style={{
          position:"absolute", width:orb.w, height:orb.h,
          borderRadius:"50%", background:orb.color,
          filter:"blur(60px)", animation:orb.anim,
          top:orb.top, left:orb.left, right:orb.right, bottom:orb.bottom,
        }} />
      ))}

      {/* Scanline effect */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,77,0,0.015) 2px, rgba(255,77,0,0.015) 4px)",
        pointerEvents:"none",
      }} />
    </div>
  );
}

// Holographic hero text
function HeroSection() {
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
      <Particles />

      {/* Grid pattern overlay */}
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

        {/* Main title */}
        <h1 style={{
          fontSize:"clamp(2.5rem, 7vw, 5rem)",
          fontWeight:"900", color:"#ffffff",
          lineHeight:"1.1", margin:"0 0 8px",
          fontFamily:"'Georgia', serif",
          letterSpacing:"-2px",
          animation: mounted ? "fadeUp 0.8s ease 0.2s both" : "none",
        }}>
          Welcome to
        </h1>
        <h1 style={{
          fontSize:"clamp(2.5rem, 7vw, 5rem)",
          fontWeight:"900",
          lineHeight:"1.1", margin:"0 0 24px",
          fontFamily:"'Georgia', serif",
          letterSpacing:"-2px",
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
          margin:"0 0 40px", maxWidth:"500px", marginLeft:"auto", marginRight:"auto",
          animation: mounted ? "fadeUp 0.8s ease 0.4s both" : "none",
        }}>
          Your ultimate source for honest tech reviews, buying guides, and the latest news
        </p>

        {/* CTA Button */}
        <div style={{ animation: mounted ? "fadeUp 0.8s ease 0.5s both" : "none" }}>
          <Link href="/articles" className="holo-btn" style={{
            display:"inline-block",
            background:"linear-gradient(135deg, #ff4d00, #ff6600, #ff8800, #ff6600, #ff4d00)",
            backgroundSize:"300% auto",
            color:"#fff",
            padding:"16px 40px", borderRadius:"50px",
            textDecoration:"none", fontWeight:"700", fontSize:"15px",
            letterSpacing:"0.5px",
            boxShadow:"0 0 20px rgba(255,77,0,0.4)",
            transition:"all 0.3s ease",
            animation:"btnHolo 3s linear infinite",
          }}>
            Browse All Articles →
          </Link>
        </div>

        {/* Stats row */}
        <div style={{
          display:"flex", justifyContent:"center", gap:"40px",
          marginTop:"60px", flexWrap:"wrap",
          animation: mounted ? "fadeUp 0.8s ease 0.6s both" : "none",
        }}>
          {[
            { num:"2M+", label:"YouTube Subscribers" },
            { num:"100+", label:"Tech Reviews" },
            { num:"98K+", label:"Video Views" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{
                fontSize:"28px", fontWeight:"800", color:"#ff4d00",
                fontFamily:"'Georgia', serif",
              }}>{stat.num}</div>
              <div style={{ fontSize:"12px", color:"#555", letterSpacing:"1px", textTransform:"uppercase" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const revalidate = 0;

export default async function Home() {
  const posts = await getPosts();
  const latestPosts = posts?.slice(0, 6);

  return (
    <div style={{ background:"#0a0a0a", minHeight:"100vh", fontFamily:"'Arial', sans-serif" }}>
      <Navbar />
      <HeroSection />

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"0 1.5rem" }}>
        <CategoryGrid />

        {/* Latest Articles */}
        <div style={{ padding:"60px 0" }}>
          <div style={{
            display:"flex", alignItems:"center",
            justifyContent:"space-between", marginBottom:"32px",
          }}>
            <div>
              <h2 className="section-title" style={{
                fontSize:"28px", fontWeight:"800",
                margin:"0 0 4px", fontFamily:"'Georgia', serif",
              }}>
                Latest Articles
              </h2>
              <div style={{ width:"60px", height:"3px", background:"linear-gradient(90deg, #ff4d00, transparent)", borderRadius:"2px" }} />
            </div>
            <Link href="/articles" style={{
              color:"#ff4d00", textDecoration:"none",
              fontSize:"13px", fontWeight:"600",
              border:"1px solid rgba(255,77,0,0.3)",
              padding:"8px 16px", borderRadius:"50px",
              transition:"all 0.3s ease",
            }}>
              View All →
            </Link>
          </div>

          {latestPosts && latestPosts.length > 0 ? (
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",
              gap:"20px",
            }}>
              {latestPosts.filter((post: any) => post?.slug?.current).map((post: any) => (
                <PostCard key={post.slug.current} post={post} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign:"center", padding:"80px 20px",
              color:"#555", fontSize:"15px",
              background:"linear-gradient(135deg, #111, #141414)",
              borderRadius:"16px",
              border:"1px solid rgba(255,77,0,0.1)",
            }}>
              No articles yet. Start creating posts in the studio!
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}