# PerformIQ — Judge Walkthrough (5–8 minutes)

**Password (all accounts):** `AtomQuest@123`  
**URL:** `http://localhost:3000` or your deployed URL

Use the **demo account buttons** on the login page for one-click fill.

---

## 0:00 — Opening (30 sec)

**Say:** “PerformIQ is an enterprise goal-setting portal — employees define annual goals, managers approve, and the organization tracks quarterly achievement with audit and admin controls.”

**Show:** Landing page → **Sign in** → point at demo account panel.

---

## 0:30 — Employee flow (2 min)

1. Click **Employee** demo card → **Log In**
2. Redirects to **Goals** (via `/dashboard` → `/goals`)
3. **Goal sheet** tab:
   - Show draft goals (Alex Rivera) — weightage bar toward 100%
   - Edit a target or weight → **Save draft** → success toast
   - **Submit for approval** → status becomes Submitted
4. **Talking point:** “Validation enforces 100% weightage and max 8 goals server-side.”

**Optional if time:** Log in as manager first to approve Alex, then return as Alex for check-in.

5. After manager approves (step below), **Quarterly check-in** tab:
   - Note **Active quarter** badge (e.g. Q2)
   - Other quarters are view-only
   - Enter numeric actual → **Save Q* check-in** → progress bar

**Expected:** Sheet status badge, toasts, locked quarters explained.

---

## 2:30 — Manager flow (2 min)

1. **Sign out** → login as **Manager** (`manager@atomquest.demo`)
2. Lands on **Team** (`/team`)
3. **Direct reports** table — mixed statuses (Submitted, Approved, etc.)
4. Click **Review** on **Priya Sharma** (Submitted)
5. **Goal review** — edit a target or weightage → **Save review edits**
6. **Approve & lock** → success toast
7. **Manager check-in comment** — select quarter tab → enter comment → **Save comment**

**Talking point:** “Managers can save edits without approving, or return with feedback.”

**Optional:** Open **Jordan Lee** (Returned) to show return feedback banner.

**Expected:** Priya moves to Approved/Locked on team list.

---

## 4:30 — Admin flow (2 min)

1. **Sign out** → **Admin** (`admin@atomquest.demo`)
2. Lands on **Admin** (`/admin/atomquest`)
3. **Overview** tab:
   - Stat cards (employees, submitted, approved, quarter check-in %)
   - **Charts** — submission progress, achievement mix, manager completion
   - **Employee completion** table
   - **Export CSV** → file downloads
4. **Audit trail** tab — show timestamp, actor, action, diff lines
5. **Shared goals** tab — explain assign form (already seeded: company-wide cost reduction)

**Talking point:** “Admins get governance without touching employee drafts.”

---

## 6:30 — RBAC & settings (30 sec)

1. **Settings** — portal role badge (Employee / Manager / Admin), read-only
2. **Navbar** — role-appropriate links only

---

## 7:00 — Close (30 sec)

**Say:** “We kept scope hackathon-tight: real auth, real Postgres, full lifecycle — no fake mockups. Email notifications log to console without Resend; production adds `RESEND_API_KEY`.”

---

## Role transition cheat sheet

| From | To | Action |
|------|-----|--------|
| Any | Login | Sign out (navbar) |
| Login | Employee | Demo card → Log In → `/goals` |
| Login | Manager | Demo card → Log In → `/team` |
| Login | Admin | Demo card → Log In → `/admin/atomquest` |

---

## If something fails

| Issue | Fallback |
|-------|----------|
| Empty admin charts | Run `pnpm seed:atomquest` |
| Check-in disabled | Manager must approve sheet first (status LOCKED) |
| Team empty | Confirm `pnpm seed:atomquest` and manager has direct reports |
| 403 on team | Re-login (session role) |

---

## Best live-demo path (minimal)

1. **Employee** — submit goals (30 sec)
2. **Manager** — approve Priya OR approve Alex (30 sec)
3. **Admin** — overview + audit + export (90 sec)

Total: ~3 minutes core + Q&A.
