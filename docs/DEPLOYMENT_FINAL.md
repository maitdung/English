# Final Deploy Checklist

Use this when you want to upload the project with the least friction.

## Frontend: Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Env:

```env
VITE_API_URL=https://english-3t66.onrender.com/api
```

- SPA fallback is already handled by `public/_redirects`.

## Backend: Render

Use `render.yaml` from the repo root.

Before first deploy, make sure production env values are correct:

- `DATABASE_URL` points to Neon
- `JWT_ACCESS_SECRET` is long and random
- `JWT_REFRESH_SECRET` is long and random
- `FRONTEND_URL=https://english-c0h.pages.dev`
- `ENABLE_SWAGGER_DOCS=false`
- `HEALTH_CHECK_REDIS_ENABLED=false` until Redis is ready

To enable the ADMIN deploy button, create a Cloudflare Pages Deploy Hook for
the `develop` branch and save its URL only in Render as:

```env
CLOUDFLARE_PAGES_DEPLOY_HOOK_URL=https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/...
```

The button rebuilds the latest commit already pushed to `develop`; it does not
store this secret in the browser or push source code from the browser.

## Database

1. Run Prisma migrations:

```bash
cd server
npx prisma migrate deploy
```

2. Seed content:

```bash
npm run seed:content
```

## Verification

Before uploading or after each big update:

```bash
npm run deploy:check
```

## Security notes

- Never commit `.env.production` to GitHub.
- Rotate secrets if they were ever exposed.
- Keep Swagger off in production unless you specifically need it.
- Restrict `FRONTEND_URL` to the exact domains you own.
