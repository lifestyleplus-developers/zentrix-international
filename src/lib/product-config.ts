export const PRODUCT_CATEGORIES = [
  {
    slug: "rough-blocks",
    label: "Rough Blocks",
    eyebrow: "",
    heroTitle: "Rough granite blocks prepared for dependable export volume.",
    badge: "Block Grade",
    cardText:
      "Primary quarry blocks selected for export planning, monument stock, and fabrication-ready cutting programs.",
  },
  {
    slug: "gangsaw-slabs",
    label: "Gangsaw Slabs",
    eyebrow: "",
    badge: "Slab Grade",
    cardText:
      "Large-format slabs supplied for flooring, cladding, countertops, and specification-driven projects.",
  },
] as const;

export type ProductCategorySlug = (typeof PRODUCT_CATEGORIES)[number]["slug"];

export type ProductSpecKey =
  | "Dimensions"
  | "Thickness"
  | "Finishes"
  | "Edge Profiles"
  | "Weight"
  | "Grain / Pattern"
  | "Compressive Strength"
  | "Density";

export type ProductSpecs = Record<ProductSpecKey, string>;

type ProductContentOverride = {
  displayName?: string;
  intro?: Partial<Record<ProductCategorySlug, string>>;
  description?: Partial<Record<ProductCategorySlug, string[]>>;
  specs?: Partial<Record<ProductCategorySlug, Partial<ProductSpecs>>>;
};

const commonOverrides: Record<string, ProductContentOverride> = {
  "steel-grey-premium": {
    displayName: "Steel Grey Premium",
  },
  "viscon-white": {
    displayName: "Viscon White",
  },
  "vizag-blue": {
    displayName: "Vizag Blue",
  },
  "taj-mahal": {
    displayName: "Taj Mahal",
  },
  patagonia: {
    displayName: "Patagonia",
  },
};

const roughBlockSpecs: ProductSpecs = {
  Dimensions: "Export-sized rough blocks cut to quarry yield and container planning.",
  Thickness: "Block form with sizing finalized during extraction and trimming.",
  Finishes: "Natural quarry finish with optional dressed faces on request.",
  "Edge Profiles": "Wire-sawn, quarry-cut, or dressed edges based on dispatch requirement.",
  Weight: "Depends on block dimensions, density, and quarry recovery.",
  "Grain / Pattern": "Pronounced natural granite movement with category-specific variation.",
  "Compressive Strength": "High structural performance suited to heavy-duty stone processing.",
  Density: "Dense granite composition selected for durability and machining stability.",
};

const gangsawSlabSpecs: ProductSpecs = {
  Dimensions: "280 x 180 CM up",
  Thickness: "2, 3 cm, and others",
  Finishes: "Polished, honed, flamed, leather, bush-hammered, lepatora, shot-blasted",
  "Edge Profiles": "Machine cut / Saw cut - straight edges",
  Weight: "Nearly 60-80 kg per sq. m",
  "Grain / Pattern": "Uniform grain / Flowing veins / Speckled patterns",
  "Compressive Strength": "1800 to 2100 kg/cm²",
  Density: "2.63 to 2.75 g/cm³",
};

export function getCategoryConfig(category: ProductCategorySlug) {
  return PRODUCT_CATEGORIES.find((item) => item.slug === category)!;
}

export function getDefaultSpecs(category: ProductCategorySlug): ProductSpecs {
  return category === "rough-blocks" ? roughBlockSpecs : gangsawSlabSpecs;
}

function humanizeWords(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function getProductDisplayName(slug: string) {
  return commonOverrides[slug]?.displayName ?? humanizeWords(slug);
}

function buildDefaultIntro(name: string, category: ProductCategorySlug) {
  return category === "rough-blocks"
    ? `${name} rough blocks are selected for clean extraction, dependable density, and efficient downstream cutting across export and monument programs.`
    : `${name} gangsaw slabs are produced for projects that require broad visual coverage, controlled grain flow, and fabrication-ready consistency.`;
}

function buildDefaultDescription(name: string, category: ProductCategorySlug) {
  if (category === "rough-blocks") {
    return [
      `${name} is supplied in rough block format for buyers who need flexibility at the cutting and finishing stage. Material selection prioritizes grain stability, quarry yield, and dispatch planning for export-oriented production lines.`,
      `The category is suited to monument work, dimensional stone conversion, and processors who prefer to control slab cutting, calibration, and surface finishing after arrival.`,
    ];
  }

  return [
    `${name} gangsaw slabs are positioned for architecture, interior surfaces, and fabrication programs where broad slab coverage and visual continuity are important. Each lot is intended to support predictable cutting layouts and consistent finished presentation.`,
    `This format works well for flooring, cladding, kitchen surfaces, feature walls, and commercial specification packages that require dependable granite performance in both appearance and durability.`,
  ];
}

export function getProductContent(slug: string, category: ProductCategorySlug) {
  const name = getProductDisplayName(slug);
  const override = commonOverrides[slug];
  const description = override?.description?.[category] ?? buildDefaultDescription(name, category);
  const intro = override?.intro?.[category] ?? buildDefaultIntro(name, category);
  const specs = {
    ...getDefaultSpecs(category),
    ...override?.specs?.[category],
  };

  return { name, intro, description, specs };
}
