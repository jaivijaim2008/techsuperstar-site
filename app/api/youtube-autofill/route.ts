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

// Convert a section into Sanity Portable Text blocks (paragraph + bullet list)
function makeSectionBlocks(heading: string, content: string, bullets: string[]) {
  const blocks = [];

  // H2 heading block
  blocks.push({
    _type: "block",
    _key: Math.random().toString(36).slice(2),
    style: "h2",
    children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: heading, marks: [] }],
    markDefs: [],
  });

  // Paragraph block
  if (content) {
    blocks.push({
      _type: "block",
      _key: Math.random().toString(36).slice(2),
      style: "normal",
      children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: content, marks: [] }],
      markDefs: [],
    });
  }

  // Bullet list blocks
  if (bullets && bullets.length > 0) {
    for (const bullet of bullets) {
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).slice(2),
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: bullet, marks: [] }],
        markDefs: [],
      });
    }
  }

  return blocks;
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

    const prompt = `You are an expert Tamil tech blogger writing detailed English blog posts. Based on this YouTube video transcript, write a DETAILED, ATTRACTIVE, and LONG blog post review.

VIDEO TITLE: ${meta.title}
CONTENT: ${contentSource}

IMPORTANT RULES:
- Title must be catchy and include relevant emojis (like the YouTube title style)
- Each section "content" must be 4-6 detailed sentences with specific numbers and facts
- Each section "bullets" must have 3-5 short punchy bullet points highlighting key facts
- Use ALL information from the transcript — do not make up facts

Return ONLY a valid JSON object (no markdown, no explanation):

{
  "title": "Catchy title with relevant emojis matching the video topic",
  "slug": "url-friendly-slug-no-emojis",
  "excerpt": "2 engaging sentences summarizing the review for the blog card",
  "category": "one of: Phones, Laptops, Tablets, Gaming, Accessories, Reviews",
  "body": [
    {
      "heading": "Introduction",
      "content": "4-6 sentences: hook the reader, introduce the device, mention price segment, target audience, and what makes it stand out in 2025.",
      "bullets": ["Key highlight 1", "Key highlight 2", "Key highlight 3"]
    },
    {
      "heading": "Design & Build Quality",
      "content": "4-6 sentences about materials, dimensions, weight, color options, button placement, ports, and in-hand feel.",
      "bullets": ["Design point 1", "Design point 2", "Design point 3"]
    },
    {
      "heading": "Display",
      "content": "4-6 sentences about exact screen size, panel type, refresh rate, brightness in nits, resolution, and real-world viewing experience.",
      "bullets": ["Display spec 1", "Display spec 2", "Display spec 3"]
    },
    {
      "heading": "Performance",
      "content": "4-6 sentences about chipset name, RAM options, gaming FPS numbers, heating, and multitasking experience.",
      "bullets": ["Performance point 1", "Performance point 2", "Performance point 3"]
    },
    {
      "heading": "Camera",
      "content": "4-6 sentences about megapixels, aperture, video quality, night mode, selfie camera, and real-world photo quality verdict.",
      "bullets": ["Camera spec 1", "Camera spec 2", "Camera spec 3"]
    },
    {
      "heading": "Battery Life",
      "content": "4-6 sentences about battery mAh, screen-on time, charging wattage, time to full charge, and battery verdict.",
      "bullets": ["Battery point 1", "Battery point 2", "Battery point 3"]
    },
    {
      "heading": "Final Verdict",
      "content": "4-6 sentences: clear buy or skip recommendation, who should buy it, value for money, and a score out of 10.",
      "bullets": ["Verdict point 1", "Verdict point 2", "Verdict point 3"]
    }
  ],
  "specs": [
    { "label": "Display", "value": "exact spec from transcript or N/A" },
    { "label": "Processor", "value": "exact spec from transcript or N/A" },
    { "label": "RAM", "value": "exact spec from transcript or N/A" },
    { "label": "Storage", "value": "exact spec from transcript or N/A" },
    { "label": "Camera", "value": "exact spec from transcript or N/A" },
    { "label": "Battery", "value": "exact spec from transcript or N/A" },
    { "label": "OS", "value": "exact spec from transcript or N/A" },
    { "label": "Price", "value": "exact spec from transcript or N/A" }
  ],
  "pros": ["Detailed pro 1", "Detailed pro 2", "Detailed pro 3", "Detailed pro 4"],
  "cons": ["Detailed con 1", "Detailed con 2", "Detailed con 3"]
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 6000,
    });

    const rawText = completion.choices[0]?.message?.content || "";
    const jsonStr = extractJSON(rawText);
    const generated = JSON.parse(jsonStr);

    // 4. Convert body sections to Sanity Portable Text blocks (with bullet points)
    const bodyBlocks = (generated.body || []).flatMap(
      (section: { heading: string; content: string; bullets?: string[] }) =>
        makeSectionBlocks(section.heading, section.content, section.bullets || [])
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