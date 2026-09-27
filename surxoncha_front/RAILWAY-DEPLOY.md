# Railway deploy

This repository contains two independent Railway services:

- `surxoncha-cms`: Strapi CMS + Railway PostgreSQL
- `surxoncha-nextjs`: Next.js frontend/API

Create each Railway service with its **Root Directory** set to the matching folder. Railway will use that folder's `railway.json` and `Dockerfile`.

## 1. CMS service

Add a Railway PostgreSQL database and connect its variables to the CMS service. Set:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
DATABASE_CLIENT=postgres
DATABASE_HOST=${{Postgres.PGHOST}}
DATABASE_PORT=${{Postgres.PGPORT}}
DATABASE_NAME=${{Postgres.PGDATABASE}}
DATABASE_USERNAME=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
DATABASE_SSL=false
APP_KEYS=<four-comma-separated-random-values>
API_TOKEN_SALT=<random-value>
ADMIN_JWT_SECRET=<random-value>
TRANSFER_TOKEN_SALT=<random-value>
JWT_SECRET=<random-value>
CORS_ORIGINS=https://<frontend-domain>,https://<cms-domain>
```

Do not use `${{Postgres.DATABASE_URL}}` here if the Postgres service shows that
variable as empty. The Railway Postgres service in this project exposes the
working connection values as `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and
`PGPASSWORD`. Add these as **variable references** on the CMS service. Remove
any CMS variables named `DATABASE_URL`, `PGHOST`, `PGPORT`, `PGDATABASE`,
`PGUSER`, or `PGPASSWORD` that were added as literal values; keep only the five
`DATABASE_*` references above.

Generate secrets locally with:

```bash
openssl rand -hex 32
```

Deploy CMS first, open `/admin`, create the administrator, and confirm:

```text
https://<cms-domain>/_health
```

The first admin setup and any required API permissions must be completed in Strapi Admin. Uploaded media should use S3-compatible storage in production; Railway container storage is not permanent.

## 2. Frontend service

For the frontend Railway service, set **Root Directory** to `surxoncha-nextjs`.
This makes Railway use `surxoncha-nextjs/railway.json` and
`surxoncha-nextjs/Dockerfile` for the Next.js deployment.

Set these Railway variables after the CMS domain exists:

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://<frontend-domain>
NEXT_PUBLIC_SITE_NAME=Surxoncha.uz
STRAPI_URL=https://<cms-domain>
NEXT_PUBLIC_STRAPI_URL=https://<cms-domain>
STRAPI_MEDIA_HOSTNAME=<cms-domain-without-https>
STRAPI_API_TOKEN=<read-only-strapi-token>
AUTH_URL=https://<frontend-domain>
NEXTAUTH_URL=https://<frontend-domain>
AUTH_SECRET=<random-value>
REVALIDATE_SECRET=<same-value-configured-in-strapi-webhook>
NEXT_REVALIDATE_URL=https://<frontend-domain>/api/revalidate
```

Deploy frontend and verify:

```text
https://<frontend-domain>/api/health
https://<frontend-domain>/
https://<frontend-domain>/category/yangiliklar
```

## GitHub

From the repository root:

```bash
git init
git add .
git status
git commit -m "Prepare Surxoncha services for Railway"
git branch -M main
git remote add origin https://github.com/<account>/<repository>.git
git push -u origin main
```

Do not commit `.env`, `.env.local`, credentials, API tokens, database files, or uploaded media. The root `.gitignore` excludes them. Add the GitHub repository to Railway and configure the two service root directories separately.
