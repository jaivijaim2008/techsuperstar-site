"use client";
import Link from "next/link";

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

function NumBadge({ n, size = "large" }: { n: number; size?: "large" | "small" }) {
  return (
    <div style={{
      fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
      fontWeight: 900,
      fontSize: size === "large" ? "clamp(36px, 7vw, 72px)" : "clamp(22px, 4vw, 40px)",
      color: "#ff4d00",
      lineHeight: 1,
      opacity: 0.9,
      letterSpacing: "-2px",
      flexShrink: 0,
      textShadow: "0 0 30px rgba(255,77,0,0.3)",
    }}>
      #{String(n).padStart(2, "0")}
    </div>
  );
}

function CatBadge({ cat }: { cat: string }) {
  // Your custom colors
  const categoryColors: Record<string, string> = {
    phones: "#ff4d00",
    laptops: "#3b82f6",
    tablets: "#10b981",
    gaming: "#a855f7",
    comparisons: "#FFD700",
    accessories: "#06b6d4",
    reviews: "#f59e0b",
  };

  const normalized = cat?.toLowerCase().replace(/[^a-z]/g, "") || "phones";
  const color = categoryColors[normalized] || "#ff4d00";

  return (
    <span style={{
      display: "inline-block",
      background: color,
      color: "#fff",
      fontSize: "9px",
      fontWeight: "800",
      padding: "3px 10px",
      borderRadius: "3px",
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    }}>
      {cat}
    </span>
  );
}

