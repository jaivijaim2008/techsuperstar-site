import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (!url) return NextResponse.json({ error: "No URL" }, { status: 400, headers: corsHeaders });

  const videoIdMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/
  );
  const videoId = videoIdMatch?.[1];
  if (!videoId) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400, headers: corsHeaders });

  const apiKey = process.env.YOUTUBE_API_KEY;
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
  );
  const data = await res.json();
  const snippet = data.items?.[0]?.snippet;
  if (!snippet) return NextResponse.json({ error: "Video not found" }, { status: 404, headers: corsHeaders });

  const thumbnailUrl =
    snippet.thumbnails?.maxres?.url ||
    snippet.thumbnails?.high?.url ||
    snippet.thumbnails?.medium?.url;

  let thumbnailBase64 = null;
  let thumbnailMimeType = "image/jpeg";
  try {
    if (thumbnailUrl) {
      const imgRes = await fetch(thumbnailUrl);
      const imgBuffer = await imgRes.arrayBuffer();
      thumbnailBase64 = Buffer.from(imgBuffer).toString("base64");
      thumbnailMimeType = imgRes.headers.get("content-type") || "image/jpeg";
    }
  } catch (e) {
    console.error("Thumbnail fetch failed:", e);
  }

  return NextResponse.json({
    title: snippet.title,
    description: snippet.description,
    thumbnail: thumbnailUrl,
    thumbnailBase64,
    thumbnailMimeType,
    tags: snippet.tags || [],
    publishedAt: snippet.publishedAt,
  }, { headers: corsHeaders });
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}