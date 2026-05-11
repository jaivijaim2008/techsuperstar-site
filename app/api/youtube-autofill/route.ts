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

function extractAndRepairJSON(text: string): string {
  // remove markdown blocks
  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = text.indexOf("{");
  if (start === -1) throw new Error("No JSON found in response");

  let jsonStr = text.slice(start);

  const end = jsonStr.lastIndexOf("}");
  if (end !== -1) {
    jsonStr = jsonStr.slice(0, end + 1);
  }

  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escape = false;

  for (const ch of jsonStr) {
    if (escape) {
      escape = false;
      continue;
    }

    if (ch === "\\" && inString) {
      escape = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === "{") openBraces++;
    if (ch === "}") openBraces--;

    if (ch === "[") openBrackets++;
    if (ch === "]") openBrackets--;
  }

  while (openBrackets > 0) {
    jsonStr += "]";
    openBrackets--;
  }

  while (openBraces > 0) {
    jsonStr += "}";
    openBraces--;
  }

  return jsonStr;
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
    .slice(0, 1500);
}

function makeSectionBlocks(
  heading: string,
  content: string,
  bullets: string[]
) {
  const blocks = [];

  blocks.push({
    _type: "block",
    _key: Math.random().toString(36).slice(2),
    style: "h2",
    children: [
      {
        _type: "span",
        _key: Math.random().toString(36).slice(2),
        text: heading,
        marks: [],
      },
    ],
    markDefs: [],
  });

  if (content) {
    blocks.push({
      _type: "block",
      _key: Math.random().toString(36).slice(2),
      style: "normal",
      children: [
        {
          _type: "span",
          _key: Math.random().toString(36).slice(2),
          text: content,
          marks: [],
        },
      ],
      markDefs: [],
    });
  }

  if (bullets && bullets.length > 0) {
    for (const bullet of bullets) {
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).slice(2),
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _type: "span",
            _key: Math.random().toString(36).slice(2),
            text: bullet,
            marks: [],
          },
        ],
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
      return NextResponse.json(
        { error: "No URL provided" },
        { status: 400, headers: corsHeaders }
      );
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400, headers: corsHeaders }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const metaRes = await fetch(
      `${baseUrl}/api/youtube-meta?url=${encodeURIComponent(url)}`
    );

    const meta = await metaRes.json();

    if (meta.error) {
      return NextResponse.json(
        { error: meta.error },
        { status: 400, headers: corsHeaders }
      );
    }

    const transcript = await fetchTranscript(videoId);

    const contentSource = transcript || meta.description || "";

    if (!contentSource) {
      return NextResponse.json(
        { error: "No content available for this video" },
        { status: 400, headers: corsHeaders }
      );
    }

    const prompt = `You are an expert Tamil tech blogger writing detailed English blog posts.

VIDEO TITLE: ${meta.title}

CONTENT:
${contentSource}

IMPORTANT:
- Return ONLY valid JSON
- No markdown
- No explanation
- No backticks
- No \`\`\`json

{
  "video_type": "single_review",
  "title": "Catchy title with emojis",
  "slug": "url-friendly-slug",
  "excerpt": "2 engaging sentences for blog card",
  "category": "phones",
  "body": [
    {
      "heading": "Section heading",
      "content": "4-6 detailed sentences",
      "bullets": ["Point 1", "Point 2", "Point 3"]
    }
  ],
  "specs": [
    { "label": "Spec name", "value": "Spec value" }
  ],
  "pros": ["Pro 1", "Pro 2", "Pro 3"],
  "cons": ["Con 1", "Con 2"]
}`;

    // Cerebras API
    const response = await fetch(
      "https://api.cerebras.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.1-8b",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1800,
          temperature: 0.4,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cerebras error: ${errText}`);
    }

    const completion = await response.json();

    let rawText =
      completion?.choices?.[0]?.message?.content || "";

    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let generated: any = {};

    try {
      const jsonStr = extractAndRepairJSON(rawText);

      generated = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("RAW AI RESPONSE:", rawText);
      console.error("JSON parse failed:", parseErr);

      return NextResponse.json(
        {
          error: "AI returned invalid JSON",
          raw: rawText,
        },
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    const bodyBlocks = (generated.body || []).flatMap(
      (section: {
        heading: string;
        content: string;
        bullets?: string[];
      }) =>
        makeSectionBlocks(
          section.heading,
          section.content,
          section.bullets || []
        )
    );

    return NextResponse.json(
      {
        title: generated.title || meta.title,
        slug: generated.slug || slugify(meta.title),
        excerpt: generated.excerpt || "",
        category: generated.category || "phones",
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
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}