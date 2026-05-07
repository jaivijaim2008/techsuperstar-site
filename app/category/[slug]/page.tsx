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
  reviews: { 
    icon: <FaStar size={48} />, 
    color: "#f59e0b", 
    rgb: "245,158,11",
    description: "Honest Takes on Tech" 
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

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "28px",
            marginBottom: "60px",
          }}>
            {posts.map((post: Post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#666",
          }}>
            <p style={{ fontSize: "18px", marginBottom: "20px" }}>
              No posts found in this category yet.
            </p>
            <Link
              href="/"
              style={{
                color: info.color,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              ← Back to Home
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
