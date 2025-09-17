import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export async function POST(req: NextRequest) {
  try {
    if (!resendApiKey) {
      return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }

    const { firstName, lastName, email, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const toAddress = "info@txfactor.com";
    const fromAddress = "info@txfactor.com";

    const subject = `TFactorTx Contact: ${firstName} ${lastName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
        <h2 style="margin: 0 0 8px 0;">New contact form submission</h2>
        <p style="margin: 0 0 12px 0; color:#374151;">From: <strong>${firstName} ${lastName}</strong> &lt;${email}&gt;</p>
        <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; white-space: pre-wrap;">${escapeHtml(message)}</div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      cc: [email],
      subject,
      html,
    });

    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 });
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


