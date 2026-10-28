# IntentTech — Approach & Conventions

> Human-readable record of the decisions behind this monorepo: what we built,
> why we built it that way, and where the seams are for future work.

## 1. The big picture

The take-home asks for three things that look separate but are really one system:

1. **API** — CRUD for a user record spanning 4 database tables (NestJS 11 + Postgres, Drizzle ORM).
2. **Web app** — a multi-step public form (wizard) plus user management (Next.js 15 App Router + shadcn/ui + RTK + Tailwind CSS 4).
3. **Admin dashboard** — view all submissions, export each as PDF and DOCX.

So the architecture makes the **backend the single source of truth** with one
atomic nested-write contract, and both the public wizard and the admin UI
consume it. No per-step APIs, no separate admin APIs.

The twist in the final draft: **data collection is public, everything admin is
protected**. That split shapes the whole design (see §3).

## 2. Monorepo layout

```
/api                  NestJS 11 + Drizzle 0.36 + Postgres 16 (Task 1 + auth) — :8080
/web                  Next.js 15 App Router + shadcn/ui + RTK + Tailwind CSS 4 (Tasks 2 + 3) — :3000
/packages/contracts   Shared TypeScript types & enums — the only cross-cutting piece
docker-compose.yml    Postgres + API + Web for one-command local run
```

**Tooling:** `pnpm` workspaces, `Turbo` pipelines (`build` first runs contracts,
then api/web), TypeScript project references, `drizzle-kit` for migrations.

**Why a monorepo?** The API and the web app must agree on request/response
shapes, enums (gender, role), and pagination envelopes. A shared `contracts`
package makes that agreement compile-time instead of handshake-time.

**Why `contracts` holds types + enums only (v1)?** Full runtime-validator
sharing (e.g. zod as the single source, with a `ZodValidationPipe` in Nest)
is the right v2, but it couples Nest's validation/filter story to frontend
form libraries. For v1: backend validates with `class-validator` DTOs that
`implement` the contract interfaces; frontend validates with `zod` schemas
typed against the same interfaces. Same rules, written twice, checked by the
compiler on both sides.

## 3. The public/protected split

There are two kinds of "user" in this system — never conflate them:

| Concept | Table | What it is |
|---|---|---|
| **Account** (logs in) | `auth_users` | Admin/staff/viewer who operate the system. Has email + password hash + role. |
| **Profile** (the resume record) | `user_infos` + children | The CRUD subject. Has **no** password, cannot log in. |

Never put `password_hash` on `user_infos`. Never assign roles to profiles.

**Endpoint access matrix** (`/api/v1`):

| Endpoint | Access | Why |
|---|---|---|
| `POST /users` | **PUBLIC** | The sole data-collection endpoint (wizard submit). |
| `GET /users`, `GET /users/:id` | `ADMIN, EDITOR, VIEWER` | Admin list + resume view + edit prefill + export source. |
| `PATCH /users/:id` | `ADMIN, EDITOR` | Admin correction flow. |
| `DELETE /users/:id` | `ADMIN` only | Destructive; highest privilege. |
| `POST /auth/login|refresh|logout`, `GET /auth/me` | public / auth'd | Session for admin. |
| `POST /auth/register` | `ADMIN` only | Invite-only accounts (see bootstrap below). |

**Key consequence: there is no public read.** The wizard's resume-preview steps
and success receipt render from **local form state + the `POST` response**,
never from `GET /:id`. This prevents public enumeration of submissions by
guessing IDs.

**Frontend routes mirror this:**

| Route | Access |
|---|---|
| `/apply` | PUBLIC — the wizard (steps 1–4 + resume preview + submit) |
| `/login` | PUBLIC |
| `/profiles`, `/profiles/:id` | Protected, all roles |
| `/profiles/:id/edit`, `/admin` | Protected, `ADMIN` + `EDITOR` |
| `/accounts` | Protected, `ADMIN` only |

