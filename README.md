# easy-home-appliance

A full-stack e-commerce application built with [Vendure](https://www.vendure.io/) and [Next.js](https://nextjs.org/).

## Project Structure

This is a monorepo using npm workspaces:

```
easy-home-appliance/
├── apps/
│   ├── server/       # Vendure backend (GraphQL API, Admin Dashboard)
│   └── storefront/   # Next.js frontend
└── package.json      # Root workspace configuration
```

## Getting Started

### Development

Start both the server and storefront in development mode:

```bash
npm run dev
```

Or run them individually:

```bash
# Start only the server
npm run dev:server

# Start only the storefront
npm run dev:storefront
```

### Access Points

- **Vendure Dashboard**: http://localhost:3000/dashboard
- **Shop GraphQL API**: http://localhost:3000/shop-api
- **Admin GraphQL API**: http://localhost:3000/admin-api
- **Storefront**: http://localhost:3001

### Admin Credentials

Use these credentials to log in to the Vendure Dashboard:

- **Username**: superadmin
- **Password**: superadmin

## Production Build

Build all packages:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Learn More

- [Vendure Documentation](https://docs.vendure.io)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vendure Discord Community](https://vendure.io/community)


## Deployment

### Railway: Vendure backend + dashboard

Railway should deploy the repository root. `railway.json` builds only the server workspace and starts only Vendure server + worker.

Leave the service's **Pre-deploy Command** and **Start Command** empty in the Railway dashboard. `railway.json` already sets both, and a dashboard pre-deploy command that runs `npm run build` rebuilds the Vendure dashboard a second time after the image build and exhausts the Node heap. `npm run start` must stay the start command: it boots the server and the worker, so replacing it with `node ./dist/index.js` would silently drop the worker (email delivery and search indexing).

Required Railway variables:

```bash
APP_ENV=production
NODE_ENV=production
COOKIE_SECRET=<strong random secret>
SUPERADMIN_USERNAME=<admin username>
SUPERADMIN_PASSWORD=<strong admin password>
VENDURE_DISABLE_TELEMETRY=true
STOREFRONT_URL=https://<your-vercel-domain>
PUBLIC_URL=https://<your-railway-domain>
ASSET_URL_PREFIX=https://<your-railway-domain>/assets/
DATABASE_URL=<provided by Railway Postgres>
```

Attach a Railway Postgres service so `DATABASE_URL` exists. Without `DATABASE_URL`, the backend falls back to local SQLite for development only.

### Vercel: Next.js storefront

Create the Vercel project with **Root Directory** set to `apps/storefront`. Vercel will auto-detect Next.js from that app root.

Required Vercel variables:

```bash
VENDURE_SHOP_API_URL=https://<your-railway-domain>/shop-api
VENDURE_CHANNEL_TOKEN=__default_channel__
NEXT_PUBLIC_SITE_URL=https://<your-vercel-domain>
NEXT_PUBLIC_SITE_NAME=easy-home-appliance
NEXT_PUBLIC_VENDURE_ASSET_HOST=<your-railway-domain>
REVALIDATION_SECRET=<strong random secret>
```
