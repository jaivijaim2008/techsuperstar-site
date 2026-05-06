import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import Footer from "@/components/Footer";
import { getPosts } from "@/lib/query";
import ScrollReveal from "@/components/ScrollReveal";

export const revalidate = 60;

export default async function AllArticlesPage() {
  const posts = await getPosts();

  return (
    <div style={{ background: "#060606", minHeight: "100vh", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", overflowX: "hidden" }}>
      <Navbar />

      <style>{`
        @keyframes shimmerText {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,77,0,0.25); }
          50%     { box-shadow: 0 0 0 6px rgba(255,77,0,0); }
        }
        @keyframes gridPan {
          from { background-position: 0 0; }
          to   { background-position: 50px 50px; }
        }
        @keyframes floatDot {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-4px); }
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
      `}</style>

      {/* Hero header */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #060606 0%, #0f0600 50%, #060606 100%)",
        padding: "60px 1.5rem 52px",
        borderBottom: "1px solid rgba(255,77,0,0.1)",
      }}>
        {/* Animated grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,77,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.025) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
          animation: "gridPan 20s linear infinite",
          pointerEvents: "none",
        }} />
        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "-60px", left: "-60px", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,77,0,0.06)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", right: "-40px", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,100,0,0.04)", filter: "blur(50px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <p style={{ color: "#444", fontSize: "12px", marginBottom: "20px", fontFamily: "var(--font-dm-sans), sans-serif", letterSpacing: "0.5px" }}>
            <a href="/" style={{ color: "#ff4d00", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px", color: "#333" }}>→</span>
            <span style={{ color: "#555" }}>All Articles</span>
          </p>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.25)",
            color: "#ff6622", fontSize: "10px", fontWeight: "700",
            padding: "5px 14px", borderRadius: "50px",
            letterSpacing: "2px", textTransform: "uppercase",
            marginBottom: "18px",
            animation: "badgePulse 2.5s ease infinite",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ff4d00", display: "inline-block", animation: "floatDot 2s ease infinite" }} />
            TechSuperStar
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: "900", margin: "0 0 14px",
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            background: "linear-gradient(90deg, #ffffff 0%, #ff4d00 40%, #ffaa55 60%, #ffffff 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmerText 4s linear infinite",
            lineHeight: 1.15,
          }}>
            All Articles
          </h1>

          <p style={{ color: "#555", fontSize: "14px", margin: "0 0 4px", fontFamily: "var(--font-dm-sans), sans-serif" }}>
            Browse all <span style={{ color: "#ff4d00", fontWeight: 700 }}>{posts?.length || 0}</span> articles from TechSuperStar
          </p>

          <div style={{ height: 2, width: 80, background: "linear-gradient(90deg, #ff4d00, rgba(255,77,0,0.1))", borderRadius: 2, marginTop: 16 }} />
        </div>
      </div>

      {/* Posts grid */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 1.5rem 80px", position: "relative", zIndex: 1 }}>
        <ScrollReveal direction="up">
          {posts && posts.length > 0 ? (
            <div className="posts-grid">
              {posts.filter((post: any) => post?.slug?.current).map((post: any) => (
                <PostCard key={post.slug.current} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
              <p style={{ color: "#555", fontSize: "16px", margin: "0 0 8px" }}>No articles yet</p>
              <p style={{ color: "#444", fontSize: "13px" }}>Start creating posts in the studio!</p>
            </div>
          )}
        </ScrollReveal>
      </div>

      <Footer />
    </div>
  );
}