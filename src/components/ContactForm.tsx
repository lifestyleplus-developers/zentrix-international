"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { ContactFormResponse, ProductInterestGroup } from "@/lib/contact-form";

const countryCodes = [
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+7", country: "Kazakhstan", flag: "🇰🇿" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+53", country: "Cuba", flag: "🇨🇺" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+95", country: "Myanmar", flag: "🇲🇲" },
  { code: "+98", country: "Iran", flag: "🇮🇷" },
  { code: "+211", country: "South Sudan", flag: "🇸🇸" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+218", country: "Libya", flag: "🇱🇾" },
  { code: "+220", country: "Gambia", flag: "🇬🇲" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+222", country: "Mauritania", flag: "🇲🇷" },
  { code: "+223", country: "Mali", flag: "🇲🇱" },
  { code: "+224", country: "Guinea", flag: "🇬🇳" },
  { code: "+225", country: "Cote d'Ivoire", flag: "🇨🇮" },
  { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
  { code: "+227", country: "Niger", flag: "🇳🇪" },
  { code: "+228", country: "Togo", flag: "🇹🇬" },
  { code: "+229", country: "Benin", flag: "🇧🇯" },
  { code: "+230", country: "Mauritius", flag: "🇲🇺" },
  { code: "+231", country: "Liberia", flag: "🇱🇷" },
  { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+235", country: "Chad", flag: "🇹🇩" },
  { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
  { code: "+239", country: "Sao Tome and Principe", flag: "🇸🇹" },
  { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+241", country: "Gabon", flag: "🇬🇦" },
  { code: "+242", country: "Republic of the Congo", flag: "🇨🇬" },
  { code: "+243", country: "Democratic Republic of the Congo", flag: "🇨🇩" },
  { code: "+244", country: "Angola", flag: "🇦🇴" },
  { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "+248", country: "Seychelles", flag: "🇸🇨" },
  { code: "+249", country: "Sudan", flag: "🇸🇩" },
  { code: "+250", country: "Rwanda", flag: "🇷🇼" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+252", country: "Somalia", flag: "🇸🇴" },
  { code: "+253", country: "Djibouti", flag: "🇩🇯" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+257", country: "Burundi", flag: "🇧🇮" },
  { code: "+258", country: "Mozambique", flag: "🇲🇿" },
  { code: "+260", country: "Zambia", flag: "🇿🇲" },
  { code: "+261", country: "Madagascar", flag: "🇲🇬" },
  { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
  { code: "+264", country: "Namibia", flag: "🇳🇦" },
  { code: "+265", country: "Malawi", flag: "🇲🇼" },
  { code: "+266", country: "Lesotho", flag: "🇱🇸" },
  { code: "+267", country: "Botswana", flag: "🇧🇼" },
  { code: "+268", country: "Eswatini", flag: "🇸🇿" },
  { code: "+269", country: "Comoros", flag: "🇰🇲" },
  { code: "+290", country: "Saint Helena", flag: "🇸🇭" },
  { code: "+291", country: "Eritrea", flag: "🇪🇷" },
  { code: "+297", country: "Aruba", flag: "🇦🇼" },
  { code: "+298", country: "Faroe Islands", flag: "🇫🇴" },
  { code: "+299", country: "Greenland", flag: "🇬🇱" },
  { code: "+350", country: "Gibraltar", flag: "🇬🇮" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+354", country: "Iceland", flag: "🇮🇸" },
  { code: "+355", country: "Albania", flag: "🇦🇱" },
  { code: "+356", country: "Malta", flag: "🇲🇹" },
  { code: "+357", country: "Cyprus", flag: "🇨🇾" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+373", country: "Moldova", flag: "🇲🇩" },
  { code: "+374", country: "Armenia", flag: "🇦🇲" },
  { code: "+375", country: "Belarus", flag: "🇧🇾" },
  { code: "+376", country: "Andorra", flag: "🇦🇩" },
  { code: "+377", country: "Monaco", flag: "🇲🇨" },
  { code: "+378", country: "San Marino", flag: "🇸🇲" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+381", country: "Serbia", flag: "🇷🇸" },
  { code: "+382", country: "Montenegro", flag: "🇲🇪" },
  { code: "+383", country: "Kosovo", flag: "🇽🇰" },
  { code: "+385", country: "Croatia", flag: "🇭🇷" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "+389", country: "North Macedonia", flag: "🇲🇰" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
  { code: "+500", country: "Falkland Islands", flag: "🇫🇰" },
  { code: "+501", country: "Belize", flag: "🇧🇿" },
  { code: "+502", country: "Guatemala", flag: "🇬🇹" },
  { code: "+503", country: "El Salvador", flag: "🇸🇻" },
  { code: "+504", country: "Honduras", flag: "🇭🇳" },
  { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
  { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
  { code: "+507", country: "Panama", flag: "🇵🇦" },
  { code: "+508", country: "Saint Pierre and Miquelon", flag: "🇵🇲" },
  { code: "+509", country: "Haiti", flag: "🇭🇹" },
  { code: "+590", country: "Guadeloupe", flag: "🇬🇵" },
  { code: "+591", country: "Bolivia", flag: "🇧🇴" },
  { code: "+592", country: "Guyana", flag: "🇬🇾" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+594", country: "French Guiana", flag: "🇬🇫" },
  { code: "+595", country: "Paraguay", flag: "🇵🇾" },
  { code: "+596", country: "Martinique", flag: "🇲🇶" },
  { code: "+597", country: "Suriname", flag: "🇸🇷" },
  { code: "+598", country: "Uruguay", flag: "🇺🇾" },
  { code: "+599", country: "Curacao", flag: "🇨🇼" },
  { code: "+670", country: "Timor-Leste", flag: "🇹🇱" },
  { code: "+672", country: "Australian External Territories", flag: "🇦🇺" },
  { code: "+673", country: "Brunei", flag: "🇧🇳" },
  { code: "+674", country: "Nauru", flag: "🇳🇷" },
  { code: "+675", country: "Papua New Guinea", flag: "🇵🇬" },
  { code: "+676", country: "Tonga", flag: "🇹🇴" },
  { code: "+677", country: "Solomon Islands", flag: "🇸🇧" },
  { code: "+678", country: "Vanuatu", flag: "🇻🇺" },
  { code: "+679", country: "Fiji", flag: "🇫🇯" },
  { code: "+680", country: "Palau", flag: "🇵🇼" },
  { code: "+681", country: "Wallis and Futuna", flag: "🇼🇫" },
  { code: "+682", country: "Cook Islands", flag: "🇨🇰" },
  { code: "+683", country: "Niue", flag: "🇳🇺" },
  { code: "+685", country: "Samoa", flag: "🇼🇸" },
  { code: "+686", country: "Kiribati", flag: "🇰🇮" },
  { code: "+687", country: "New Caledonia", flag: "🇳🇨" },
  { code: "+688", country: "Tuvalu", flag: "🇹🇻" },
  { code: "+689", country: "French Polynesia", flag: "🇵🇫" },
  { code: "+690", country: "Tokelau", flag: "🇹🇰" },
  { code: "+691", country: "Micronesia", flag: "🇫🇲" },
  { code: "+692", country: "Marshall Islands", flag: "🇲🇭" },
  { code: "+850", country: "North Korea", flag: "🇰🇵" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+853", country: "Macau", flag: "🇲🇴" },
  { code: "+855", country: "Cambodia", flag: "🇰🇭" },
  { code: "+856", country: "Laos", flag: "🇱🇦" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
  { code: "+960", country: "Maldives", flag: "🇲🇻" },
  { code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+963", country: "Syria", flag: "🇸🇾" },
  { code: "+964", country: "Iraq", flag: "🇮🇶" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+967", country: "Yemen", flag: "🇾🇪" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+970", country: "Palestine", flag: "🇵🇸" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+975", country: "Bhutan", flag: "🇧🇹" },
  { code: "+976", country: "Mongolia", flag: "🇲🇳" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
  { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
  { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
  { code: "+995", country: "Georgia", flag: "🇬🇪" },
  { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
];

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
    const countryCode = String(formData.get("countryCode") ?? "").trim();
    const phoneNumber = String(formData.get("phone") ?? "").trim();
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      phone: [countryCode, phoneNumber].filter(Boolean).join(" "),
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
          Full Name
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
            Phone
          </span>
          <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-2 sm:grid-cols-[9rem_minmax(0,1fr)]">
            <select
              name="countryCode"
              required
              defaultValue="+91"
              aria-label="Country code"
              className="min-h-12 rounded-[1rem] border border-white/12 bg-[rgba(255,255,255,0.05)] px-3 text-sm text-stone-50 outline-none transition hover:border-white/20 focus:border-stone-200/50 [&_option]:bg-stone-900 [&_option]:text-stone-50"
            >
              {countryCodes.map((country) => (
                <option key={`${country.country}-${country.code}`} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phone"
              required
              inputMode="tel"
              className="min-h-12 rounded-[1rem] border border-white/12 bg-[rgba(255,255,255,0.05)] px-4 text-base text-stone-50 outline-none transition placeholder:text-stone-500 focus:border-stone-200/50"
              placeholder="your phone number"
            />
          </div>
        </label>


        <label className="grid gap-2">
          <span className="text-[0.72rem] uppercase tracking-[0.22em] text-stone-400">
          Email
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
                              className="peer sr-only"
                            />
                            <span
                              aria-hidden="true"
                              className="flex size-5 shrink-0 items-center justify-center rounded-[0.35rem] border border-white/30 bg-stone-950 text-[0.85rem] font-bold leading-none text-transparent transition peer-checked:border-stone-100 peer-checked:bg-stone-100 peer-checked:text-stone-950"
                            >
                              ✓
                            </span>
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
          Tell us what you need
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
