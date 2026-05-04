import { MetadataRoute } from "next";
import { getPosts } from "@/lib/query";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const postUrls = posts?.map((post: any) => ({
    url: `https://techsuperstar-site.vercel.app/post/${post.slug.current}`,
    lastModified: post.publishedAt || new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })) || [];

  return [
    { url: "https://techsuperstar-site.vercel.app", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://techsuperstar-site.vercel.app/articles", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://techsuperstar-site.vercel.app/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...postUrls,
  ];
}