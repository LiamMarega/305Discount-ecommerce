# 305 Discount Ecommerce

Full-stack ecommerce/catalog application for **305 Discount** (`305discount.com`), built with [Vendure](https://www.vendure.io/) and [Next.js](https://nextjs.org/).

The project keeps the same commerce architecture and performance-oriented implementation inherited from the Easy Home template while using an independent 305 Discount brand layer, SEO metadata, contact data and visual system.

## Storefront scope

- Furniture
- Appliances
- Mattresses
- Miami, FL inventory
- Catalog or full ecommerce mode
- WhatsApp product inquiries
- Localized storefront (`en` / `es`)
- Dynamic sitemap, robots metadata and structured data

## Project structure

```text
305Discount-ecommerce/
├── apps/
│   ├── server/       # Vendure backend, worker and Dashboard
│   └── storefront/   # Next.js storefront
├── scripts/
└── package.json
```

## Development

Start server + storefront:

```bash
npm run dev
```

Or separately:

```bash
npm run dev:server
npm run dev:storefront
```

Local endpoints:

- Vendure Dashboard: `http://localhost:3000/dashboard`
- Shop GraphQL API: `http://localhost:3000/shop-api`
- Admin GraphQL API: `http://localhost:3000/admin-api`
- Storefront: `http://localhost:3001`

## Production build

```bash
npm run build
npm run start
```

## Railway — Vendure backend

Deploy the repository root. `railway.json` builds the server workspace and starts Vendure server + worker.

Recommended production variables:

```bash
APP_ENV=production
NODE_ENV=production
COOKIE_SECRET=<strong random secret>
SUPERADMIN_USERNAME=<admin username>
SUPERADMIN_PASSWORD=<strong admin password>
VENDURE_DISABLE_TELEMETRY=true
STOREFRONT_URL=https://305discount.com
PUBLIC_URL=https://<your-railway-domain>
ASSET_URL_PREFIX=https://<your-railway-domain>/assets/
DATABASE_URL=<provided by Railway Postgres>
STORE_MODE=catalog
```

Attach Railway Postgres so `DATABASE_URL` exists. Without it, the server falls back to local SQLite for development.

## Vercel — Next.js storefront

Set **Root Directory** to `apps/storefront`.

Recommended variables:

```bash
VENDURE_SHOP_API_URL=https://<your-railway-domain>/shop-api
VENDURE_CHANNEL_TOKEN=__default_channel__
NEXT_PUBLIC_SITE_URL=https://305discount.com
NEXT_PUBLIC_SITE_NAME=305 Discount
NEXT_PUBLIC_VENDURE_ASSET_HOST=<your-railway-domain>
NEXT_PUBLIC_STORE_MODE=catalog
REVALIDATION_SECRET=<strong random secret>
```

## Brand source of truth

Store identity and contact data live in:

```text
apps/storefront/src/lib/brand.ts
```

The repository intentionally does **not** publish an inherited Easy Home email, street address, social profile, Google review set or dealer claim. Add those only when verified 305 Discount details are available.
