"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { ContactFormResponse } from "@/lib/contact-form";

export function ContactForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      requirement: String(formData.get("requirement") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as ContactFormResponse;

      if (!response.ok || !result.success) {
        setMessage(result.message ?? "We could not send your enquiry right now.");
        return;
      }

      form.reset();
      router.push("/contact-us/thank-you");
    } catch {
      setMessage("We could not send your enquiry right now.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-[1.45rem] border border-white/10 bg-white/7 p-5 backdrop-blur-sm sm:rounded-[1.9rem] sm:p-6">
      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-400 sm:text-xs sm:tracking-[0.28em]">
        Send Enquiry
      </p>
      <h3 className="mt-4 text-[2.2rem] leading-[0.95] tracking-[-0.04em] text-stone-50 sm:text-4xl">
        Contact us
      </h3>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-[0.72rem] uppercase tracking-[0.22em] text-stone-400">
            Name
          </span>
          <input
            type="text"
            name="name"
            required
            className="min-h-12 rounded-[1rem] border border-white/12 bg-[rgba(255,255,255,0.05)] px-4 text-base text-stone-50 outline-none transition placeholder:text-stone-500 focus:border-stone-200/50"
            placeholder="Your name"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[0.72rem] uppercase tracking-[0.22em] text-stone-400">
            Phone Number
          </span>
          <input
            type="tel"
            name="phone"
            required
            className="min-h-12 rounded-[1rem] border border-white/12 bg-[rgba(255,255,255,0.05)] px-4 text-base text-stone-50 outline-none transition placeholder:text-stone-500 focus:border-stone-200/50"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[0.72rem] uppercase tracking-[0.22em] text-stone-400">
            Mail ID
          </span>
          <input
            type="email"
            name="email"
            required
            className="min-h-12 rounded-[1rem] border border-white/12 bg-[rgba(255,255,255,0.05)] px-4 text-base text-stone-50 outline-none transition placeholder:text-stone-500 focus:border-stone-200/50"
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[0.72rem] uppercase tracking-[0.22em] text-stone-400">
            Requirement Detail
          </span>
          <textarea
            name="requirement"
            required
            rows={5}
            className="rounded-[1rem] border border-white/12 bg-[rgba(255,255,255,0.05)] px-4 py-3 text-base text-stone-50 outline-none transition placeholder:text-stone-500 focus:border-stone-200/50"
            placeholder="Tell us what material, quantity, and finish you need."
          />
        </label>

        {message ? (
          <p aria-live="polite" className="text-sm leading-6 text-amber-200">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-stone-100 px-5 py-3 text-[0.72rem] uppercase tracking-[0.24em] text-stone-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </section>
  );
}
