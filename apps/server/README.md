# 305 Discount Vendure Server

Vendure backend for the **305 Discount** ecommerce/catalog project.

This app contains the Shop/Admin GraphQL APIs, worker, search/job infrastructure, email templates, asset serving and the branded Vendure Dashboard used by the storefront in `../storefront`.

## Development

From the repository root:

```bash
npm run dev:server
```

Or from `apps/server`:

```bash
npm run dev
```

Default local endpoints:

- Dashboard: `http://localhost:3000/dashboard`
- Shop API: `http://localhost:3000/shop-api`
- Admin API: `http://localhost:3000/admin-api`

## Production

The repository is configured to deploy the Vendure backend on Railway. See the root `README.md` and `.env.example` for the current 305 Discount environment variables and deployment settings.

Production identity and sender defaults use **305 Discount** / `305discount.com`. Store mode can remain `catalog` while checkout is disabled or be switched to `ecommerce` when the complete checkout flow is enabled.

## Migrations

Whenever the Vendure schema changes, generate and commit a migration:

```bash
npx vendure migrate
```

Do not enable `synchronize: true` against production data.
