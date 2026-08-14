# AGENTS.md

Nuxt 4 app ("KOMPAK 98", Indonesian alumni portal). Nuxt `srcDir` is `app/`; backend is Nitro server routes under `server/`. Deployed on Vercel; assets on Cloudflare R2.

## Commands (use Bun)

- Install/build runs `nuxt prepare` via `postinstall`, generating `.nuxt/` (the `tsconfig.json` references generated tsconfigs). Regenerate with `bun run dev` / `bun install` when you add files.
- `bun run dev` — dev server (port 3000)
- `bun run lint` — ESLint **with `--fix`** (auto-fixes; antfu config: 2-space indent, **semicolons, double quotes**)
- `bun run check` — `nuxt typecheck`; requires `.nuxt/` generated first
- `bun run db:push` / `bun run db:studio` — Drizzle sync + Studio (see DB)

There is **no test suite**. Verify with `lint` → `check` → manual `dev`.

## Environment

- `shared/env.ts` zod-validates **all** env keys at import time — a missing key throws on startup. `.env` is gitignored; there is no `.env.example`. `drizzle.config.ts` throws if `DATABASE_URL` is absent.
- DB is Neon Postgres. `server/database/index.ts` exports `db`.

## Database (Drizzle)

- No migration files; schema lives in `server/database/schema/<domain>.ts` (one file per domain, plus `auth.ts`, `common.ts`, `relations.ts`). Added via `bun run db:push`.
- Tables use `snakeCase.table(...)` and reuse `createdUpdated` from `common.ts` (`createdAt`/`updatedAt`). FK `references` always specify `onDelete`.

## Backend architecture (mirror it when adding features)

- `server/modules/<domain>/` = `model.ts` (zod), `repo.ts` (drizzle queries), `service.ts` (logic). `server/api/v1/**` handlers are thin: call the service, guard with `authGuard`/`adminGuard` from `server/utils/guard.ts`.
- Validate input with the helpers in `server/utils/validator.ts` (`getValidatedQuerySafe`, `readValidatedBodySafe`, `readValidatedRouterParamsSafe`, `readValidatedMultipart`) and the multipart file schemas in `server/utils/schema.ts` — do not hand-roll validation. Errors use `createError` with a user-friendly `statusMessage`.
- Auth = better-auth (`server/api/auth/[...all].ts` handler), adapter wired to Drizzle. `server/middleware/auth.ts` populates `event.context.user` for every server event. Roles/permissions configured in `shared/permission.ts` via the better-auth admin plugin.
- New user registrations are created `banned: true` by default (see `databaseHooks` in `server/utils/auth.ts`) — account verification flow gates access.
- File uploads go to Cloudflare R2 via `server/utils/files.ts` (`@aws-sdk/client-s3`). Served images come from `https://assets.kompak98.com`.

## Frontend conventions (important quirk)

- `nuxt.config.ts` sets `imports: { scan: false }` and `components: { dirs: [] }` — custom composables, utils, and components are **NOT auto-imported**. Explicitly import them, e.g. `import { openModal } from "~/composables/modal"`, `from "~/utils"`. (Nuxt built-ins like `useHead`/`useSeoMeta`/`useFetch` still work.)
- Feature UI pattern: `app/features/<domain>/` = `<X>Container.vue` + `constants.ts` (+ `components/`), referenced from the thin page in `app/pages/`. Pages use route groups `(Landing)`, `(Auth)`, and `dashboard/{user,admin}`.
- Client routing guards live in `app/middleware/auth.global.ts` (`/dashboard/admin` requires `role === "admin"`); server routes independently enforce with guards.
- If you reference a new external image origin, it must be added to the CSP `img-src` in `nuxt.config.ts` (currently `assets.kompak98.com`).

## Ops / misc

- `vercel.json` defines a monthly cron hitting `server/api/v1/cron/kas-bulanan.get.ts`, which requires an `Authorization: Bearer <CRON_SECRET>` header.
- README.md is the stale Nuxt starter — ignore it.
