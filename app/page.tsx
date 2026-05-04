import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import CategoryGrid from "@/components/CategoryGrid";
import { getPosts } from "@/lib/query";
import Link from "next/link";
import Footer from "@/components/Footer";

export const revalidate = 0;

export default async function Home() {
  const posts = await getPosts();
  const latestPosts = posts?.slice(0, 6);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Arial', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: "#0f0f0f",
        borderBottom: "1px solid #1a1a1a",
        padding: "60px 1.5rem",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "#ff4d00", color: "#fff",
            fontSize: "11px", fontWeight: "700",
            padding: "4px 12px", borderRadius: "4px",
            letterSpacing: "1.5px", textTransform: "uppercase",
            marginBottom: "20px",
          }}>
            Tech Reviews & News
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: "800", color: "#ffffff",
            lineHeight: "1.15", margin: "0 0 16px",
            fontFamily: "'Georgia', serif", letterSpacing: "-1px",
          }}>
            Welcome to{" "}
            <span style={{ color: "#ff4d00" }}>TechSuperStar</span>
          </h1>
          <p style={{ color: "#777", fontSize: "16px", lineHeight: "1.6", margin: "0 0 32px" }}>
            Your ultimate source for honest tech reviews, buying guides, and the latest news
          </p>
          <Link href="/articles" style={{
            display: "inline-block",
            background: "#ff4d00", color: "#fff",
            padding: "12px 28px", borderRadius: "8px",
            textDecoration: "none", fontWeight: "600", fontSize: "14px",
          }}>
            Browse All Articles →
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Categories */}
        <CategoryGrid />

        {/* Latest Articles */}
        <div style={{ padding: "48px 0" }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: "20px",
          }}>
            <h2 style={{
              color: "#ffffff", fontSize: "20px", fontWeight: "700",
              margin: 0, fontFamily: "'Georgia', serif", letterSpacing: "-0.3px",
            }}>
              Latest Articles
            </h2>
            <Link href="/articles" style={{
              color: "#ff4d00", textDecoration: "none",
              fontSize: "13px", fontWeight: "600",
            }}>
              View All →
            </Link>
          </div>

          {latestPosts && latestPosts.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "16px",
            }}>
              {latestPosts.filter((post: any) => post?.slug?.current).map((post: any) => (
                <PostCard key={post.slug.current} post={post} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: "60px 20px",
              color: "#555", fontSize: "15px",
              background: "#141414", borderRadius: "12px",
              border: "1px solid #1e1e1e",
            }}>
              No articles yet. Start creating posts in the studio!
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}