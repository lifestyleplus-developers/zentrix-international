import { NextResponse } from "next/server";
import { PRODUCT_CATEGORIES } from "@/lib/product-config";
import type { ProductInterestGroup } from "@/lib/contact-form";
import { getProductsByCategory } from "@/lib/products";
import { roughBlockSwatches } from "@/lib/rough-block-swatches";

export const runtime = "nodejs";

export async function GET() {
  const groups = await Promise.all(
    PRODUCT_CATEGORIES.map(async (category) => {
      const products = await getProductsByCategory(category.slug);
      const options = products.map((product) => ({
        label: product.name,
        value: `${category.label} - ${product.name}`,
      }));

      if (category.slug === "rough-blocks") {
        options.push(
          ...roughBlockSwatches.map(([name]) => ({
            label: name,
            value: `${category.label} - ${name}`,
          })),
        );
      }

      if (options.length === 0) {
        options.push({
          label: category.label,
          value: category.label,
        });
      }

      return {
        category: category.label,
        options,
      } satisfies ProductInterestGroup;
    }),
  );

  return NextResponse.json<ProductInterestGroup[]>(groups);
}
