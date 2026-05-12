import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  const start = text.indexOf("{");
  if (start === -1) throw new Error("No JSON found in response");

  let jsonStr = text.slice(start);
  const end = jsonStr.lastIndexOf("}");
  if (end !== -1) jsonStr = jsonStr.slice(0, end + 1);

  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escape = false;

  for (const ch of jsonStr) {
    if (escape) { escape = false; continue; }
    if (ch === "\\" && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") openBraces++;
    if (ch === "}") openBraces--;
    if (ch === "[") openBrackets++;
    if (ch === "]") openBrackets--;
  }

  while (openBrackets > 0) { jsonStr += "]"; openBrackets--; }
  while (openBraces > 0) { jsonStr += "}"; openBraces--; }

  // Patch common AI mistakes
  jsonStr = jsonStr
    .replace(/,\s*([}\]])/g, "$1")        // trailing commas
    .replace(/:\s*undefined/g, ": null")  // undefined → null
    .replace(/\bNaN\b/g, "null");         // NaN → null

  return jsonStr;
}

async function fetchTranscript(videoId: string): Promise<string> {
  try {
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
      .slice(0, 3000); // More transcript = richer posts
  } catch {
    return "";
  }
}

function makeSectionBlocks(
  heading: string,
  content: string,
  bullets: string[]
) {
  const key = () => Math.random().toString(36).slice(2);
  const blocks = [];

  blocks.push({
    _type: "block", _key: key(), style: "h2",
    children: [{ _type: "span", _key: key(), text: heading, marks: [] }],
    markDefs: [],
  });

  if (content) {
    blocks.push({
      _type: "block", _key: key(), style: "normal",
      children: [{ _type: "span", _key: key(), text: content, marks: [] }],
      markDefs: [],
    });
  }

  for (const bullet of bullets ?? []) {
    blocks.push({
      _type: "block", _key: key(), style: "normal",
      listItem: "bullet", level: 1,
      children: [{ _type: "span", _key: key(), text: bullet, marks: [] }],
      markDefs: [],
    });
  }

  return blocks;
}

// ─── Prompt ──────────────────────────────────────────────────────────────────

function buildPrompt(title: string, contentSource: string) {
  return `You are an expert Tamil tech blogger writing detailed, SEO-optimised English blog posts.

VIDEO TITLE: ${title}

CONTENT:
${contentSource}

RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation.
- All string values must be properly escaped.
- body must have at least 5 sections with 4-8 detailed sentences each.
- specs must have at least 8 entries if available.
- pros/cons must have at least 4 entries each.

{
  "video_type": "single_review",
  "title": "Catchy title with emojis",
  "slug": "url-friendly-slug",
  "excerpt": "2 engaging sentences for blog card",
  "category": "phones",
  "body": [
    {
      "heading": "Section heading",
      "content": "4-8 detailed sentences expanding on this section",
      "bullets": ["Detailed point 1", "Detailed point 2", "Detailed point 3"]
    }
  ],
  "specs": [{ "label": "Spec name", "value": "Spec value" }],
  "pros": ["Pro 1", "Pro 2", "Pro 3", "Pro 4"],
  "cons": ["Con 1", "Con 2", "Con 3"]
}`;
}

// ─── AI Providers ─────────────────────────────────────────────────────────────
// Each returns the raw content string or throws.

async function callCerebras(prompt: string): Promise<string> {
  const key = process.env.CEREBRAS_API_KEY;
  if (!key) throw new Error("CEREBRAS_API_KEY not set");

  const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.1-8b",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2500,
      temperature: 0.4,
    }),
  });

  if (!res.ok) throw new Error(`Cerebras ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

async function callGroq(prompt: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY not set");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile", // Much larger model = better quality
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.4,
    }),
  });

  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 4000, temperature: 0.4 },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function callOpenRouter(prompt: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL ?? "",
      "X-Title": "TechSuperstar Blog Generator",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-70b-instruct:free", // Free tier
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.4,
    }),
  });

  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

async function callHuggingFace(prompt: string): Promise<string> {
  const key = process.env.HUGGINGFACE_API_KEY;
  if (!key) throw new Error("HUGGINGFACE_API_KEY not set");

  const res = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 3000, temperature: 0.4, return_full_text: false },
      }),
    }
  );

  if (!res.ok) throw new Error(`HuggingFace ${res.status}: ${await res.text()}`);
  const data = await res.json();
  // HF returns array
  return Array.isArray(data) ? data[0]?.generated_text ?? "" : data?.generated_text ?? "";
}

// ─── Provider waterfall ───────────────────────────────────────────────────────

type Provider = { name: string; call: (p: string) => Promise<string> };

const PROVIDERS: Provider[] = [
  { name: "Groq (llama-70b)",    call: callGroq },        // Best free quality
  { name: "Gemini 1.5 Flash",    call: callGemini },      // Google, generous limits
  { name: "Cerebras (llama-8b)", call: callCerebras },    // Very fast
  { name: "OpenRouter",          call: callOpenRouter },  // Free fallback
  { name: "HuggingFace Mixtral", call: callHuggingFace }, // Last resort
];

async function generateWithFallback(
  prompt: string
): Promise<{ rawText: string; provider: string }> {
  const errors: string[] = [];

  for (const provider of PROVIDERS) {
    try {
      console.log(`[AI] Trying ${provider.name}…`);
      const rawText = await provider.call(prompt);

      if (!rawText || rawText.length < 100) {
        throw new Error("Empty or too-short response");
      }

      console.log(`[AI] ✅ ${provider.name} succeeded`);
      return { rawText, provider: provider.name };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[AI] ❌ ${provider.name} failed: ${msg}`);
      errors.push(`${provider.name}: ${msg}`);
    }
  }

  throw new Error(`All AI providers failed:\n${errors.join("\n")}`);
}

// ─── Main handler ─────────────────────────────────────────────────────────────

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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Fetch meta and transcript in parallel
    const [metaRes, transcript] = await Promise.all([
      fetch(`${baseUrl}/api/youtube-meta?url=${encodeURIComponent(url)}`),
      fetchTranscript(videoId),
    ]);

    const meta = await metaRes.json();

    if (meta.error) {
      return NextResponse.json(
        { error: meta.error },
        { status: 400, headers: corsHeaders }
      );
    }

    const contentSource = transcript || meta.description || "";

    if (!contentSource) {
      return NextResponse.json(
        { error: "No content available for this video" },
        { status: 400, headers: corsHeaders }
      );
    }

    const prompt = buildPrompt(meta.title, contentSource);

    // Try all providers with automatic fallback
    const { rawText, provider } = await generateWithFallback(prompt);

    let generated: any = {};

    try {
      const jsonStr = extractAndRepairJSON(rawText);
      generated = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("RAW AI RESPONSE:", rawText);
      console.error("JSON parse failed:", parseErr);

      return NextResponse.json(
        { error: "AI returned invalid JSON", raw: rawText, provider },
        { status: 500, headers: corsHeaders }
      );
    }

    const bodyBlocks = (generated.body || []).flatMap(
      (section: { heading: string; content: string; bullets?: string[] }) =>
        makeSectionBlocks(section.heading, section.content, section.bullets || [])
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
        _meta: { provider }, // helpful for debugging
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