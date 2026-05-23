import Image from "next/image";
import type { ProductDetail } from "@/lib/products";

type ProductHeroProps = {
  product: ProductDetail;
};

export function ProductHero({ product }: ProductHeroProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="relative min-h-[24rem] overflow-hidden rounded-[1.7rem] border border-white/10 bg-stone-900 shadow-[0_32px_90px_rgba(0,0,0,0.32)] sm:min-h-[30rem] sm:rounded-[2.2rem]">
        <Image
          src={product.coverImage.src}
          alt={product.coverImage.alt}
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 46vw"
          className="object-contain object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,15,13,0.08),rgba(16,15,13,0.48))]" />
      </div>

      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-400 sm:text-xs sm:tracking-[0.34em]">
          {product.eyebrow}
        </p>
        <h1 className="mt-4 max-w-[10ch] text-[3rem] leading-[0.92] tracking-[-0.05em] text-stone-50 sm:text-7xl">
          {product.name}
        </h1>
        <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/7 px-4 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-stone-100 sm:text-xs sm:tracking-[0.28em]">
          {product.categoryLabel}
        </div>
        <p className="mt-6 max-w-xl text-base leading-8 text-stone-300 sm:text-lg">
          {product.intro}
        </p>
      </div>
    </section>
  );
}
