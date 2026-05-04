import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/lib/query";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const allPosts = await getPosts();

  const results = allPosts?.filter((post: any) =>
    post.title?.toLowerCase().includes(query.toLowerCase()) ||
    post.categories?.some((cat: string) =>
      cat?.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 1.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ color: "#666", fontSize: "13px", marginBottom: "8px" }}>
            <Link href="/" style={{ color: "#ff4d00", textDecoration: "none" }}>Home</Link>
            {" → Search"}
          </p>
          <h1 style={{
            color: "#fff", fontSize: "28px", fontWeight: "700",
            fontFamily: "'Georgia', serif", margin: "0 0 8px",
          }}>
            {query ? `Results for "${query}"` : "Search"}
          </h1>
          <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
            {results?.length || 0} article{results?.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Results */}
        {results && results.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}>
            {results.map((post: any) => (
              <PostCard key={post.slug.current} post={post} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            background: "#141414", borderRadius: "12px",
            border: "1px solid #1e1e1e",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p style={{ color: "#555", fontSize: "16px", margin: "0 0 8px" }}>
              No articles found for <span style={{ color: "#fff" }}>"{query}"</span>
            </p>
            <p style={{ color: "#444", fontSize: "13px" }}>
              Try searching for phones, laptops, gaming, or reviews
            </p>
          </div>
        )}
      </div>
    </div>
  );
}