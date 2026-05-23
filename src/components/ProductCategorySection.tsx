import Link from "next/link";
import { getCategoryConfig, type ProductCategorySlug } from "@/lib/product-config";
import type { ProductSummary } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";

type ProductCategorySectionProps = {
  category: ProductCategorySlug;
  products: ProductSummary[];
  showViewAll?: boolean;
};

export function ProductCategorySection({
  category,
  products,
  showViewAll = true,
}: ProductCategorySectionProps) {
  const config = getCategoryConfig(category);
  const hasProducts = products.length > 0;

  return (
    <section className="rounded-[1.7rem] border border-stone-300 bg-white p-5 shadow-[0_24px_70px_rgba(28,23,19,0.08)] sm:rounded-[2.2rem] sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          
          <h2 className="mt-4 max-w-[12ch] text-[2.8rem] leading-[0.95] tracking-[-0.05em] text-stone-950 sm:text-6xl">
            {config.label}
          </h2>
        </div>
        <div className="max-w-xl">
          {/* <p className="text-[0.98rem] leading-7 text-stone-600 sm:text-base">{config.heroText}</p> */}
          {showViewAll && hasProducts ? (
            <Link
              href={`/products/${config.slug}`}
              className="mt-5 inline-flex rounded-full border border-stone-300 bg-white px-5 py-3 text-[0.68rem] uppercase tracking-[0.24em] text-stone-900 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white sm:text-xs sm:tracking-[0.28em]"
            >
              View Category
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-8">
        {hasProducts ? (
          <ProductGrid products={products} />
        ) : (
          <div className="rounded-[1.45rem] border border-dashed border-stone-300 bg-stone-50 p-6 sm:rounded-[1.8rem] sm:p-8">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-500 sm:text-xs sm:tracking-[0.28em]">
              Coming Soon
            </p>
            <h3 className="mt-3 text-[2rem] leading-[0.98] tracking-[-0.04em] text-stone-950 sm:text-[2.4rem]">
              Rough block inventory will appear here when assets are added.
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}
