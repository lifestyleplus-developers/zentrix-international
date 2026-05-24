"use server";

import { Resend } from "resend";
import { redirect } from "next/navigation";
import { contactInfo } from "@/lib/contact";
import type { ContactFormState } from "@/lib/contact-form-state";

function getFieldValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
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

  if (!process.env.RESEND_API_KEY) {
    return {
      message:
        "Email sending is not configured yet. Please contact us directly at internationalzentrix@gmail.com or by phone.",
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const fromAddress =
    process.env.CONTACT_FORM_FROM ?? "onboarding@resend.dev";

  const toAddress =
    process.env.CONTACT_FORM_TO ?? contactInfo.email;

  try {
    await resend.emails.send({
      from: `${contactInfo.companyName} Website <${fromAddress}>`,
      to: toAddress,
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