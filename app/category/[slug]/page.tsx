import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import Footer from "@/components/Footer";
import { getPostsByCategory } from "@/lib/query";
import Link from "next/link";
import { FaMobileAlt, FaLaptop, FaTabletAlt, FaGamepad, FaStar, FaHeadphones } from "react-icons/fa";

export const dynamic = "force-dynamic";

interface Post {
  _id: string;
  title: string;
  slug: string;
  category: string;
  [key: string]: any;
}

const categoryInfo: Record<string, { 
  icon: React.ReactNode; 
  color: string; 
  rgb: string; 
  description: string 
}> = {
  phones: { 
    icon: <FaMobileAlt size={48} />, 
    color: "#ff4d00", 
    rgb: "255,77,0",
    description: "Latest smartphone reviews and news" 
  },
  laptops: { 
    icon: <FaLaptop size={48} />, 
    color: "#3b82f6", 
    rgb: "59,130,246",
    description: "Laptop reviews and buying guides" 
  },
  tablets: { 
    icon: <FaTabletAlt size={48} />, 
    color: "#10b981", 
    rgb: "16,185,129",
    description: "Tablet reviews and comparisons" 
  },
  gaming: { 
    icon: <FaGamepad size={48} />, 
    color: "#a855f7", 
    rgb: "168,85,247",
    description: "Gaming hardware, reviews and news" 
  },
  comparisons: { 
  icon: <FaStar size={48} />, 
  color: "#f59e0b", 
  rgb: "245,158,11",
  description: "Side by side product comparisons" 
},
  accessories: { 
    icon: <FaHeadphones size={48} />, 
    color: "#06b6d4", 
    rgb: "6,182,212",
    description: "Gear & Gadgets" 
  },
};

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const info = categoryInfo[slug as keyof typeof categoryInfo];
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | TechSuperstar`,
    description: info?.description || "Explore our latest tech reviews",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const posts = await getPostsByCategory(slug);
  const info = categoryInfo[slug as keyof typeof categoryInfo];

  if (!info) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1, padding: "60px 20px", textAlign: "center" }}>
          <h1>Category not found</h1>
          <Link href="/">← Back to Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "60px 20px 40px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        {/* Category Header */}
        <div style={{ marginBottom: "60px", textAlign: "center" }}>
          {/* Icon */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            borderRadius: 24,
            background: `linear-gradient(135deg, rgba(${info.rgb},0.15), rgba(${info.rgb},0.05))`,
            border: `2px solid rgba(${info.rgb},0.3)`,
            color: info.color,
            marginBottom: 24,
            boxShadow: `0 0 40px rgba(${info.rgb},0.2)`,
          }}>
            {info.icon}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 900,
            margin: "0 0 12px",
            fontFamily: "'Playfair Display', Georgia, serif",
            background: `linear-gradient(90deg, #ffffff 0%, ${info.color} 40%, #ffffff 100%)`,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-1px",
          }}>
            {slug.charAt(0).toUpperCase() + slug.slice(1)}
          </h1>

          {/* Description */}
          <p style={{
            fontSize: "16px",
            color: "#aaa",
            margin: "0 0 24px",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            fontFamily: "'Inter', sans-serif",
          }}>
            {info.description}
          </p>

          {/* Divider */}
          <div style={{
            height: 2,
            background: `linear-gradient(90deg, transparent, ${info.color}, transparent)`,
            borderRadius: 2,
            maxWidth: "200px",
            margin: "0 auto",
          }} />
        </div>

        {/* Posts Header */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{
            fontSize: "24px",
            fontWeight: 800,
            margin: "0 0 8px",
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <span style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: info.color,
              boxShadow: `0 0 16px ${info.color}`,
            }} />
            Featured Articles
          </h2>
          <p style={{
            fontSize: "14px",
            color: "#999",
            margin: 0,
            fontFamily: "'Inter', sans-serif",
          }}>
            {posts.length} {posts.length === 1 ? "article" : "articles"} available
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "32px",
            marginBottom: "80px",
          }}>
            {posts.map((post: Post, index: number) => (
              <div
                key={post._id}
                style={{
                  animation: `slideUp 0.6s ease-out ${index * 0.1}s backwards`,
                  perspective: "1000px",
                }}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "80px 40px",
            borderRadius: 20,
            background: `linear-gradient(135deg, rgba(${info.rgb},0.05), rgba(${info.rgb},0.01))`,
            border: `1px solid rgba(${info.rgb},0.1)`,
            marginBottom: "60px",
          }}>
            <div style={{
              fontSize: 64,
              marginBottom: 20,
            }}>
              📭
            </div>
            <p style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#fff",
              marginBottom: "12px",
              fontFamily: "'Inter', sans-serif",
            }}>
              No posts yet in this category
            </p>
            <p style={{
              fontSize: "14px",
              color: "#999",
              marginBottom: "28px",
              fontFamily: "'Inter', sans-serif",
            }}>
              This section is coming soon. Check back later!
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                background: `linear-gradient(135deg, ${info.color}, rgba(${info.rgb},0.7))`,
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "14px",
                borderRadius: 12,
                transition: "all 0.3s ease",
                boxShadow: `0 8px 24px rgba(${info.rgb},0.3)`,
                border: "none",
                cursor: "pointer",
              }}
            >
              ← Back to Home
            </Link>
          </div>
        )}

        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </main>

      <Footer />
    </div>
  );
}
