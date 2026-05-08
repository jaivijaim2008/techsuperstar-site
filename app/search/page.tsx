import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getPosts } from "@/lib/query";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }> | { q?: string };
}) {
  const resolvedParams = await Promise.resolve(searchParams);
  const query = decodeURIComponent(resolvedParams.q || "");
  const allPosts = await getPosts();

  const results = query.trim() === "" ? [] : allPosts?.filter((post: any) => {
    const q = query.toLowerCase().trim();
    const title = post.title?.toLowerCase() || "";
    const cats = post.categories?.map((c: string) => c?.toLowerCase()).join(" ") || "";
    const body = Array.isArray(post.bodyText)
      ? post.bodyText.join(" ").toLowerCase()
      : post.bodyText?.toLowerCase() || "";
    return title.includes(q) || cats.includes(q) || body.includes(q);
  });

  return (
    <div style={{ background: "#060606", minHeight: "100vh", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", overflowX: "hidden" }}>
      <Navbar />

      <style suppressHydrationWarning>{`
        @keyframes shimmerText {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes gridPan {
          from { background-position: 0 0; }
          to   { background-position: 50px 50px; }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,77,0,0.25); }
          50%     { box-shadow: 0 0 0 6px rgba(255,77,0,0); }
        }
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 22px;
        }
      `}</style>

      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #060606 0%, #0f0600 50%, #060606 100%)",
        padding: "60px 1.5rem 52px",
        borderBottom: "1px solid rgba(255,77,0,0.1)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,77,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.025) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
          animation: "gridPan 20s linear infinite",
          pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", top: "-60px", left: "-60px", width: 280, height: 280, borderRadius: "50%", background: "rgba(255,77,0,0.06)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ color: "#444", fontSize: "12px", marginBottom: "20px", letterSpacing: "0.5px" }}>
            <Link href="/" style={{ color: "#ff4d00", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px", color: "#333" }}>→</span>
            <span style={{ color: "#555" }}>Search</span>
          </p>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.25)",
            color: "#ff6622", fontSize: "10px", fontWeight: "700",
            padding: "5px 14px", borderRadius: "50px",
            letterSpacing: "2px", textTransform: "uppercase",
            marginBottom: "16px",
            animation: "badgePulse 2.5s ease infinite",
          }}>
            🔍 Search Results
          </div>

          <h1 style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: "900", margin: "0 0 12px",
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            background: "linear-gradient(90deg, #ffffff 0%, #ff4d00 40%, #ffaa55 60%, #ffffff 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmerText 4s linear infinite",
            lineHeight: 1.15,
          }}>
            {query ? `"${query}"` : "Search"}
          </h1>

          <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>
            <span style={{ color: "#ff4d00", fontWeight: 700 }}>{results?.length || 0}</span>
            {" "}article{results?.length !== 1 ? "s" : ""} found
            {query && <span style={{ color: "#444" }}> for your query</span>}
          </p>

          <div style={{ height: 2, width: 80, background: "linear-gradient(90deg, #ff4d00, rgba(255,77,0,0.1))", borderRadius: 2, marginTop: 16 }} />
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 1.5rem 80px", position: "relative", zIndex: 1 }}>
        <ScrollReveal direction="up">
          {results && results.length > 0 ? (
            <div className="posts-grid">
              {results.map((post: any) => (
                <PostCard key={post.slug.current} post={post} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: "80px 24px",
              background: "linear-gradient(135deg, #0f0f0f, #141414)",
              borderRadius: "20px",
              border: "1px dashed rgba(255,77,0,0.15)",
            }}>
              <div style={{ fontSize: "56px", marginBottom: "16px" }}>🔍</div>
              <p style={{ color: "#555", fontSize: "16px", margin: "0 0 8px" }}>
                No results for <span style={{ color: "#fff", fontWeight: 700 }}>"{query}"</span>
              </p>
              <p style={{ color: "#444", fontSize: "13px", margin: "0 0 28px" }}>
                Try searching for phones, laptops, gaming, or reviews
              </p>
              <Link href="/" style={{
                background: "linear-gradient(135deg, #ff4d00, #ff8800)",
                color: "#fff", padding: "12px 28px",
                borderRadius: "50px", textDecoration: "none",
                fontSize: "13px", fontWeight: "700",
                boxShadow: "0 4px 20px rgba(255,77,0,0.3)",
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
