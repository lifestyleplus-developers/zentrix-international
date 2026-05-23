import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/lib/products";

type ProductCardProps = {
  product: ProductSummary;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-stone-300 bg-white shadow-[0_24px_70px_rgba(28,23,19,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(28,23,19,0.14)] sm:rounded-[2rem]">
      <Link href={product.href} className="block focus:outline-none focus:ring-2 focus:ring-stone-500/40">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
          <Image
            src={product.coverImage.src}
            alt={product.coverImage.alt}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(15,13,11,0.65)_100%)]" />
          <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-[rgba(17,15,12,0.45)] px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-stone-100 backdrop-blur-sm sm:left-5 sm:top-5 sm:text-[0.68rem]">
            {product.categoryLabel}
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <h3 className="text-[2rem] leading-[0.98] tracking-[-0.04em] text-stone-950 sm:text-[2.2rem]">
            {product.name}
          </h3>
          <div className="mt-8 flex items-center justify-between gap-4">
            <span className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-500 sm:text-xs sm:tracking-[0.28em]">
              {product.imageCount} {product.imageCount === 1 ? "image" : "images"}
            </span>
            <span className="rounded-full border border-stone-300 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-stone-900 transition group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white sm:text-xs">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
