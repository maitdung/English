# Deploy Quickstart

## Frontend on Cloudflare Pages

1. Connect GitHub repo.
2. Choose branch: `develop` or your release branch.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env:

```env
VITE_API_URL=https://english-3t66.onrender.com/api
```

## Backend on Render / Railway / Fly / VPS

1. Set environment variables from `server/.env.production.example`.
   The production `FRONTEND_URL` is `https://english-c0h.pages.dev`.
   To enable one-click deploy for ADMIN, set the Cloudflare Pages `develop`
   Deploy Hook URL as `CLOUDFLARE_PAGES_DEPLOY_HOOK_URL` on the backend host.
2. If you do not have a production Redis yet, keep:

```env
HEALTH_CHECK_REDIS_ENABLED=false
```

3. Run migrations:

```bash
cd server
npx prisma migrate deploy
npm run seed:content
```

4. Start app:

```bash
npm run start:prod
```

## Safety check before deploy

From repo root:

```bash
npm run deploy:check
```

If this passes, the project is usually safe to upload.
