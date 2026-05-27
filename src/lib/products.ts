import { promises as fs } from "node:fs";
import path from "node:path";
import {
  getCategoryConfig,
  getProductContent,
  PRODUCT_CATEGORIES,
  type ProductCategorySlug,
  type ProductSpecs,
} from "@/lib/product-config";

export type ProductImage = {
  alt: string;
  src: string;
};

export type ProductSummary = {
  category: ProductCategorySlug;
  categoryLabel: string;
  slug: string;
  name: string;
  href: string;
  coverImage: ProductImage;
  imageCount: number;
  intro: string;
};

export type ProductDetail = ProductSummary & {
  badge: string;
  eyebrow: string;
  metaDescription: string;
  description: string[];
  specs: ProductSpecs;
  images: ProductImage[];
};

const productsRoot = path.join(process.cwd(), "public", "products");

function sortImages(images: string[]) {
  return images.sort((left, right) => {
    if (left.startsWith("cover")) return -1;
    if (right.startsWith("cover")) return 1;
    return left.localeCompare(right, undefined, { numeric: true });
  });
}

async function getProductDirectories(category: ProductCategorySlug) {
  const categoryPath = path.join(productsRoot, category);

  try {
    const entries = await fs.readdir(categoryPath, { withFileTypes: true });

    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function getProductImages(category: ProductCategorySlug, slug: string) {
  const productPath = path.join(productsRoot, category, slug);
  const entries = await fs.readdir(productPath, { withFileTypes: true });
  const files = sortImages(
    entries
      .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
      .map((entry) => entry.name),
  );

  return files.map((file, index) => ({
    alt: `${getProductContent(slug, category).name} ${index === 0 ? "primary image" : `gallery image ${index}`}`,
    src: `/products/${category}/${slug}/${file}`,
  }));
}

export async function getProductsByCategory(category: ProductCategorySlug): Promise<ProductSummary[]> {
  const categoryConfig = getCategoryConfig(category);
  const directories = await getProductDirectories(category);

  const products = await Promise.all(
    directories.map(async (slug) => {
      const images = await getProductImages(category, slug);
      const content = getProductContent(slug, category);

      return {
        category,
        categoryLabel: categoryConfig.label,
        slug,
        name: content.name,
        href: `/products/${category}/${slug}`,
        coverImage: images[0],
        imageCount: images.length,
        intro: content.intro,
      } satisfies ProductSummary;
    }),
  );

  return products.sort((left, right) => left.name.localeCompare(right.name));
}

export async function getAllProducts() {
  const entries = await Promise.all(
    PRODUCT_CATEGORIES.map(async (category) => ({
      category,
      products: await getProductsByCategory(category.slug),
    })),
  );

  return entries;
}

export async function getProductDetail(
  category: ProductCategorySlug,
  slug: string,
): Promise<ProductDetail | null> {
  const productDirectories = await getProductDirectories(category);

  if (!productDirectories.includes(slug)) {
    return null;
  }

  const images = await getProductImages(category, slug);
  const categoryConfig = getCategoryConfig(category);
  const content = getProductContent(slug, category);

  return {
    category,
    categoryLabel: categoryConfig.label,
    slug,
    name: content.name,
    href: `/products/${category}/${slug}`,
    coverImage: images[0],
    imageCount: images.length,
    intro: content.intro,
    badge: categoryConfig.badge,
    eyebrow: categoryConfig.eyebrow,
    metaDescription: content.metaDescription,
    description: content.description,
    specs: content.specs,
    images,
  };
}

export async function getAllProductParams() {
  const params = await Promise.all(
    PRODUCT_CATEGORIES.map(async ({ slug: category }) => {
      const products = await getProductsByCategory(category);
      return products.map((product) => ({ category, slug: product.slug }));
    }),
  );

  return params.flat();
}
