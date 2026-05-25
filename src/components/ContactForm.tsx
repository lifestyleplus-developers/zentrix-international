"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { ContactFormResponse, ProductInterestGroup } from "@/lib/contact-form";

export function ContactForm() {
  const router = useRouter();
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [productGroups, setProductGroups] = useState<ProductInterestGroup[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  const selectedProductLabels = productGroups
    .flatMap((group) => group.options)
    .filter((option) => selectedProducts.includes(option.value))
    .map((option) => option.label);

  const productDropdownLabel =
    selectedProductLabels.length === 0
      ? "Select a product"
      : selectedProductLabels.length <= 2
        ? selectedProductLabels.join(", ")
        : `${selectedProductLabels.length} products selected`;

  useEffect(() => {
    let cancelled = false;

    fetch("/api/product-options")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load product options.");
        }

        return response.json() as Promise<ProductInterestGroup[]>;
      })
      .then((groups) => {
        if (!cancelled) {
          setProductGroups(groups);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMessage("Product options could not be loaded. Please refresh and try again.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProductDropdownOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  function toggleProductSelection(value: string) {
    setSelectedProducts((current) =>
      current.includes(value)
        ? current.filter((product) => product !== value)
        : [...current, value],
    );
  }

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
      productInterest: selectedProducts,
      requirement: String(formData.get("requirement") ?? "").trim(),
    };

    if (payload.productInterest.length === 0) {
      setPending(false);
      setMessage("Please select at least one product.");
      return;
    }

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
      setSelectedProducts([]);
      setIsProductDropdownOpen(false);
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
            placeholder="your phone number"
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

        <fieldset className="grid gap-2">
          <legend className="text-[0.72rem] uppercase tracking-[0.22em] text-stone-400">
            Product Interest
          </legend>
          <div ref={productDropdownRef} className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isProductDropdownOpen}
              disabled={productGroups.length === 0}
              onClick={() => setIsProductDropdownOpen((isOpen) => !isOpen)}
              className="flex min-h-12 w-full items-center justify-between gap-3 rounded-[1rem] border border-white/12 bg-[rgba(255,255,255,0.05)] px-4 text-left text-base text-stone-50 outline-none transition hover:border-white/20 focus:border-stone-200/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                className={
                  selectedProductLabels.length === 0
                    ? "truncate text-stone-500"
                    : "truncate text-stone-50"
                }
              >
                {productDropdownLabel}
              </span>
              <span className="text-sm text-stone-400" aria-hidden="true">
                {isProductDropdownOpen ? "−" : "+"}
              </span>
            </button>

            {selectedProducts.map((product) => (
              <input
                key={product}
                type="hidden"
                name="productInterest"
                value={product}
              />
            ))}

            {isProductDropdownOpen ? (
              <div
                role="listbox"
                aria-multiselectable="true"
                className="absolute left-0 right-0 top-[calc(100%+0.45rem)] z-30 max-h-72 overflow-y-auto rounded-[1rem] border border-white/12 bg-[#201d19] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.42)]"
              >
                {productGroups.map((group) => (
                  <div key={group.category} className="py-1">
                    <p className="px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone-300">
                      {group.category}
                    </p>
                    <div className="grid gap-1">
                      {group.options.map((option) => {
                        const isSelected = selectedProducts.includes(option.value);

                        return (
                          <label
                            key={option.value}
                            className="flex cursor-pointer items-center gap-3 rounded-[0.8rem] px-3 py-2 text-sm text-stone-100 transition hover:bg-white/8"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleProductSelection(option.value)}
                              className="size-4 rounded border-white/20 bg-transparent accent-stone-100"
                            />
                            <span>{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </fieldset>

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
