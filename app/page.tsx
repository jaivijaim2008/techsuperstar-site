"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPost } from "@/lib/query";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { useState } from "react";

export const revalidate = 0;

function getYouTubeId(url: string) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://techsuperstar-site.vercel.app/post/${slug}`;
  const text = encodeURIComponent(`Check out this article: ${title}`);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid #1e1e1e" }}>
      <p style={{ color: "#555", fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px", fontWeight: "600" }}>
        Share this article
      </p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${text}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "#25D366", color: "#fff", padding: "10px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "700", transition: "opacity 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.524 5.858L0 24l6.302-1.498A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.032-1.388l-.36-.214-3.732.887.927-3.618-.235-.372A9.818 9.818 0 1112 21.818z" />
          </svg>
          WhatsApp
        </a>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "#000", border: "1px solid #333", color: "#fff", padding: "10px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "700", transition: "opacity 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X / Twitter
        </a>

        {/* Instagram */}
        <button
          onClick={() => { navigator.clipboard.writeText(url); alert("Link copied! Paste it on Instagram."); }}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff", padding: "10px 18px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "opacity 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          Instagram (Copy Link)
        </button>

        {/* Copy Link */}
        <button
          onClick={() => { navigator.clipboard.writeText(url); alert("Link copied!"); }}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#aaa", padding: "10px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#ff4d00"; (e.currentTarget as HTMLElement).style.color = "#ff4d00"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLElement).style.color = "#aaa"; }}
        >
          🔗 Copy Link
        </button>

      </div>
    </div>
  );
}

