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
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\s?]+)/
  );
  return match?.[1] ?? null;
}

function convertUSDToINR(text: string): string {
  const rate = 83;
  return text.replace(/\$([\d,]+)/g, (_, amount) => {
    const usd = Number(amount.replace(/,/g, ""));
    const inr = usd * rate;
    return `₹${inr.toLocaleString("en-IN")}`;
  });
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

  jsonStr = jsonStr
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/:\s*undefined/g, ": null")
    .replace(/\bNaN\b/g, "null");

  return jsonStr;
}

function withTimeout(ms: number): AbortSignal {
  return AbortSignal.timeout(ms);
}

// ─── Transcript Fetcher ───────────────────────────────────────────────────────

async function fetchTranscript(videoId: string): Promise<string> {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      signal: withTimeout(15000),
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

    const xmlRes = await fetch(track.baseUrl, { signal: withTimeout(10000) });
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
  } catch {
    return "";
  }
}

// ─── AI Image Generator ───────────────────────────────────────────────────────

async function generateSectionImage(
  heading: string,
  deviceName: string
): Promise<string> {

  const query = encodeURIComponent(
    `${deviceName} smartphone tech`
  );

  return `https://source.unsplash.com/1200x675/?${query}`;
}

// ─── Block Builder ────────────────────────────────────────────────────────────

function makeSectionBlocks(
  heading: string,
  content: string,
  bullets: string[],
  imageUrl?: string
) {
  const key = () => Math.random().toString(36).slice(2);
  const blocks = [];

  // Heading
  blocks.push({
    _type: "block", _key: key(), style: "h2",
    children: [{ _type: "span", _key: key(), text: heading, marks: [] }],
    markDefs: [],
  });

  // AI Image below heading
  if (imageUrl) {
    blocks.push({
      _type: "sectionImage",
      _key: key(),
      imageUrl,
      alt: heading,
    });
  }

  // Paragraph
  if (content) {
    blocks.push({
      _type: "block", _key: key(), style: "normal",
      children: [{ _type: "span", _key: key(), text: content, marks: [] }],
      markDefs: [],
    });
  }

  // Bullet points
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
  return `You are a professional Tamil tech blogger writing in ENGLISH. Write an extremely detailed, long-form, SEO-optimised blog post. The target reader is someone who wants to know everything before buying. Never be brief.

VIDEO TITLE: ${title}

TRANSCRIPT / DESCRIPTION:
${contentSource}

STRICT REQUIREMENTS:
- Return ONLY valid JSON. Zero markdown, zero backticks, zero explanation outside JSON.
- "body" MUST have EXACTLY 8 sections minimum. Each section MUST have:
  - "heading": descriptive heading (no generic labels)
  - "content": a SINGLE detailed paragraph of AT LEAST 150 words covering that topic in depth
  - "bullets": AT LEAST 5 bullet points, each a full sentence (not fragments)
- "specs" MUST have AT LEAST 12 entries covering processor, RAM, storage, display size, display type, refresh rate, battery, charging speed, OS, camera details, dimensions, weight, connectivity, price
- "pros" MUST have AT LEAST 6 entries, each a full descriptive sentence
- "cons" MUST have AT LEAST 4 entries, each a full descriptive sentence with context
- All text must be detailed, informative, and written for SEO. Use real values from the transcript where available.
- The 8 required body sections are: Introduction & Overview, Design & Build Quality, Display Quality & Experience, Performance & Benchmark Results, Camera System & Photo Quality, Battery Life & Charging, Software & Features, Price & Verdict

Return this exact JSON shape:
{
  "video_type": "single_review",
  "title": "Catchy SEO title with relevant emojis (include device name, year, key feature)",
  "slug": "url-friendly-slug-with-device-name",
  "excerpt": "Two compelling sentences that summarise the review for a blog card. Should include a hook and key verdict.",
  "category": "phones",
  "body": [
    {
      "heading": "Section heading here",
      "content": "A single paragraph of at least 150 words that thoroughly covers this section topic with specific details, numbers, and analysis from the review content...",
      "bullets": [
        "Full sentence bullet point with specific detail",
        "Full sentence bullet point with specific detail",
        "Full sentence bullet point with specific detail",
        "Full sentence bullet point with specific detail",
        "Full sentence bullet point with specific detail"
      ]
    }
  ],
  "specs": [
    { "label": "Processor", "value": "Exact chip name and details" },
    { "label": "RAM", "value": "Amount and type" },
    { "label": "Storage", "value": "Options available" },
    { "label": "Display", "value": "Size, type, resolution" },
    { "label": "Refresh Rate", "value": "Hz" },
    { "label": "Battery", "value": "mAh" },
    { "label": "Charging", "value": "Watt speed, wireless if available" },
    { "label": "Rear Camera", "value": "Full camera spec breakdown" },
    { "label": "Front Camera", "value": "MP and features" },
    { "label": "OS", "value": "Version and skin" },
    { "label": "Dimensions", "value": "mm" },
    { "label": "Weight", "value": "grams" },
    { "label": "Price", "value": "Launch price with currency" }
  ],
  "pros": [
    "Full sentence describing this positive aspect with specific details",
    "Full sentence describing this positive aspect with specific details",
    "Full sentence describing this positive aspect with specific details",
    "Full sentence describing this positive aspect with specific details",
    "Full sentence describing this positive aspect with specific details",
    "Full sentence describing this positive aspect with specific details"
  ],
  "cons": [
    "Full sentence describing this negative aspect with context",
    "Full sentence describing this negative aspect with context",
    "Full sentence describing this negative aspect with context",
    "Full sentence describing this negative aspect with context"
  ]
}`;
}

