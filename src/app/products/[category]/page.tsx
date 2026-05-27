import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductBreadcrumb } from "@/components/ProductBreadcrumb";
import { ProductCategorySection } from "@/components/ProductCategorySection";
import { getCategoryConfig, PRODUCT_CATEGORIES, type ProductCategorySlug } from "@/lib/product-config";
import { getProductsByCategory } from "@/lib/products";
import { roughBlockSwatches } from "@/lib/rough-block-swatches";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

function RoughBlocksSourcingStrip() {
  const items = [
    {
      title: "All of India",
      text: "We source from North and South Indian quarries, not a single region",
    },
    {
      title: "Seven export ports",
      text: "Kandla · Mundra · JNPT · Cochin · Vizag · Tuticorin · Chennai",
    },
    {
      title: "Any form",
      text: "Raw · Rough · Sawn · Rubbing — unfinished and quarry-direct",
    },
  ];

  return (
    <section className="grid gap-4 rounded-[1.7rem] border border-white/10 bg-white/7 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.12)] sm:rounded-[2.2rem] sm:p-8 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-[1.25rem] border border-white/10 bg-white/6 p-5">
          <h2 className="text-[0.72rem] uppercase tracking-[0.24em] text-stone-300">
            {item.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-400 sm:text-base">{item.text}</p>
        </div>
      ))}
    </section>
  );
}

