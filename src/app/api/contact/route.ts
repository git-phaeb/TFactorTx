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

    // Only send the first email to info@tfactortx.com
    const toAddress = "info@tfactortx.com";
    // Use a verified sender domain for Resend. Fallback to onboarding@resend.dev if custom domain not yet verified.
    const fromAddress = process.env.RESEND_FROM || "TFactorTx <info@tfactortx.com>";

    const subject = `TFactorTx Contact: ${firstName} ${lastName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
        <h2 style="margin: 0 0 8px 0;">New contact form submission</h2>
        <p style="margin: 0 0 12px 0; color:#374151;">From: <strong>${escapeHtml(firstName)} ${escapeHtml(lastName)}</strong> &lt;${email}&gt;</p>
        <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; white-space: pre-wrap;">${escapeHtml(message)}</div>
      </div>
    `;

    try {
      const { error } = await resend.emails.send({
        from: fromAddress,
        to: [toAddress],
        replyTo: email,
        subject,
        html,
        text: `New contact form submission\nFrom: ${firstName} ${lastName} <${email}>\n\n${message}`,
      });

      if (error) {
        console.error("Resend send error:", error);
        const message = typeof error === "string" ? error : (error as any)?.message || "Upstream email provider error";
        return NextResponse.json({ error: message }, { status: 502 });
      }
    } catch (sendErr: any) {
      console.error("Resend exception:", sendErr);
      const isProd = process.env.NODE_ENV === "production";
      const publicMessage = isProd ? "Email service temporarily unavailable" : (sendErr?.message || "Email send failed");
      return NextResponse.json({ error: publicMessage }, { status: 502 });
    }

    // Only send the confirmation email to the submitting user
    try {
      const userSubject = "Thanks for contacting TFactorTx — we received your message";
      const userHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">

          <p style="margin: 0 0 12px 0;">Hi ${escapeHtml(firstName)},</p>
          <p style="margin: 0 0 12px 0;">Thanks for reaching out to <strong>TFactorTx</strong>. We will get back to you as soon as possible.</p>
          <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; white-space: pre-wrap;">
            ${escapeHtml(message)}
          </div>
          <p style="margin: 12px 0 0 0;">If you want to add anything, just reply to this email.</p>
          <p style="margin: 8px 0 0 0;">TFactorTx Team</p>
        </div>
      `;
      const userText = `Hi ${firstName},\n\nThanks for contacting TFactorTx. We will get back to you as soon as possible.\n\nYour message:\n${message}\n\n— TFactorTx Team`;

      const { error: userError } = await resend.emails.send({
        from: fromAddress,
        to: [email],
        replyTo: toAddress,
        subject: userSubject,
        html: userHtml,
        text: userText,
      });

      if (userError) {
        console.error("Resend user confirmation send error:", userError);
        // Do not fail the request for user confirmation failures
      }
    } catch (userSendErr: any) {
      console.error("Resend user confirmation exception:", userSendErr);
      // Do not fail the request for user confirmation exceptions
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
