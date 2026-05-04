import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Only trigger on published posts
  if (body._type !== "post" || !body.title) {
    return NextResponse.json({ message: "Ignored" }, { status: 200 });
  }

  const postTitle = body.title;
  const postSlug = body.slug?.current || "";
  const postUrl = `https://www.techsuperstar.in/post/${postSlug}`;

  try {
    const res = await fetch("https://api.brevo.com/v3/emailCampaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        name: `Blog: ${postTitle}`,
        subject: `New Post: ${postTitle}`,
        sender: { name: "TechSuperStar", email: "your@email.com" },
        type: "classic",
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#fff;padding:32px;border-radius:12px">
            <h1 style="color:#ff4d00;font-size:24px;margin-bottom:8px">TechSuperStar</h1>
            <h2 style="font-size:20px;margin-bottom:16px">${postTitle}</h2>
            <p style="color:#aaa;font-size:14px;line-height:1.6">A new blog post has just been published. Click below to read it!</p>
            <a href="${postUrl}" style="display:inline-block;margin-top:20px;background:#ff4d00;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Read Now →</a>
            <p style="color:#555;font-size:12px;margin-top:32px">You're receiving this because you subscribed to TechSuperStar newsletter.</p>
          </div>
        `,
        recipients: { listIds: [3] },
        scheduledAt: new Date(Date.now() + 60000).toISOString(),
      }),
    });

    const data = await res.json();

    // Send the campaign immediately
    await fetch(`https://api.brevo.com/v3/emailCampaigns/${data.id}/sendNow`, {
      method: "POST",
      headers: { "api-key": process.env.BREVO_API_KEY! },
    });

    return NextResponse.json({ message: "Email sent!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}