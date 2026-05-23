import Link from "next/link";

type ProductBreadcrumbProps = {
  categoryHref: string;
  categoryLabel: string;
  productName?: string;
};

export function ProductBreadcrumb({
  categoryHref,
  categoryLabel,
  productName,
}: ProductBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-400 sm:text-xs sm:tracking-[0.3em]"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="transition hover:text-stone-200">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/products" className="transition hover:text-stone-200">
            Products
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href={categoryHref} className="transition hover:text-stone-200">
            {categoryLabel}
          </Link>
        </li>
        {productName ? (
          <>
            <li aria-hidden="true">/</li>
            <li className="text-stone-200">{productName}</li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}
