# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development setup

```bash
npm install                        # also runs prisma generate via postinstall
docker compose up -d               # PostgreSQL on port 5433
npx prisma migrate deploy          # apply migrations
npx prisma db seed                 # seed initial data
npm run dev                        # http://localhost:3000
```

Required environment variables (copy `.env.example` → `.env`):

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_URL` / `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `MERCADOPAGO_ACCESS_TOKEN` / `MERCADOPAGO_PUBLIC_KEY` / `MERCADOPAGO_APP_NUMBER` / `MP_CLIENT_SECRET`
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `QUINIELA_URL` — scraping target for the national lottery draw method
- `SEED_USER_EMAIL` / `SEED_USER_PASSWORD` — credentials for the seeded admin user

## Common commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint         # ESLint
npx prisma migrate dev --name <name>   # create a new migration
npx prisma generate                    # regenerate client after schema changes
npx prisma studio                      # GUI for the database
```

## Architecture

### Backend: Clean Architecture in `backend/`

The `backend/` directory is organized by **bounded context**, each following a strict three-layer structure:

```
backend/context/<context>/
  domain/
    entities/        # plain domain objects (no Prisma types)
    repositories/    # interfaces (abstract classes)
  application/
    dto/             # input/output shapes
    use-case/        # one class per use case, injected with repository interfaces
  infrastructure/
    database/        # PrismaXxxRepository — implements the repository interface
    mappers/         # converts Prisma model → domain entity
```

Bounded contexts: `user`, `company`, `raffle`, `payment`, `quantity-discount`, `sold-numbers`, `raffle-winner`.

**Key pattern**: API routes in `app/api/` wire everything together manually — they instantiate Prisma repositories, inject them into use cases, and call `execute()`. There is no DI container.

### Frontend layers

- **`app/`** — Next.js App Router. Route groups: `(auth)` (login/register), `(authenticated)` (admin dashboard, requires session), `(public)` (landing, raffle view).
- **`components/pages/`** — page-level feature components, one subdirectory per page (e.g. `create/`, `raffle/`, `admin/`).
- **`services/`** — client-side functions that call `apiClient`. Used from components and pages.
- **`lib/api.ts`** — `ApiClient` singleton. Pass `serverSide: true` to forward cookies from server components. Pass `tags` to attach Next.js cache tags for ISR invalidation.
- **`contexts/`** — React context providers for the raffle creation/edit forms and number selection.
- **`components/ui/`** — shadcn/ui-based component library (Tailwind v4).

### Auth

NextAuth v4 with JWT strategy (`lib/auth.ts`). Providers: credentials (email + bcrypt) and Google OAuth. The session token carries `id`, `firstName`, `lastName`, `companyId`, and `mpConnected`. Use `requireAuth()` from `backend/shared/guards/auth.guard.ts` at the top of API route handlers — it returns `{ userId, email, firstName, lastName, companyId }`.

**Anonymous buyer sessions**: `lib/session.ts` generates a `numeralo_session_id` UUID in `localStorage` for unauthenticated number buyers. This ID is sent with reservation requests so the backend can group reserved numbers by anonymous session.

### Prisma

- Schema: `prisma/schema.prisma`
- Generated client output: **`app/generated/prisma/`** (non-default location)
- Import enums from `@/app/generated/prisma/enums`, models from `@/app/generated/prisma/models`
- Uses `@prisma/adapter-pg` driver adapter — `PrismaPg` is configured in `lib/prisma.ts`

### Domain concepts

**Raffle lifecycle**: `DRAFT` → `ACTIVE` → `FINISHED`

**Draw methods**:
- `ALEATORIO` — random draw from sold numbers (shuffled at close time)
- `QUINIELA_NACIONAL` — winner determined by scraping the Argentine national lottery result; the quiniela number is mapped to a raffle number via modulo arithmetic. **Note**: `backend/shared/utils/get-quiniela-number.ts` is incomplete (has a `TODO` marker and returns `null`).

**Draw triggers**:
- `VENDER_TODO` — raffle closes automatically when all numbers are sold
- `FECHA_FIJA` — raffle closes on a scheduled date (cron job `app/api/cron/close-raffles/`)

The shared `backend/shared/utils/close-raffle.ts` utility handles the full close flow for `ALEATORIO` draws: picks winners, writes `RaffleWinner` records in a transaction, sets status to `FINISHED`, and sends a completion email. Both the `VENDER_TODO` path and the cron job call this utility.

**Payment types**:
- `RAFFLE_ACTIVATION` — organizer pays to publish a raffle; approved by MercadoPago webhook → status set to `ACTIVE`
- `NUMBER_PURCHASE` — buyer purchases numbers; approved by webhook → `SoldNumber` records set to `SOLD`

**Companies** connect their own MercadoPago account via OAuth (`app/api/webhooks/mercadopago/oauth/`). The webhook identifies the correct company by `mpUserId` and uses their `mpAccessToken` when calling the MP API. Always retrieve the token via `getValidMpAccessToken(companyId)` from `lib/mercadopago.ts` — it transparently refreshes expired tokens using the stored `mpRefreshToken`.

**SoldNumber reservation flow**: numbers go `AVAILABLE` → `RESERVED` (held for a TTL while checkout is pending) → `SOLD` (after payment approved). Rejected/cancelled payments return numbers to `AVAILABLE`.

### Error handling

Use the typed error hierarchy from `backend/shared/errors/`:

```ts
throw new ValidationError("message")   // 400
throw new UnauthorizedError("...")     // 401
throw new ForbiddenError("...")        // 403
throw new NotFoundError("...")         // 404
throw new ConflictError("...")         // 409
```

API routes catch `CustomError` instances and return the appropriate status code; all other errors become 500.

### Cache invalidation

Server-side Next.js cache tags are used for data fetching. Call `revalidateTagAction` / `revalidatePathAction` from `lib/revalidate.ts` (server actions) after mutations to invalidate stale data.
