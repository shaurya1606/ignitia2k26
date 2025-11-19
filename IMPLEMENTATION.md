# Ignitia — Implementation README

This document summarizes the architecture and implementation details for the Ignitia repository. It assumes you're familiar with Next.js 13+ app directory, TypeScript, and basic auth concepts.

---

## Project Overview

This repository builds an authentication-first Next.js app with a ninja-themed UI. Core features:
- Authentication: sign up, login (credentials + OAuth), email verification, password reset, two-factor auth.
- NextAuth for session management with Drizzle adapter (Postgres/Neon DB schema).
- Drizzle ORM for database access and migrations.
- Mail sending through Resend (resend API).
- UI primitives using Tailwind + Radix components.
- Frontend animations with GSAP and Framer Motion.
- A small preloader and page transition utilities.

---

## Quick Start

Requirements:
- Node 20+ (recommended). Use `pnpm` or `npm`.
- A Postgres / Neon-compatible DB available (DATABASE_URL).
- Resend API key if you want to send emails.

Local dev:

1. Install dependencies

```bash
pnpm install
# or npm install
```

2. Create required environment variables (.env):

- DATABASE_URL="postgresql://..." (Neon or Postgres)
- NEXTAUTH_URL="http://localhost:3000"
- NEXTAUTH_SECRET="A_STRONG_SECRET"
- RESEND_API_KEY="resend_api_key"
- NEXT_PUBLIC_APP_URL (optional, default http://localhost:3000)
- GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
- LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET

Example: .env.local

```
DATABASE_URL=postgres://user:pass@localhost:5432/ignitia
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
RESEND_API_KEY=<resend-api-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
```

3. Database setup & migrations (Drizzle):

```bash
pnpm run drizzle:generate # optional: generates typed queries
pnpm run drizzle:migrate  # run migrations
```

4. Start dev server

```bash
pnpm dev
```

Then open http://localhost:3000.

---

## Key Implementation Details

### Authentication

- NextAuth configured in `src/auth.ts`. Providers: GitHub, Google, LinkedIn (OAuth), and a Credentials provider (email/password).
- The Drizzle adapter is used for NextAuth: it stores users and accounts in Postgres. See `src/lib/dbconfig/schema.ts` for schema details (users, accounts, tokens, 2fa).
- `src/auth.config.ts` includes the credentials authorize flow (bcrypt password check).
- `src/app/api/auth` contains routes for signup, login, reset-password, verify-email and ties server logic into the service layer (`services/authServices`).
- 2FA flow uses tokens stored with expiry and emails sent via `Resend`.

#### Important endpoints
- `POST /api/auth/signup` — create user and optionally send verification.
- `POST /api/auth/login` — login via credentials, supports 2FA.
- `POST /api/auth/reset-password` — send reset token to email.
- `GET /verify-email?token=...` — verify email.
- `POST /api/auth/[...nextauth]` — NextAuth handler.

### Mailer

- Mail templates in `src/lib/mail/*.tsx`.
- Sending emails via Resend (`src/services/authServices/mail.ts`); uses `RESEND_API_KEY`.
- The templates provide both HTML and text versions.

### Database

- Using Drizzle (Postgres). The schema is in `src/lib/dbconfig/schema.ts`.
- Migrations are under `drizzle/*` and `drizzle/meta`.
- Use `drizzle-kit` npm scripts to run migrations.

### UI & Layout

- App layout lives in `src/app/layout.tsx`. The root is wrapped in `src/app/AppShell.tsx` (client component) which mounts the minimal preloader.
- Landing / route-specific layouts are under `src/app/(routes)` and `(auth)`, `(protected)`.
- The preloader (`src/components/landing/MinimalPreloader.tsx`) is shown on initial load by `AppShell` and can be used per-page where needed (example `src/app/page.tsx` uses a simulated delay).
- Common UI primitives are in `src/components/ui`: `button`, `dialog`, `input`, `label`, etc.; these follow accessible patterns using Radix and Tailwind.

### Page transitions & Navbar

- Previously, a blade overlay transition (`src/app/(routes)/_components/PageTransition.tsx`) caused a center line effect; it was removed or simplified as it interfered with UX.
- `src/app/(routes)/layout.tsx` includes a persistent `Navbar` so it remains mounted across client-side navigation, avoiding flashes and blank areas.

---

## Extending & Customizing

- Auth:
  - Add or remove providers in `src/auth.config.ts`.
  - The Credentials provider uses `LoginFormSchema` in `src/lib/schema/authSchema.ts` for input validation.
  - Two-Factor auth logic can be found in `src/auth.ts` and `src/services/authServices`.

- Mailers:
  - Use `src/lib/mail/*` templates to update content and `src/services/authServices/mail.ts` to change transport or provider.

- Database:
  - Add tables in `src/lib/dbconfig/schema.ts` and add migrations using Drizzle.
  - All queries live under `src/lib/queries/*` and are intentionally modular.

- UI:
  - `src/components/ui` contains common components used throughout the app. Styling uses Tailwind and class variance authority patterns.
  - `src/components/auth/*` includes the auth forms and mix-ins for server-side / client-side logic.

---

## Developer Tips

- Use `pnpm run lint` and `pnpm run typecheck` before committing.
- For email templates, build and test using Resend sandbox/API keys; set `RESEND_API_KEY` in .env.
- When debugging auth flows, use the NextAuth events and `console.log` statements in `src/auth.ts` for insightful logs.

---

## Troubleshooting

- Blank transitions on route change: ensure `Navbar` is persistent in the `(routes)` layout; server-heavy pages might still cause perceived flashes.
- Database connection errors: verify `DATABASE_URL` and that the `pg` engine used in `drizzle.config.ts` matches your DB.
- Email not sending: check `RESEND_API_KEY` and the `from`/`to` addresses; also check the Resend dashboard for usage.

---

If you'd like, I can add example `.env.local` or a small migration script to seed an admin user. Want that included?