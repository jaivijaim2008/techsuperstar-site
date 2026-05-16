"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TiltCard from "./TiltCard";

function timeAgo(dateStr: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 36e5);
  const d = Math.floor(diff / 864e5);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  if (d < 30) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// Category colors - your custom colors
const CATEGORY_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  phones: { color: "#ff4d00", bg: "rgba(255, 77, 0, 0.1)", border: "rgba(255, 77, 0, 0.3)" },
  laptops: { color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.3)" },
  tablets: { color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.3)" },
  gaming: { color: "#a855f7", bg: "rgba(168, 85, 247, 0.1)", border: "rgba(168, 85, 247, 0.3)" },
  reviews: { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.3)" },
  accessories: { color: "#06b6d4", bg: "rgba(6, 182, 212, 0.1)", border: "rgba(6, 182, 212, 0.3)" },
  comparisons: { color: "#FFD700", bg: "rgba(255, 215, 0, 0.1)", border: "rgba(255, 215, 0, 0.3)" },
};

function getCategoryColor(category: string) {
  const normalized = category?.toLowerCase().replace(/[^a-z]/g, "") || "phones";
  return CATEGORY_COLORS[normalized] || CATEGORY_COLORS.phones;
}

const CATEGORIES = [
  { name: "All",         href: "/articles" },
  { name: "Phones",      href: "/category/phones" },
  { name: "Laptops",     href: "/category/laptops" },
  { name: "Tablets",     href: "/category/tablets" },
  { name: "Gaming",      href: "/category/gaming" },
  { name: "Comparisons", href: "/category/comparisons" },
  { name: "Accessories", href: "/category/accessories" },
];

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#111",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "16px",
      overflow: "hidden",
      marginBottom: "16px",
    }}>
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{
          width: 3, height: 14,
          background: "#ff4d00",
          borderRadius: 2,
          display: "inline-block",
          flexShrink: 0,
          boxShadow: "0 0 8px rgba(255,77,0,0.5)",
        }} />
        <span style={{
          fontSize: "10px",
          fontWeight: "700",
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: "2px",
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function LiveSubscriberCount() {
  const [subscribers, setSubscribers] = useState("2.08M");

  useEffect(() => {
    fetch("/api/youtube-stats")
      .then((r) => r.json())
      .then((data) => { if (data.subscribers) setSubscribers(data.subscribers); })
      .catch(() => {});
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      marginBottom: "16px",
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: "22px",
          fontWeight: "800",
          color: "#ff4d00",
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          lineHeight: 1,
        }}>
          {subscribers}
        </div>
        <div style={{
          fontSize: "10px",
          color: "#555",
          letterSpacing: "1px",
          textTransform: "uppercase",
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          marginTop: "4px",
        }}>
          Subscribers
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ posts }: { posts: any[] }) {
  const pathname = usePathname() || "";

  // Determine active category
  const getActiveCategory = () => {
    if (!pathname) return null;
    if (pathname === "/articles") return "All";
    if (pathname.includes("/category/phones")) return "Phones";
    if (pathname.includes("/category/laptops")) return "Laptops";
    if (pathname.includes("/category/tablets")) return "Tablets";
    if (pathname.includes("/category/gaming")) return "Gaming";
    if (pathname.includes("/category/comparisons")) return "Comparisons";
    if (pathname.includes("/category/accessories")) return "Accessories";
    return null;
  };

  const activeCategory = getActiveCategory();

  return (
    <>
      <style suppressHydrationWarning>{`
        .sidebar-yt-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255,77,0,0.5) !important;
        }
        .cat-pill {
          transition: all 0.3s ease;
        }
        .cat-pill:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }
        .cat-pill.active {
          transform: translateY(-2px);
        }
        .trending-row:hover {
          background: rgba(255,77,0,0.04) !important;
        }
        .view-all-link:hover {
          background: rgba(255,77,0,0.1) !important;
          border-color: rgba(255,77,0,0.4) !important;
        }
      `}</style>

      <aside className="sidebar-inner">

        {/* YouTube Banner */}
        <div style={{ 
          marginBottom: "16px",
          background: "linear-gradient(135deg, #1a0800, #0f0500, #1a0800)",
          border: "1px solid rgba(255,77,0,0.25)",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center",
          position: "relative",
          overflow: "visible",
        }}>
          <TiltCard>
            <div style={{
              background: "transparent",
              border: "none",
              borderRadius: "0px",
              padding: "0px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              height: "100%",
            }}>
          <div style={{
            position: "absolute", top: "-40px", left: "50%",
            transform: "translateX(-50%)",
            width: "200px", height: "120px",
            background: "radial-gradient(ellipse, rgba(255,77,0,0.15), transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{
            width: "52px", height: "52px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #ff4d00",
            boxShadow: "0 0 16px rgba(255,77,0,0.4)",
            margin: "0 auto 12px",
            position: "relative", zIndex: 1,
          }}>
            <img src="/favicon.jpg" alt="TechSuperStar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div style={{
            fontSize: "15px", fontWeight: "700", color: "#fff",
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            marginBottom: "4px", position: "relative", zIndex: 1,
          }}>
            Tech<span style={{ color: "#ff4d00" }}>SuperStar</span>
          </div>

          <div style={{
            fontSize: "10px", color: "#555",
            letterSpacing: "1.5px", textTransform: "uppercase",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            marginBottom: "14px", position: "relative", zIndex: 1,
          }}>
            Tamil Tech Reviews
          </div>

          <LiveSubscriberCount />
            </div>
          </TiltCard>

          {/* Subscribe Button - Inside wrapper but outside TiltCard */}
          <a
            href="https://www.youtube.com/@TechSuperStarOfficial"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-yt-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#ff4d00",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              boxShadow: "0 4px 16px rgba(255,77,0,0.35)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              position: "relative",
              zIndex: 10,
              minWidth: "min(160px, 80%)",
              justifyContent: "center",
              cursor: "pointer",
              border: "none",
              marginTop: "14px",
            }}
          >
            ▶ Subscribe Free
          </a>
        </div>

        {/* Categories */}
        <SidebarSection title="Browse by Category">
          <div style={{ padding: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {CATEGORIES.map((cat) => {
              const isAll = cat.name === "All";
              const isActive = activeCategory === cat.name;
              const colors = isAll ? null : getCategoryColor(cat.name);

              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className={`cat-pill${isActive ? " active" : ""}`}
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: isActive ? "#fff" : isAll ? "#666" : colors?.color,
                    background: isActive 
                      ? (isAll ? "#ff4d00" : colors?.color)
                      : (isAll ? "rgba(255,255,255,0.03)" : colors?.bg),
                    border: isActive 
                      ? `1px solid ${isAll ? "#ff4d00" : colors?.color}`
                      : (isAll ? "1px solid rgba(255,255,255,0.07)" : `1px solid ${colors?.border}`),
                    borderRadius: "20px",
                    padding: "6px 13px",
                    textDecoration: "none",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    transition: "all 0.3s ease",
                    display: "inline-block",
                    minHeight: "32px",
                    lineHeight: "20px",
                    boxShadow: isActive 
                      ? `0 0 12px ${isAll ? "rgba(255,77,0,0.4)" : `${colors?.color}66`}`
                      : "none",
                  }}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </SidebarSection>

        {/* Trending */}
        <SidebarSection title="Trending Now">
          {posts.slice(0, 5).map((post: any, i: number) => (
            <Link
              key={post.slug?.current}
              href={`/post/${post.slug?.current}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <TiltCard>
                <div
                  className="trending-row"
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "12px 14px",
                  borderBottom: i < Math.min(posts.length, 5) - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  alignItems: "flex-start",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                <div style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: "22px",
                  color: "#ff4d00",
                  lineHeight: 1,
                  minWidth: "28px",
                  opacity: 0.85,
                  flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div style={{
                  width: "56px", height: "46px",
                  borderRadius: "6px",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "#1a1a1a",
                }}>
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%",
                      background: "linear-gradient(135deg, #1a0800, #0f0500)",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "18px",
                    }}>
                      📱
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {post.categories?.[0] && (
                    (() => {
                      const colors = getCategoryColor(post.categories[0]);
                      return (
                        <div style={{
                          fontSize: "9px",
                          color: colors.color,
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                          marginBottom: "3px",
                        }}>
                          {post.categories[0]}
                        </div>
                      );
                    })()
                  )}
                  <div style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#ccc",
                    lineHeight: "1.4",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {post.title}
                  </div>
                  <div style={{
                    fontSize: "10px", color: "#555",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    marginTop: "4px",
                  }}>
                    {timeAgo(post.publishedAt)}
                  </div>
                </div>
                </div>
              </TiltCard>
            </Link>
          ))}

          <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <Link
              href="/articles"
              className="view-all-link"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                color: "#ff4d00",
                fontSize: "12px",
                fontWeight: "600",
                textDecoration: "none",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid rgba(255,77,0,0.2)",
                background: "rgba(255,77,0,0.04)",
                transition: "all 0.2s ease",
                minHeight: "40px",
              }}
            >
              View All Articles →
            </Link>
          </div>
        </SidebarSection>

      </aside>
    </>
  );
}