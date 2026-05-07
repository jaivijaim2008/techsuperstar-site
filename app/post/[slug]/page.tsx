import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getPost } from "@/lib/query";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { ShareButtons, CommentsSection } from "./ClientComponents";

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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };

  const description = post.body
    ? post.body
        .filter((b: any) => b._type === "block")
        .slice(0, 2)
        .map((b: any) => b.children?.map((c: any) => c.text).join(""))
        .join(" ")
        .slice(0, 160)
    : "";

  const ogImage = post.image
    ? `https://wsrv.nl/?url=${encodeURIComponent(post.image)}&w=1200&h=630&fit=cover&output=jpg&q=80`
    : "https://techsuperstar-site.vercel.app/favicon.jpg";

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div style={{ background: "#060606", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "120px 1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>😕</div>
          <h1 style={{
            color: "#fff", fontSize: "28px", marginBottom: "12px",
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontWeight: 900,
          }}>
            Post not found
          </h1>
          <p style={{ color: "#555", marginBottom: "28px", fontSize: "14px" }}>This article may have been moved or deleted.</p>
          <Link href="/" style={{
            background: "linear-gradient(135deg, #ff4d00, #ff8800)",
            color: "#fff", padding: "12px 28px",
            borderRadius: "50px", textDecoration: "none",
            fontSize: "13px", fontWeight: "700",
            boxShadow: "0 4px 20px rgba(255,77,0,0.3)",
          }}>
            ← Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const youtubeId = getYouTubeId(post.youtubeUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.image || "",
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author || "TechSuperStar",
    },
    publisher: {
      "@type": "Organization",
      name: "TechSuperStar",
      logo: {
        "@type": "ImageObject",
        url: "https://techsuperstar-site.vercel.app/favicon.jpg",
      },
    },
  };

  return (
    <div style={{ background: "#060606", minHeight: "100vh", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", overflowX: "hidden" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <style suppressHydrationWarning>{`
        @keyframes gridPan {
          from { background-position: 0 0; }
          to   { background-position: 50px 50px; }
        }
        .prose-content p { margin-bottom: 22px; color: #999; line-height: 1.95; font-size: 16px; }
        .prose-content h1 { color: #fff; font-size: 2rem; font-family: var(--font-playfair), Georgia, serif; margin: 44px 0 18px; font-weight: 900; }
        .prose-content h2 { color: #fff; font-size: 1.5rem; font-family: var(--font-playfair), Georgia, serif; margin: 38px 0 16px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,77,0,0.15); font-weight: 900; }
        .prose-content h3 { color: #ddd; font-size: 1.2rem; font-family: var(--font-playfair), Georgia, serif; margin: 30px 0 14px; font-weight: 700; }
        .prose-content blockquote { border-left: 3px solid #ff4d00; padding: 12px 20px; margin: 28px 0; color: #666; font-style: italic; background: rgba(255,77,0,0.04); border-radius: 0 10px 10px 0; }
        .prose-content ul, .prose-content ol { padding-left: 22px; margin-bottom: 22px; color: #999; }
        .prose-content li { margin-bottom: 10px; line-height: 1.7; }
        .prose-content strong { color: #fff; font-weight: 700; }
        .prose-content em { color: #aaa; }
        .prose-content a { color: #ff4d00; text-decoration: none; border-bottom: 1px solid rgba(255,77,0,0.3); }
        .prose-content a:hover { border-color: #ff4d00; }
      `}</style>

      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #060606 0%, #0f0600 50%, #060606 100%)",
        padding: "52px 1.5rem 48px",
        borderBottom: "1px solid rgba(255,77,0,0.1)",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,77,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.02) 1px, transparent 1px)", backgroundSize: "55px 55px", animation: "gridPan 20s linear infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-80px", left: "-60px", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,77,0,0.06)", filter: "blur(70px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ color: "#444", fontSize: "12px", marginBottom: "20px", letterSpacing: "0.5px" }}>
            <Link href="/" style={{ color: "#ff4d00", textDecoration: "none" }}>Home</Link>
            {post.categories?.[0] && (
              <>
                <span style={{ margin: "0 8px", color: "#333" }}>→</span>
                <Link href={`/category/${post.categories[0].toLowerCase()}`} style={{ color: "#ff4d00", textDecoration: "none" }}>
                  {post.categories[0]}
                </Link>
              </>
            )}
            <span style={{ margin: "0 8px", color: "#333" }}>→</span>
            <span style={{ color: "#555" }}>{post.title}</span>
          </p>

          {post.categories?.[0] && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(255,77,0,0.1)",
              border: "1px solid rgba(255,77,0,0.3)",
              color: "#ff6622", fontSize: "10px", fontWeight: "700",
              padding: "5px 14px", borderRadius: "50px",
              letterSpacing: "2px", textTransform: "uppercase",
              marginBottom: "18px",
            }}>
              {post.categories[0]}
            </div>
          )}

          <h1 style={{
            color: "#ffffff",
            fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
            fontWeight: "900", lineHeight: "1.2",
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            margin: "0 0 24px",
            letterSpacing: "-0.5px",
          }}>
            {post.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "50px", padding: "7px 14px",
            }}>
              <span style={{ fontSize: 14 }}>✍️</span>
              <span style={{ color: "#666", fontSize: "12px", fontWeight: 600 }}>{post.author || "TechSuperStar"}</span>
            </div>
            {post.publishedAt && (
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "50px", padding: "7px 14px",
              }}>
                <span style={{ fontSize: 14 }}>📅</span>
                <span style={{ color: "#666", fontSize: "12px", fontWeight: 600 }}>
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 1.5rem 80px" }}>
        <ScrollReveal direction="up">
          {youtubeId && (
            <div style={{
              marginBottom: "40px", position: "relative",
              paddingBottom: "56.25%", height: 0, overflow: "hidden",
              borderRadius: "16px",
              border: "1px solid rgba(255,77,0,0.15)",
              boxShadow: "0 0 40px rgba(255,77,0,0.08)",
            }}>
              <iframe
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={post.title} frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          {!youtubeId && post.image && (
            <div style={{ marginBottom: "40px" }}>
              <img
                src={post.image} alt={post.title}
                style={{
                  width: "100%", maxHeight: "400px",
                  objectFit: "cover", objectPosition: "center top",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,77,0,0.12)",
                  boxShadow: "0 0 40px rgba(255,77,0,0.06)",
                }}
              />
            </div>
          )}

          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,77,0,0.3), transparent)", marginBottom: "40px" }} />

          <div className="prose-content">
            {post.body ? (
              <PortableText value={post.body} components={{
                block: {
                  normal: ({ children }) => <p>{children}</p>,
                  h1: ({ children }) => <h1>{children}</h1>,
                  h2: ({ children }) => <h2>{children}</h2>,
                  h3: ({ children }) => <h3>{children}</h3>,
                  blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                },
                list: {
                  bullet: ({ children }) => <ul>{children}</ul>,
                  number: ({ children }) => <ol>{children}</ol>,
                },
                listItem: {
                  bullet: ({ children }) => <li>{children}</li>,
                  number: ({ children }) => <li>{children}</li>,
                },
                marks: {
                  strong: ({ children }) => <strong>{children}</strong>,
                  em: ({ children }) => <em>{children}</em>,
                  link: ({ value, children }) => <a href={value?.href} target="_blank" rel="noopener noreferrer">{children}</a>,
                },
                types: {
                  image: ({ value }) => (
                    <div style={{ margin: "36px 0" }}>
                      <img
                        src={value?.asset?.url || value?.url} alt={value?.alt || ""}
                        style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(255,77,0,0.1)" }}
                      />
                      {value?.alt && <p style={{ color: "#444", fontSize: "12px", textAlign: "center", marginTop: "10px" }}>{value.alt}</p>}
                    </div>
                  ),
                  youtube: ({ value }) => {
                    const videoId = getYouTubeId(value?.url);
                    if (!videoId) return null;
                    return (
                      <div style={{ margin: "32px 0", position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", border: "1px solid rgba(255,77,0,0.15)" }}>
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
              }} />
            ) : (
              <p style={{ color: "#444" }}>No content yet.</p>
            )}
          </div>

          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,77,0,0.2), transparent)", margin: "48px 0" }} />

          <ShareButtons title={post.title} slug={slug} />
          <CommentsSection postId={post._id} initialComments={post.comments || []} />

          <div style={{ marginTop: "48px" }}>
            <Link href="/" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              color: "#ff4d00", textDecoration: "none",
              fontSize: "13px", fontWeight: "700",
              background: "rgba(255,77,0,0.08)",
              border: "1px solid rgba(255,77,0,0.2)",
              padding: "10px 20px", borderRadius: "50px",
            }}>
              ← Back to Home
            </Link>
          </div>
        </ScrollReveal>
      </div>

      <Footer />
    </div>
  );
}
