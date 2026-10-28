# IntentTech

Monorepo: public profile-submission wizard + protected admin (NestJS/Drizzle API, Next.js + shadcn web, shared contracts).

See [ARCHITECTURE.md](./ARCHITECTURE.md) for approach and conventions.

## Prerequisites

- Node ≥ 20, `pnpm@9`, Postgres 16 (or Docker)

## Quickstart (local)

```bash
pnpm install

# 1. Start Postgres (or: docker compose up postgres)
# 2. Configure API
cp api/.env.example api/.env   # set DATABASE_URL + JWT secrets

# 3. Migrate + bootstrap the first ADMIN
pnpm db:migrate
BOOTSTRAP_ADMIN_EMAIL=admin@example.com BOOTSTRAP_ADMIN_PASSWORD='Admin123!' pnpm db:seed

# 4. Run both apps
pnpm dev
```

- Web: http://localhost:3000 — public wizard at `/apply`, admin login at `/login`
- API: http://localhost:8080/api/v1

## One-command (Docker)

```bash
docker compose up --build
```

## Useful scripts (from root)

| Command | What it does |
|---|---|
| `pnpm dev` | api + web in parallel (turbo) |
| `pnpm build` / `typecheck` / `lint` | all workspaces |
| `pnpm db:generate` | drizzle-kit migration diff |
| `pnpm db:migrate` | apply `api/drizzle/init.sql` |
| `pnpm db:seed` | bootstrap ADMIN account |

## Dependency versions

All direct dependencies use `^` ranges floored at the latest major/minor line
verified at scaffold time (NestJS 11, Next 15, React 19, Tailwind CSS 4,
Drizzle 0.36, Redux Toolkit 2.5, RHF 7.54, zod 3.24), so a fresh `pnpm install`
floats to the newest compatible release without crossing a breaking major.
The two deliberate exceptions: `bcrypt` stays on v5 (the maintained
`bcryptjs`-line API with prebuilds for this toolchain; v6 changes native
packaging) and `class-validator`/`class-transformer` stay on 0.x (the stable
line Nest's `ValidationPipe` targets).
