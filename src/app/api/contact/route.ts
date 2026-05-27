import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { contactInfo } from "@/lib/contact";
import type { ContactFormPayload, ContactFormResponse } from "@/lib/contact-form";

export const runtime = "nodejs";

function getRequiredEnv(name: "EMAIL_USER" | "EMAIL_PASS") {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function isValidPayload(body: unknown): body is ContactFormPayload {
  if (!body || typeof body !== "object") {
    return false;
  }

  const payload = body as Record<string, unknown>;

  return (
    typeof payload.name === "string" &&
    typeof payload.phone === "string" &&
    typeof payload.email === "string" &&
    Array.isArray(payload.productInterest) &&
    payload.productInterest.every((item) => typeof item === "string") &&
    typeof payload.requirement === "string"
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ContactFormResponse>(
      { success: false, message: "Invalid request payload." },
      { status: 400 },
    );
  }

  if (!isValidPayload(body)) {
    return NextResponse.json<ContactFormResponse>(
      { success: false, message: "Missing required form fields." },
      { status: 400 },
    );
  }

  const name = body.name.trim();
  const phone = body.phone.trim();
  const email = body.email.trim();
  const productInterest = body.productInterest.map((item) => item.trim()).filter(Boolean);
  const requirement = body.requirement.trim();

  if (!name || !phone || !email || !requirement) {
    return NextResponse.json<ContactFormResponse>(
      { success: false, message: "Please complete all fields before submitting." },
      { status: 400 },
    );
  }

  const emailUser = getRequiredEnv("EMAIL_USER");
  const emailPass = getRequiredEnv("EMAIL_PASS");
  const emailTo = process.env.EMAIL_TO?.trim() || contactInfo.email;

  if (!emailUser || !emailPass || !emailTo) {
    return NextResponse.json<ContactFormResponse>(
      {
        success: false,
        message:
          "Email sending is not configured. Set EMAIL_USER, EMAIL_PASS, and EMAIL_TO on the server.",
      },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
// After trimming productInterest, add this grouping logic
const grouped = productInterest.reduce<Record<string, string[]>>((acc, item) => {
  const dashIndex = item.indexOf(" - ");
  if (dashIndex !== -1) {
    const type = item.slice(0, dashIndex).trim();
    const stone = item.slice(dashIndex + 3).trim();
    (acc[type] ??= []).push(stone);
  } else {
    (acc[item] ??= []);
  }
  return acc;
}, {});

const productInterestText = Object.entries(grouped)
  .map(([type, stones]) =>
    stones.length > 0
      ? `${type}\n${stones.map((s) => `  - ${s}`).join("\n")}`
      : type
  )
  .join("\n\n");

const productInterestHtml = Object.entries(grouped)
  .map(
    ([type, stones]) => `
      <tr>
        <td style="padding: 7px 0; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #999990; vertical-align: top; width: 120px;">
          ${stones.length > 0 ? escapeHtml(type) : "Product interest"}
        </td>
        <td style="padding: 7px 0; font-size: 14px; color: #1a1a18; vertical-align: top;">
          ${
            stones.length > 0
              ? `<span style="font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #1a1a18; display: block; margin-bottom: 4px;">${escapeHtml(type)}</span>
                 ${stones.map((s) => `<span style="display: block; color: #44443f;">${escapeHtml(s)}</span>`).join("")}`
              : escapeHtml(type)
          }
        </td>
      </tr>
    `
  )
  .join("") || `
      <tr>
        <td style="padding: 7px 0; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #999990; vertical-align: top; width: 120px;">
          Product interest
        </td>
        <td style="padding: 7px 0; font-size: 14px; color: #1a1a18; vertical-align: top;">
          Not specified
        </td>
      </tr>
    `;
  try {
    const info = await transporter.sendMail({
      from: `"${contactInfo.companyName} Website" <${emailUser}>`,
      to: emailTo,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        ``,
        `Product Interest:`,
        productInterestText || "Not specified",
        ``,
        `Requirement Detail:`,
        requirement,
      ].join("\n"),
      
      html: `
        <div style="font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
      
          <div style="padding: 32px 40px; border-bottom: 1px solid #e8e8e4;">
            <p style="margin: 0; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #999990;">New enquiry</p>
            <h1 style="margin: 6px 0 0; font-size: 20px; font-weight: 600; color: #1a1a18; letter-spacing: -0.01em;">${escapeHtml(name)}</h1>
          </div>
      
          <div style="padding: 28px 40px; border-bottom: 1px solid #e8e8e4;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 7px 0; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #999990; width: 120px;">Phone</td>
                <td style="padding: 7px 0; font-size: 14px; color: #1a1a18;">${escapeHtml(phone)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #999990;">Email</td>
                <td style="padding: 7px 0; font-size: 14px; color: #2563eb;">${escapeHtml(email)}</td>
              </tr>
            </table>
          </div>
      
          <div style="padding: 28px 40px; border-bottom: 1px solid #e8e8e4;">
            <p style="margin: 0 0 14px; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #999990;">Product interest</p>
            <table style="width: 100%; border-collapse: collapse;">
              ${productInterestHtml}
            </table>
          </div>
      
          <div style="padding: 28px 40px;">
            <p style="margin: 0 0 10px; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #999990;">Requirement</p>
            <p style="margin: 0; font-size: 14px; color: #1a1a18; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(requirement)}</p>
          </div>
      
        </div>
      `,
    });

    if (!info.accepted || info.accepted.length === 0) {
      return NextResponse.json<ContactFormResponse>(
        {
          success: false,
          message: "The email provider did not accept the enquiry for delivery.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json<ContactFormResponse>({ success: true });
  } catch (error) {
    console.error("Nodemailer send error:", error);

    return NextResponse.json<ContactFormResponse>(
      {
        success: false,
        message:
          "We could not send your enquiry right now. Please try again later or contact us directly by phone or email.",
      },
      { status: 500 },
    );
  }
}
