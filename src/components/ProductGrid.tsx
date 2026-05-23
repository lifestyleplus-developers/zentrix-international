import type { ProductSummary } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

type ProductGridProps = {
  products: ProductSummary[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={`${product.category}-${product.slug}`} product={product} />
      ))}
    </div>
  );
}
