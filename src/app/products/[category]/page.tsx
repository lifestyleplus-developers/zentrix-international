import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductBreadcrumb } from "@/components/ProductBreadcrumb";
import { ProductCategorySection } from "@/components/ProductCategorySection";
import { getCategoryConfig, PRODUCT_CATEGORIES, type ProductCategorySlug } from "@/lib/product-config";
import { getProductsByCategory } from "@/lib/products";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

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
        <div className="mx-auto max-w-6xl">
          <ProductCategorySection category={config.slug} products={products} showViewAll={false} />
        </div>
      </section>
    </main>
  );
}
