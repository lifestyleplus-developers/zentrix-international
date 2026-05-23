import type { Metadata } from "next";
import Link from "next/link";
import { ProductCategorySection } from "@/components/ProductCategorySection";
import { PRODUCT_CATEGORIES } from "@/lib/product-config";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products | Zentrix International",
  description: "Browse Zentrix International rough blocks and gangsaw slabs.",
};

export default async function ProductsPage() {
  const productGroups = await getAllProducts();

  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <section className="border-b border-white/8 px-5 pb-14 pt-28 sm:px-10 sm:pb-18 sm:pt-32 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-400 sm:text-xs sm:tracking-[0.34em]">
                Product Catalog
              </p>
              <h1 className="mt-4 max-w-[12ch] text-[3rem] leading-[0.92] tracking-[-0.05em] text-stone-50 sm:text-7xl">
                Granite catalog structured for expansion.
              </h1>
            </div>
            <div className="max-w-xl">
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-[0.68rem] uppercase tracking-[0.24em] text-stone-100 transition hover:bg-white/12 sm:text-xs sm:tracking-[0.28em]"
                >
                  Back Home
                </Link>
                {PRODUCT_CATEGORIES.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products/${category.slug}`}
                    className="rounded-full border border-white/12 px-5 py-3 text-[0.68rem] uppercase tracking-[0.24em] text-stone-300 transition hover:border-white/24 hover:text-stone-50 sm:text-xs sm:tracking-[0.28em]"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {productGroups.map(({ category, products }) => (
            <ProductCategorySection key={category.slug} category={category.slug} products={products} />
          ))}
        </div>
      </section>
    </main>
  );
}
