import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

async function getPost(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      "image": mainImage.asset->url,
      body
    }`,
    { slug }
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return <div className="p-6 text-white">Post not found</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-3xl mx-auto p-6">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 leading-snug">
          {post.title}
        </h1>

        {/* Image */}
        {post.image && (
          <img
            src={post.image}
            className="w-full rounded-xl mb-6"
          />
        )}

        {/* Content */}
        <div className="text-gray-200 leading-8 space-y-4 text-lg">
          <PortableText value={post.body} />
        </div>

      </div>
    </div>
  );
}