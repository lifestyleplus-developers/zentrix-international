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
  metaDescription?: Partial<Record<ProductCategorySlug, string>>;
  description?: Partial<Record<ProductCategorySlug, string[]>>;
  specs?: Partial<Record<ProductCategorySlug, Partial<ProductSpecs>>>;
};

const commonOverrides: Record<string, ProductContentOverride> = {
  "absolute-black": {
    intro: {
      "gangsaw-slabs":
        "A deep, uniform black with minimal grain movement - consistent from slab to slab, favoured for monolithic surfaces and architectural contrast work.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Absolute Black gangsaw slabs from Zentrix International. Uniform grain, 280x180 cm and above, multiple finishes. Commercial supply from Bangalore.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Uniform, minimal grain movement",
      },
    },
  },
  "alaska-gold": {
    intro: {
      "gangsaw-slabs":
        "Warm gold tones with flowing brown and grey veining - works well where a natural, high-movement pattern is specified.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Alaska Gold gangsaw slabs - warm gold tones with flowing veining. Available in 2 and 3 cm thickness from Zentrix International.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "High-movement veining, warm tones",
      },
    },
  },
  "alpine-white": {
    intro: {
      "gangsaw-slabs":
        "A clean white base with subtle grey veining - one of the most versatile stones in the range for light interior schemes.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Alpine White gangsaw slabs from Zentrix International. Clean white, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Subtle grey veining on white ground",
      },
    },
  },
  "black-forest": {
    intro: {
      "gangsaw-slabs":
        "Dark grey-black with scattered mineral flecks and faint veining - denser in character than Absolute Black, with more surface depth.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Black Forest gangsaw slabs from Zentrix International. Dark speckled, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Fine speckle with faint veining",
      },
    },
  },
  "black-galaxy": {
    intro: {
      "gangsaw-slabs":
        "Black granite with gold and copper mineral flecks that appear to shift under light - a distinctive material for feature surfaces.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Black Galaxy gangsaw slabs from Zentrix International. Gold flecked, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Fine black grain with gold mineral flecks",
      },
    },
  },
  "black-pearl": {
    intro: {
      "gangsaw-slabs":
        "Deep charcoal base with a fine silver speckle pattern - an understated alternative to Black Galaxy for projects requiring more restraint.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Black Pearl gangsaw slabs from Zentrix International. Silver speckled, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Fine silver speckle on charcoal ground",
      },
    },
  },
  "colonial-cream": {
    intro: {
      "gangsaw-slabs":
        "Creamy white ground with warm brown and grey speckle - a reliable, widely specified stone for residential and commercial kitchens.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Colonial Cream gangsaw slabs from Zentrix International. Warm speckle, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Warm speckle, low movement",
      },
    },
  },
  "colonial-white": {
    intro: {
      "gangsaw-slabs":
        "Off-white with subtle brown mineral deposits and fine grain movement - complementary to warm-toned interiors and natural material palettes.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Colonial White gangsaw slabs from Zentrix International. Warm grained, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Fine grain, warm mineral deposits",
      },
    },
  },
  crystalo: {
    intro: {
      "gangsaw-slabs":
        "Light grey-white with prominent crystal clusters and flowing veins - visually active at scale, strong as a feature wall or countertop.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Crystalo gangsaw slabs from Zentrix International. Crystal veined, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Crystal clusters with flowing veins",
      },
    },
  },
  "forest-gold": {
    intro: {
      "gangsaw-slabs":
        "Green-gold tones with dark mineral inclusions and moderate veining - an earthy choice for projects with natural or organic design language.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Forest Gold gangsaw slabs from Zentrix International. Earthy veining, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Earthy grain, moderate veining",
      },
    },
  },
  "imperial-gold": {
    intro: {
      "gangsaw-slabs":
        "Warm yellow-gold base with heavy brown and red veining - bold in pattern, often specified for statement flooring and cladding.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Imperial Gold gangsaw slabs from Zentrix International. Bold veining, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Bold veining, high movement",
      },
    },
  },
  "lava-ore": {
    intro: {
      "gangsaw-slabs":
        "Dark base with deep-toned veining and a coarse mineral texture - suited to industrial and raw-finish design contexts.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Lava Ore gangsaw slabs from Zentrix International. Dark textured, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Coarse grain, deep-toned veining",
      },
    },
  },
  "steel-grey-premium": {
    displayName: "Steel Grey Premium",
    intro: {
      "gangsaw-slabs":
        "Cool mid-grey with fine, consistent grain and minimal pattern variation - a precise, architectural choice for clean-lined projects.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Steel Grey Premium gangsaw slabs from Zentrix International. Fine grained, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Consistent fine grain, low pattern variation",
      },
    },
  },
  "viscon-white": {
    displayName: "Viscon White",
    intro: {
      "gangsaw-slabs":
        "White to light grey with flowing dark veins and medium grain - a dependable mid-range stone for a wide variety of applications.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Viscon White gangsaw slabs from Zentrix International. Flowing veins, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Flowing dark veins, medium grain",
      },
    },
  },
  "vizag-blue": {
    displayName: "Vizag Blue",
    intro: {
      "gangsaw-slabs":
        "Steel blue-grey with uniform grain and subtle directional movement - distinctive colour, consistently available at commercial volume.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Vizag Blue gangsaw slabs - steel blue-grey granite in consistent commercial grades. Enquire with Zentrix International.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Uniform steel blue-grey, directional grain",
      },
    },
  },
  "taj-mahal": {
    displayName: "Taj Mahal",
    intro: {
      "gangsaw-slabs":
        "Creamy white with soft gold and grey veining - warmer in tone than Alpine White, with a more expressive surface character.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Taj Mahal gangsaw slabs from Zentrix International. Soft veining, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Soft gold and grey veining on cream ground",
      },
    },
  },
  patagonia: {
    displayName: "Patagonia",
    intro: {
      "gangsaw-slabs":
        "White to grey base with dramatic grey-black veining that moves across the slab face - high visual impact, frequently specified for luxury interiors.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Patagonia granite slabs with dramatic grey-black veining. Gangsaw cut, commercial volume, supplied direct from quarry by Zentrix International.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Dramatic grey-black veining on white-grey ground",
      },
    },
  },
  "river-white": {
    intro: {
      "gangsaw-slabs":
        "Cream-white with flowing grey and burgundy veining - a classic movement pattern that works across residential and commercial applications.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "River White gangsaw slabs from Zentrix International. Flowing veins, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Flowing grey and burgundy veins",
      },
    },
  },
  "thunder-white": {
    intro: {
      "gangsaw-slabs":
        "White base with strong dark grey veining and scattered mineral spotting - high contrast in a light material.",
    },
    metaDescription: {
      "gangsaw-slabs":
        "Thunder White gangsaw slabs from Zentrix International. Strong veining, available in polished, honed, and other finishes. Enquire for volume pricing.",
    },
    specs: {
      "gangsaw-slabs": {
        "Grain / Pattern": "Strong dark veining on white ground",
      },
    },
  },
};

const roughBlockSpecs: ProductSpecs = {
  Dimensions: 
  "Small: 120–180 × 60–90 × 60–90 cm\n" +
  "Medium: 180–240 × 90–120 × 90–120 cm\n" +
  "Large: 240–320 × 120–180 × 100–180 cm",
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
  const metaDescription = override?.metaDescription?.[category] ?? intro;
  const specs = {
    ...getDefaultSpecs(category),
    ...override?.specs?.[category],
  };

  return { name, intro, metaDescription, description, specs };
}
