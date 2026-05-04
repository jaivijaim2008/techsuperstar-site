"use client";
import Link from "next/link";

export default function PostCard({ post }: any) {
  const categoryColors: Record<string, string> = {
    phones: "#ff4d00",
    laptops: "#0066ff",
    tablets: "#00aa44",
    gaming: "#aa00ff",
    reviews: "#ff6600",
    accessories: "#0099cc",
  };

  const getCategoryColor = (cat: string) => {
    return categoryColors[cat?.toLowerCase()] || "#ff4d00";
  };

  return (
    <Link href={`/post/${post.slug.current}`} style={{ textDecoration: "none" }}>
      <div style={{
        background: "#141414",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #1e1e1e",
        transition: "all 0.25s ease",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-4px)";
          el.style.borderColor = "#333";
          el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(0)";
          el.style.borderColor = "#1e1e1e";
          el.style.boxShadow = "none";
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", paddingTop: "56.25%", background: "#1a1a1a" }}>
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              style={{
                position: "absolute", top: 0, left: 0,
                width: "100%", height: "100%", objectFit: "cover",
              }}
            />
          ) : (
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)",
              color: "#444", fontSize: "40px",
            }}>
              📱
            </div>
          )}

          {/* Category Badge */}
          {post.categories && post.categories[0] && (
            <div style={{
              position: "absolute", top: "12px", left: "12px",
              background: getCategoryColor(post.categories[0]),
              color: "#fff", fontSize: "11px", fontWeight: "700",
              padding: "4px 10px", borderRadius: "4px",
              textTransform: "uppercase", letterSpacing: "0.8px",
              fontFamily: "'Arial', sans-serif",
            }}>
              {post.categories[0]}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{
            color: "#ffffff", fontSize: "15px", fontWeight: "600",
            lineHeight: "1.5", margin: "0 0 12px",
            fontFamily: "'Georgia', serif",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {post.title}
          </h3>

          {/* Meta */}
          <div style={{
            marginTop: "auto", display: "flex", alignItems: "center",
            justifyContent: "space-between", paddingTop: "12px",
            borderTop: "1px solid #1e1e1e",
          }}>
            <span style={{ color: "#666", fontSize: "12px", fontFamily: "'Arial', sans-serif" }}>
              {post.author || "TechSuperStar"}
            </span>
            {post.publishedAt && (
              <span style={{ color: "#555", fontSize: "12px", fontFamily: "'Arial', sans-serif" }}>
                {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric"
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}