// ─── AI Providers ─────────────────────────────────────────────────────────────

async function callGroq(prompt: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY not set");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    signal: withTimeout(60000),
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a professional tech blogger. Always respond with pure valid JSON only. No markdown fences. No preamble. No explanation. Start your response with { and end with }."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 8000,
      temperature: 0.3,
    }),
  });

  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
  const data = await res.json();

  const finishReason = data?.choices?.[0]?.finish_reason;
  if (finishReason === "length") {
    throw new Error("Groq response truncated (finish_reason=length) — hit token limit");
  }

  return data?.choices?.[0]?.message?.content ?? "";
}

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${key}`,
    {
      method: "POST",
      signal: withTimeout(60000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a professional tech blogger. Respond with pure valid JSON only. No markdown. No backticks. No explanation. Start with { and end with }.\n\n${prompt}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini Pro ${res.status}: ${await res.text()}`);
  const data = await res.json();

  const finishReason = data?.candidates?.[0]?.finishReason;
  if (finishReason === "MAX_TOKENS") {
    throw new Error("Gemini Pro response truncated (MAX_TOKENS) — falling back");
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function callGeminiFlash(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: "POST",
      signal: withTimeout(60000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a professional tech blogger. Respond with pure valid JSON only. No markdown. No backticks.\n\n${prompt}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.3,
        },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini Flash ${res.status}: ${await res.text()}`);
  const data = await res.json();

  const finishReason = data?.candidates?.[0]?.finishReason;
  if (finishReason === "MAX_TOKENS") {
    throw new Error("Gemini Flash response truncated (MAX_TOKENS) — falling back");
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function callCerebras(prompt: string): Promise<string> {
  const key = process.env.CEREBRAS_API_KEY;
  if (!key) throw new Error("CEREBRAS_API_KEY not set");

  const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    signal: withTimeout(60000),
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.1-70b",
      messages: [
        {
          role: "system",
          content: "You are a professional tech blogger. Always respond with pure valid JSON only. No markdown fences. No preamble. Start with { and end with }."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 8000,
      temperature: 0.3,
    }),
  });

  if (!res.ok) throw new Error(`Cerebras ${res.status}: ${await res.text()}`);
  const data = await res.json();

  const finishReason = data?.choices?.[0]?.finish_reason;
  if (finishReason === "length") {
    throw new Error("Cerebras response truncated (finish_reason=length) — falling back");
  }

  return data?.choices?.[0]?.message?.content ?? "";
}

async function callOpenRouter(prompt: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    signal: withTimeout(60000),
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL ?? "",
      "X-Title": "TechSuperstar Blog Generator",
    },
    body: JSON.stringify({
      model: "google/gemini-flash-1.5",
      messages: [
        {
          role: "system",
          content: "You are a professional tech blogger. Always respond with pure valid JSON only. No markdown fences. No preamble. Start with { and end with }."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 8000,
      temperature: 0.3,
    }),
  });

  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const data = await res.json();

  const finishReason = data?.choices?.[0]?.finish_reason;
  if (finishReason === "length") {
    throw new Error("OpenRouter response truncated (finish_reason=length) — falling back");
  }

  return data?.choices?.[0]?.message?.content ?? "";
}

async function callHuggingFace(prompt: string): Promise<string> {
  const key = process.env.HUGGINGFACE_API_KEY;
  if (!key) throw new Error("HUGGINGFACE_API_KEY not set");

  const systemMsg = "You are a professional tech blogger. Always respond with pure valid JSON only. No markdown fences.\n\n";

  const res = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
    {
      method: "POST",
      signal: withTimeout(60000),
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: systemMsg + prompt,
        parameters: {
          max_new_tokens: 8000,
          temperature: 0.3,
          return_full_text: false,
        },
      }),
    }
  );

  if (!res.ok) throw new Error(`HuggingFace ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return Array.isArray(data) ? data[0]?.generated_text ?? "" : data?.generated_text ?? "";
}

// ─── Provider waterfall ───────────────────────────────────────────────────────

type Provider = { name: string; call: (p: string) => Promise<string> };

const PROVIDERS: Provider[] = [
  { name: "Groq llama-3.3-70b",      call: callGroq },
  { name: "Gemini 1.5 Pro",           call: callGemini },
  { name: "Gemini 1.5 Flash",         call: callGeminiFlash },
  { name: "Cerebras llama-70b",       call: callCerebras },
  { name: "OpenRouter Gemini Flash",  call: callOpenRouter },
  { name: "HuggingFace Mixtral-8x7B", call: callHuggingFace },
];

const MIN_QUALITY_LENGTH = 2000;

function validateStructure(generated: any, providerName: string): void {
  if (!Array.isArray(generated.body) || generated.body.length < 8) {
    throw new Error(
      `${providerName}: body has ${generated.body?.length ?? 0} sections — need 8+`
    );
  }

  for (let i = 0; i < generated.body.length; i++) {
    const section = generated.body[i];
    if (!section.content || section.content.trim().length < 100) {
      throw new Error(
        `${providerName}: body[${i}].content too short (${section.content?.length ?? 0} chars)`
      );
    }
    if (!Array.isArray(section.bullets) || section.bullets.length < 5) {
      throw new Error(
        `${providerName}: body[${i}].bullets has ${section.bullets?.length ?? 0} items — need 5+`
      );
    }
  }

  if (!Array.isArray(generated.specs) || generated.specs.length < 8) {
    throw new Error(
      `${providerName}: specs has ${generated.specs?.length ?? 0} entries — need 8+`
    );
  }

  if (!Array.isArray(generated.pros) || generated.pros.length < 6) {
    throw new Error(
      `${providerName}: pros has ${generated.pros?.length ?? 0} entries — need 6+`
    );
  }

  if (!Array.isArray(generated.cons) || generated.cons.length < 4) {
    throw new Error(
      `${providerName}: cons has ${generated.cons?.length ?? 0} entries — need 4+`
    );
  }
}

async function generateWithFallback(
  prompt: string
): Promise<{ generated: any; provider: string }> {
  const errors: string[] = [];

  for (const provider of PROVIDERS) {
    try {
      console.log(`[AI] Trying ${provider.name}…`);
      const rawText = await provider.call(prompt);

      if (!rawText || rawText.length < MIN_QUALITY_LENGTH) {
        throw new Error(`Response too short (${rawText?.length ?? 0} chars) — rejected`);
      }

      const jsonStr = extractAndRepairJSON(rawText);
      const generated = JSON.parse(jsonStr);

      validateStructure(generated, provider.name);

      console.log(`[AI] ✅ ${provider.name} succeeded (${rawText.length} chars)`);
      return { generated, provider: provider.name };
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

    const [metaRes, transcript] = await Promise.all([
      fetch(`${baseUrl}/api/youtube-meta?url=${encodeURIComponent(url)}`, {
        signal: withTimeout(15000),
      }),
      fetchTranscript(videoId),
    ]);

    const meta = await metaRes.json();

    if (meta.error) {
      return NextResponse.json(
        { error: meta.error },
        { status: 400, headers: corsHeaders }
      );
    }

    const contentSource = [transcript, meta.description]
      .filter(Boolean)
      .join("\n\n---\n\n")
      .slice(0, 9000);

    const contentForPrompt = contentSource || meta.title;

    if (!contentForPrompt) {
      return NextResponse.json(
        { error: "No content available for this video" },
        { status: 400, headers: corsHeaders }
      );
    }

    const prompt = buildPrompt(meta.title, contentForPrompt);

    const { generated, provider } = await generateWithFallback(prompt);

    // Convert USD to INR
    generated.specs = (generated.specs || []).map((spec: any) => ({
      ...spec,
      value: spec.label?.toLowerCase().includes("price")
        ? convertUSDToINR(spec.value)
        : spec.value,
    }));

    generated.excerpt = convertUSDToINR(generated.excerpt || "");

    generated.body = (generated.body || []).map((section: any) => ({
      ...section,
      content: convertUSDToINR(section.content || ""),
      bullets: (section.bullets || []).map((b: string) => convertUSDToINR(b)),
    }));

    generated.pros = (generated.pros || []).map((p: string) => convertUSDToINR(p));
    generated.cons = (generated.cons || []).map((c: string) => convertUSDToINR(c));

    // Generate AI image URL for each section
    const deviceName = meta.title?.replace(/[^\w\s]/g, "").trim() || "smartphone";

    const sectionImages = await Promise.all(
      (generated.body || []).map((section: any) =>
        generateSectionImage(section.heading, deviceName).catch(() => undefined)
      )
    );

    // Build body blocks with images
    const bodyBlocks = (generated.body || []).flatMap(
      (section: { heading: string; content: string; bullets?: string[] }, i: number) =>
        makeSectionBlocks(section.heading, section.content, section.bullets || [], sectionImages[i])
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
        _meta: { provider, contentLength: contentSource.length },
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