function CommentsSection({ postId, initialComments }: { postId: string; initialComments: any[] }) {
  const [comments, setComments] = useState(initialComments || []);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!form.name || !form.message) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, postId }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid #1e1e1e" }}>
      <h3 style={{ color: "#fff", fontSize: "20px", fontWeight: "700", fontFamily: "Georgia, serif", margin: "0 0 24px" }}>
        💬 Comments ({comments.length})
      </h3>

      {comments.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
          {comments.map((comment: any) => (
            <div key={comment._id} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #ff4d00, #ff8800)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "14px", flexShrink: 0 }}>
                  {comment.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>{comment.name}</div>
                  <div style={{ color: "#444", fontSize: "11px" }}>
                    {new Date(comment.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
              </div>
              <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>{comment.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "24px", textAlign: "center", marginBottom: "40px" }}>
          <p style={{ color: "#444", fontSize: "14px", margin: 0 }}>No comments yet. Be the first to comment!</p>
        </div>
      )}

      {status === "success" ? (
        <div style={{ background: "linear-gradient(135deg, #0f2e1a, #0a1f10)", border: "1px solid #1a5c2e", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>✅</div>
          <p style={{ color: "#4ade80", fontSize: "14px", margin: 0, fontWeight: "600" }}>Comment submitted! It will appear after approval.</p>
        </div>
      ) : (
        <div style={{ background: "#111", border: "1px solid rgba(255,77,0,0.15)", borderRadius: "16px", padding: "28px" }}>
          <h4 style={{ color: "#fff", fontSize: "16px", fontWeight: "700", margin: "0 0 20px" }}>Leave a Comment</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ color: "#555", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Name *</label>
                <input
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#ff4d00")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#222")}
                />
              </div>
              <div>
                <label style={{ color: "#555", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Email (optional)</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#ff4d00")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#222")}
                />
              </div>
            </div>
            <div>
              <label style={{ color: "#555", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Message *</label>
              <textarea
                placeholder="Write your comment here..."
                rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none", resize: "vertical", minHeight: "100px", boxSizing: "border-box", fontFamily: "Arial, sans-serif" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#ff4d00")}
                onBlur={e => (e.currentTarget.style.borderColor = "#222")}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              style={{ background: "linear-gradient(135deg, #ff4d00, #ff8800)", border: "none", borderRadius: "8px", padding: "12px 24px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "opacity 0.2s", opacity: status === "loading" ? 0.7 : 1 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {status === "loading" ? "Submitting..." : "Post Comment 💬"}
            </button>
            {status === "error" && (
              <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>Something went wrong. Please try again.</p>
            )}
            <p style={{ color: "#444", fontSize: "12px", margin: 0 }}>
              * Comments are reviewed before appearing publicly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
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

  const youtubeId = getYouTubeId(post.youtubeUrl);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Navbar />

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
          <div style={{ display: "inline-block", background: "#ff4d00", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "4px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>
            {post.categories[0]}
          </div>
        )}

        {/* Title */}
        <h1 style={{ color: "#ffffff", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: "800", lineHeight: "1.2", fontFamily: "Georgia, serif", margin: "0 0 20px" }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingBottom: "24px", borderBottom: "1px solid #1e1e1e", marginBottom: "32px", flexWrap: "wrap" }}>
          <span style={{ color: "#666", fontSize: "13px" }}>✍️ {post.author || "TechSuperStar"}</span>
          {post.publishedAt && (
            <span style={{ color: "#555", fontSize: "13px" }}>
              📅 {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
        </div>

        {/* YouTube Video */}
        {youtubeId && (
          <div style={{ marginBottom: "32px", position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", border: "1px solid #1e1e1e", background: "#000" }}>
            <iframe
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={post.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        {/* Thumbnail */}
        {!youtubeId && post.image && (
          <div style={{ marginBottom: "32px" }}>
            <img src={post.image} alt={post.title} style={{ width: "100%", maxHeight: "350px", objectFit: "cover", objectPosition: "center top", borderRadius: "12px", border: "1px solid #1e1e1e" }} />
          </div>
        )}

        {/* Body */}
        <div style={{ color: "#cccccc", fontSize: "16px", lineHeight: "1.9" }}>
          {post.body ? (
            <PortableText
              value={post.body}
              components={{
                block: {
                  normal: ({ children }) => <p style={{ marginBottom: "20px", color: "#bbb" }}>{children}</p>,
                  h1: ({ children }) => <h1 style={{ color: "#fff", fontSize: "2rem", fontFamily: "Georgia, serif", margin: "40px 0 16px" }}>{children}</h1>,
                  h2: ({ children }) => <h2 style={{ color: "#fff", fontSize: "1.5rem", fontFamily: "Georgia, serif", margin: "36px 0 14px", paddingBottom: "8px", borderBottom: "1px solid #1e1e1e" }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ color: "#fff", fontSize: "1.2rem", fontFamily: "Georgia, serif", margin: "28px 0 12px" }}>{children}</h3>,
                  blockquote: ({ children }) => <blockquote style={{ borderLeft: "3px solid #ff4d00", paddingLeft: "16px", margin: "24px 0", color: "#888", fontStyle: "italic" }}>{children}</blockquote>,
                },
                list: {
                  bullet: ({ children }) => <ul style={{ paddingLeft: "20px", marginBottom: "20px", color: "#bbb" }}>{children}</ul>,
                  number: ({ children }) => <ol style={{ paddingLeft: "20px", marginBottom: "20px", color: "#bbb" }}>{children}</ol>,
                },
                listItem: {
                  bullet: ({ children }) => <li style={{ marginBottom: "8px" }}>{children}</li>,
                  number: ({ children }) => <li style={{ marginBottom: "8px" }}>{children}</li>,
                },
                marks: {
                  strong: ({ children }) => <strong style={{ color: "#fff", fontWeight: "700" }}>{children}</strong>,
                  em: ({ children }) => <em style={{ color: "#aaa" }}>{children}</em>,
                  link: ({ value, children }) => (
                    <a href={value?.href} target="_blank" rel="noopener noreferrer" style={{ color: "#ff4d00", textDecoration: "none" }}>
                      {children}
                    </a>
                  ),
                },
                types: {
                  image: ({ value }) => (
                    <div style={{ margin: "32px 0" }}>
                      <img src={value?.asset?.url || value?.url} alt={value?.alt || ""} style={{ width: "100%", borderRadius: "8px", border: "1px solid #1e1e1e" }} />
                      {value?.alt && <p style={{ color: "#555", fontSize: "13px", textAlign: "center", marginTop: "8px" }}>{value.alt}</p>}
                    </div>
                  ),
                  youtube: ({ value }) => {
                    const videoId = getYouTubeId(value?.url);
                    if (!videoId) return null;
                    return (
                      <div style={{ margin: "32px 0", position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", border: "1px solid #1e1e1e" }}>
                        <iframe
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={value?.caption || "YouTube Video"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
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

        {/* Share Buttons */}
        <ShareButtons title={post.title} slug={params.slug} />

        {/* Comments */}
        <CommentsSection postId={post._id} initialComments={post.comments || []} />

        {/* Back Button */}
        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #1e1e1e" }}>
          <Link href="/" style={{ color: "#ff4d00", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
            ← Back to Home
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  );
}