The `(protected)` layout (needs session) plus per-page `<RequireRole>`
(needs role) mirror the backend matrix. Route groups: `(public)` for
`/apply`, `(auth)` for `/login`, `(protected)` for everything else. The
role-hidden nav and route gates are **UX only — the backend guards enforce**.
This is stated in code comments so nobody mistakes client gating for security.

## 4. Data model

No 5th `users` table — `user_infos` **is** the aggregate root, and the three
child tables are owned by it (`ON DELETE CASCADE` at the DB level, so a deleted
user can never leave orphans even if app code forgets).

| Table | Cardinality | Notes |
|---|---|---|
| `user_infos` | root | first/last name, DOB, occupation, gender enum, photo URL, timestamps |
| `user_contacts` | `1:1` | `user_id UNIQUE FK`, email `CITEXT UNIQUE`, phone, fax?, linkedinUrl? |
| `user_addresses` | `1:1` | `user_id UNIQUE FK`, addressLine, city, state, country, zipCode |
| `user_academics` | `1:N` | `user_id FK`, schoolName required; degree/field/dates/description optional; `sortOrder` |
| `auth_users` | standalone | email `CITEXT UNIQUE`, password hash (bcrypt-12), role enum, isActive |

**Notable choices:**

- **`CITEXT` for emails** — case-insensitive uniqueness at the DB level, so
  `Ada@x.com` and `ada@x.com` can't both register (no app-level race). Applied
  in the migration; Drizzle declares the column as `text()`.
- **Dates as ISO strings in app code, guarded by `CHECK`s** — DOB must be
  `<= CURRENT_DATE`, `endDate >= startDate`. Belt and suspenders: DTOs +
  service assertions + DB constraints.
- **`sortOrder` on academics** — preserves the wizard's list order through
  full-replace updates (see §5).
- **Academic sub-fields are our minimal guess** — the spec only says "list of
  all past schools." `schoolName` is the only required field; the rest is what
  a resume template needs. Confirm with the evaluator.

## 5. Write semantics

- **Atomicity:** every write runs inside one `db.transaction()`. Create inserts
  `user_infos`, then contact/address/academics with the new id. Update upserts
  the 1:1 rows and reconciles academics. **All-or-nothing** — never a user
  without contact/address because a later step failed. Duplicate email → `409`.
- **Academics `PATCH` = full replace.** If the `academics` key is present,
  delete-all + re-insert in submitted order; if absent, leave untouched. This
  matches the wizard ("submit the whole reviewed list") and needs no
  client-generated IDs. Id-keyed upsert (`{id?} + deletedIds[]`) is the
  documented v2 — not built now.
- **Photo is a URL string in v1.** Real upload
  (`POST /users/:id/photo`, multipart, 5 MB, image MIME allowlist → returns URL
  → `PATCH` with it) is admin-only and deferred until storage is decided.
- **Pagination:** `GET /users?page&limit&search&sort`, defaults `page=1,
  limit=20, max 100`. `search` matches first/last name + email via `ILIKE`.
  The list returns `academicsCount`, never full academic arrays.
- **Exports = Option A (client-side).** PDF (`jspdf`) + DOCX (`docx`) generate
  from the `GET /:id` payload in the browser — zero backend work. Backend
  `GET /:id/export?format=` is the fallback if pixel-identical server rendering
  is required. Pick one, not both.

## 6. Auth & RBAC (minimal but real)

- JWT access (short TTL) + refresh pair. Backend: global `JwtAuthGuard` with
  `@Public()` opt-out, then `RolesGuard` reading `@Roles(...)` metadata.
- Passwords: bcrypt cost 12, never selected into a response.
- **Bootstrap problem:** `register` is ADMIN-only, so the first admin comes
  from `pnpm db:seed` (env-provided email/password). Disable after first login.
