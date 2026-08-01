# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in the MTD Lingo Pro repository.

## Overview

MTD Lingo Pro is a comprehensive English learning platform from A1 to C2 levels, featuring learning paths, vocabulary database, interactive lessons, listening-speech-reading-writing-grammar practice, testing, and user management admin area.

### Technology Stack
- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS 4
- **Backend**: NestJS 11, Prisma 7, PostgreSQL, Redis
- **Testing**: Jest, Supertest, Node test runner, Oxlint
- **DevOps**: Docker, Docker Compose

## Development Commands

### Environment Setup
```bash
# Install dependencies (both frontend and backend)
npm install
cd server && npm install

# Setup environment files
cp .env.example .env
cp server/.env.example server/.env

# Start databases
docker compose up -d

# Database setup
cd server
npx prisma migrate deploy
npm run content:import  # Import learning content
```

### Development Server
```bash
# Start frontend (http://localhost:5173)
npm run dev

# Start backend in separate terminal (http://localhost:3001/api)
cd server
npm run start:dev
```

### Backend Specific Commands
```bash
# Content management
npm run content:check       # Format + typecheck + test + audit
npm run content:dry-run     # Simulate import without writing to DB
npm run content:import      # Upsert content via transaction
npm run content:verify      # Compare source with database
npm run content:stats       # Show content statistics

# Testing
npm test                    # Run all tests
npm test -- --runInBand     # Run tests sequentially
npm run test:e2e -- --runInBand  # Run E2E tests sequentially
```

### Frontend Specific Commands
```bash
# Build and preview
npm run build               # Build for production
npm run preview             # Preview production build
npm run lint                # Run linting with oxlint
```

### Deployment Preparation
```bash
# Prepare for deployment
npm run deploy:prepare      # Copy production env examples
npm run deploy:check        # Run pre-deployment checks (build + lint + backend build + test)
```

## Project Structure

### Root Level
- `package.json` - Root package with frontend dependencies and scripts
- `vite.config.ts` - Vite configuration for frontend
- `index.html` - Entry point HTML file
- `server/` - Backend NestJS application

### Frontend (`src/` directory)
- `src/` - Main source code
  - `app/` - Application root components
  - `assets/` - Static assets (images, icons, etc.)
  - `components/` - Reusable UI components
  - `features/` - Feature modules organized by feature (learning paths, vocabulary, etc.)
  - `features/practice/` - Practice features including TOEIC materials
  - `features/admin/` - Admin dashboard and management features
  - `features/auth/` - Authentication components (login, register, profile)
  - `features/dashboard/` - User dashboard with Daily Mix
  - `layouts/` - Page layouts
  - `router/` - React Router configuration
  - `services/` - API service layers
  - `store/` - State management (Zustand)
  - `hooks/` - Custom React hooks
  - `utils/` - Utility functions
  - `lib/` - Utility libraries and helpers
  - `types/` - TypeScript type definitions
  - `health/` - Health check endpoints
  - `mocks/` - Mock data for development/testing
  - `styles/` - Global styles and CSS utilities

### Backend (`server/` directory)
- `src/` - NestJS source code organized by feature modules
  - `auth/` - Authentication (JWT, bcrypt, refresh tokens)
  - `users/` - User management (profiles, roles)
  - `content/` - Learning content management (courses, lessons, vocabulary)
  - `admin/` - Administrative functions and dashboards
  - `practice/` - Exercise and quiz functionality
  - `dashboard/` - User progress tracking and analytics
- `prisma/` - Prisma ORM configuration
  - `schema.prisma` - Database schema with relations
  - `migrations/` - Database migration history
- `test/` - Test files organized by module
- Docker-related files for containerization

## Key Development Patterns

### Frontend
- **State Management**: Zustand store in `src/store/` for global state
- **API Communication**: Service layer in `src/services/` with axios instances
- **Routing**: File-based routing in `src/router/` with lazy loading
- **Components**: Reusable UI components in `src/components/` with Tailwind styling
- **Hooks**: Custom hooks in `src/hooks/` for encapsulating logic
- **Styling**: Tailwind CSS with custom configurations in `tailwind.config.js`

### Backend
- **Architecture**: Modular NestJS architecture with feature-based modules
- **Database**: Prisma ORM with PostgreSQL provider
- **Authentication**: JWT strategy with access/refresh tokens, bcrypt hashing
- **Validation**: DTO validation with class-validator and class-transformer
- **Error Handling**: Centralized exception filters and interceptors
- **Caching**: Redis integration for session storage and caching
- **Background Jobs**: Bull queues for email sending and processing

