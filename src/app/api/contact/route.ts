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
    typeof payload.requirement === "string"
  );
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
        "",
        "Requirement Detail:",
        requirement,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f1b17;">
          <h2 style="margin-bottom: 16px;">New enquiry from Zentrix International website</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Requirement Detail:</strong></p>
          <p>${requirement.replace(/\n/g, "<br />")}</p>
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
