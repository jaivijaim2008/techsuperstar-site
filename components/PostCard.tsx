"use client";
import Link from "next/link";
import { useState } from "react";

const categoryColors: Record<string, { color: string; glow: string }> = {
  phones:      { color: "#ff4d00", glow: "rgba(255,77,0,0.3)" },
  laptops:     { color: "#0066ff", glow: "rgba(0,102,255,0.3)" },
  tablets:     { color: "#00cc66", glow: "rgba(0,204,102,0.3)" },
  gaming:      { color: "#aa00ff", glow: "rgba(170,0,255,0.3)" },
  reviews:     { color: "#ff8800", glow: "rgba(255,136,0,0.3)" },
  accessories: { color: "#00ccff", glow: "rgba(0,204,255,0.3)" },
};

export default function PostCard({ post }: any) {
  const [hovered, setHovered] = useState(false);

  const cat = post.categories?.[0]?.toLowerCase() || "";
  const { color, glow } = categoryColors[cat] || { color: "#ff4d00", glow: "rgba(255,77,0,0.3)" };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%{background-position:-200% center}
          100%{background-position:200% center}
        }
        @keyframes badgePulse {
          0%,100%{box-shadow:0 0 6px ${color}66}
          50%{box-shadow:0 0 14px ${color}99}
        }
      `}</style>

      <Link href={`/post/${post.slug.current}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: hovered
              ? "linear-gradient(135deg, #161616, #121212)"
              : "#111111",
            borderRadius: "16px",
            overflow: "hidden",
            border: `1px solid ${hovered ? color + "55" : "rgba(255,255,255,0.06)"}`,
            transition: "all 0.35s ease",
            cursor: "pointer",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            transform: hovered ? "translateY(-8px)" : "translateY(0)",
            boxShadow: hovered
              ? `0 20px 60px ${glow}, 0 0 0 1px ${color}22`
              : "0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          {/* Corner accents */}
          {hovered && <>
            <div style={{ position:"absolute", top:0, left:0, width:20, height:20, borderTop:`2px solid ${color}`, borderLeft:`2px solid ${color}`, borderRadius:"16px 0 0 0", zIndex:2 }} />
            <div style={{ position:"absolute", top:0, right:0, width:20, height:20, borderTop:`2px solid ${color}`, borderRight:`2px solid ${color}`, borderRadius:"0 16px 0 0", zIndex:2 }} />
          </>}

          {/* Image */}
          <div style={{ position:"relative", paddingTop:"56.25%", background:"#1a1a1a", overflow:"hidden" }}>
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                style={{
                  position:"absolute", top:0, left:0,
                  width:"100%", height:"100%", objectFit:"cover",
                  transition:"transform 0.5s ease",
                  transform: hovered ? "scale(1.06)" : "scale(1)",
                }}
              />
            ) : (
              <div style={{
                position:"absolute", top:0, left:0, width:"100%", height:"100%",
                display:"flex", alignItems:"center", justifyContent:"center",
                background:`linear-gradient(135deg, #1a1a1a, ${color}11)`,
                color:"#444", fontSize:"48px",
              }}>
                📱
              </div>
            )}

            {/* Dark overlay on hover */}
            <div style={{
              position:"absolute", inset:0,
              background: hovered ? "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" : "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)",
              transition:"all 0.35s ease",
            }} />

            {/* Category Badge */}
            {post.categories?.[0] && (
              <div style={{
                position:"absolute", top:"12px", left:"12px",
                background: color,
                color:"#fff", fontSize:"10px", fontWeight:"800",
                padding:"4px 12px", borderRadius:"50px",
                textTransform:"uppercase", letterSpacing:"1.5px",
                fontFamily:"'Arial', sans-serif",
                animation: hovered ? "badgePulse 1.5s ease-in-out infinite" : "none",
                boxShadow: `0 0 10px ${glow}`,
              }}>
                {post.categories[0]}
              </div>
            )}

            {/* Read time badge */}
            <div style={{
              position:"absolute", top:"12px", right:"12px",
              background:"rgba(0,0,0,0.7)",
              backdropFilter:"blur(8px)",
              color:"#aaa", fontSize:"10px", fontWeight:"600",
              padding:"4px 10px", borderRadius:"50px",
              fontFamily:"'Arial', sans-serif",
              border:"1px solid rgba(255,255,255,0.1)",
            }}>
              5 min read
            </div>
          </div>

          {/* Content */}
          <div style={{ padding:"18px", flex:1, display:"flex", flexDirection:"column" }}>

            {/* Title */}
            <h3 style={{
              fontSize:"15px", fontWeight:"700",
              lineHeight:"1.5", margin:"0 0 12px",
              fontFamily:"'Georgia', serif",
              display:"-webkit-box",
              WebkitLineClamp:2,
              WebkitBoxOrient:"vertical",
              overflow:"hidden",
              background: hovered
                ? `linear-gradient(90deg, #fff, ${color}, #fff)`
                : "none",
              backgroundSize:"200% auto",
              WebkitBackgroundClip: hovered ? "text" : "unset",
              WebkitTextFillColor: hovered ? "transparent" : "#ffffff",
              animation: hovered ? "shimmer 2s linear infinite" : "none",
              transition:"all 0.35s ease",
            }}>
              {post.title}
            </h3>

            {/* Meta */}
            <div style={{
              marginTop:"auto",
              display:"flex", alignItems:"center",
              justifyContent:"space-between",
              paddingTop:"12px",
              borderTop:`1px solid ${hovered ? color + "22" : "rgba(255,255,255,0.06)"}`,
              transition:"border-color 0.35s ease",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                <div style={{
                  width:"22px", height:"22px", borderRadius:"50%",
                  background:`linear-gradient(135deg, ${color}, ${color}88)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"10px", fontWeight:"700", color:"#fff",
                }}>
                  {(post.author || "T")[0].toUpperCase()}
                </div>
                <span style={{ color:"#666", fontSize:"12px", fontFamily:"'Arial', sans-serif" }}>
                  {post.author || "TechSuperStar"}
                </span>
              </div>

              {post.publishedAt && (
                <span style={{ color:"#555", fontSize:"11px", fontFamily:"'Arial', sans-serif" }}>
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    day:"numeric", month:"short", year:"numeric"
                  })}
                </span>
              )}
            </div>

            {/* Read more */}
            <div style={{
              marginTop:"12px",
              display:"flex", alignItems:"center", gap:"6px",
              color: hovered ? color : "#444",
              fontSize:"12px", fontWeight:"700",
              fontFamily:"'Arial', sans-serif",
              letterSpacing:"0.5px",
              textTransform:"uppercase",
              transition:"color 0.35s ease",
            }}>
              Read Article
              <span style={{
                transform: hovered ? "translateX(4px)" : "translateX(0)",
                transition:"transform 0.35s ease",
                display:"inline-block",
              }}>→</span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}