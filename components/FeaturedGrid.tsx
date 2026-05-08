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
      fontSize: size === "large" ? "clamp(48px, 7vw, 72px)" : "clamp(28px, 4vw, 40px)",
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
  return (
    <span style={{
      display: "inline-block",
      background: "#ff4d00",
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
        .hero-card-inner { display: flex; flex-direction: column; justify-content: flex-end; height: 100%; }
      `}</style>

      <Link href={`/post/${post.slug?.current}`} style={{ textDecoration: "none", display: "block" }}>
        <div className="hero-card" style={{
          position: "relative",
          minHeight: "clamp(280px, 40vw, 380px)",
          borderRadius: "16px 0 0 16px",
          overflow: "hidden",
          background: "#111",
        }}>
          {/* Image */}
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

          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
          }} />

          {/* Content */}
          <div style={{
            position: "relative", zIndex: 2,
            padding: "24px",
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
              fontSize: "clamp(18px, 2.5vw, 26px)",
              fontWeight: "700",
              color: "#fff",
              lineHeight: "1.3",
              margin: "0 0 12px",
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
          gap: "12px",
          padding: "16px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          alignItems: "flex-start",
          cursor: "pointer",
        }}>
          <NumBadge n={num} size="small" />

          {/* Thumbnail */}
          <div style={{
            width: "80px", height: "64px",
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
                fontSize: "24px",
              }}>📱</div>
            )}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: "5px" }}>
              <CatBadge cat={post.categories?.[0] || "Tech"} />
            </div>
            <h3 className="sec-title" style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#ddd",
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
            <div style={{
              fontSize: "11px",
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
          {/* Image */}
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
            {/* Number on image */}
            <div style={{
              position: "absolute", bottom: "10px", left: "12px",
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontWeight: 900,
              fontSize: "28px",
              color: "#ff4d00",
              lineHeight: 1,
              textShadow: "0 0 20px rgba(255,77,0,0.5)",
            }}>
              #{String(num).padStart(2, "0")}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "12px" }}>
            <div style={{ marginBottom: "6px" }}>
              <CatBadge cat={post.categories?.[0] || "Tech"} />
            </div>
            <h3 className="bot-title" style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#ccc",
              lineHeight: "1.4",
              margin: "0 0 8px",
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
              fontSize: "11px", color: "#555",
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

// ── Main export ────────────────────────────────────────────────────────────
export default function FeaturedGrid({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) return null;

  const hero       = posts[0];
  const secondary  = posts.slice(1, 4);   // up to 3 stacked
  const bottom     = posts.slice(4, 7);   // up to 3 bottom cards

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* ── Top row: hero + secondary stack ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "#111",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        overflow: "hidden",
      }}>
        {/* Hero */}
        <HeroCard post={hero} num={1} />

        {/* Secondary stack */}
        <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
          {secondary.map((post: any, i: number) => (
            <SecondaryCard key={post.slug?.current} post={post} num={i + 2} />
          ))}
          {/* Fill empty slots so grid stays consistent */}
          {secondary.length === 0 && (
            <div style={{ padding: "24px", color: "#444", fontSize: "13px", textAlign: "center" }}>
              More articles coming soon
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row: small cards ── */}
      {bottom.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${bottom.length}, 1fr)`,
          gap: "12px",
        }}>
          {bottom.map((post: any, i: number) => (
            <BottomCard key={post.slug?.current} post={post} num={i + secondary.length + 2} />
          ))}
        </div>
      )}
    </div>
  );
}