### Content Management
- Learning content stored in `server/prisma/content/` as JSON files
- Import workflow:
  1. `npm run content:dry-run` - Validate without DB changes
  2. `npm run content:import` - Actual import via transactions
  3. `npm run content:verify` - Verify import integrity
- Content structure: Courses > Lessons > Exercises/Vocabulary/Activities

## Environment Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_TELEGRAM_SUPPORT_URL=https://t.me/maituandung
```

### Backend (server/.env)
```
# Database
POSTGRES_URL=postgresql://user:password@localhost:5432/mtd_lingo?schema=public

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Security (use strong, different secrets in production)
JWT_ACCESS_SECRET=your_access_secret_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_here_different_from_access

# Email (for password reset)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
EMAIL_FROM=noreply@mtdlingo.pro

# Telegram Bot (for notifications)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Security
FRONTEND_URL=http://localhost:5173
PASSWORD_RESET_EXPOSE_TOKEN=false
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# CORS (comma-separated for production)
ALLOWED_ORIGINS=http://localhost:5173
```

## Code Quality Standards

### Formatting & Linting
- **Frontend**: Oxlint (`npm run lint`) + Prettier (via VSCode/settings)
- **Backend**: Prettier (`npm run format`) + ESLint
- **TypeScript**: Strict mode enabled in both frontend and backend

### Testing Practices
- Unit tests co-located with implementation files (`*.spec.ts`)
- E2E tests for critical user flows in `test/` directory
- Mock external services in tests (email, payment gateways)
- Aim for >80% coverage on critical paths

### Git Practices
- Feature branches off `main`: `feature/feature-name`
- Conventional commit messages: `feat: add user profile page`
- Pull requests require review before merging
- `.gitignore` excludes node_modules, dist, build, env files

## Common Tasks

### Adding a New Feature
1. Create feature branch: `git checkout -b feature/awesome-feature`
2. Backend:
   - Generate module: `nest g module feature-name` (in server/)
   - Generate service/controller: `nest g service feature-name` / `nest g controller feature-name`
   - Update Prisma schema if needed and run migrations
   - Add DTOs, validation, and error handling
3. Frontend:
   - Create feature folder in `src/features/`
   - Add components, hooks, services as needed
   - Add routes in `src/router/` if page-based
   - Add state management if global state needed
4. Update types in `src/types/` or backend DTOs as needed
5. Write tests for new functionality
6. Test end-to-end: frontend -> backend -> database
7. Submit PR with description and screenshots if UI changes

### Database Changes
1. Modify `server/prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev --name describe_change`
3. Apply to production: `npx prisma migrate deploy`
4. Update Prisma client: `npx prisma generate`
5. Update relevant service methods to use new fields

### Content Updates
1. Edit JSON files in `server/prisma/content/`
2. Validate changes: `npm run content:dry-run`
3. Import changes: `npm run content:import`
4. Verify integrity: `npm run content:verify`
5. Commit both content changes and any resulting DB migrations

## Debugging Tips

### Frontend
- Use React DevTools for component inspection
- Check network tab for API requests/responses
- Review console for warnings/errors
- Use Redux DevTools extension if Zustand devtools enabled
- Validate responsive design with device toolbar

### Backend
- NestJS built-in logger with different levels
- Enable query logging in development: `{ log: ['query', 'error', 'warn'] }` in main.ts
- Use Postman or similar for API testing
- Check database directly with Prisma Studio: `npx prisma studio`
- Review NestJS exception logs for stack traces

### Database
- Monitor connection pools in production
- Use EXPLAIN ANALYZE for slow queries
- Backup before major migrations
- Check Redis memory usage and hit rates

## Important Notes

### Security
- Never commit `.env` files or credentials
- Use environment variables for all secrets
- Validate and sanitize all user inputs
- Implement rate limiting on public endpoints
- Use HTTPS in production with proper SSL certificates

### Performance
- Enable React.memo for expensive components
- Implement virtual scrolling for large lists
- Use React.lazy and Suspense for code splitting
- Optimize database queries with proper indexing
- Utilize Redis caching for frequently accessed data
- Compress assets and enable browser caching

### Internationalization
- Current implementation supports Vietnamese UI with English content
- Text strings should be externalized for future i18n
- Date/number formatting should respect locale settings
- Right-to-left language support not currently implemented

### Testing Credentials
Run the development seed and use the test account declared in
`server/prisma/seed.ts`. Never reuse that account or its password in production,
and rotate any credentials that have been exposed.
