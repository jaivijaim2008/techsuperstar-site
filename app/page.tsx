import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsTicker from "@/components/NewsTicker";
import FeaturedGrid from "@/components/FeaturedGrid";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import ScrollReveal from "@/components/ScrollReveal";
import { getPosts } from "@/lib/query";
import TagsBar from "@/components/TagsBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

const CATEGORY_SECTIONS = [
  { key: "phones",      label: "Latest Phones",  emoji: "📱", href: "/category/phones"      },
  { key: "laptops",     label: "Latest Laptops", emoji: "💻", href: "/category/laptops"     },
  { key: "gaming",      label: "Gaming Gear",    emoji: "🎮", href: "/category/gaming"      },
  { key: "tablets",     label: "Latest Tablets", emoji: "📟", href: "/category/tablets"     },
  { key: "reviews",     label: "Reviews",        emoji: "⭐", href: "/category/reviews"     },
  { key: "accessories", label: "Accessories",    emoji: "🎧", href: "/category/accessories" },
];

export default async function Home() {
  const posts = await getPosts();

  return (
    <div style={{
      background: "#060606",
      minHeight: "100vh",
      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    }}>

      <style>{`
        /* ── Main layout ── */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (min-width: 900px) {
          .main-grid {
            grid-template-columns: 1fr 300px;
            align-items: start;
          }
        }

        /* ── Section header ── */
        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,77,0,0.08);
          border: 1px solid rgba(255,77,0,0.25);
          color: #ff6622;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 50px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .section-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #ff4d00;
        }
        .section-title {
          font-size: clamp(18px, 4vw, 28px);
          font-weight: 900;
          margin: 0 0 8px;
          font-family: var(--font-playfair), 'Playfair Display', Georgia, serif;
          background: linear-gradient(90deg, #ffffff 0%, #ff4d00 40%, #ffaa55 65%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.2;
        }
        .section-underline {
          height: 2px;
          width: 60px;
          background: linear-gradient(90deg, #ff4d00, rgba(255,77,0,0.1));
          border-radius: 2px;
        }
        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #ff4d00;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(255,77,0,0.3);
          padding: 10px 18px;
          border-radius: 50px;
          transition: all 0.25s ease;
          white-space: nowrap;
          background: rgba(255,77,0,0.04);
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          min-height: 40px;
        }
        .view-all-btn:hover {
          background: rgba(255,77,0,0.12);
          border-color: rgba(255,77,0,0.6);
          transform: translateX(3px);
        }

        /* ── Posts grid ── */
        .posts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 480px) {
          .posts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 900px) {
          .posts-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
          }
        }

        /* ── Category section posts grid (3 max) ── */
        .cat-posts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 480px) {
          .cat-posts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 900px) {
          .cat-posts-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        }

        /* ── CTA banner ── */
        .cta-banner {
          position: relative;
          background: linear-gradient(135deg, #1a0800, #0e0500, #1a0800);
          border: 1px solid rgba(255,77,0,0.2);
          border-radius: 20px;
          padding: clamp(20px, 5vw, 52px) clamp(16px, 5vw, 52px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          overflow: hidden;
        }
        .cta-stat-value {
          font-size: 20px;
          font-weight: 800;
          color: #ff4d00;
          font-family: var(--font-playfair), 'Playfair Display', serif;
          line-height: 1.1;
        }
        .cta-stat-label {
          font-size: 10px;
          color: #555;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-top: 3px;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
        }
        .cta-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #ff4d00, #ff8800);
          color: #fff;
          padding: 13px 24px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
          font-size: 13px;
          box-shadow: 0 4px 20px rgba(255,77,0,0.35);
          transition: all 0.25s ease;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          min-height: 44px;
          justify-content: center;
        }
        .cta-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(255,77,0,0.5);
        }
        .cta-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.04);
          color: #aaa;
          padding: 13px 24px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          font-size: 13px;
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.25s ease;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          min-height: 44px;
          justify-content: center;
        }
        .cta-btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
          transform: translateY(-2px);
        }

        /* ── Divider ── */
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,77,0,0.15), transparent);
        }

        /* ── CTA responsive ── */
        @media (max-width: 640px) {
          .cta-banner {
            text-align: center;
            justify-content: center;
          }
          .cta-actions {
            justify-content: center;
            width: 100%;
          }
          .cta-btn-primary, .cta-btn-secondary {
            flex: 1;
            min-width: 140px;
          }
          .cta-stats-row {
            justify-content: center;
          }
        }

        .section-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        /* ── Category section strip ── */
        .cat-section {
          padding: 40px 0 0;
        }
        .cat-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .cat-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: clamp(16px, 3vw, 22px);
          font-weight: 800;
          color: #fff;
          font-family: var(--font-playfair), 'Playfair Display', Georgia, serif;
          border-left: 3px solid #ff4d00;
          padding-left: 12px;
        }
        .cat-section-emoji {
          font-size: 20px;
        }
        .cat-view-all {
          font-size: 12px;
          color: #ff4d00;
          text-decoration: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1px solid rgba(255,77,0,0.25);
          padding: 6px 14px;
          border-radius: 50px;
          transition: all 0.2s;
          white-space: nowrap;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
        }
        .cat-view-all:hover {
          background: rgba(255,77,0,0.1);
          border-color: #ff4d00;
        }
      `}</style>

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── News Ticker ── */}
      <NewsTicker posts={posts ?? []} />
      <TagsBar />

      {/* ── Main content ── */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "clamp(14px, 4vw, 20px) clamp(12px, 4vw, 24px) 0",
      }}>

        {/* ── Featured + Sidebar grid ── */}
        <div className="main-grid">
          <ScrollReveal direction="up" delay={0}>
            <FeaturedGrid posts={posts ?? []} />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={100}>
            <Sidebar posts={posts ?? []} />
          </ScrollReveal>
        </div>

        {/* ── Divider — margin:0 so no gap below sidebar ── */}
        <div className="section-divider" style={{ margin: "0" }} />

        {/* ── Category Sections (like Beebom) ── */}
        {CATEGORY_SECTIONS.map((cat) => {
          const catPosts = (posts ?? []).filter((p: any) => {
            const cats: string[] = (p.categories ?? []).map((c: any) =>
              (typeof c === "string" ? c : c?.title ?? c?.slug?.current ?? "").toLowerCase()
            );
            return cats.includes(cat.key);
          }).slice(0, 3);

          if (catPosts.length === 0) return null;

          return (
            <ScrollReveal key={cat.key} direction="up" delay={0}>
              <div className="cat-section">
                <div className="cat-section-header">
                  <div className="cat-section-title">
                    <span className="cat-section-emoji">{cat.emoji}</span>
                    {cat.label}
                  </div>
                  <Link href={cat.href} className="cat-view-all">
                    View All →
                  </Link>
                </div>
                <div className="cat-posts-grid">
                  {catPosts.map((post: any) => (
                    <PostCard key={post.slug.current} post={post} />
                  ))}
                </div>
              </div>
              <div className="section-divider" style={{ margin: "40px 0 0" }} />
            </ScrollReveal>
          );
        })}

        {/* ── All Articles section ── */}
        <div style={{ padding: "40px 0 60px" }}>
          <ScrollReveal direction="up" delay={0}>
            <div className="section-header-row">
              <div>
                <div className="section-badge">
                  <span className="section-badge-dot" />
                  Fresh off the press
                </div>
                <h2 className="section-title">Latest Tech Articles & Reviews</h2>
                <div className="section-underline" />
              </div>
              <Link href="/articles" className="view-all-btn">
                View All →
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            {posts && posts.length > 0 ? (
              <div className="posts-grid">
                {posts
                  .filter((post: any) => post?.slug?.current)
                  .map((post: any) => (
                    <PostCard key={post.slug.current} post={post} />
                  ))}
              </div>
            ) : (
              <div style={{
                textAlign: "center",
                padding: "60px 24px",
                background: "linear-gradient(135deg, #0f0f0f, #141414)",
                borderRadius: "20px",
                border: "1px dashed rgba(255,77,0,0.15)",
                color: "#555",
                fontSize: "14px",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}>
                No articles yet. Start creating posts in the studio!
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <ScrollReveal direction="up" delay={0}>
        <div style={{ padding: "0 clamp(12px, 4vw, 24px) 60px" }}>
          <div className="cta-banner" style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{
              position: "absolute", top: "-60px", right: "-60px",
              width: "240px", height: "240px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,77,0,0.12), transparent 70%)",
              pointerEvents: "none",
            }} />
            <div className="cta-text">
              <h3 style={{
                fontSize: "clamp(16px, 4vw, 26px)",
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontWeight: 900,
                color: "#fff",
                margin: "0 0 8px",
              }}>
                Stay ahead of the tech curve 🚀
              </h3>
              <p style={{
                fontSize: "13px", color: "#666", margin: 0,
                lineHeight: "1.6", maxWidth: "400px",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}>
                Subscribe to our YouTube channel and never miss a review, unboxing or buying guide — all in Tamil.
              </p>
              <div className="cta-stats-row" style={{ display: "flex", gap: "24px", marginTop: "18px", flexWrap: "wrap" }}>
                {[
                  { label: "Subscribers", value: "2.06M" },
                  { label: "Total Views",  value: "3.2M"  },
                  { label: "Likes",        value: "203K"  },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="cta-stat-value">{stat.value}</div>
                    <div className="cta-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cta-actions" style={{ display: "flex", gap: "12px", flexWrap: "wrap", flexShrink: 0 }}>
              <Link href="https://www.youtube.com/@TechSuperStarOfficial" target="_blank" className="cta-btn-primary">
                ▶ Subscribe on YouTube
              </Link>
              <Link href="/contact" className="cta-btn-secondary">
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
