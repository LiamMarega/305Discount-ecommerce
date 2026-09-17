import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = './appliances-vendure-import';
const PRODUCTS_JSON = path.join(OUT_DIR, 'raw/all-products.json');
const PRODUCT_COLLECTION_MAP_JSON = path.join(OUT_DIR, 'raw/product-collection-map.json');
const OUTPUT_CSV = path.join(OUT_DIR, 'vendure-products.clean.csv');

const TAX_CATEGORY = 'standard';

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function csvCell(value) {
  const clean = String(value ?? '')
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return `"${clean.replace(/"/g, '""')}"`;
}

function facetValue(value) {
  return String(value ?? '')
    .trim()
    .replace(/[|:]/g, '-')
    .replace(/\s+/g, ' ');
}

function getProducts() {
  const raw = readJson(PRODUCTS_JSON, { products: [] });
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.products)) return raw.products;
  return [];
}

function getCollectionMap() {
  const raw = readJson(PRODUCT_COLLECTION_MAP_JSON, {});
  return raw && typeof raw === 'object' ? raw : {};
}

function getCollectionNamesForProduct(product, collectionMap) {
  const entry = collectionMap[String(product.id)] || collectionMap[product.id] || [];
  if (!Array.isArray(entry)) return [];

  return entry
    .map(item => {
      if (typeof item === 'string') return item;
      return item.title || item.name || item.handle || '';
    })
    .filter(Boolean);
}

function getCondition(product) {
  const text = [
    product.title,
    product.product_type,
    product.vendor,
    ...(product.tags || []),
  ].join(' ').toLowerCase();

  if (text.includes('open box')) return 'Open Box';
  if (text.includes('brand new') || text.includes('new')) return 'Brand New';
  return '';
}

function buildFacets(product, collectionNames) {
  const facets = [];

  if (product.vendor) {
    facets.push(`brand:${facetValue(product.vendor)}`);
  }

  if (product.product_type) {
    facets.push(`type:${facetValue(product.product_type)}`);
  }

  const condition = getCondition(product);
  if (condition) {
    facets.push(`condition:${facetValue(condition)}`);
  }

  for (const tag of product.tags || []) {
    if (tag) facets.push(`shopify-tag:${facetValue(tag)}`);
  }

  for (const collectionName of collectionNames) {
    facets.push(`collection:${facetValue(collectionName)}`);
  }

  return [...new Set(facets)].join('|');
}

function getAssets(product) {
  return (product.images || [])
    .slice()
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .map(image => image.src)
    .filter(Boolean)
    .join('|');
}

function getOptionGroups(product) {
  return (product.options || [])
    .map(option => option.name)
    .filter(Boolean)
    .filter(name => name.toLowerCase() !== 'title')
    .map(facetValue);
}

function getOptionValues(variant, optionGroups) {
  if (!optionGroups.length) return '';

  return optionGroups
    .map((_, index) => {
      const value = variant[`option${index + 1}`];
      return value && value !== 'Default Title' ? facetValue(value) : 'Default';
    })
    .join('|');
}

function getSku(product, variant) {
  if (variant.sku && String(variant.sku).trim()) {
    return String(variant.sku).trim();
  }

  return `SHOPIFY-${product.id}-${variant.id}`;
}

function getPrice(variant) {
  const price = Number.parseFloat(variant.price || '0');
  return Number.isFinite(price) ? price.toFixed(2) : '0.00';
}

function main() {
  const products = getProducts();
  const collectionMap = getCollectionMap();

  if (!products.length) {
    console.error(`No products found in ${PRODUCTS_JSON}`);
    process.exit(1);
  }

  const header = [
    'name',
    'slug',
    'description',
    'assets',
    'facets',
    'optionGroups',
    'optionValues',
    'sku',
    'price',
    'taxCategory',
    'stockOnHand',
    'trackInventory',
    'variantAssets',
    'variantFacets',
  ];

  const rows = [header.map(csvCell).join(',')];

  let productCount = 0;
  let variantCount = 0;

  for (const product of products) {
    const variants = Array.isArray(product.variants) && product.variants.length
      ? product.variants
      : [{ id: `default-${product.id}`, title: 'Default Title', price: '0', available: true }];

    const collectionNames = getCollectionNamesForProduct(product, collectionMap);
    const optionGroups = getOptionGroups(product);
    const optionGroupsCell = optionGroups.join('|');
    const assets = getAssets(product);
    const facets = buildFacets(product, collectionNames);
    const description = cleanText(product.body_html || '');

    variants.forEach((variant, index) => {
      const isFirstVariant = index === 0;
      const featuredImage = variant.featured_image?.src || '';

      const row = [
        isFirstVariant ? product.title : '',
        isFirstVariant ? product.handle : '',
        isFirstVariant ? description : '',
        isFirstVariant ? assets : '',
        isFirstVariant ? facets : '',
        isFirstVariant ? optionGroupsCell : '',
        getOptionValues(variant, optionGroups),
        getSku(product, variant),
        getPrice(variant),
        TAX_CATEGORY,
        variant.available === false ? '0' : '1',
        'true',
        featuredImage,
        '',
      ];

      rows.push(row.map(csvCell).join(','));
      variantCount++;
    });

    productCount++;
  }

  fs.writeFileSync(OUTPUT_CSV, rows.join('\n'), 'utf8');

  console.log(`Generated: ${OUTPUT_CSV}`);
  console.log(`Products: ${productCount}`);
  console.log(`Variants: ${variantCount}`);
  console.log(`Rows including header: ${rows.length}`);
}

main();
