# PerformIQ — Documentation Index

**Status:** **Demo-ready** · Ignitia 2K26 hackathon submission

PerformIQ is an enterprise performance lifecycle platform (UI branding). Internal code and APIs use the `atomquest` module prefix (`/api/atomquest/*`, `/admin/atomquest`).

## Purpose

Central documentation for engineering review, hackathon judging, and portfolio use. All content is derived from the repository—no speculative features.

## Document map

| Document | Purpose |
|----------|---------|
| [IMPLEMENTATION.md](./IMPLEMENTATION.md) | Master implementation reference (modules, lifecycles, inventories) |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System flows: auth, RBAC, goal/check-in lifecycles |
| [FEATURES.md](./FEATURES.md) | Feature catalog with status labels |
| [FEATURE_MATRIX.md](./FEATURE_MATRIX.md) | BRD traceability matrix (status × demo × BRD) |
| [API.md](./API.md) | HTTP API reference (handlers, roles, payloads) |
| [DATABASE.md](./DATABASE.md) | Drizzle schema, tables, relationships |
| [AUTH_RBAC.md](./AUTH_RBAC.md) | NextAuth, middleware, role matrix |
| [UI_UX.md](./UI_UX.md) | Pages, components, design tokens |
| [DEMO_FLOW.md](./DEMO_FLOW.md) | Judge/demo walkthrough and credentials |
| [SETUP.md](./SETUP.md) | Local development setup |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production build and verification |
| [TESTING.md](./TESTING.md) | Test strategy and current gaps |
| [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md) | Constraints and demo risks |
| [ROADMAP.md](./ROADMAP.md) | Planned / deferred work (not implemented) |
| [CHANGELOG.md](./CHANGELOG.md) | Documentation and release notes |

## Tech stack (repository)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, Radix-based `components/ui` |
| Auth | NextAuth 5.0.0-beta.30 (JWT) |
| ORM | Drizzle 0.45.x |
| Database | PostgreSQL (Neon serverless driver) |
| Charts | Recharts 3.x |
| Email | Resend (optional) |

## Quick start

```bash
pnpm install
cp .example.env .env.local   # set DATABASE_URL, AUTH_SECRET
pnpm drizzle:push
pnpm seed:atomquest
pnpm dev
```

Demo password: `AtomQuest@123` (see [DEMO_FLOW.md](./DEMO_FLOW.md)).

## Status legend

| Label | Meaning |
|-------|---------|
| **Implemented** | Works end-to-end in codebase |
| **Demo-ready** | Implemented; tuned for hackathon demo/seed |
| **Partial** | Incomplete or env-dependent |
| **Deferred** | Schema or stub only; no runtime feature |
| **Planned** | Roadmap only |

## Related files (repository root)

Legacy copies may exist at repo root (`README.md`, `ARCHITECTURE.md`, `JUDGE_WALKTHROUGH.md`). **`/docs` is the maintained documentation set.**
