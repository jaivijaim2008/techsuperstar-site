import { NextRequest, NextResponse } from "next/server";

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

    // 3. Generate everything with OpenRouter
    const prompt = `You are an expert Tamil tech blogger writing detailed English blog posts. Based on this YouTube video transcript, write a DETAILED, ATTRACTIVE, and LONG blog post.

VIDEO TITLE: ${meta.title}
CONTENT: ${contentSource}

STEP 1 — DETECT VIDEO TYPE:
First analyze the title and content to detect what type of video this is:
- "single_review" → reviewing ONE product (e.g. "OnePlus 15R Review")
- "comparison" → comparing TWO or more products (e.g. "iPhone vs Samsung", "Vivo X300 Pro vs Xiaomi 17 Ultra")
- "top_list" → listing multiple products (e.g. "Top 5 Phones", "Best Earbuds 2025")
- "accessories" → earbuds, headphones, chargers, cables, cases, etc.
- "news" → announcements, leaks, upcoming phones
- "other" → anything else

STEP 2 — GENERATE SMART SPECS based on video type:

For "single_review" phones/laptops/tablets → use these spec labels:
["Display", "Processor", "RAM", "Storage", "Camera", "Battery", "OS", "Price"]

For "comparison" → use format "Product A vs Product B" for each label:
Example: { "label": "Battery", "value": "Vivo X300 Pro: 4200mAh | Xiaomi 17 Ultra: 4500mAh" }
Use labels: ["Display", "Processor", "RAM", "Storage", "Camera", "Battery", "OS", "Price"]

For "top_list" → list each product with its key spec:
Example: { "label": "iPhone 16 Pro", "value": "A18 Pro chip, 48MP camera, starts at ₹1,19,900" }

For "accessories" (earbuds/headphones) → use these labels:
["Driver Size", "Connectivity", "Battery Life", "ANC", "Water Resistance", "Codec Support", "Weight", "Price"]

For "accessories" (chargers/cables) → use these labels:
["Wattage", "Connector Type", "Cable Length", "Compatibility", "Fast Charging", "Price"]

For "news" → use these labels:
["Expected Price", "Launch Date", "Key Features", "Chipset", "Camera", "Battery", "Availability"]

For "other" → generate the most relevant spec labels based on content (maximum 8 labels)

STEP 3 — GENERATE SMART BODY SECTIONS based on video type:

For "single_review" → use sections: Introduction, Design & Build, Display, Performance, Camera, Battery Life, Final Verdict
For "comparison" → use sections: Introduction, Design Comparison, Display Comparison, Performance Comparison, Camera Comparison, Battery Comparison, Which One to Buy?
For "top_list" → use sections: Introduction, then one section per product, then Final Recommendations
For "accessories" → use sections: Introduction, Design & Build, Sound Quality (or Performance), Features, Battery Life, Value for Money, Final Verdict
For "news" → use sections: Introduction, Key Highlights, Expected Specs, Price & Availability, Should You Wait?
For "other" → generate the most relevant sections based on content

IMPORTANT RULES:
- Title must be catchy with relevant emojis matching the YouTube title style
- Each section "content" must be 4-6 detailed sentences with specific numbers and facts from the transcript
- Each section "bullets" must have 3-5 short punchy bullet points
- For comparison videos, always mention BOTH products in every section
- NEVER put N/A for specs — extract real values from transcript. Only use N/A if truly not mentioned at all
- Do not make up facts — use only information from the transcript

Return ONLY a valid JSON object (no markdown, no explanation):

{
  "video_type": "single_review | comparison | top_list | accessories | news | other",
  "title": "Catchy title with relevant emojis",
  "slug": "url-friendly-slug-no-emojis",
  "excerpt": "2 engaging sentences summarizing the content for the blog card",
  "category": "one of: Phones, Laptops, Tablets, Gaming, Accessories, Reviews",
  "body": [
    {
      "heading": "Section heading based on video type",
      "content": "4-6 detailed sentences with specific facts and numbers from transcript",
      "bullets": ["Punchy bullet point 1", "Punchy bullet point 2", "Punchy bullet point 3"]
    }
  ],
  "specs": [
    { "label": "Spec label based on video type", "value": "Exact value from transcript" }
  ],
  "pros": ["Detailed pro 1", "Detailed pro 2", "Detailed pro 3", "Detailed pro 4"],
  "cons": ["Detailed con 1", "Detailed con 2", "Detailed con 3"]
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://techsuperstar-site.vercel.app",
        "X-Title": "TechSuperStar",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 6000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter error: ${errText}`);
    }

    const completion = await response.json();
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
        video_type: generated.video_type || "single_review",
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