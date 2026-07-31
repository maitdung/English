# MTD Lingo Pro — Database & Deployment Plan

Last updated: 2026-07-31

## 1. Current project status

Frontend:

- React + Vite.
- Build command: `npm run build`.
- Output directory: `dist`.
- Production API env: `VITE_API_URL=https://your-api-domain/api`.

Backend:

- NestJS API.
- PostgreSQL via Prisma.
- Redis available locally via Docker Compose.
- API prefix: `/api`.
- Health endpoint: `/api/health`.
- Swagger endpoint: `/api/docs`.

Current database models:

- `User`
- `Course`
- `Unit`
- `Lesson`
- `Vocabulary`
- `Exercise`

Current content seed:

- A1 → C2 course content.
- Lessons, vocabulary, and exercises are imported through `server/prisma/content`.

## 2. Database gaps before real production

The current schema is good for content and authentication, but not yet complete for a full learning product.

Priority tables to add next:

### Learning progress

- `Enrollment`
  - user joins a course
  - course progress percentage
  - started/completed timestamps
- `LessonProgress`
  - per-user, per-lesson progress
  - status: not started / in progress / completed
  - time spent
  - best score
- `ExerciseAttempt`
  - answer submitted
  - correct/incorrect
  - score
  - attempt count
  - submittedAt
- `DailyLearningActivity`
  - daily minutes
  - completed lessons/exercises
  - streak support
- `VocabularyReview`
  - spaced repetition state
  - due date
  - ease factor
  - attempts/correct attempts

### Admin / operations

- `AdminSetting`
  - frontend URL
  - API URL
  - maintenance mode
  - deploy notes
  - feature flags
- `AuditLog`
  - admin changed role/status/deleted user
  - actorId
  - targetId
  - action
  - metadata
  - createdAt
- `Notification`
  - in-app announcements
  - system messages
  - admin broadcast

### Security / account completeness

- Email verification token table or fields.
- Login attempt tracking.
- Optional 2FA table later.
- Password reset already exists.

## 3. Recommended production architecture

Recommended low-cost/free-friendly architecture:

```txt
User browser
  ↓
Cloudflare Pages
  - hosts React/Vite frontend
  - free pages.dev subdomain
  - optional custom domain
  ↓
NestJS backend hosting
  - Render / Railway / Fly.io / VPS / Cloudflare container later
  - exposes https://api.your-domain.com/api
  ↓
Managed PostgreSQL
  - Neon / Supabase / Railway Postgres / Render Postgres
  ↓
Redis
  - Upstash Redis / Railway Redis
  - optional at first if queues are not used in production
```

Important: Cloudflare Pages is perfect for the frontend, but the current NestJS backend is a Node server. It should be deployed separately unless we later convert backend routes to Cloudflare Workers-compatible code.

## 4. Cloudflare Pages settings for frontend

Use GitHub integration.

Suggested settings:

- Repository: `maitdung/English`
- Branch: `develop` or production branch later
- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/` if deploying from repo root

Environment variables:

```env
VITE_API_URL=https://your-backend-domain/api
```

Cloudflare provides a free `*.pages.dev` project URL. A custom domain can also be attached. If using an apex/root custom domain, the domain should be added as a Cloudflare zone. If using only a subdomain, a CNAME can point to the Pages site.

## 5. Backend production checklist

Required environment variables:

```env
NODE_ENV=production
PORT=3001
API_PREFIX=api
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=long-random-production-secret
JWT_ACCESS_TTL_SECONDS=900
JWT_REFRESH_SECRET=another-long-random-production-secret
JWT_REFRESH_TTL_SECONDS=604800
PASSWORD_RESET_TTL_MINUTES=30
PASSWORD_RESET_EXPOSE_TOKEN=false
FRONTEND_URL=https://your-cloudflare-pages-url.pages.dev,https://your-custom-domain.com
```

Production commands:

```bash
cd server
npm ci
npm run build
npm run seed:content
npm run start:prod
```

Before running `seed:content`, production database must be migrated:

```bash
cd server
npx prisma migrate deploy
npm run seed:content
```

## 6. Recommended next implementation order

1. Add production-ready progress database:
   - Enrollment
   - LessonProgress
   - ExerciseAttempt
   - DailyLearningActivity
   - VocabularyReview

2. Add backend APIs:
   - enroll course
   - save lesson progress
   - submit exercise attempt
   - get user progress dashboard
   - get daily activity/streak

3. Connect frontend pages to real database progress:
   - dashboard stats
   - course detail progress
   - lesson completion
   - quiz score history
   - vocabulary review queue

4. Add admin operations:
   - admin settings persisted in DB
   - audit log
   - basic content visibility/status controls

5. Prepare deploy:
   - production `.env.example`
   - deployment checklist
   - Cloudflare Pages frontend
   - backend host
   - managed Postgres
   - CORS/domain verification

## 7. Free domain reality check

Cloudflare Pages gives a free `*.pages.dev` subdomain.

For a personal custom domain like `yourname.com`, the domain itself usually must be purchased from a registrar. Cloudflare can manage DNS and provide SSL/CDN on the free plan, but Cloudflare does not generally give a free custom root domain.

Practical free setup:

- Frontend: `mtd-lingo-pro.pages.dev`
- Backend: free backend-host URL, for example `mtd-lingo-api.onrender.com`
- Later custom domain:
  - `mtdlingo.com`
  - `www.mtdlingo.com` → Cloudflare Pages
  - `api.mtdlingo.com` → backend host

