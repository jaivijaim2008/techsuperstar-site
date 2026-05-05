import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import CategoryGrid from "@/components/CategoryGrid";
import { getPosts } from "@/lib/query";
import Link from "next/link";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";

export const revalidate = 0;

export default async function Home() {
  const posts = await getPosts();
  const latestPosts = posts?.slice(0, 6);

  return (
    <div className="home-root">
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        .home-root {
          background: #060606;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ── Noise overlay ── */
        .home-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* ── Ambient glow ── */
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

        /* ── Page fade-in ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerText {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes lineExpand {
          from { width: 0; }
          to   { width: 60px; }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,77,0,0.25); }
          50%     { box-shadow: 0 0 0 6px rgba(255,77,0,0); }
        }
        @keyframes floatDot {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-6px); }
        }
        @keyframes rotateOrbit {
          from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }

        .section-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── Section header ── */
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
          animation: fadeUp 0.7s ease both;
          animation-delay: 0.1s;
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
          font-family: 'Playfair Display', Georgia, serif;
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
          animation: lineExpand 0.8s ease 0.3s both;
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

        /* ── Posts grid ── */
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 22px;
          animation: fadeUp 0.7s ease 0.25s both;
        }

        /* ── Empty state ── */
        .empty-state {
          text-align: center;
          padding: 80px 24px;
          background: linear-gradient(135deg, #0f0f0f, #141414);
          border-radius: 20px;
          border: 1px dashed rgba(255,77,0,0.15);
          color: #555;
          font-size: 14px;
          animation: fadeUp 0.5s ease both;
        }

        /* ── Divider ── */
        .section-divider {
          position: relative;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,77,0,0.15), transparent);
          margin: 0 auto;
          max-width: 1200px;
          padding: 0 1.5rem;
        }

        /* ── Stats strip ── */
        .stats-strip {
          position: relative;
          z-index: 1;
          background: linear-gradient(135deg, #0e0e0e, #111);
          border-top: 1px solid rgba(255,77,0,0.08);
          border-bottom: 1px solid rgba(255,77,0,0.08);
          padding: 28px 1.5rem;
          margin: 56px 0;
          overflow: hidden;
          animation: fadeUp 0.6s ease 0.4s both;
        }
        .stats-strip::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            rgba(255,77,0,0.015) 0px,
            rgba(255,77,0,0.015) 1px,
            transparent 1px,
            transparent 80px
          );
          pointer-events: none;
        }
        .stats-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 24px;
        }
        .stat-item {
          text-align: center;
          flex: 1;
          min-width: 100px;
        }
        .stat-number {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 900;
          font-family: 'Playfair Display', serif;
          color: #ff4d00;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 11px;
          color: #444;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 600;
        }
        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.05);
          flex-shrink: 0;
        }

        /* ── CTA Banner ── */
        .cta-banner {
          position: relative;
          z-index: 1;
          margin: 0 1.5rem 72px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
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
          animation: fadeUp 0.7s ease 0.5s both;
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
          font-family: 'Playfair Display', serif;
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

        /* ── Scroll-reveal utility ── */
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Mobile tweaks ── */
        @media (max-width: 640px) {
          .stats-inner { gap: 16px; }
          .stat-divider { display: none; }
          .cta-banner { text-align: center; justify-content: center; }
          .cta-text p { max-width: 100%; }
          .cta-actions { justify-content: center; width: 100%; }
          .cta-btn-primary, .cta-btn-secondary { flex: 1; justify-content: center; }
        }
      `}</style>

      {/* Inline scroll-reveal script */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', function() {
          const els = document.querySelectorAll('.reveal');
          const io = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
          }, { threshold: 0.12 });
          els.forEach(el => io.observe(el));
        });
      `}} />

      <div className="ambient-glow" />

      <HeroSection />

      {/* Hidden SEO H1 */}
      <h1 style={{ position:"absolute", left:"-9999px", width:"1px", height:"1px", overflow:"hidden" }}>
        TechSuperStar - Tech Reviews, News & Buying Guides
      </h1>

      {/* Stats Strip */}
      <div className="stats-strip reveal">
        <div className="stats-inner">
          {[
            { number: "100+", label: "Reviews Published" },
            null,
            { number: "50K+", label: "Monthly Readers" },
            null,
            { number: "6+", label: "Categories Covered" },
            null,
            { number: "Weekly", label: "New Content" },
          ].map((item, i) =>
            item === null
              ? <div key={i} className="stat-divider" />
              : (
                <div key={i} className="stat-item">
                  <div className="stat-number">{item.number}</div>
                  <div className="stat-label">{item.label}</div>
                </div>
              )
          )}
        </div>
      </div>

      <div className="section-wrapper">
        <div className="reveal">
          <CategoryGrid />
        </div>

        {/* Latest Articles */}
        <div style={{ padding: "64px 0 80px" }}>
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
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ padding: "0 1.5rem 72px", position: "relative", zIndex: 1 }}>
        <div className="cta-banner reveal" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="cta-text">
            <h3>Stay ahead of the tech curve 🚀</h3>
            <p>Subscribe to our YouTube channel and never miss a review, unboxing or buying guide — all in Tamil.</p>
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

      <Footer />
    </div>
  );
}