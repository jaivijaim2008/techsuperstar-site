"use client";
import { useState } from "react";
import { FaWhatsapp, FaXTwitter, FaInstagram, FaLink } from "react-icons/fa6";

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://techsuperstar-site.vercel.app/post/${slug}`;
  const text = encodeURIComponent(`Check out this article: ${title}`);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid #1e1e1e" }}>
      <p style={{ color: "#555", fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px", fontWeight: "600" }}>
        Share this article
      </p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <a href={`https://wa.me/?text=${text}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "#25D366", color: "#fff", padding: "10px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "700" }}>
          <FaWhatsapp size={16} /> WhatsApp
        </a>
        <a href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "#000", border: "1px solid #333", color: "#fff", padding: "10px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "700" }}>
          <FaXTwitter size={16} /> X / Twitter
        </a>
        <button onClick={() => { navigator.clipboard.writeText(url); alert("Link copied! Paste it on Instagram."); }}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff", padding: "10px 18px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
          <FaInstagram size={16} /> Instagram (Copy Link)
        </button>
        <button onClick={() => { navigator.clipboard.writeText(url); alert("Link copied!"); }}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#aaa", padding: "10px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
          <FaLink size={16} /> Copy Link
        </button>
      </div>
    </div>
  );
}

export function CommentsSection({ postId, initialComments }: { postId: string; initialComments: any[] }) {
  const [comments] = useState(initialComments || []);
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
      if (res.ok) { setStatus("success"); setForm({ name: "", email: "", message: "" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
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
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #ff4d00, #ff8800)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "14px" }}>
                  {comment.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>{comment.name}</div>
                  {/* ✅ suppressHydrationWarning: toLocaleDateString() output can differ
                      between server (UTC) and client (local timezone) — safe to suppress */}
                  <div suppressHydrationWarning style={{ color: "#444", fontSize: "11px" }}>
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
                <input placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#ff4d00")} onBlur={e => (e.currentTarget.style.borderColor = "#222")} />
              </div>
              <div>
                <label style={{ color: "#555", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Email (optional)</label>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#ff4d00")} onBlur={e => (e.currentTarget.style.borderColor = "#222")} />
              </div>
            </div>
            <div>
              <label style={{ color: "#555", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Message *</label>
              <textarea placeholder="Write your comment here..." rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none", resize: "vertical", minHeight: "100px", boxSizing: "border-box", fontFamily: "Arial, sans-serif" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#ff4d00")} onBlur={e => (e.currentTarget.style.borderColor = "#222")} />
            </div>
            <button onClick={handleSubmit} disabled={status === "loading"}
              style={{ background: "linear-gradient(135deg, #ff4d00, #ff8800)", border: "none", borderRadius: "8px", padding: "12px 24px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", opacity: status === "loading" ? 0.7 : 1 }}>
              {status === "loading" ? "Submitting..." : "Post Comment 💬"}
            </button>
            {status === "error" && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>Something went wrong. Please try again.</p>}
            <p style={{ color: "#444", fontSize: "12px", margin: 0 }}>* Comments are reviewed before appearing publicly.</p>
          </div>
        </div>
      )}
    </div>
  );
}