- Hardening in v1: `helmet`, CORS allowlist, throttling (stricter on login +
  public submit), 1 MB body cap, max 20 academics.
- Known gap (documented in code): logout is client-side token discard; a
  refresh-token revocation list is v2.

## 7. Frontend organization (by feature)

```
web/src/
  app/
    layout.tsx, providers.tsx, store.ts, apiClient.ts   app shell, Redux provider, token attach + 401 → logout
    page.tsx                                            public landing (links to /apply, /login)
    (public)/apply/page.tsx                             PUBLIC wizard host (step 0–4 + review)
    (auth)/login/page.tsx                               PUBLIC login
    (protected)/layout.tsx                              session gate + role-aware nav
    (protected)/profiles/...                           PROTECTED list / detail / edit
    (protected)/admin/page.tsx                          ADMIN + EDITOR dashboard
    (protected)/accounts/page.tsx                        ADMIN-only accounts
    403/page.tsx                                        insufficient-role page
  components/
    resume-view.tsx                                     shared presentational resume template (server-safe)
    ui/                    shadcn primitives: button (asChild via Radix Slot), card,
                           input, label, textarea, select (styled native), table, badge
  lib/
    seo.ts                 createMetadata() — page title + OG/Twitter tags abstraction
    utils.ts               shadcn `cn()` helper
  features/
    apply/                 PUBLIC wizard state: schemas (zod), applySlice (RTK),
                           steps/step-info|contact|address|academics, review-submit
    auth/                  session slice, hooks, require-role (UX-only gate)
    admin/                 exporters (PDF/DOCX) — consumed by protected pages
```

**Server vs client components:** every `page.tsx` is a server component that
exports `metadata = createMetadata({ title, description? })` and renders a
`*-client.tsx` island only where interactivity is unavoidable (wizard steps,
login form, data-fetching admin tables, role gates). `resume-view.tsx` stays
server-safe so it can be used in both server and client trees.

**Next.js + shadcn notes:** file-based routing replaces react-router
(`(public)`/`(auth)`/`(protected)` groups keep URLs unchanged: `/apply`,
`/login`, `/profiles`, `/admin`, `/accounts`, `/403`). shadcn primitives are
vendored (not CLI-fetched) in the new-york/neutral style on Tailwind v4
CSS-first tokens (`globals.css`, `@theme inline`); `Select` is a styled
native element so no Radix Select dependency is needed. `Button asChild` uses
`@radix-ui/react-slot`.

**Dependency versions:** all direct deps use `^` ranges floored at the latest
major/minor line verified at migration time (Next 15, React 19, Tailwind 4,
RTK 2.5, RHF 7.54, zod 3.24, Nest 11, Drizzle 0.36), so fresh installs float
to the newest compatible release without crossing a breaking major.
Exceptions: `bcrypt` stays on v5 (stable prebuilds for this toolchain) and
`class-validator`/`class-transformer` stay on 0.x (the line Nest's
`ValidationPipe` targets).

## 8. Conventions

- **Naming:** tables `snake_case` plural, columns `snake_case`; TS/DTOs
  `camelCase`; files `kebab/PascalCase` matching Nest/React norms.
- **API prefix** `/api/v1`; errors as `{ statusCode, message, error }`.
- **Validation order:** client (zod, fast feedback) → DTOs (class-validator,
  trust boundary) → service assertions → DB constraints.
- **Commits/PRs** end with the standard Claude co-author/trailer lines.
- **What we don't save in memory:** anything derivable from code, git history,
  or this file.

## 9. Open questions (confirm before hardening)

1. Academic sub-fields, gender enum values, phone/fax rules, country/zip strictness, DOB/min-age rule.
2. Photo: URL string vs real upload + storage target?
3. One address per user — confirmed, or multiple?
4. Token transport: bearer JSON (take-home) vs httpOnly cookies (production)?
5. May VIEWERs export? Password policy + lockout? Audit trail (`updated_by` FK)?
