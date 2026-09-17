#!/usr/bin/env node
/**
 * Shopify public JSON -> Vendure CSV + Initial Data generator
 *
 * What it does:
 * 1. Fetches all published products from /products.json with pagination.
 * 2. Fetches all collections from /collections.json with pagination.
 * 3. Fetches products for each collection from /collections/{handle}/products.json.
 * 4. Links products to their real Shopify collections.
 * 5. Generates a Vendure-compatible CSV.
 * 6. Generates a Vendure initial-data.ts file with collection definitions.
 *
 * Usage:
 *   node shopify-vendure-full-scraper.mjs \
 *     --base=https://www.theappliancesoutlet.com \
 *     --out=./appliances-vendure-import
 *
 * Requirements:
 *   Node.js 18+ because this script uses native fetch().
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_BASE_URL = 'https://www.theappliancesoutlet.com';
const SHOPIFY_LIMIT = 250;
const DEFAULT_TAX_CATEGORY = 'standard';
const DEFAULT_STOCK_ON_HAND = 1;
const DEFAULT_TRACK_INVENTORY = true;
const REQUEST_DELAY_MS = 250;
const MAX_RETRIES = 4;

function parseArgs(argv) {
  const args = {
    base: DEFAULT_BASE_URL,
    out: './appliances-vendure-import',
    limit: SHOPIFY_LIMIT,
  };

  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--base=')) args.base = arg.replace('--base=', '').trim();
    if (arg.startsWith('--out=')) args.out = arg.replace('--out=', '').trim();
    if (arg.startsWith('--limit=')) args.limit = Number(arg.replace('--limit=', '').trim());
  }

  args.base = args.base.replace(/\/$/, '');
  if (!Number.isFinite(args.limit) || args.limit <= 0) args.limit = SHOPIFY_LIMIT;
  if (args.limit > 250) args.limit = SHOPIFY_LIMIT;

  return args;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchJson(url, retries = MAX_RETRIES) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: {
          accept: 'application/json,text/plain,*/*',
          'user-agent': 'Mozilla/5.0 ShopifyVendureImporter/1.0',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      return await res.json();
    } catch (err) {
      lastError = err;
      const wait = REQUEST_DELAY_MS * attempt * 2;
      console.warn(`Fetch failed (${attempt}/${retries}): ${url}`);
      console.warn(`Reason: ${err.message}`);
      if (attempt < retries) await sleep(wait);
    }
  }

  throw lastError;
}

async function fetchPaginatedArray(baseUrl, key, limit = SHOPIFY_LIMIT) {
  const all = [];
  let page = 1;

  while (true) {
    const separator = baseUrl.includes('?') ? '&' : '?';
    const url = `${baseUrl}${separator}limit=${limit}&page=${page}`;
    console.log(`Fetching ${key} page ${page}: ${url}`);

    const data = await fetchJson(url);
    const items = Array.isArray(data?.[key]) ? data[key] : [];

    if (items.length === 0) break;

    all.push(...items);

    if (items.length < limit) break;

    page += 1;
    await sleep(REQUEST_DELAY_MS);
  }

  return all;
}