function RoughBlocksSwatchSection() {
  return (
    <section className="rounded-[1.7rem] border border-stone-300 bg-white p-5 shadow-[0_24px_70px_rgba(28,23,19,0.08)] sm:rounded-[2.2rem] sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-500 sm:text-xs sm:tracking-[0.34em]">
            Additional Varieties
          </p>
          <h2 className="mt-4 max-w-[12ch] text-[2.8rem] leading-[0.95] tracking-[-0.05em] text-stone-950 sm:text-6xl">
            Available rough blocks
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
          These varieties are available on request. Images and detailed pages will be added when product assets are available.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {roughBlockSwatches.map(([name, swatchGradient]) => (
          <article
            key={name}
            className="group overflow-hidden rounded-[1.5rem] border border-stone-300 bg-white shadow-[0_24px_70px_rgba(28,23,19,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(28,23,19,0.14)] sm:rounded-[2rem]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
              <div
                aria-label={`${name} rough block colour swatch`}
                className="h-full w-full transition duration-500 group-hover:scale-[1.04]"
                role="img"
                style={{ background: swatchGradient }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(15,13,11,0.65)_100%)]" />
              <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-[rgba(17,15,12,0.45)] px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-stone-100 backdrop-blur-sm sm:left-5 sm:top-5 sm:text-[0.68rem]">
                Rough Blocks
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-7">
              <h3 className="min-h-[4.1rem] text-[2rem] leading-[0.98] tracking-[-0.04em] text-stone-950 sm:min-h-[4.6rem] sm:text-[2.2rem]">
                {name}
              </h3>
              <p className="mt-auto pt-8 text-[0.68rem] uppercase tracking-[0.24em] text-stone-500 sm:text-xs sm:tracking-[0.28em]">
                Available on request
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RoughBlocksDescriptionBlock() {
  return (
    <section className="rounded-[1.7rem] border border-stone-300 bg-white p-5 shadow-[0_24px_70px_rgba(28,23,19,0.08)] sm:rounded-[2.2rem] sm:p-8">
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-500 sm:text-xs sm:tracking-[0.34em]">
        Rough Block Supply
      </p>
      <div className="mt-5 grid gap-4">
        <p className="max-w-4xl text-base leading-8 text-stone-600 sm:text-lg">
          Zentrix International sources granite blocks directly from quarries across North and South India — covering all major colour families and geological regions.
        </p>
        <p className="max-w-4xl text-base leading-8 text-stone-600 sm:text-lg">
          We work with fabricators, slab processors, and export buyers who need reliable block supply at commercial volume. No middlemen. Consistent grading. Shipment from seven ports across India.
        </p>
      </div>
    </section>
  );
}

function RoughBlocksSpecsPanel() {
  const specs = [
    ["Material", "Granite"],
    ["Stone Form", "Raw, Rough, Sawn, Rubbing"],
    ["Surface", "Unfinished"],
    ["Colours", "White, Black, Green, and other variants"],
    ["Origin", "North and South India"],
    ["Crack Resistance", "Yes"],
  ];
  const sizes = [
    ["Gangsaw Blocks", "Cutter Blocks"],
    ["260x160x100 cm", "180x70x60 cm"],
    ["280x180x100 cm", "240x70x60 cm"],
    ["300x190x120 cm", ""],
    ["300x200x100 cm", ""],
  ];

  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-[1.7rem] border border-stone-300 bg-white p-5 shadow-[0_24px_70px_rgba(28,23,19,0.08)] sm:rounded-[2.2rem] sm:p-8">
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-500 sm:text-xs sm:tracking-[0.34em]">
          Specifications
        </p>
        <div className="mt-5 divide-y divide-stone-200">
          {specs.map(([label, value]) => (
            <div key={label} className="grid gap-2 py-4 sm:grid-cols-[12rem_1fr]">
              <span className="text-sm font-semibold text-stone-700">{label}</span>
              <span className="text-sm leading-6 text-stone-600 sm:text-base">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-stone-300 bg-white p-5 shadow-[0_24px_70px_rgba(28,23,19,0.08)] sm:rounded-[2.2rem] sm:p-8">
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-500 sm:text-xs sm:tracking-[0.34em]">
          Sizes
        </p>
        <div className="mt-5 divide-y divide-stone-200">
          {sizes.map(([gangsaw, cutter], index) => (
            <div
              key={`${gangsaw}-${cutter}`}
              className={`grid grid-cols-2 gap-4 py-4 ${
                index === 0 ? "text-sm font-semibold text-stone-800" : "text-sm text-stone-600 sm:text-base"
              }`}
            >
              <span>{gangsaw}</span>
              <span>{cutter}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm font-semibold text-stone-950">Custom dimensions on request.</p>
      </div>
    </section>
  );
}

function RoughBlocksCtaStrip() {
  return (
    <section className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(135deg,rgba(43,36,30,0.96),rgba(17,15,12,0.98))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:rounded-[2.2rem] sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-[2.4rem] leading-[0.95] tracking-[-0.05em] text-stone-50 sm:text-5xl">
            Have a specific requirement?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-stone-300">
            Tell us the colour, size, and volume. We&apos;ll source it and get back to you.
          </p>
        </div>
        <Link
          href="/#contact-us"
          className="inline-flex w-fit rounded-full border border-white/12 bg-stone-100 px-5 py-3 text-[0.72rem] uppercase tracking-[0.24em] text-stone-950 transition hover:bg-white"
        >
          Send Enquiry
        </Link>
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  return PRODUCT_CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const config = PRODUCT_CATEGORIES.find((item) => item.slug === category);

  if (!config) {
    return {};
  }

  return {
    title: `${config.label} | Zentrix International`,
    // description: config.heroText,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const match = PRODUCT_CATEGORIES.find((item) => item.slug === category);

  if (!match) {
    notFound();
  }

  const products = await getProductsByCategory(category as ProductCategorySlug);
  const config = getCategoryConfig(category as ProductCategorySlug);

  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <section className="border-b border-white/8 px-5 pb-14 pt-28 sm:px-10 sm:pb-18 sm:pt-32 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <ProductBreadcrumb categoryHref={`/products/${config.slug}`} categoryLabel={config.label} />
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-400 sm:text-xs sm:tracking-[0.34em]">
                {config.eyebrow}
              </p>
              <h1 className="mt-4 max-w-[12ch] text-[3rem] leading-[0.92] tracking-[-0.05em] text-stone-50 sm:text-7xl">
                {config.label}
              </h1>
            </div>
            {/* <p className="max-w-xl text-base leading-8 text-stone-300 sm:text-lg">{config.heroTitle}</p> */}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-8">
          <ProductCategorySection category={config.slug} products={products} showViewAll={false} />
          {config.slug === "rough-blocks" ? (
            <>
              <RoughBlocksSwatchSection />
              <RoughBlocksSourcingStrip />
              <RoughBlocksDescriptionBlock />
              <RoughBlocksSpecsPanel />
              <RoughBlocksCtaStrip />
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}
