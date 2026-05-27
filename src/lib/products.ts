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
const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);

type ProductAssetSource =
  | {
      kind: "directory";
      slug: string;
      directory: string;
    }
  | {
      kind: "file";
      slug: string;
      file: string;
    };

function isImageFile(file: string) {
  return imageExtensions.has(path.extname(file).toLowerCase());
}

function filenameToSlug(file: string) {
  return path
    .basename(file, path.extname(file))
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function publicProductPath(...segments: string[]) {
  return `/products/${segments.map((segment) => encodeURIComponent(segment)).join("/")}`;
}

function sortImages(images: string[]) {
  return images.sort((left, right) => {
    if (left.startsWith("cover")) return -1;
    if (right.startsWith("cover")) return 1;
    return left.localeCompare(right, undefined, { numeric: true });
  });
}

async function getProductAssetSources(category: ProductCategorySlug): Promise<ProductAssetSource[]> {
  const categoryPath = path.join(productsRoot, category);

  try {
    const entries = await fs.readdir(categoryPath, { withFileTypes: true });
    const directories = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({
        kind: "directory" as const,
        slug: entry.name,
        directory: entry.name,
      }));
    const files = entries
      .filter((entry) => entry.isFile() && !entry.name.startsWith(".") && isImageFile(entry.name))
      .map((entry) => ({
        kind: "file" as const,
        slug: filenameToSlug(entry.name),
        file: entry.name,
      }));

    return [...directories, ...files].filter((source) => source.slug);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function getProductImages(category: ProductCategorySlug, source: ProductAssetSource) {
  if (source.kind === "file") {
    const name = getProductContent(source.slug, category).name;

    return [
      {
        alt: `${name} primary image`,
        src: publicProductPath(category, source.file),
      },
    ];
  }

  const productPath = path.join(productsRoot, category, source.directory);
  const entries = await fs.readdir(productPath, { withFileTypes: true });
  const files = sortImages(
    entries
      .filter((entry) => entry.isFile() && !entry.name.startsWith(".") && isImageFile(entry.name))
      .map((entry) => entry.name),
  );

  return files.map((file, index) => ({
    alt: `${getProductContent(source.slug, category).name} ${index === 0 ? "primary image" : `gallery image ${index}`}`,
    src: publicProductPath(category, source.directory, file),
  }));
}

export async function getProductsByCategory(category: ProductCategorySlug): Promise<ProductSummary[]> {
  const categoryConfig = getCategoryConfig(category);
  const sources = await getProductAssetSources(category);
  const products: ProductSummary[] = [];

  for (const source of sources) {
    const images = await getProductImages(category, source);
    const content = getProductContent(source.slug, category);

    if (images.length === 0) {
      continue;
    }

    products.push({
      category,
      categoryLabel: categoryConfig.label,
      slug: source.slug,
      name: content.name,
      href: `/products/${category}/${source.slug}`,
      coverImage: images[0],
      imageCount: images.length,
      intro: content.intro,
    });
  }

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
  const productSources = await getProductAssetSources(category);
  const productSource = productSources.find((source) => source.slug === slug);

  if (!productSource) {
    return null;
  }

  const images = await getProductImages(category, productSource);

  if (images.length === 0) {
    return null;
  }

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
