import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getPostsByCategory } from "@/lib/query";
import Link from "next/link";

export const dynamic = "force-dynamic";

const categoryInfo: Record<string, { icon: string; color: string; rgb: string; description: string }> = {
  phones:      { icon: "📱", color: "#ff4d00", rgb: "255,77,0",    description: "Latest smartphone reviews and news" },
  laptops:     { icon: "💻", color: "#0066ff", rgb: "0,102,255",   description: "Laptop reviews and buying guides" },
  tablets:     { icon: "📟", color: "#00aa44", rgb: "0,170,68",    description: "Tablet reviews and comparisons" },
  gaming:      { icon: "🎮", color: "#aa00ff", rgb: "170,0,255",   description: "Gaming hardware, reviews and news" },
  reviews:     { icon: "⭐", color: "#ff6600", rgb: "255,102,0",   description: "In-depth product reviews" },
  accessories: { icon: "🎧", color: "#0099cc", rgb: "0,153,204",   description: "Tech accessories and gadgets" },
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getPostsByCategory(slug);
  const info = categoryInfo[slug] || { icon: "📂", color: "#ff4d00", rgb: "255,77,0", description: "" };
  const label = slug.charAt(0).toUpperCase() + slug.slice(1);

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
        @keyframes iconPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(${info.rgb},0.3); }
          50%     { box-shadow: 0 0 0 10px rgba(${info.rgb},0); }
        }
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 22px;
        }
      `}</style>

      <div style={{
        position: "relative", overflow: "hidden",
        background: `linear-gradient(160deg, #060606 0%, rgba(${info.rgb},0.04) 50%, #060606 100%)`,
        padding: "60px 1.5rem 52px",
        borderBottom: `1px solid rgba(${info.rgb},0.12)`,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(${info.rgb},0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(${info.rgb},0.02) 1px, transparent 1px)`,
          backgroundSize: "55px 55px",
          animation: "gridPan 20s linear infinite",
          pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", top: "-80px", left: "-80px", width: 320, height: 320, borderRadius: "50%", background: `rgba(${info.rgb},0.07)`, filter: "blur(70px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", right: "10%", width: 200, height: 200, borderRadius: "50%", background: `rgba(${info.rgb},0.04)`, filter: "blur(50px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ color: "#444", fontSize: "12px", marginBottom: "24px", letterSpacing: "0.5px" }}>
            <Link href="/" style={{ color: "#ff4d00", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px", color: "#333" }}>→</span>
            <span style={{ color: "#555" }}>{label}</span>
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{
              width: "68px", height: "68px",
              background: `rgba(${info.rgb},0.1)`,
              border: `2px solid rgba(${info.rgb},0.4)`,
              borderRadius: "18px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "32px", flexShrink: 0,
              boxShadow: `0 0 30px rgba(${info.rgb},0.2)`,
              animation: "iconPulse 2.5s ease-in-out infinite",
            }}>
              {info.icon}
            </div>

            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "7px",
                background: `rgba(${info.rgb},0.08)`,
                border: `1px solid rgba(${info.rgb},0.25)`,
                color: info.color,
                fontSize: "10px", fontWeight: "700",
                padding: "4px 12px", borderRadius: "50px",
                letterSpacing: "2px", textTransform: "uppercase",
                marginBottom: "10px",
              }}>
                Category
              </div>

              <h1 style={{
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: "900", margin: "0 0 8px",
                fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                background: `linear-gradient(90deg, #ffffff 0%, ${info.color} 50%, #ffffff 100%)`,
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmerText 4s linear infinite",
                lineHeight: 1.1,
              }}>
                {label}
              </h1>

              <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>
                {info.description}
                <span style={{ color: info.color, fontWeight: 700, marginLeft: 8 }}>
                  • {posts?.length || 0} article{posts?.length !== 1 ? "s" : ""}
                </span>
              </p>
            </div>
          </div>

          <div style={{ height: 2, width: 80, background: `linear-gradient(90deg, ${info.color}, rgba(${info.rgb},0.1))`, borderRadius: 2, marginTop: 24 }} />
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 1.5rem 80px", position: "relative", zIndex: 1 }}>
        <ScrollReveal direction="up">
          {posts && posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map((post: any) => (
                <PostCard key={post.slug.current} post={post} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: "80px 24px",
              background: "linear-gradient(135deg, #0f0f0f, #141414)",
              borderRadius: "20px",
              border: `1px dashed rgba(${info.rgb},0.2)`,
            }}>
              <div style={{ fontSize: "56px", marginBottom: "16px" }}>{info.icon}</div>
              <p style={{ color: "#555", fontSize: "16px", margin: "0 0 8px" }}>No articles in this category yet</p>
              <p style={{ color: "#444", fontSize: "13px", margin: "0 0 28px" }}>Check back soon for new content!</p>
              <Link href="/" style={{
                background: `linear-gradient(135deg, ${info.color}, #ff8800)`,
                color: "#fff", padding: "12px 28px",
                borderRadius: "50px", textDecoration: "none",
                fontSize: "13px", fontWeight: "700",
                boxShadow: `0 4px 20px rgba(${info.rgb},0.3)`,
              }}>
                ← Back to Home
              </Link>
            </div>
          )}
        </ScrollReveal>
      </div>

      <Footer />
    </div>
  );
}