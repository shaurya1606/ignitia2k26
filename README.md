# Authentication-and-Authorization

This repository contains a Next.js application focused on authentication and authorization flows, UI and related backend API routes. It includes client pages and components for signup, login, password-reset flows and protected routes.

Summary
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Animations: GSAP / Framer Motion (where used)
- Purpose: Demonstration and implementation of authentication flows, protected routes, and UI components for an event-style site.

## Table of Contents
- Getting started
- Development
- Build & Production
- Environment variables
- Project structure
- Key components
- Contributing
- License

## Getting started

Prerequisites
- Node.js 18+ (or the version your monorepo requires)
- pnpm (recommended) — or npm / yarn

Install dependencies

```powershell
pnpm install
# or
npm install
```

Run development server

```powershell
pnpm dev
# or
npm run dev
```

Open http://localhost:3000 in your browser.

## Development

- Routes and pages live under `src/app/` (App Router).
- API endpoints are under `src/app/api/`.
- UI components live in `src/components/`.
- Utilities, db helpers and services are under `src/lib/` and `src/services/`.

Tip: Many pages use client components (`"use client"`) for animations and interactive UX.

## Build & Production

Build for production

```powershell
pnpm build
pnpm start
```

Deploy: This project can be deployed to Vercel, Netlify, or any Node-compatible host. If using Vercel, the app router is supported out of the box.

## Environment variables

Create a `.env.local` with the variables your app needs. Example variables used in this project (update names to match the actual code):

```
DATABASE_URL=postgres://user:pass@host:5432/dbname
NEXTAUTH_URL=https://your-site.com
NEXTAUTH_SECRET=some-secret
SMTP_URL=smtp://user:pass@smtp.example.com:587
STRIPE_SECRET_KEY=sk_live_...
TWILIO_SID=ACxxxx
TWILIO_TOKEN=xxxx
```

Only add secrets to `.env*` files and never commit them to source control.

## Project structure (high level)

Key folders under `src/`:

- `app/` — Next.js app routes and pages (App Router)
- `app/(auth)` — Authentication pages and flows (signup, login, password reset)
- `app/(protected)` — Layout and pages for protected routes
- `components/` — Reusable UI components (auth forms, landing, dashboard, ui primitives)
- `lib/` — Utilities, db connectors and helpers
- `services/` — Business logic (auth services, mail, token, user helpers)

Example files / entry points:
- `src/app/page.tsx` — Landing / home page
- `src/app/layout.tsx` — Global layout
- `src/app/api/auth/...` — NextAuth and API routes

## Key components and features

- Authentication flows: Sign up, verify email, login, reset password, new password
- Protected routes and server-side checks
- Preloader and page transition animations (GSAP / Tailwind utility classes)
- Lenis-based smooth scroll on some landing pages

## Troubleshooting & common commands

- Run linting (if configured): `pnpm lint`
- Run tests (if present): `pnpm test`
- Format code: `pnpm format` or via your editor setup

## Contributing

1. Fork the repo
2. Create a new branch: `feature/xyz`
3. Make changes and add tests
4. Open a pull request describing the change

Please follow the repository's code style and commit message guidelines.

## Where to find things

- Authentication pages: `src/app/(auth)`
- Page transition overlay component: `src/app/(routes)/_components/PageTransition.tsx` (controls tile animations)
- Landing scene & hero: `src/components/landing/*`

## License

This project does not include a license file. Add a `LICENSE` if you want to open-source it (MIT / Apache-2.0 are common choices).

---

If you want, I can:
- Add a `CONTRIBUTING.md` with PR and branch rules
- Add example `.env.local.example` with variable names used by the app
- Add automated scripts for lint/test/build in package.json

If you'd like me to write one of those now, tell me which and I'll add it.
