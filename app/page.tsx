import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import CategoryGrid from "@/components/CategoryGrid";
import { getPosts } from "@/lib/query";
import Link from "next/link";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ScrollReveal from "@/components/ScrollReveal";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await getPosts();
  const latestPosts = posts?.slice(0, 3);

  return (
    <div className="home-root">
      <Navbar />

      <style>{`
        .home-root {
          background: #060606;
          min-height: 100vh;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        .home-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        .ambient-glow {
          position: fixed;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(255,77,0,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        @keyframes shimmerText {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,77,0,0.25); }
          50%     { box-shadow: 0 0 0 6px rgba(255,77,0,0); }
        }
        @keyframes floatDot {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-6px); }
        }

        .section-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
          flex-wrap: wrap;
          gap: 16px;
        }

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
          animation: badgePulse 2.5s ease infinite;
        }

        .section-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #ff4d00;
          animation: floatDot 2s ease infinite;
        }

        .section-title {
          font-size: clamp(22px, 3.5vw, 32px);
          font-weight: 900;
          margin: 0 0 10px;
          font-family: var(--font-playfair), 'Playfair Display', Georgia, serif;
          background: linear-gradient(90deg, #ffffff 0%, #ff4d00 40%, #ffaa55 60%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerText 4s linear infinite;
          line-height: 1.2;
        }

        .section-underline {
          height: 2px;
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
          padding: 9px 18px;
          border-radius: 50px;
          transition: all 0.25s ease;
          letter-spacing: 0.5px;
          white-space: nowrap;
          background: rgba(255,77,0,0.04);
        }
        .view-all-btn:hover {
          background: rgba(255,77,0,0.12);
          border-color: rgba(255,77,0,0.6);
          transform: translateX(3px);
          box-shadow: 0 0 20px rgba(255,77,0,0.15);
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 22px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 24px;
          background: linear-gradient(135deg, #0f0f0f, #141414);
          border-radius: 20px;
          border: 1px dashed rgba(255,77,0,0.15);
          color: #555;
          font-size: 14px;
        }

        .cta-banner {
          position: relative;
          background: linear-gradient(135deg, #1a0800 0%, #0e0500 50%, #1a0800 100%);
          border: 1px solid rgba(255,77,0,0.2);
          border-radius: 24px;
          padding: clamp(28px, 5vw, 52px) clamp(20px, 5vw, 52px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          overflow: hidden;
        }
        .cta-banner::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,77,0,0.12), transparent 70%);
          pointer-events: none;
        }
        .cta-banner::after {
          content: '';
          position: absolute;
          bottom: -40px; left: 30%;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,100,0,0.06), transparent 70%);
          pointer-events: none;
        }
        .cta-text h3 {
          font-size: clamp(18px, 3vw, 26px);
          font-family: var(--font-playfair), 'Playfair Display', serif;
          font-weight: 900;
          color: #fff;
          margin: 0 0 8px;
        }
        .cta-text p {
          font-size: 13px;
          color: #666;
          margin: 0;
          line-height: 1.6;
          max-width: 400px;
        }
        .cta-stats {
          display: flex;
          gap: 24px;
          margin-top: 18px;
          flex-wrap: wrap;
        }
        .cta-stat-value {
          font-size: 20px;
          font-weight: 800;
          color: #ff4d00;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          line-height: 1.1;
        }
        .cta-stat-label {
          font-size: 10px;
          color: #555;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-top: 3px;
        }
        .cta-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }
        .cta-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #ff4d00, #ff8800);
          color: #fff;
          padding: 12px 24px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
          font-size: 13px;
          box-shadow: 0 4px 20px rgba(255,77,0,0.35);
          transition: all 0.25s ease;
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
          padding: 12px 24px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          font-size: 13px;
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.25s ease;
        }
        .cta-btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .cta-banner { text-align: center; justify-content: center; }
          .cta-text p { max-width: 100%; }
          .cta-stats { justify-content: center; }
          .cta-actions { justify-content: center; width: 100%; }
          .cta-btn-primary, .cta-btn-secondary { flex: 1; justify-content: center; }
        }
      `}</style>

      <div className="ambient-glow" />

      <HeroSection />

      <h1 style={{ position:"absolute", left:"-9999px", width:"1px", height:"1px", overflow:"hidden" }}>
        TechSuperStar - Tech Reviews, News & Buying Guides
      </h1>

      <div className="section-wrapper">

        <ScrollReveal direction="up" delay={0}>
          <CategoryGrid />
        </ScrollReveal>

        <div style={{ padding: "40px 0 80px" }}>

          <ScrollReveal direction="up" delay={0}>
            <div className="section-header">
              <div>
                <div className="section-badge">
                  <span className="section-badge-dot" />
                  Fresh off the press
                </div>
                <h2 className="section-title">Latest Tech Articles & Reviews</h2>
                <div className="section-underline" />
              </div>
              <Link href="/articles" className="view-all-btn">
                View All Articles →
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            {latestPosts && latestPosts.length > 0 ? (
              <div className="posts-grid">
                {latestPosts.filter((post: any) => post?.slug?.current).map((post: any) => (
                  <PostCard key={post.slug.current} post={post} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                No articles yet. Start creating posts in the studio!
              </div>
            )}
          </ScrollReveal>

        </div>
      </div>

      <ScrollReveal direction="up" delay={0}>
        <div style={{ padding: "0 1.5rem 72px", position: "relative", zIndex: 1 }}>
          <div className="cta-banner" style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="cta-text">
              <h3>Stay ahead of the tech curve 🚀</h3>
              <p>Subscribe to our YouTube channel and never miss a review, unboxing or buying guide — all in Tamil.</p>
              <div className="cta-stats">
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
            <div className="cta-actions">
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

      <Footer />
    </div>
  );
}