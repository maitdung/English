# Deploy Quickstart

## Frontend on Cloudflare Pages

1. Connect GitHub repo.
2. Choose branch: `develop` or your release branch.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env:

```env
VITE_API_URL=https://api.your-domain.com/api
```

## Backend on Render / Railway / Fly / VPS

1. Set environment variables from `server/.env.production.example`.
2. Run migrations:

```bash
cd server
npx prisma migrate deploy
npm run seed:content
```

3. Start app:

```bash
npm run start:prod
```

## Safety check before deploy

From repo root:

```bash
npm run deploy:check
```

If this passes, the project is usually safe to upload.
