import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

export async function POST(req: NextRequest) {
  const { name, email, message, postId } = await req.json();

  if (!name || !message || !postId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await client.create({
    _type: "comment",
    name,
    email,
    message,
    approved: false,
    post: { _type: "reference", _ref: postId },
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}