function normalizeText(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

function stripHtmlToText(html) {
  return normalizeText(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function slugify(value) {
  return normalizeText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

function normalizeFacetValue(value) {
  return normalizeText(value)
    .replace(/\|/g, '/')
    .replace(/:/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim();
}

function csvEscape(value) {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows, columns) {
  const lines = [];
  lines.push(columns.map(csvEscape).join(','));
  for (const row of rows) {
    lines.push(columns.map(col => csvEscape(row[col] ?? '')).join(','));
  }
  return `${lines.join('\n')}\n`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function getImageUrls(product) {
  return unique((product.images || []).map(img => img?.src).filter(Boolean));
}

function getVariantImageUrl(variant) {
  return variant?.featured_image?.src || '';
}

function inferCondition(product) {
  const haystack = [product.title, product.product_type, ...(product.tags || [])]
    .join(' ')
    .toLowerCase();

  if (haystack.includes('open box')) return 'Open Box';
  if (haystack.includes('brand new') || haystack.includes('new')) return 'Brand New';
  return '';
}

function variantSku(product, variant) {
  if (variant?.sku && String(variant.sku).trim()) return String(variant.sku).trim();
  return `SHOPIFY-${product.id}-${variant?.id || 'VARIANT'}`;
}

function buildProductCollectionMap(collectionProductsByHandle, collections) {
  const collectionByHandle = new Map(collections.map(c => [c.handle, c]));
  const productIdToCollections = new Map();

  for (const [handle, products] of Object.entries(collectionProductsByHandle)) {
    const collection = collectionByHandle.get(handle);
    if (!collection) continue;

    for (const product of products) {
      const id = String(product.id);
      if (!productIdToCollections.has(id)) productIdToCollections.set(id, []);
      productIdToCollections.get(id).push({
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
      });
    }
  }

  return productIdToCollections;
}

function buildFacets(product, productCollections) {
  const facets = [];

  if (product.vendor) facets.push(`brand:${normalizeFacetValue(product.vendor)}`);
  if (product.product_type) facets.push(`type:${normalizeFacetValue(product.product_type)}`);

  const condition = inferCondition(product);
  if (condition) facets.push(`condition:${condition}`);

  for (const tag of product.tags || []) {
    const normalizedTag = normalizeFacetValue(tag);
    if (!normalizedTag) continue;
    facets.push(`shopify-tag:${normalizedTag}`);
  }

  for (const collection of productCollections || []) {
    const normalizedCollection = normalizeFacetValue(collection.title);
    if (!normalizedCollection) continue;
    facets.push(`collection:${normalizedCollection}`);
  }

  return unique(facets).join('|');
}

function buildVendureRows(products, productIdToCollections) {
  const rows = [];

  for (const product of products) {
    const variants = Array.isArray(product.variants) && product.variants.length > 0
      ? product.variants
      : [{ id: 'default', title: 'Default Title', price: '0.00', available: true }];

    const productCollections = productIdToCollections.get(String(product.id)) || [];
    const imageUrls = getImageUrls(product);
    const facets = buildFacets(product, productCollections);
    const hasRealOptions = variants.some(v => normalizeText(v.title) && normalizeText(v.title) !== 'Default Title');

    for (let i = 0; i < variants.length; i += 1) {
      const variant = variants[i];
      const isFirstVariant = i === 0;

      let optionGroups = '';
      let optionValues = '';

      if (hasRealOptions) {
        const optionNames = (product.options || [])
          .map(option => normalizeText(option.name))
          .filter(name => name && name.toLowerCase() !== 'title');

        optionGroups = optionNames.length > 0 ? optionNames.join('|') : 'Option';

        const values = [];
        if (optionNames.length > 0) {
          for (let optionIndex = 1; optionIndex <= optionNames.length; optionIndex += 1) {
            values.push(normalizeText(variant[`option${optionIndex}`]));
          }
        } else {
          values.push(normalizeText(variant.title));
        }
        optionValues = values.filter(Boolean).join('|');
      }

      rows.push({
        name: isFirstVariant ? normalizeText(product.title) : '',
        slug: isFirstVariant ? (product.handle || slugify(product.title)) : '',
        description: isFirstVariant ? stripHtmlToText(product.body_html || '') : '',
        assets: isFirstVariant ? imageUrls.join('|') : '',
        facets: isFirstVariant ? facets : '',
        optionGroups: isFirstVariant ? optionGroups : '',
        optionValues: hasRealOptions ? optionValues : '',
        sku: variantSku(product, variant),
        price: normalizeText(variant.price || '0.00'),
        taxCategory: DEFAULT_TAX_CATEGORY,
        stockOnHand: variant.available === false ? 0 : DEFAULT_STOCK_ON_HAND,
        trackInventory: String(DEFAULT_TRACK_INVENTORY),
        variantAssets: getVariantImageUrl(variant),
        variantFacets: '',
        'product:shopifyProductId': isFirstVariant ? String(product.id) : '',
        'variant:shopifyVariantId': String(variant.id || ''),
        'variant:compareAtPrice': normalizeText(variant.compare_at_price || ''),
      });
    }
  }

  return rows;
}

function buildInitialDataTs(collections) {
  const vendureCollections = collections
    .filter(collection => collection?.title && collection?.handle)
    .map(collection => ({
      name: normalizeFacetValue(collection.title),
      filters: [
        {
          code: 'facet-value-filter',
          args: {
            facetValueNames: [`collection:${normalizeFacetValue(collection.title)}`],
            containsAny: false,
          },
        },
      ],
      ...(collection.image?.src ? { assetPaths: [collection.image.src] } : {}),
    }));

  return `import { InitialData, LanguageCode } from '@vendure/core';

export const initialData: InitialData = {
  defaultLanguage: LanguageCode.en,
  countries: [
    { name: 'United States', code: 'US', zone: 'United States' },
  ],
  defaultZone: 'United States',
  taxRates: [
    { name: 'standard', percentage: 0 },
  ],
  shippingMethods: [
    { name: 'Standard Shipping', price: 0 },
  ],
  paymentMethods: [
    {
      name: 'Standard Payment',
      handler: {
        code: 'dummy-payment-handler',
        arguments: [{ name: 'automaticSettle', value: 'false' }],
      },
    },
  ],
  collections: ${JSON.stringify(vendureCollections, null, 4)},
};
`;
}

async function ensureDirs(outDir) {
  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(path.join(outDir, 'raw'), { recursive: true });
  await fs.mkdir(path.join(outDir, 'raw', 'collection-products'), { recursive: true });
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function main() {
  const args = parseArgs(process.argv);
  const outDir = path.resolve(args.out);

  await ensureDirs(outDir);

  console.log('Base URL:', args.base);
  console.log('Output:', outDir);

  const products = await fetchPaginatedArray(`${args.base}/products.json`, 'products', args.limit);
  console.log(`Fetched products: ${products.length}`);

  const collections = await fetchPaginatedArray(`${args.base}/collections.json`, 'collections', args.limit);
  console.log(`Fetched collections: ${collections.length}`);

  const collectionProductsByHandle = {};

  for (const collection of collections) {
    if (!collection.handle) continue;
    const url = `${args.base}/collections/${encodeURIComponent(collection.handle)}/products.json`;
    const collectionProducts = await fetchPaginatedArray(url, 'products', args.limit);
    collectionProductsByHandle[collection.handle] = collectionProducts;

    await writeJson(
      path.join(outDir, 'raw', 'collection-products', `${collection.handle}.json`),
      { collection, products: collectionProducts },
    );

    console.log(`Collection ${collection.title}: ${collectionProducts.length} products`);
    await sleep(REQUEST_DELAY_MS);
  }

  const productIdToCollections = buildProductCollectionMap(collectionProductsByHandle, collections);
  const rows = buildVendureRows(products, productIdToCollections);

  const columns = [
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
    'product:shopifyProductId',
    'variant:shopifyVariantId',
    'variant:compareAtPrice',
  ];

  const csv = toCsv(rows, columns);
  const initialDataTs = buildInitialDataTs(collections);

  await fs.writeFile(path.join(outDir, 'vendure-products.csv'), csv, 'utf8');
  await fs.writeFile(path.join(outDir, 'vendure-initial-data.ts'), initialDataTs, 'utf8');

  const mapObject = Object.fromEntries(
    [...productIdToCollections.entries()].map(([productId, productCollections]) => [productId, productCollections]),
  );

  const summary = {
    baseUrl: args.base,
    generatedAt: new Date().toISOString(),
    totalProducts: products.length,
    totalCollections: collections.length,
    totalCsvRows: rows.length,
    productsWithCollections: productIdToCollections.size,
    outputFiles: [
      'vendure-products.csv',
      'vendure-initial-data.ts',
      'raw/all-products.json',
      'raw/collections.json',
      'raw/product-collection-map.json',
      'raw/import-summary.json',
    ],
  };

  await writeJson(path.join(outDir, 'raw', 'all-products.json'), { products });
  await writeJson(path.join(outDir, 'raw', 'collections.json'), { collections });
  await writeJson(path.join(outDir, 'raw', 'product-collection-map.json'), mapObject);
  await writeJson(path.join(outDir, 'raw', 'import-summary.json'), summary);

  console.log('\nDone. Generated files:');
  console.log(`- ${path.join(outDir, 'vendure-products.csv')}`);
  console.log(`- ${path.join(outDir, 'vendure-initial-data.ts')}`);
  console.log(`- ${path.join(outDir, 'raw', 'import-summary.json')}`);
}

main().catch(err => {
  console.error('\nFatal error:');
  console.error(err);
  process.exit(1);
});
