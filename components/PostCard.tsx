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
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 6px ${color}66; }
          50%      { box-shadow: 0 0 14px ${color}99; }
        }

        /* ── All hover-dependent styles live here, NOT in inline style props ── */

        .post-card {
          background: #111111;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.35s ease;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          transform: translateY(0);
          box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }
        .post-card:hover {
          background: linear-gradient(135deg, #161616, #121212);
          border-color: ${color}55;
          transform: translateY(-8px);
          box-shadow: 0 20px 60px ${glow}, 0 0 0 1px ${color}22;
        }

        /* Corner accents — shown only on hover via opacity */
        .post-card-corner {
          position: absolute;
          width: 20px; height: 20px;
          opacity: 0;
          transition: opacity 0.35s ease;
          z-index: 2;
          pointer-events: none;
        }
        .post-card:hover .post-card-corner { opacity: 1; }
        .post-card-corner-tl {
          top: 0; left: 0;
          border-top: 2px solid ${color};
          border-left: 2px solid ${color};
          border-radius: 16px 0 0 0;
        }
        .post-card-corner-tr {
          top: 0; right: 0;
          border-top: 2px solid ${color};
          border-right: 2px solid ${color};
          border-radius: 0 16px 0 0;
        }

        /* Image zoom */
        .post-card-img {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s ease;
          transform: scale(1);
        }
        .post-card:hover .post-card-img { transform: scale(1.06); }

        /* Image overlay */
        .post-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%);
          transition: background 0.35s ease;
        }
        .post-card:hover .post-card-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%);
        }

        /* Category badge */
        .post-card-badge {
          position: absolute; top: 12px; left: 12px;
          background: ${color};
          color: #fff; font-size: 10px; font-weight: 800;
          padding: 4px 12px; border-radius: 50px;
          text-transform: uppercase; letter-spacing: 1.5px;
          font-family: 'Arial', sans-serif;
          box-shadow: 0 0 10px ${glow};
          animation: none;
        }
        .post-card:hover .post-card-badge {
          animation: badgePulse 1.5s ease-in-out infinite;
        }

        /* Title — shimmer only on hover */
        .post-card-title {
          font-size: 15px; font-weight: 700;
          line-height: 1.5; margin: 0 0 12px;
          font-family: 'Georgia', serif;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #ffffff;
          transition: all 0.35s ease;
          /* No background-clip on server — avoids the #425 mismatch */
        }
        .post-card:hover .post-card-title {
          background: linear-gradient(90deg, #fff, ${color}, #fff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s linear infinite;
        }

        /* Meta divider */
        .post-card-meta {
          margin-top: auto;
          display: flex; align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
          transition: border-color 0.35s ease;
        }
        .post-card:hover .post-card-meta {
          border-top-color: ${color}22;
        }

        /* Read more arrow */
        .post-card-read-more {
          margin-top: 12px;
          display: flex; align-items: center; gap: 6px;
          color: #444;
          font-size: 12px; font-weight: 700;
          font-family: 'Arial', sans-serif;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: color 0.35s ease;
        }
        .post-card:hover .post-card-read-more { color: ${color}; }

        .post-card-arrow {
          display: inline-block;
          transform: translateX(0);
          transition: transform 0.35s ease;
        }
        .post-card:hover .post-card-arrow { transform: translateX(4px); }
      `}</style>

      <Link href={`/post/${post.slug.current}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        <div
          className="post-card"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Corner accents */}
          <div className="post-card-corner post-card-corner-tl" />
          <div className="post-card-corner post-card-corner-tr" />

          {/* Image */}
          <div style={{ position: "relative", paddingTop: "56.25%", background: "#1a1a1a", overflow: "hidden" }}>
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="post-card-img"
              />
            ) : (
              <div style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `linear-gradient(135deg, #1a1a1a, ${color}11)`,
                color: "#444", fontSize: "48px",
              }}>
                📱
              </div>
            )}

            <div className="post-card-overlay" />

            {/* Category Badge */}
            {post.categories?.[0] && (
              <div className="post-card-badge">
                {post.categories[0]}
              </div>
            )}

            {/* Read time badge */}
            <div style={{
              position: "absolute", top: "12px", right: "12px",
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
              color: "#aaa", fontSize: "10px", fontWeight: "600",
              padding: "4px 10px", borderRadius: "50px",
              fontFamily: "'Arial', sans-serif",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              5 min read
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>

            <h3 className="post-card-title">{post.title}</h3>

            {/* Meta */}
            <div className="post-card-meta">
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${color}, ${color}88)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: "700", color: "#fff",
                }}>
                  {(post.author || "T")[0].toUpperCase()}
                </div>
                <span style={{ color: "#666", fontSize: "12px", fontFamily: "'Arial', sans-serif" }}>
                  {post.author || "TechSuperStar"}
                </span>
              </div>

              {post.publishedAt && (
                <span style={{ color: "#555", fontSize: "11px", fontFamily: "'Arial', sans-serif" }}>
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* Read more */}
            <div className="post-card-read-more">
              Read Article
              <span className="post-card-arrow">→</span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
