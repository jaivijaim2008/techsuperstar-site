import { ImageResponse } from "next/og";
import { getPost } from "@/lib/query";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px", height: "630px",
          background: "linear-gradient(135deg, #060606 0%, #1a0800 50%, #060606 100%)",
          display: "flex", flexDirection: "column",
          justifyContent: "flex-end", padding: "60px",
          position: "relative",
        }}
      >
        {post?.image && (
          <img
            src={post.image}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.2,
            }}
          />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #060606 40%, transparent 100%)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {post?.categories?.[0] && (
            <div style={{
              display: "flex", marginBottom: "20px",
            }}>
              <span style={{
                background: "rgba(255,77,0,0.2)",
                border: "1px solid rgba(255,77,0,0.5)",
                color: "#ff6622", fontSize: "14px", fontWeight: "700",
                padding: "6px 18px", borderRadius: "50px",
                letterSpacing: "2px", textTransform: "uppercase",
              }}>
                {post.categories[0]}
              </span>
            </div>
          )}

          <div style={{
            color: "#ffffff", fontSize: "52px", fontWeight: "900",
            lineHeight: "1.15", marginBottom: "28px",
            maxWidth: "900px",
          }}>
            {post?.title || "TechSuperStar"}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ color: "#ff4d00", fontSize: "22px", fontWeight: "700" }}>
              techsuperstar-site.vercel.app
            </div>
            <div style={{
              background: "linear-gradient(135deg, #ff4d00, #ff8800)",
              color: "#fff", fontSize: "18px", fontWeight: "700",
              padding: "12px 28px", borderRadius: "50px",
            }}>
              Read Full Article →
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}