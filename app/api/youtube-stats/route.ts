import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } } // cache for 1 hour
    );
    const data = await res.json();
    const stats = data.items?.[0]?.statistics;

    const formatCount = (n: string) => {
      const num = parseInt(n || "0");
      if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
      if (num >= 1000) return (num / 1000).toFixed(0) + "K";
      return String(num);
    };

    return NextResponse.json({
      subscribers: formatCount(stats?.subscriberCount),
      views: formatCount(stats?.viewCount),
    });
  } catch {
    return NextResponse.json({ subscribers: "2.08M", views: "3.2M" });
  }
}