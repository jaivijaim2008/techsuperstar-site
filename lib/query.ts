import { client } from "./sanity";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Sanity timeout")), ms)
    ),
  ]);
}

export async function getPosts() {
  try {
    const posts = await withTimeout(
      client.fetch(`
        *[_type == "post"] | order(publishedAt desc) {
          title, slug,
          "author": coalesce(author->name, author),
          "image": mainImage.asset->url,
          "categories": categories[]->title,
          "bodyText": body[].children[].text,
          excerpt,
          publishedAt
        }
      `),
      5000
    );
    return posts || [];
  } catch (error) {
    console.warn("⚠️ Sanity fetch failed:", error);
    return [];
  }
}

export async function getPostsByCategory(categorySlug: string) {
  try {
    const posts = await withTimeout(
      client.fetch(
        `*[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
          title, slug,
          "author": coalesce(author->name, author),
          "image": mainImage.asset->url,
          "categories": categories[]->title,
          "bodyText": pt::text(body),
          excerpt,
          publishedAt
        }`,
        { categorySlug }
      ),
      5000
    );
    return posts || [];
  } catch (error) {
    console.warn("⚠️ Sanity fetch failed:", error);
    return [];
  }
}

export async function getCategories() {
  try {
    return await withTimeout(
      client.fetch(`
        *[_type == "category"] | order(title asc) {
          title, slug, description
        }
      `),
      5000
    );
  } catch (error) {
    console.warn("⚠️ Sanity fetch failed, using default categories");
    return [
      { title: "Phones", slug: { current: "phones" }, description: "Latest smartphone reviews" },
      { title: "Laptops", slug: { current: "laptops" }, description: "Laptop reviews and guides" },
      { title: "Tablets", slug: { current: "tablets" }, description: "Tablet reviews" },
      { title: "Gaming", slug: { current: "gaming" }, description: "Gaming hardware" },
      { title: "Reviews", slug: { current: "reviews" }, description: "Product reviews" },
      { title: "Accessories", slug: { current: "accessories" }, description: "Tech accessories" },
    ];
  }
}

export async function getPost(slug: string) {
  try {
    const post = await withTimeout(
      client.fetch(
        `*[_type == "post" && slug.current == $slug][0]{
          _id,
          title,
          "author": coalesce(author->name, author),
          "image": mainImage.asset->url,
          "categories": categories[]->title,
          publishedAt,
          youtubeUrl,
          body,
          excerpt,
          "comments": *[_type == "comment" && references(^._id) && approved == true] | order(createdAt asc) {
            _id, name, message, createdAt
          }
        }`,
        { slug }
      ),
      5000
    );
    return post || null;
  } catch (error) {
    console.warn("Sanity fetch failed for post:", slug);
    return null;
  }
}