import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductBreadcrumb } from "@/components/ProductBreadcrumb";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductHero } from "@/components/ProductHero";
import { ProductSpecs } from "@/components/ProductSpecs";
import { PRODUCT_CATEGORIES, type ProductCategorySlug } from "@/lib/product-config";
import { getAllProductParams, getProductDetail } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateStaticParams() {
  return getAllProductParams();
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { category, slug } = await params;

  if (!PRODUCT_CATEGORIES.some((item) => item.slug === category)) {
    return {};
  }

  const product = await getProductDetail(category as ProductCategorySlug, slug);

  if (!product) {
    return {};
  }

  return {
    title: `${product.name} | ${product.categoryLabel} | Zentrix International`,
    description: product.intro,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, slug } = await params;

  if (!PRODUCT_CATEGORIES.some((item) => item.slug === category)) {
    notFound();
  }

  const product = await getProductDetail(category as ProductCategorySlug, slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <section className="border-b border-white/8 px-5 pb-14 pt-28 sm:px-10 sm:pb-18 sm:pt-32 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <ProductBreadcrumb
            categoryHref={`/products/${product.category}`}
            categoryLabel={product.categoryLabel}
            productName={product.name}
          />
          <div className="mt-8">
            <ProductHero product={product} />
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-8">
          <ProductSpecs specs={product.specs} />

          <section
            aria-labelledby="product-description"
            className="rounded-[1.5rem] border border-stone-300 bg-white p-5 shadow-[0_24px_70px_rgba(28,23,19,0.08)] sm:rounded-[1.9rem] sm:p-7"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-500 sm:text-xs sm:tracking-[0.34em]">
              Description
            </p>
            <h2
              id="product-description"
              className="mt-3 text-[2.2rem] leading-[0.95] tracking-[-0.04em] text-stone-950 sm:text-4xl"
            >
              Material overview
            </h2>
            <div className="mt-6 grid gap-4">
              {product.description.map((paragraph) => (
                <p key={paragraph} className="max-w-4xl text-base leading-8 text-stone-600 sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {product.images.length > 1 ? (
            <ProductGallery name={product.name} images={product.images} />
          ) : null}
        </div>
      </section>
    </main>
  );
}
