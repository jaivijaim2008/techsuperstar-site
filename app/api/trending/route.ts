import { client } from "@/lib/sanity";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await client.fetch(
      `*[_type == "post"] | order(publishedAt desc)[0..9]{
        title,
        "slug": slug.current,
        "category": categories[0]->title
      }`
    );
    return NextResponse.json(posts || []);
  } catch (error) {
    return NextResponse.json([]);
  }
}