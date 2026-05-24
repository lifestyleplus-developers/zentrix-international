import type { ProductSpecs as ProductSpecsType } from "@/lib/product-config";

type ProductSpecsProps = {
  specs: ProductSpecsType;
};

export function ProductSpecs({ specs }: ProductSpecsProps) {
  return (
    <section
      aria-labelledby="product-specifications"
      className="rounded-[1.5rem] border border-stone-300 bg-white p-5 shadow-[0_24px_70px_rgba(28,23,19,0.08)] sm:rounded-[1.9rem] sm:p-7"
    >
      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-500 sm:text-xs sm:tracking-[0.34em]">
          Specifications
        </p>
        <h2
          id="product-specifications"
          className="mt-3 text-[2.2rem] leading-[0.95] tracking-[-0.04em] text-stone-950 sm:text-4xl"
        >
          Technical data
        </h2>
      </div>

      <dl className="mt-8 divide-y divide-stone-300 border-y border-stone-300">
        {Object.entries(specs).map(([label, value]) => (
          <div key={label} className="grid gap-4 py-5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8 sm:py-7">
            <dt className="text-[1.1rem] leading-[1.2] tracking-[-0.02em] text-stone-700 sm:text-[1.45rem]">
              {label}
            </dt>
            <dd className="max-w-4xl text-base leading-8 text-stone-600 sm:text-lg">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <p className="text-base leading-7 text-stone-900 sm:text-lg">
          <strong>
          Note: Custom dimensions can be provided upon order request
          </strong>
        </p>
      </div>
    </section>
  );
}