// ── Hero card (post #1) ────────────────────────────────────────────────────
function HeroCard({ post, num }: { post: any; num: number }) {
  return (
    <>
      <style suppressHydrationWarning>{`
        .hero-card { transition: all 0.3s ease; }
        .hero-card:hover .hero-img { transform: scale(1.04); }
        .hero-card:hover .hero-title { color: #ffaa55 !important; }
      `}</style>

      <Link href={`/post/${post.slug?.current}`} style={{ textDecoration: "none", display: "block" }}>
        <div className="hero-card" style={{
          position: "relative",
          minHeight: "clamp(220px, 45vw, 380px)",
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
          background: "#111",
        }}>
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="hero-img"
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
            />
          ) : (
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, #1a0800, #0f0500, #1a0800)",
            }} />
          )}

          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
          }} />

          <div style={{
            position: "relative", zIndex: 2,
            padding: "clamp(14px, 4vw, 24px)",
            display: "flex", flexDirection: "column",
            justifyContent: "flex-end",
            height: "100%",
            boxSizing: "border-box",
          }}>
            <NumBadge n={num} size="large" />
            <div style={{ marginTop: "8px", marginBottom: "10px" }}>
              <CatBadge cat={post.categories?.[0] || "Tech"} />
            </div>
            <h2 className="hero-title" style={{
              fontSize: "clamp(15px, 3.5vw, 26px)",
              fontWeight: "700",
              color: "#fff",
              lineHeight: "1.3",
              margin: "0 0 10px",
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              transition: "color 0.3s ease",
            }}>
              {post.title}
            </h2>
            <div style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              display: "flex", gap: "10px", alignItems: "center",
            }}>
              <span>{post.author || "TechSuperStar"}</span>
              <span style={{ color: "#ff4d00" }}>•</span>
              <span>{timeAgo(post.publishedAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

// ── Secondary stacked card ─────────────────────────────────────────────────
function SecondaryCard({ post, num }: { post: any; num: number }) {
  return (
    <>
      <style suppressHydrationWarning>{`
        .sec-card { transition: background 0.2s ease; }
        .sec-card:hover { background: rgba(255,77,0,0.04) !important; }
        .sec-card:hover .sec-title { color: #ff4d00 !important; }
        .sec-thumb-img { transition: transform 0.4s ease; }
        .sec-card:hover .sec-thumb-img { transform: scale(1.06); }
      `}</style>

      <Link href={`/post/${post.slug?.current}`} style={{ textDecoration: "none" }}>
        <div className="sec-card" style={{
          display: "flex",
          gap: "10px",
          padding: "12px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          alignItems: "flex-start",
          cursor: "pointer",
        }}>
          <NumBadge n={num} size="small" />

          <div style={{
            width: "clamp(60px, 15vw, 80px)",
            height: "clamp(48px, 12vw, 64px)",
            borderRadius: "8px",
            overflow: "hidden",
            flexShrink: 0,
            background: "#1a1a1a",
          }}>
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="sec-thumb-img"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                background: "linear-gradient(135deg, #1a0800, #0f0500)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px",
              }}>📱</div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: "4px" }}>
              <CatBadge cat={post.categories?.[0] || "Tech"} />
            </div>
            <h3 className="sec-title" style={{
              fontSize: "clamp(11px, 2.5vw, 13px)",
              fontWeight: "600",
              color: "#ddd",
              lineHeight: "1.4",
              margin: "0 0 4px",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              transition: "color 0.2s ease",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {post.title}
            </h3>
            <div style={{
              fontSize: "10px",
              color: "#555",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}>
              {timeAgo(post.publishedAt)}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

// ── Bottom small card ──────────────────────────────────────────────────────
function BottomCard({ post, num }: { post: any; num: number }) {
  return (
    <>
      <style suppressHydrationWarning>{`
        .bot-card { transition: border-color 0.2s ease, transform 0.2s ease; }
        .bot-card:hover { border-color: rgba(255,77,0,0.4) !important; transform: translateY(-4px); }
        .bot-card:hover .bot-title { color: #ff4d00 !important; }
        .bot-img { transition: transform 0.4s ease; }
        .bot-card:hover .bot-img { transform: scale(1.05); }
      `}</style>

      <Link href={`/post/${post.slug?.current}`} style={{ textDecoration: "none" }}>
        <div className="bot-card" style={{
          background: "#111",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "pointer",
        }}>
          <div style={{
            position: "relative",
            paddingTop: "56.25%",
            background: "#1a1a1a",
            overflow: "hidden",
          }}>
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="bot-img"
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg, #1a0800, #0f0500)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "36px",
              }}>📱</div>
            )}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)",
            }} />
            <div style={{
              position: "absolute", bottom: "10px", left: "12px",
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontWeight: 900,
              fontSize: "clamp(20px, 4vw, 28px)",
              color: "#ff4d00",
              lineHeight: 1,
              textShadow: "0 0 20px rgba(255,77,0,0.5)",
            }}>
              #{String(num).padStart(2, "0")}
            </div>
          </div>

          <div style={{ padding: "10px 12px 12px" }}>
            <div style={{ marginBottom: "5px" }}>
              <CatBadge cat={post.categories?.[0] || "Tech"} />
            </div>
            <h3 className="bot-title" style={{
              fontSize: "clamp(12px, 2.5vw, 13px)",
              fontWeight: "600",
              color: "#ccc",
              lineHeight: "1.4",
              margin: "0 0 6px",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              transition: "color 0.2s ease",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {post.title}
            </h3>
            <div style={{ fontSize: "11px", color: "#555", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
              {timeAgo(post.publishedAt)}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function FeaturedGrid({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) return null;

  const hero      = posts[0];
  const secondary = posts.slice(1, 4);
  const bottom    = posts.slice(4, 10);

  const cols = 3;
  const remainder = bottom.length % cols;

  return (
    <>
      <style suppressHydrationWarning>{`
        .featured-top-grid {
          display: grid;
          grid-template-columns: 1fr;
          background: #111;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
        }
        .featured-secondary-col {
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        @media (min-width: 640px) {
          .featured-top-grid {
            grid-template-columns: 1fr 1fr;
          }
          .featured-secondary-col {
            border-top: none;
            border-left: 1px solid rgba(255,255,255,0.06);
          }
          .hero-card {
            border-radius: 16px 0 0 16px !important;
          }
        }

        .featured-bottom-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 480px) {
          .featured-bottom-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 768px) {
          .featured-bottom-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .featured-bottom-grid.remainder-1 > :last-child {
            grid-column: 1 / -1;
          }

          .featured-bottom-grid.remainder-2 > :nth-last-child(1),
          .featured-bottom-grid.remainder-2 > :nth-last-child(2) {
            grid-column: span 1;
          }
          .featured-bottom-grid.remainder-2 > :nth-last-child(2) {
            grid-column: 1 / 2;
          }
          .featured-bottom-grid.remainder-2 > :nth-last-child(1) {
            grid-column: 2 / 4;
          }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* ── Top row: hero + secondary stack ── */}
        <div className="featured-top-grid">
          {/* Hero */}
          <HeroCard post={hero} num={1} />

          {/* Secondary stack */}
          <div className="featured-secondary-col">
            {secondary.map((post: any, i: number) => (
              <SecondaryCard key={post.slug?.current} post={post} num={i + 2} />
            ))}
            {secondary.length === 0 && (
              <div style={{ padding: "24px", color: "#444", fontSize: "13px", textAlign: "center" }}>
                More articles coming soon
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom row ── */}
        {bottom.length > 0 && (
          <div className={`featured-bottom-grid${remainder !== 0 ? ` remainder-${remainder}` : ""}`}>
            {bottom.map((post: any, i: number) => (
              <BottomCard key={post.slug?.current} post={post} num={i + secondary.length + 2} />
            ))}
          </div>
        )}

      </div>
    </>
  );
}
