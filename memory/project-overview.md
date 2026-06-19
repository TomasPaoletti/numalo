---
name: project-overview
description: Numeralo — Next.js 15 raffle platform. Tech stack, architecture, key patterns, and domain concepts.
metadata:
  type: project
---

Numeralo is a raffle marketplace platform where companies create raffles and buyers purchase numbers via MercadoPago or bank transfer.

**Stack**: Next.js 15, React 19, Tailwind v4, shadcn/ui (new-york), Prisma 7 (PostgreSQL on port 5433 via Docker), NextAuth v4, Cloudinary, Resend email, MercadoPago SDK.

**Architecture**: Clean Architecture in `backend/` (domain / application / infrastructure per bounded context). API routes in `app/api/` wire repos to use-cases manually. No DI container.

**Key patterns**:
- Server components call internal API via `apiClient` with `serverSide: true` (forwards cookies)
- Email sent with `React.createElement(Template, props)` from `.ts` files (no JSX in server actions)
- Cloudinary upload: `uploadImage` (resource_type: image) or `uploadDocument` (resource_type: auto)
- `formatPrice` exported from `lib/utils`; `APP_URL` also from `lib/utils`
- Auth guard: `requireAuth()` from `backend/shared/guards/auth.guard.ts`

**Transfer payment feature** (added 2026-06-19):
- Page: `app/(public)/raffle/[id]/pagar/page.tsx` — reached via `?session_id=...`
- Server action: `app/actions/transfer.ts` — `submitComprobante(FormData)`
- Components: `components/pages/raffle/pagar/`
- Schema: Raffle now has `titular, alias, cbu, cuit, banco`; Payment has `comprobanteUrl, comprobantePublicId`
- Admin confirmation flow (PENDING → APPROVED → numbers SOLD) not yet implemented

**Why**: Bank transfer is a common payment method in Argentina (MercadoPago alternative).
**How to apply**: When working on payments or checkout, consider both the MP flow (checkout page) and the transfer flow (pagar page). Bank data is per-raffle, not per-company.
