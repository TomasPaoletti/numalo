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
- `RESEND_FROM_EMAIL` — sender address for transactional email via Resend
- `NEXT_PUBLIC_APP_URL`
- `CRON_SECRET` — shared secret validated by all cron routes via `x-cron-secret` header
- `QUINIELA_URL` — scraping target for the national lottery draw method (scraper is incomplete — see TODO in `backend/shared/utils/get-quiniela-number.ts`)
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
    repositories/    # interfaces
  application/
    dto/             # input/output shapes
    use-case/        # one class per use case, injected with repository interfaces
  infrastructure/
    database/        # PrismaXxxRepository — implements the repository interface
    mappers/         # converts Prisma model → domain entity
```

Bounded contexts: `user`, `company`, `raffle`, `payment`, `quantity-discount`, `sold-numbers`, `raffle-winner`.

**Key pattern**: API routes in `app/api/` wire everything together manually — they instantiate Prisma repositories, inject them into use cases, and call `execute()`. There is no DI container.

**Shared utilities** live in `backend/shared/`:
- `utils/close-raffle.ts` — full close flow: picks winners (ALEATORIO), writes `RaffleWinner` records in a transaction, sets status to `FINISHED`, sends email.
- `raffle/raffle-verify-complete.ts` — called after approving a bank transfer; counts only `SOLD` numbers (not `RESERVED_WITH_COMPROBANT`) and closes the raffle if `soldCount === totalNumbers`.
- `utils/map-quiniela-to-raffle-number.ts` — maps a 4-digit quiniela result to a raffle number via modulo arithmetic.
- `utils/get-quiniela-number.ts` — scraper for the national lottery site; **incomplete** (returns `null`, has a `TODO`). Quiniela winner assignment is done manually by the organizer via the admin stats page.
- `emails/` — email helpers using Resend. Call `sendEmail()` from `lib/email/send-email.ts`.

### Frontend layers

- **`app/`** — Next.js App Router. Route groups: `(auth)` (login/register), `(authenticated)` (admin dashboard, requires session), `(public)` (landing, raffle view).
- **`components/pages/`** — page-level feature components, one subdirectory per page.
- **`services/`** — client-side functions that call `apiClient`. Used from components and pages.
- **`lib/api.ts`** — `ApiClient` singleton. Pass `serverSide: true` to forward cookies from server components. Pass `tags` to attach Next.js cache tags for ISR invalidation.
- **`contexts/`** — React context providers for the raffle creation/edit forms and number selection.
- **`components/ui/`** — shadcn/ui-based component library (Tailwind v4). Color primary is violet/purple (`oklch(0.541 0.281 293.009)`).

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
- `ALEATORIO` — random draw from sold numbers at close time; `closeRaffle()` picks winners automatically.
- `QUINIELA_NACIONAL` — `closeRaffle()` sets status to `FINISHED` and sends a pending email; the organizer then manually enters the official lottery number in the admin stats page (`SectionAssignQuinielaWinner`), which calls `POST /api/raffle/[id]/assign-quiniela-winner`. That component only renders when `status === FINISHED && winners.length === 0`.

**Draw triggers**:
- `VENDER_TODO` — after each bank-transfer approval, `RaffleVerifyComplete` counts `SOLD` numbers and calls `closeRaffle()` if all are sold.
- `FECHA_FIJA` — the cron job `app/api/cron/close-raffles` (authenticated via `x-cron-secret`) runs daily and closes raffles whose `drawDate` falls on today (Argentina timezone).

**Payment flow — number purchase (bank transfer)**:
Numbers go through these `ReservationStatus` states: `AVAILABLE` → `RESERVED` (TTL hold) → `RESERVED_WITH_COMPROBANT` (buyer uploaded bank transfer proof) → `SOLD` (organizer approved). Denied transfers delete the `SoldNumber` records and set payment to `REJECTED`.

The review endpoint (`POST /api/raffle/[id]/sold-numbers/review`) handles approve/deny and triggers `RaffleVerifyComplete` on approval for `VENDER_TODO` raffles.

**Important**: When counting "numbers sold" for stats or sold-count checks, always use `getSoldNumbersWithPayment()` (filters `status = SOLD`) — not `findByRaffleId()` which returns all statuses including `RESERVED_WITH_COMPROBANT`. The `findByRaffleId()` method is intentionally unfiltered because it's used by the buyer numbers grid to mark all occupied numbers (including pending comprobantes) as unavailable.

**Payment types**:
- `RAFFLE_ACTIVATION` — organizer pays to publish a raffle; approved by MercadoPago webhook (`app/api/webhooks/mercadopago/`) → status set to `ACTIVE`. Uses the platform-level `MERCADOPAGO_ACCESS_TOKEN`.
- `NUMBER_PURCHASE` — buyer pays via bank transfer + comprobante upload; organizer manually approves via admin stats page.

**Company banking fields**: The `Company` model stores `alias`, `cbu`, `cuit`, `banco`, and `titular` — used to display bank transfer instructions to buyers on the payment page.

**Images**: Uploaded to Cloudinary. The `imagePublicId` field on `Raffle` is used for deletion.

### Admin dashboard — raffle cards (`components/pages/admin/`)

- `STATUS_BADGE`, `STATUS_OPTIONS`, `RAFFLES_OPTIONS` are defined in `components/pages/admin/constants/index.ts`.
- On desktop (≥768px), the entire card is clickable and navigates to the stats page. The dropdown trigger calls `e.stopPropagation()` to prevent navigation.
- Raffles that are `FINISHED` with no winners assigned get an amber border (`border-amber-300`) and appear first in the list (sorted in `app/(authenticated)/admin/page.tsx`). An amber `Alert` banner is shown above the grid when any such raffles exist.
- The status badge appears over the image on desktop (absolute positioned) and inline in the card content on mobile.
- `findByStatus` in `PrismaRaffleRepository` includes `winners` — required for the pending-winner sort and border logic.

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
