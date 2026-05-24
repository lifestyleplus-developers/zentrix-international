"use server";

import nodemailer from "nodemailer";
import { redirect } from "next/navigation";
import { contactInfo } from "@/lib/contact";
import type { ContactFormState } from "@/lib/contact-form-state";

function getFieldValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = getFieldValue(formData, "name");
  const phone = getFieldValue(formData, "phone");
  const email = getFieldValue(formData, "email");
  const requirement = getFieldValue(formData, "requirement");

  if (!name || !phone || !email || !requirement) {
    return { message: "Please complete all fields before submitting." };
  }

  const transporter = createTransporter();

  if (!transporter) {
    return {
      message:
        "Email sending is not configured yet. Please contact us directly at internationalzentrix@gmail.com or by phone.",
    };
  }

  const fromAddress = process.env.CONTACT_FORM_FROM ?? process.env.SMTP_USER ?? contactInfo.email;

  try {
    await transporter.sendMail({
      from: `"${contactInfo.companyName} Website" <${fromAddress}>`,
      to: contactInfo.email,
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
  } catch {
    return {
      message:
        "We could not send your enquiry right now. Please try again later or contact us directly by email or phone.",
    };
  }

  redirect("/contact-us/thank-you");
}
