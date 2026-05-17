# PerformIQ

**PerformIQ** · Enterprise-style goal setting, manager approval, and quarterly check-ins.

## Problem

Organizations struggle to align annual goals, manager approvals, and quarterly progress in one auditable system. Spreadsheets and email chains break down at scale.

## Solution

**PerformIQ** is a role-based web portal where employees draft and submit goal sheets, managers review and lock approvals, and admins govern cycles, shared KPIs, compliance exports, and audit trails.

## Architecture (high level)

```
Browser (Next.js App Router)
    → proxy.ts (NextAuth + RBAC + AtomQuest route guards)
    → API routes (/api/atomquest/*)
    → Drizzle ORM → PostgreSQL (Neon)
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for flows.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, Radix UI |
| Auth | NextAuth v5 (Credentials + OAuth), JWT sessions |
| Database | PostgreSQL (Neon), Drizzle ORM |
| Charts | Recharts |
| Email | Resend (optional; console fallback) |

## RBAC model

| Role | Routes | Capabilities |
|------|--------|--------------|
| **Employee** | `/goals`, `/settings` | Own goal sheet, submit, quarterly check-in |
| **Manager** | `/goals`, `/team`, `/settings` | Direct reports list, review, approve/return, check-in comments |
| **Admin** | `/goals`, `/team`, `/admin/atomquest`, `/settings` | Org-wide team view, stats, charts, export, audit, shared KPIs |

Post-login entry: `/dashboard` → auto-redirects to role home.

## Major features

- Annual goal sheet (draft → submit → return → lock)
- Manager review with inline edits
- Quarterly check-ins with UOM-aware inputs and progress scoring
- Active-quarter locking (only current quarter editable)
- Shared KPI assignment (admin → employees)
- Admin dashboard with charts and CSV export
- Audit trail with before/after diffs
- Best-effort email notifications

## Screenshots

<!-- Add before submission -->
| Page | File |
|------|------|
| Landing | `docs/screenshots/landing.png` |
| Employee goals | `docs/screenshots/goals.png` |
| Manager team | `docs/screenshots/team.png` |
| Admin overview | `docs/screenshots/admin-overview.png` |
| Audit trail | `docs/screenshots/admin-audit.png` |

## Setup

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database (Neon recommended)

### Install

```bash
pnpm install
cp .example.env .env.local
# Edit .env.local — set DATABASE_URL and AUTH_SECRET
```

### Database

```bash
pnpm drizzle:push
pnpm seed:atomquest
```

### Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
pnpm build
pnpm start
```

## Demo accounts

**Password for all:** `AtomQuest@123`

| Role | Email | Seeded state |
|------|-------|--------------|
| Admin | `admin@atomquest.demo` | Full admin access |
| Manager | `manager@atomquest.demo` | Team of 5 employees |
| Employee (live demo) | `employee@atomquest.demo` | **DRAFT** — create & submit live |
| Employee | `priya.sharma@atomquest.demo` | **SUBMITTED** — pending review |
| Employee | `arjun.mehta@atomquest.demo` | **LOCKED** + check-in + shared KPI owner |
| Employee | `sam.okonkwo@atomquest.demo` | **LOCKED** + completed check-in |
| Employee | `jordan.lee@atomquest.demo` | **RETURNED** |

Login page includes one-click demo account fill.

## Hackathon highlights

- Production-shaped auth (JWT, middleware RBAC, role in session)
- Full goal lifecycle without spreadsheet chaos
- Fiscal-year cycle awareness
- Admin governance (audit, export, shared goals)
- Judge-ready seeded data for charts and dashboards
- Minimal scope — no over-engineered workflow engine

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm seed:atomquest` | Demo data seed |
| `pnpm typecheck` | TypeScript check |

## Documentation

- [JUDGE_WALKTHROUGH.md](./JUDGE_WALKTHROUGH.md) — 5–8 minute demo script
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Technical flows
- [FEATURE_MATRIX.md](./FEATURE_MATRIX.md) — Feature vs BRD mapping


