"use client";
import { useState } from "react";
import { StringInputProps, set, useFormValue, useClient } from "sanity";
import { useDocumentOperation } from "sanity";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function descriptionToBlocks(description: string) {
  const lines = description.split(/\n+/).filter((l) => l.trim());
  const blocks: any[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect section headings (short lines, no punctuation at end, or ALL CAPS words)
    const isHeading =
      trimmed.length < 60 &&
      !trimmed.endsWith(".") &&
      !trimmed.endsWith("!") &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("http") &&
      !trimmed.startsWith("#") &&
      /^[A-Z]/.test(trimmed);

    // Detect bullet points
    const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("• ");

    if (isBullet) {
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).slice(2),
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [{ _type: "span", _key: "a", text: trimmed.replace(/^[-•]\s/, ""), marks: [] }],
        markDefs: [],
      });
    } else if (isHeading && blocks.length > 0) {
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).slice(2),
        style: "h2",
        children: [{ _type: "span", _key: "a", text: trimmed, marks: [] }],
        markDefs: [],
      });
    } else {
      // Skip timestamp lines and hashtag lines
      if (/^\d+:\d+/.test(trimmed) || trimmed.startsWith("#")) continue;
      // Skip bare URLs
      if (/^https?:\/\//.test(trimmed)) continue;

      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).slice(2),
        style: "normal",
        children: [{ _type: "span", _key: "a", text: trimmed, marks: [] }],
        markDefs: [],
      });
    }
  }

  return blocks;
}

export function YoutubeAutofill(props: StringInputProps) {
  const { value, onChange, elementProps } = props;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const client = useClient({ apiVersion: "2024-01-01" });
  const documentId = useFormValue(["_id"]) as string;

  const handleAutofill = async () => {
    if (!value) return;
    setLoading(true);
    setStatus("⏳ Fetching from YouTube...");

    try {
      const res = await fetch(`/api/youtube-meta?url=${encodeURIComponent(value)}`);
      const data = await res.json();

      if (data.error) {
        setStatus("❌ " + data.error);
        setLoading(false);
        return;
      }

      const blocks = descriptionToBlocks(data.description);
      const slug = slugify(data.title);

      await client
        .patch(documentId)
        .set({
          title: data.title,
          slug: { _type: "slug", current: slug },
          publishedAt: data.publishedAt,
          body: blocks,
        })
        .commit();

      setStatus("✅ Auto-filled! Title, slug, body and date are set. Add category and image manually.");
    } catch (err) {
      setStatus("❌ Failed. Check your API key and try again.");
    }

    setLoading(false);
  };

  return (
    <div>
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
          marginBottom: "10px",
          boxSizing: "border-box",
        }}
      />
      <button
        type="button"
        onClick={handleAutofill}
        disabled={loading || !value}
        style={{
          background: loading || !value ? "#333" : "#ff4d00",
          color: "#fff",
          border: "none",
          padding: "10px 24px",
          borderRadius: "8px",
          cursor: loading || !value ? "not-allowed" : "pointer",
          fontSize: "13px",
          fontWeight: "700",
          marginBottom: "8px",
        }}
      >
        {loading ? "⏳ Fetching..." : "⚡ Auto-fill from YouTube"}
      </button>
      {status && (
        <p style={{ color: "#aaa", fontSize: "12px", marginTop: "6px", lineHeight: 1.5 }}>
          {status}
        </p>
      )}
    </div>
  );
}