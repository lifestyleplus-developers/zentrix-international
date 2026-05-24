import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[var(--canvas)] px-5 py-24 text-[var(--ink)] sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(27,23,18,0.9),rgba(18,15,13,0.98))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:p-12">
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-400 sm:text-xs sm:tracking-[0.34em]">
          Thank You
        </p>
        <h1 className="mt-4 text-[3rem] leading-[0.92] tracking-[-0.05em] text-stone-50 sm:text-7xl">
          Your enquiry has been sent.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
          The Zentrix International team has received your message and will get
          back to you shortly.
        </p>
        <Link
          href="/#contact-us"
          className="mt-8 inline-flex rounded-full border border-white/12 bg-white/6 px-5 py-3 text-[0.68rem] uppercase tracking-[0.24em] text-stone-50 transition hover:bg-white/12 sm:text-xs sm:tracking-[0.28em]"
        >
          Back To Contact
        </Link>
      </div>
    </main>
  );
}
