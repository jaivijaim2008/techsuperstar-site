import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import Footer from "@/components/Footer";
import { getPostsByCategory } from "@/lib/query";
import Link from "next/link";

const categoryInfo: Record<string, { icon: string; color: string; description: string }> = {
  phones: { icon: "📱", color: "#ff4d00", description: "Latest smartphone reviews and news" },
  laptops: { icon: "💻", color: "#0066ff", description: "Laptop reviews and buying guides" },
  tablets: { icon: "📟", color: "#00aa44", description: "Tablet reviews and comparisons" },
  gaming: { icon: "🎮", color: "#aa00ff", description: "Gaming hardware, reviews and news" },
  reviews: { icon: "⭐", color: "#ff6600", description: "In-depth product reviews" },
  accessories: { icon: "🎧", color: "#0099cc", description: "Tech accessories and gadgets" },
};

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const posts = await getPostsByCategory(slug);
  const info = categoryInfo[slug] || { icon: "📂", color: "#ff4d00", description: "" };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Arial', sans-serif" }}>
      <Navbar />

      {/* Category Header */}
      <div style={{
        background: "#0f0f0f",
        borderBottom: "1px solid #1a1a1a",
        padding: "48px 1.5rem",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#555", fontSize: "13px", marginBottom: "12px" }}>
            <Link href="/" style={{ color: "#ff4d00", textDecoration: "none" }}>Home</Link>
            {" → "}
            <span style={{ color: "#777" }}>{slug.charAt(0).toUpperCase() + slug.slice(1)}</span>
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "56px", height: "56px",
              background: info.color + "22",
              border: `2px solid ${info.color}`,
              borderRadius: "12px",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "28px",
            }}>
              {info.icon}
            </div>
            <div>
              <h1 style={{
                color: "#fff", fontSize: "28px", fontWeight: "700",
                fontFamily: "'Georgia', serif", margin: "0 0 6px",
              }}>
                {slug.charAt(0).toUpperCase() + slug.slice(1)}
              </h1>
              <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
                {info.description} • {posts?.length || 0} article{posts?.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 1.5rem" }}>
        {posts && posts.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}>
            {posts.map((post: any) => (
              <PostCard key={post.slug.current} post={post} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            background: "#141414", borderRadius: "12px",
            border: "1px solid #1e1e1e",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>{info.icon}</div>
            <p style={{ color: "#555", fontSize: "16px", margin: "0 0 8px" }}>
              No articles in this category yet
            </p>
            <p style={{ color: "#444", fontSize: "13px", margin: "0 0 24px" }}>
              Check back soon for new content!
            </p>
            <Link href="/" style={{
              background: "#ff4d00", color: "#fff",
              padding: "10px 24px", borderRadius: "8px",
              textDecoration: "none", fontSize: "13px", fontWeight: "600",
            }}>
              Back to Home
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}