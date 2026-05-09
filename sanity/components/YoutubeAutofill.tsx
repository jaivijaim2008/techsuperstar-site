"use client";
import { useState } from "react";
import { StringInputProps, useFormValue, useClient } from "sanity";

export function YoutubeAutofill(props: StringInputProps) {
  const { value, elementProps } = props;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const client = useClient({ apiVersion: "2024-01-01" });
  const documentId = useFormValue(["_id"]) as string;

  const handleAutofill = async () => {
    if (!value) return;
    setLoading(true);
    setIsError(false);
    setIsDone(false);
    setStatus("⏳ Fetching transcript & generating blog with Gemini AI...");

    try {
      // Using absolute Vercel URL so it works from hosted Sanity Studio (sanity.io)
      const res = await fetch("https://techsuperstar-site.vercel.app/api/youtube-autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl: value }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to generate content");
      }

      setStatus("🖼️ Uploading thumbnail...");

      // Upload thumbnail to Sanity if available
      let mainImage = undefined;
      if (data.thumbnailBase64) {
        try {
          const byteArray = Uint8Array.from(atob(data.thumbnailBase64), (c) => c.charCodeAt(0));
          const blob = new Blob([byteArray], { type: data.thumbnailMimeType || "image/jpeg" });
          const file = new File([blob], "thumbnail.jpg", { type: data.thumbnailMimeType || "image/jpeg" });
          const asset = await client.assets.upload("image", file, { filename: "thumbnail.jpg" });
          mainImage = {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
          };
        } catch (imgErr) {
          console.warn("Thumbnail upload failed:", imgErr);
        }
      }

      setStatus("💾 Saving to Sanity...");

      const draftId = documentId.startsWith("drafts.") ? documentId : `drafts.${documentId}`;

      await client
        .patch(draftId)
        .set({
          title: data.title,
          slug: { _type: "slug", current: data.slug },
          excerpt: data.excerpt,
          publishedAt: data.publishedAt,
          body: data.body,
          ...(mainImage && { mainImage }),
        })
        .commit({ visibility: "async" });

      setIsDone(true);
      setStatus("✅ Done! Title, slug, excerpt, date, thumbnail and body filled in. Set the Category manually.");
    } catch (err) {
      console.error("Autofill error:", err);
      setIsError(true);
      setStatus("❌ " + (err instanceof Error ? err.message : String(err)));
    }

    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input
        {...elementProps}
        placeholder="Paste YouTube URL here..."
        style={{
          width: "100%",
          padding: "10px 14px",
          background: "#1a1a1a",
          border: "1px solid #444",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "14px",
          boxSizing: "border-box",
        }}
      />
      <button
        type="button"
        onClick={handleAutofill}
        disabled={loading || !value}
        style={{
          background: loading || !value ? "#333" : isDone ? "#1a7a3c" : "#ff4d00",
          color: "#fff",
          border: "none",
          padding: "10px 24px",
          borderRadius: "8px",
          cursor: loading || !value ? "not-allowed" : "pointer",
          fontSize: "13px",
          fontWeight: "700",
          width: "fit-content",
          transition: "background 0.2s",
        }}
      >
        {loading ? "⏳ Generating..." : isDone ? "✅ Done!" : "⚡ Auto-fill from YouTube"}
      </button>
      {status && (
        <p style={{ color: isError ? "#ff6b6b" : isDone ? "#4caf50" : "#aaa", fontSize: "12px", margin: 0 }}>
          {status}
        </p>
      )}
    </div>
  );
}
