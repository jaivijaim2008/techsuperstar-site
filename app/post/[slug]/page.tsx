import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPost, getPosts } from "@/lib/query";
import Link from "next/link";
import { PortableText } from "@portabletext/react";

export const revalidate = 0;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts?.map((post: any) => ({ slug: post.slug.current })) || [];
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>😕</div>
          <h1 style={{ color: "#fff", fontSize: "24px", marginBottom: "12px" }}>Post not found</h1>
          <Link href="/" style={{ color: "#ff4d00", textDecoration: "none" }}>← Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Arial', sans-serif" }}>
      <Navbar />

      {/* Hero Image */}
      {post.image && (
        <div style={{ width: "100%", maxHeight: "480px", overflow: "hidden" }}>
          <img
            src={post.image}
            alt={post.title}
            style={{ width: "100%", height: "480px", objectFit: "cover" }}
          />
        </div>
      )}

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 1.5rem" }}>

        {/* Breadcrumb */}
        <p style={{ color: "#555", fontSize: "13px", marginBottom: "20px" }}>
          <Link href="/" style={{ color: "#ff4d00", textDecoration: "none" }}>Home</Link>
          {" → "}
          {post.categories?.[0] && (
            <>
              <Link href={`/category/${post.categories[0].toLowerCase()}`} style={{ color: "#ff4d00", textDecoration: "none" }}>
                {post.categories[0]}
              </Link>
              {" → "}
            </>
          )}
          <span style={{ color: "#777" }}>{post.title}</span>
        </p>

        {/* Category Badge */}
        {post.categories?.[0] && (
          <div style={{
            display: "inline-block",
            background: "#ff4d00", color: "#fff",
            fontSize: "11px", fontWeight: "700",
            padding: "4px 12px", borderRadius: "4px",
            letterSpacing: "1.5px", textTransform: "uppercase",
            marginBottom: "16px",
          }}>
            {post.categories[0]}
          </div>
        )}

        {/* Title */}
        <h1 style={{
          color: "#ffffff", fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          fontWeight: "800", lineHeight: "1.2",
          fontFamily: "'Georgia', serif", margin: "0 0 20px",
        }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{
          display: "flex", alignItems: "center", gap: "16px",
          paddingBottom: "24px", borderBottom: "1px solid #1e1e1e",
          marginBottom: "32px", flexWrap: "wrap",
        }}>
          <span style={{ color: "#666", fontSize: "13px" }}>
            ✍️ {post.author || "TechSuperStar"}
          </span>
          {post.publishedAt && (
            <span style={{ color: "#555", fontSize: "13px" }}>
              📅 {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric"
              })}
            </span>
          )}
        </div>

        {/* Body Content */}
        <div style={{ color: "#cccccc", fontSize: "16px", lineHeight: "1.9" }}>
          {post.body ? (
            <PortableText
              value={post.body}
              components={{
                block: {
                  normal: ({ children }) => (
                    <p style={{ marginBottom: "20px", color: "#bbb" }}>{children}</p>
                  ),
                  h1: ({ children }) => (
                    <h1 style={{ color: "#fff", fontSize: "2rem", fontFamily: "'Georgia', serif", margin: "40px 0 16px" }}>{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 style={{ color: "#fff", fontSize: "1.5rem", fontFamily: "'Georgia', serif", margin: "36px 0 14px", paddingBottom: "8px", borderBottom: "1px solid #1e1e1e" }}>{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 style={{ color: "#fff", fontSize: "1.2rem", fontFamily: "'Georgia', serif", margin: "28px 0 12px" }}>{children}</h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote style={{ borderLeft: "3px solid #ff4d00", paddingLeft: "16px", margin: "24px 0", color: "#888", fontStyle: "italic" }}>{children}</blockquote>
                  ),
                },
                list: {
                  bullet: ({ children }) => (
                    <ul style={{ paddingLeft: "20px", marginBottom: "20px", color: "#bbb" }}>{children}</ul>
                  ),
                  number: ({ children }) => (
                    <ol style={{ paddingLeft: "20px", marginBottom: "20px", color: "#bbb" }}>{children}</ol>
                  ),
                },
                listItem: {
                  bullet: ({ children }) => (
                    <li style={{ marginBottom: "8px" }}>{children}</li>
                  ),
                  number: ({ children }) => (
                    <li style={{ marginBottom: "8px" }}>{children}</li>
                  ),
                },
                marks: {
                  strong: ({ children }) => (
                    <strong style={{ color: "#fff", fontWeight: "700" }}>{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em style={{ color: "#aaa" }}>{children}</em>
                  ),
                  link: ({ value, children }) => (
                    <a href={value?.href} target="_blank" rel="noopener noreferrer" style={{ color: "#ff4d00", textDecoration: "none" }}>{children}</a>
                  ),
                },
                types: {
                  image: ({ value }) => (
                    <div style={{ margin: "32px 0" }}>
                      <img
                        src={value?.asset?.url || value?.url}
                        alt={value?.alt || ""}
                        style={{ width: "100%", borderRadius: "8px", border: "1px solid #1e1e1e" }}
                      />
                      {value?.alt && (
                        <p style={{ color: "#555", fontSize: "13px", textAlign: "center", marginTop: "8px" }}>{value.alt}</p>
                      )}
                    </div>
                  ),
                  youtube: ({ value }) => {
                    const getYouTubeId = (url: string) => {
                      const match = url?.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&\s]+)/);
                      return match?.[1];
                    };
                    const videoId = getYouTubeId(value?.url);
                    if (!videoId) return null;
                    return (
                      <div style={{ margin: "32px 0", borderRadius: "12px", overflow: "hidden", aspectRatio: "16/9" }}>
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={value?.caption || "YouTube Video"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ display: "block" }}
                        />
                      </div>
                    );
                  },
                },
              }}
            />
          ) : (
            <p style={{ color: "#555" }}>No content yet.</p>
          )}
        </div>

        {/* Back Button */}
        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #1e1e1e" }}>
          <Link href="/" style={{
            color: "#ff4d00", textDecoration: "none",
            fontSize: "14px", fontWeight: "600",
          }}>
            ← Back to Home
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  );
}