import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/lib/query";

export default async function AllArticlesPage() {
  const posts = await getPosts();

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            All Articles
          </h1>
          <p className="text-gray-400">
            Browse all {posts?.length || 0} articles from TechSuperStar
          </p>
        </div>

        {/* Posts Grid */}
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <PostCard key={post.slug.current} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No articles found yet.</p>
            <p className="text-gray-500 mt-2">Start creating posts in the studio!</p>
          </div>
        )}
      </div>
    </div>
  );
}