# Documentation prompts

## Purpose

Optional prompts for AI-assisted documentation maintenance.

## Current state

**Planned** — no automated prompt runner in CI.

## Usage

When updating PerformIQ docs:

1. Scan `src/app`, `src/app/api`, `src/lib/dbconfig`, `src/proxy.ts`, `package.json`, `scripts/seed-atomquest.mjs`.
2. Update `/docs` only — do not change application code.
3. Mark status: Implemented | Partial | Demo-ready | Deferred | Planned.
4. Keep PerformIQ (UI) vs `atomquest` (internal routes) distinction accurate.

See parent [README.md](../README.md).
