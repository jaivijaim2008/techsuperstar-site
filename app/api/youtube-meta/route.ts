import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "No URL" }, { status: 400 });

  const videoIdMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/
  );
  const videoId = videoIdMatch?.[1];
  if (!videoId) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });

  const apiKey = process.env.YOUTUBE_API_KEY;
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
  );
  const data = await res.json();
  const snippet = data.items?.[0]?.snippet;
  if (!snippet) return NextResponse.json({ error: "Video not found" }, { status: 404 });

  return NextResponse.json({
    title: snippet.title,
    description: snippet.description,
    thumbnail: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url,
    tags: snippet.tags || [],
    publishedAt: snippet.publishedAt,
  });
}