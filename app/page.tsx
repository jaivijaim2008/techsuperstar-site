import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import CategoryGrid from "@/components/CategoryGrid";
import { getPosts } from "@/lib/query";
import Link from "next/link";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";

export const revalidate = 0;

export default async function Home() {
  const posts = await getPosts();
  const latestPosts = posts?.slice(0, 6);

  return (
    <div style={{ background:"#0a0a0a", minHeight:"100vh", fontFamily:"'Arial', sans-serif" }}>
      <Navbar />
      <HeroSection />

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"0 1.5rem" }}>
        {/* SEO H1 - Hidden visually but present for search engines */}
        <h1 style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden"
        }}>
          TechSuperStar - Tech Reviews, News & Buying Guides
        </h1>

        <CategoryGrid />

        <div style={{ padding:"60px 0" }}>
          <div style={{
            display:"flex", alignItems:"center",
            justifyContent:"space-between", marginBottom:"32px",
          }}>
            <div>
              <h2 style={{
                fontSize:"28px", fontWeight:"800",
                margin:"0 0 4px", fontFamily:"'Georgia', serif",
                background:"linear-gradient(90deg, #fff, #ff4d00, #fff)",
                backgroundSize:"200% auto",
                WebkitBackgroundClip:"text",
                WebkitTextFillColor:"transparent",
              }}>
                Latest Tech Articles & Reviews
              </h2>
              <div style={{ width:"60px", height:"3px", background:"linear-gradient(90deg, #ff4d00, transparent)", borderRadius:"2px" }} />
            </div>
            <Link href="/articles" style={{
              color:"#ff4d00", textDecoration:"none",
              fontSize:"13px", fontWeight:"600",
              border:"1px solid rgba(255,77,0,0.3)",
              padding:"8px 16px", borderRadius:"50px",
            }}>
              View All →
            </Link>
          </div>

          {latestPosts && latestPosts.length > 0 ? (
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",
              gap:"20px",
            }}>
              {latestPosts.filter((post: any) => post?.slug?.current).map((post: any) => (
                <PostCard key={post.slug.current} post={post} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign:"center", padding:"80px 20px",
              color:"#555", fontSize:"15px",
              background:"linear-gradient(135deg, #111, #141414)",
              borderRadius:"16px",
              border:"1px solid rgba(255,77,0,0.1)",
            }}>
              No articles yet. Start creating posts in the studio!
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}