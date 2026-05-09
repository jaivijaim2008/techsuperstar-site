import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

function extractVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/
  );
  return match?.[1] ?? null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);
}

function extractJSON(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found in response");
  return text.slice(start, end + 1);
}

async function fetchTranscript(videoId: string): Promise<string> {
  const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  const html = await res.text();

  const captionsMatch = html.match(/"captionTracks":\s*(\[[\s\S]*?\])/);
  if (!captionsMatch) return "";

  const tracks = JSON.parse(captionsMatch[1]);
  const track =
    tracks.find((t: { languageCode: string }) => t.languageCode === "en") ||
    tracks[0];
  if (!track?.baseUrl) return "";

  const xmlRes = await fetch(track.baseUrl);
  const xml = await xmlRes.text();

  return xml
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400, headers: corsHeaders });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400, headers: corsHeaders });
    }

    // 1. Fetch YouTube metadata
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const metaRes = await fetch(`${baseUrl}/api/youtube-meta?url=${encodeURIComponent(url)}`);
    const meta = await metaRes.json();

    if (meta.error) {
      return NextResponse.json({ error: meta.error }, { status: 400, headers: corsHeaders });
    }

    // 2. Fetch transcript
    const transcript = await fetchTranscript(videoId);
    const contentSource = transcript || meta.description || "";

    if (!contentSource) {
      return NextResponse.json({ error: "No content available for this video" }, { status: 400, headers: corsHeaders });
    }

    // 3. Generate everything with Groq
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `You are an expert Tamil tech blogger writing in English. Based on this YouTube video transcript, write a DETAILED and LONG blog post review.

VIDEO TITLE: ${meta.title}
CONTENT: ${contentSource}

IMPORTANT: Each section's "content" must be AT LEAST 4-6 sentences long with specific details, numbers, and comparisons. Do NOT write short summaries. Use all the information from the transcript to write rich, detailed content.

Return ONLY a valid JSON object (no markdown, no explanation) with these exact keys:

{
  "title": "Clean blog title without emojis",
  "slug": "url-friendly-slug",
  "excerpt": "2-sentence summary for the blog card",
  "category": "one of: Phones, Laptops, Tablets, Gaming, Accessories, Reviews",
  "body": [
    { "heading": "Introduction", "content": "Write 4-6 sentences introducing the device, its market positioning, target audience, price segment, and what makes it special or unique compared to competitors." },
    { "heading": "Design & Build", "content": "Write 4-6 sentences about the physical design, materials used, dimensions, weight, color options, button placement, ports, and overall in-hand feel and comfort." },
    { "heading": "Display", "content": "Write 4-6 sentences about display size, panel type (OLED/AMOLED/LCD), refresh rate, peak brightness, color accuracy, resolution, and real-world viewing experience including sunlight visibility." },
    { "heading": "Performance", "content": "Write 4-6 sentences about the processor model, RAM, storage options, real-world performance in daily tasks, gaming experience, multitasking capability, heating issues, and any benchmark results mentioned." },
    { "heading": "Camera", "content": "Write 4-6 sentences about the main camera specs (megapixels, aperture, sensor size), photo quality in different lighting conditions, video recording capabilities, night mode performance, selfie camera quality, and overall camera verdict." },
    { "heading": "Battery Life", "content": "Write 4-6 sentences about battery capacity in mAh, screen-on time in real usage, wired charging speed in watts, wireless charging support, battery drain during gaming, and overall battery rating." },
    { "heading": "Verdict", "content": "Write 4-6 sentences giving a final verdict, summarizing the best and worst aspects, who should buy this device, value for money assessment, and a clear buy or skip recommendation." }
  ],
  "specs": [
    { "label": "Display", "value": "exact spec extracted from transcript or N/A" },
    { "label": "Processor", "value": "exact spec extracted from transcript or N/A" },
    { "label": "RAM", "value": "exact spec extracted from transcript or N/A" },
    { "label": "Storage", "value": "exact spec extracted from transcript or N/A" },
    { "label": "Camera", "value": "exact spec extracted from transcript or N/A" },
    { "label": "Battery", "value": "exact spec extracted from transcript or N/A" },
    { "label": "OS", "value": "exact spec extracted from transcript or N/A" },
    { "label": "Price", "value": "exact spec extracted from transcript or N/A" }
  ],
  "pros": ["detailed pro 1", "detailed pro 2", "detailed pro 3", "detailed pro 4"],
  "cons": ["detailed con 1", "detailed con 2", "detailed con 3"]
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 6000,
    });

    const rawText = completion.choices[0]?.message?.content || "";
    const jsonStr = extractJSON(rawText);
    const generated = JSON.parse(jsonStr);

    // 4. Convert body sections to Sanity Portable Text blocks
    const bodyBlocks = (generated.body || []).flatMap(
      (section: { heading: string; content: string }) => [
        {
          _type: "block",
          _key: Math.random().toString(36).slice(2),
          style: "h2",
          children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: section.heading, marks: [] }],
          markDefs: [],
        },
        {
          _type: "block",
          _key: Math.random().toString(36).slice(2),
          style: "normal",
          children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: section.content, marks: [] }],
          markDefs: [],
        },
      ]
    );

    return NextResponse.json(
      {
        title: generated.title || meta.title,
        slug: generated.slug || slugify(meta.title),
        excerpt: generated.excerpt || "",
        category: generated.category || "Reviews",
        publishedAt: meta.publishedAt,
        thumbnail: meta.thumbnail,
        thumbnailBase64: meta.thumbnailBase64,
        thumbnailMimeType: meta.thumbnailMimeType,
        body: bodyBlocks,
        specs: generated.specs || [],
        pros: generated.pros || [],
        cons: generated.cons || [],
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("Autofill error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500, headers: corsHeaders }
    );
  }
}