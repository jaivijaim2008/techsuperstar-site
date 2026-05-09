import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

function extractVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

async function fetchTranscript(videoId: string): Promise<string> {
  const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!pageRes.ok) throw new Error("Failed to fetch YouTube page");

  const html = await pageRes.text();

  const captionsMatch = html.match(/"captionTracks":\s*(\[[\s\S]*?\])/);
  if (!captionsMatch) throw new Error("No captions found for this video");

  const tracks = JSON.parse(captionsMatch[1]);
  const track =
    tracks.find((t: { languageCode: string }) => t.languageCode === "en") ||
    tracks[0];

  if (!track?.baseUrl) throw new Error("No caption track URL found");

  const captionUrl = track.baseUrl.replace(/\\u0026/g, "&");

  const transcriptRes = await fetch(captionUrl);
  if (!transcriptRes.ok) throw new Error("Failed to fetch transcript XML");

  const xml = await transcriptRes.text();

  const textMatches = xml.match(/<text[^>]*>([\s\S]*?)<\/text>/g) || [];
  const transcript = textMatches
    .map((tag) =>
      tag
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim()
    )
    .filter(Boolean)
    .join(" ");

  if (!transcript) throw new Error("Transcript is empty");
  return transcript;
}

function textToPortableText(text: string): object[] {
  const lines = text.split("\n").filter((l) => l.trim());
  const blocks: object[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let style = "normal";
    let cleanText = trimmed;

    if (trimmed.startsWith("### ")) {
      style = "h3";
      cleanText = trimmed.slice(4);
    } else if (trimmed.startsWith("## ")) {
      style = "h2";
      cleanText = trimmed.slice(3);
    } else if (trimmed.startsWith("# ")) {
      style = "h1";
      cleanText = trimmed.slice(2);
    }

    blocks.push({
      _type: "block",
      _key: Math.random().toString(36).slice(2, 10),
      style,
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: Math.random().toString(36).slice(2, 10),
          text: cleanText,
          marks: [],
        },
      ],
    });
  }

  return blocks;
}

export async function POST(req: NextRequest) {
  try {
    const { youtubeUrl } = await req.json();
    if (!youtubeUrl) {
      return NextResponse.json({ error: "YouTube URL is required" }, { status: 400, headers: corsHeaders });
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400, headers: corsHeaders });
    }

    // 1. Fetch YouTube metadata from your existing route
    const metaRes = await fetch(
      `https://techsuperstar-site.vercel.app/api/youtube-meta?url=${encodeURIComponent(youtubeUrl)}`
    );
    const meta = await metaRes.json();
    if (!metaRes.ok || meta.error) {
      return NextResponse.json(
        { error: `YouTube meta fetch failed: ${meta.error}` },
        { status: 422, headers: corsHeaders }
      );
    }

    // 2. Fetch transcript (falls back to description if no captions)
    let transcript = "";
    try {
      transcript = await fetchTranscript(videoId);
    } catch (err) {
      console.warn("Transcript fetch failed, using description:", err);
      transcript = meta.description || "";
    }

    const contentSource = transcript
      ? `VIDEO TRANSCRIPT:\n${transcript.slice(0, 8000)}`
      : `VIDEO DESCRIPTION (no transcript available):\n${meta.description}`;

    // 3. Send to Gemini 2.0 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a tech blog writer for TechSuperStar, a Tamil tech YouTube channel with 2M+ subscribers.

VIDEO TITLE: ${meta.title}
PUBLISHED DATE: ${meta.publishedAt}
TAGS: ${(meta.tags || []).slice(0, 15).join(", ")}

${contentSource}

Based on the above, generate a complete English blog post.
Respond ONLY with a valid JSON object — no markdown fences, no extra text, no explanation.

{
  "title": "Blog title with emojis matching TechSuperStar style e.g. 'AirPods Pro 3 😱 Best or Worst 🤯 Honest Review ⭐️ TechSuperStar ⭐️'",
  "slug": "lowercase-hyphenated-slug-no-emojis-no-special-chars",
  "category": "exactly one of: Phones, Laptops, Tablets, Gaming, Reviews, Accessories",
  "excerpt": "2-3 sentence summary for article cards. Hook the reader and mention the product clearly.",
  "body": "Full blog post in plain text. Use ## for section headings, ### for sub-headings. Cover every major point from the transcript. Minimum 700 words. Write in an engaging honest review style."
}`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const clean = rawText.replace(/```json|```/g, "").trim();
    const generated = JSON.parse(clean);

    const portableTextBody = textToPortableText(generated.body);

    return NextResponse.json({
      title: generated.title,
      slug: generated.slug,
      category: generated.category,
      excerpt: generated.excerpt,
      publishedAt: meta.publishedAt,
      body: portableTextBody,
      thumbnail: meta.thumbnail,
      thumbnailBase64: meta.thumbnailBase64,
      thumbnailMimeType: meta.thumbnailMimeType,
    }, { headers: corsHeaders });

  } catch (error) {
    console.error("YouTube autofill error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500, headers: corsHeaders }
    );
  }
}
