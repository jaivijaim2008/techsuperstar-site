"use client";
import { useState } from "react";
import { StringInputProps, useClient, useFormValue, set, unset } from "sanity";

const BASE_URL = "https://techsuperstar-site.vercel.app";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);
}

export function YoutubeAutofill(props: StringInputProps) {
  const { value = "", onChange, elementProps } = props;
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const client = useClient({ apiVersion: "2024-01-01" });
  const docId = useFormValue(["_id"]) as string;

  const handleAutofill = async () => {
    if (!value) {
      setStatus("❌ Please paste a YouTube URL first.");
      return;
    }

    if (!docId) {
      setStatus("❌ No document ID found. Please save the document first.");
      return;
    }

    setIsLoading(true);
    setIsDone(false);
    setStatus("⏳ Fetching video data and generating blog with AI...");

    try {
      const res = await fetch(`${BASE_URL}/api/youtube-autofill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API request failed");

      setStatus("✍️ Filling in all fields...");

      const patch = client.patch(docId);

      // Title
      if (data.title) patch.set({ title: data.title });

      // Slug
      if (data.slug) patch.set({ slug: { _type: "slug", current: slugify(data.slug) } });

      // Excerpt
      if (data.excerpt) patch.set({ excerpt: data.excerpt });

      // Published date
      if (data.publishedAt) patch.set({ publishedAt: data.publishedAt });

      // Body
      if (data.body?.length) patch.set({ body: data.body });

      // Specs
      if (data.specs?.length) {
        patch.set({
          specs: data.specs.map((s: { label: string; value: string }) => ({
            _type: "object",
            _key: Math.random().toString(36).slice(2),
            label: s.label,
            value: s.value,
          })),
        });
      }

      // Pros
      if (data.pros?.length) {
        patch.set({ pros: data.pros });
      }

      // Cons
      if (data.cons?.length) {
        patch.set({ cons: data.cons });
      }

      // Category - auto-detect and link reference
      if (data.category) {
        try {
          // Always capitalize first letter to match your Sanity slugs (Phones, Laptops etc.)
          const categorySlug = data.category.toLowerCase();

          const categoryDoc = await client.fetch(
            `*[_type == "category" && slug.current == $slug][0]{ _id }`,
            { slug: categorySlug }
          );

          if (categoryDoc?._id) {
            patch.set({
              categories: [
                {
                  _type: "reference",
                  _key: Math.random().toString(36).slice(2),
                  _ref: categoryDoc._id,
                },
              ],
            });
          }
        } catch (catErr) {
          console.warn("Category patch failed:", catErr);
        }
      }

      // Upload thumbnail as mainImage
      if (data.thumbnailBase64 && data.thumbnailMimeType) {
        setStatus("🖼️ Uploading thumbnail...");
        try {
          const byteChars = atob(data.thumbnailBase64);
          const byteArr = new Uint8Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
          const blob = new Blob([byteArr], { type: data.thumbnailMimeType });

          const imageAsset = await client.assets.upload("image", blob, {
            filename: `${slugify(data.title || "thumbnail")}.jpg`,
          });

          patch.set({
            mainImage: {
              _type: "image",
              asset: { _type: "reference", _ref: imageAsset._id },
              alt: data.title || "",
            },
          });
        } catch (imgErr) {
          console.warn("Thumbnail upload failed:", imgErr);
        }
      }

      await patch.commit();

      setStatus("✅ Done! All fields filled — title, slug, excerpt, body, specs, pros, cons & category.");
      setIsDone(true);
    } catch (err) {
      console.error(err);
      setStatus(`❌ Error: ${err instanceof Error ? err.message : "Something went wrong"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* URL Input */}
      <input
        {...elementProps}
        value={value}
        placeholder="https://youtu.be/..."
        onChange={(e) => onChange(e.target.value ? set(e.target.value) : unset())}
        style={{
          padding: "10px 14px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "14px",
          width: "100%",
          boxSizing: "border-box",
        }}
      />

      {/* Auto-fill Button */}
      <button
        onClick={handleAutofill}
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          borderRadius: "6px",
          border: "none",
          background: isDone ? "#16a34a" : isLoading ? "#94a3b8" : "#ff4d00",
          color: "#fff",
          fontWeight: "700",
          fontSize: "14px",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "background 0.3s",
          alignSelf: "flex-start",
        }}
      >
        {isLoading ? "⏳ Generating..." : isDone ? "✅ Done!" : "⚡ Auto-fill from YouTube"}
      </button>

      {/* Status Message */}
      {status && (
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: status.startsWith("❌") ? "#dc2626" : "#555",
            fontStyle: "italic",
          }}
        >
          {status}
        </p>
      )}

      {/* What gets filled */}
      {!isDone && !isLoading && (
        <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
          Fills: Title · Slug · Excerpt · Date · Body · Specs Table · Pros · Cons · Thumbnail · Category
        </p>
      )}
    </div>
  );
}
