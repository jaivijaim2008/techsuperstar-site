"use client";
import { useState } from "react";
import { StringInputProps, useFormValue, useClient } from "sanity";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function descriptionToBlocks(description: string) {
  const lines = description.split(/\n+/).filter((l) => l.trim());
  const blocks: any[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^\d+:\d+/.test(trimmed)) continue;
    if (trimmed.startsWith("#")) continue;
    if (/^https?:\/\//.test(trimmed)) continue;
    const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
    const isHeading = trimmed.length < 60 && !trimmed.endsWith(".") && !trimmed.endsWith("!") && !isBullet && blocks.length > 0;
    if (isBullet) {
      blocks.push({ _type: "block", _key: Math.random().toString(36).slice(2), style: "normal", listItem: "bullet", level: 1, children: [{ _type: "span", _key: "a", text: trimmed.replace(/^[-*]\s/, ""), marks: [] }], markDefs: [] });
    } else if (isHeading) {
      blocks.push({ _type: "block", _key: Math.random().toString(36).slice(2), style: "h2", children: [{ _type: "span", _key: "a", text: trimmed, marks: [] }], markDefs: [] });
    } else {
      blocks.push({ _type: "block", _key: Math.random().toString(36).slice(2), style: "normal", children: [{ _type: "span", _key: "a", text: trimmed, marks: [] }], markDefs: [] });
    }
  }
  return blocks;
}

export function YoutubeAutofill(props: StringInputProps) {
  const { value, elementProps } = props;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const client = useClient({ apiVersion: "2024-01-01" });
  const documentId = useFormValue(["_id"]) as string;

  const handleAutofill = async () => {
    if (!value) return;
    setLoading(true);
    setStatus("Fetching from YouTube...");
    try {
      const res = await fetch(`https://techsuperstar-site.vercel.app/api/youtube-meta?url=${encodeURIComponent(value)}`);
      const data = await res.json();
      if (data.error) { setStatus("Error: " + data.error); setLoading(false); return; }

      setStatus("Uploading thumbnail...");

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
          console.error("Image upload failed:", imgErr);
        }
      }

      setStatus("Saving...");
      const blocks = descriptionToBlocks(data.description);
      const slug = slugify(data.title);

      await client.patch(documentId).set({
        title: data.title,
        slug: { _type: "slug", current: slug },
        publishedAt: data.publishedAt,
        body: blocks,
        ...(mainImage && { mainImage }),
      }).commit();

      setStatus("Done! Title, slug, body, image and date filled. Add category manually.");
    } catch (err) {
      console.error("Autofill error:", err);
      setStatus("Failed: " + (err instanceof Error ? err.message : String(err)));
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input
        {...elementProps}
        placeholder="Paste YouTube URL here..."
        style={{ width: "100%", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "14px", boxSizing: "border-box" }}
      />
      <button
        type="button"
        onClick={handleAutofill}
        disabled={loading || !value}
        style={{ background: loading || !value ? "#333" : "#ff4d00", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: loading || !value ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "700", width: "fit-content" }}
      >
        {loading ? "Fetching..." : "Auto-fill from YouTube"}
      </button>
      {status && <p style={{ color: "#aaa", fontSize: "12px", margin: 0 }}>{status}</p>}
    </div>
  );
}