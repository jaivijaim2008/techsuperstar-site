import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: { name: "TechSuperStar Contact", email: "jaivijai188@gmail.com" },
      to: [{ email: "jaivijai188@gmail.com", name: "TechSuperStar" }],
      subject: `New Contact: ${subject || "No Subject"}`,
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#fff;padding:32px;border-radius:12px">
          <h2 style="color:#ff4d00;margin-bottom:24px">New Contact Message</h2>
          <p><strong style="color:#aaa">Name:</strong> <span style="color:#fff">${name}</span></p>
          <p><strong style="color:#aaa">Email:</strong> <span style="color:#fff">${email}</span></p>
          <p><strong style="color:#aaa">Subject:</strong> <span style="color:#fff">${subject || "N/A"}</span></p>
          <p><strong style="color:#aaa">Message:</strong></p>
          <div style="background:#1a1a1a;padding:16px;border-radius:8px;border-left:3px solid #ff4d00;color:#ccc;line-height:1.7">
            ${message}
          </div>
          <p style="color:#555;font-size:12px;margin-top:24px">Sent from TechSuperStar contact form</p>
        </div>
      `,
    }),
  });

  if (res.ok) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}