"use client";
import { useState, useEffect, useRef } from "react";
import { FaWhatsapp, FaXTwitter, FaLink, FaCheck } from "react-icons/fa6";

/* ─────────────────────────────────────────
   READING PROGRESS BAR
───────────────────────────────────────── */
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
      height: "3px", background: "rgba(255,255,255,0.05)",
    }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        background: "linear-gradient(90deg, #ff4d00, #ff8800, #ffcc00)",
        transition: "width 0.1s linear",
        boxShadow: "0 0 10px rgba(255,77,0,0.6)",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   TABLE OF CONTENTS
───────────────────────────────────────── */
interface Heading { id: string; text: string; level: number; }

export function TableOfContents({ body }: { body: any[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(true);

  // Extract headings from Portable Text body
  const headings: Heading[] = (body || [])
    .filter((b: any) => b._type === "block" && ["h2", "h3"].includes(b.style))
    .map((b: any) => {
      const text = b.children?.map((c: any) => c.text).join("") || "";
      const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").slice(0, 60);
      return { id, text, level: b.style === "h2" ? 2 : 3 };
    });

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings.length]);

  if (headings.length < 2) return null;

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f0f0f, #111)",
      border: "1px solid rgba(255,77,0,0.15)",
      borderRadius: "14px",
      padding: "20px 22px",
      marginBottom: "36px",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "16px" }}>📋</span>
          <span style={{ color: "#fff", fontSize: "14px", fontWeight: "700", letterSpacing: "0.3px" }}>
            Table of Contents
          </span>
          <span style={{
            background: "rgba(255,77,0,0.15)", color: "#ff6622",
            fontSize: "10px", fontWeight: "700", padding: "2px 8px",
            borderRadius: "50px",
          }}>{headings.length}</span>
        </div>
        <span style={{ color: "#555", fontSize: "12px", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
      </button>

      {open && (
        <div style={{ marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" }}>
          {headings.map((h, i) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{
                display: "flex", alignItems: "flex-start", gap: "10px",
                padding: "7px 10px", marginLeft: h.level === 3 ? "16px" : "0",
                borderRadius: "8px", textDecoration: "none",
                background: activeId === h.id ? "rgba(255,77,0,0.08)" : "transparent",
                borderLeft: activeId === h.id ? "2px solid #ff4d00" : "2px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ color: "#333", fontSize: "11px", fontWeight: "700", minWidth: "20px", paddingTop: "1px" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{
                color: activeId === h.id ? "#ff6622" : "#666",
                fontSize: h.level === 2 ? "13px" : "12px",
                fontWeight: h.level === 2 ? "600" : "500",
                lineHeight: "1.4",
                transition: "color 0.2s ease",
              }}>
                {h.text}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   SHARE BUTTONS (fixed — no Instagram)
───────────────────────────────────────── */
export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://techsuperstar-site.vercel.app/post/${slug}`;
  const text = encodeURIComponent(`Check out this article: ${title}`);
  const encodedUrl = encodeURIComponent(url);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid #1e1e1e" }}>
      <p style={{ color: "#555", fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px", fontWeight: "600" }}>
        Share this article
      </p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <a
          href={`https://wa.me/?text=${text}%20${encodedUrl}`}
          target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "#25D366", color: "#fff", padding: "10px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "700" }}
        >
          <FaWhatsapp size={16} /> WhatsApp
        </a>

        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`}
          target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "#000", border: "1px solid #333", color: "#fff", padding: "10px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "700" }}
        >
          <FaXTwitter size={16} /> X / Twitter
        </a>

        <button
          onClick={handleCopy}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: copied ? "#1a3a1a" : "#1a1a1a",
            border: copied ? "1px solid #2d6a2d" : "1px solid #2a2a2a",
            color: copied ? "#4ade80" : "#aaa",
            padding: "10px 18px", borderRadius: "8px",
            fontSize: "13px", fontWeight: "700", cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {copied ? <FaCheck size={16} /> : <FaLink size={16} />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMMENTS SECTION (unchanged)
───────────────────────────────────────── */
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
