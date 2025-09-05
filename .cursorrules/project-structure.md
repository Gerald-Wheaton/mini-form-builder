## Project Goals

- Ship a minimal, correct form builder with: admin auth (hardcoded), form CRUD (≤2 sections, ≤3 fields/section), public render/submit, confirmation screen.
- Optional AI: suggest section/field names from a short prompt via OpenAI.
- Prioritize clarity > cleverness. Prefer boring, proven patterns.

## Tech Stack

- Framework: Next.js (App Router).
- Language: TypeScript strict.
- Styling: Tailwind CSS only (no CSS-in-JS). Use shadcn/ui ONLY. If extra tailwind is absolutely necessary, include it. NEVER modify shadcn components inline.
- DB: Prisma + SQLite (file `./prisma/dev.db`).
- API: Next.js Route Handlers (`app/api/**/route.ts`).
- UUIDs: Use `uuid` package or Prisma’s `@default(uuid())` if supported.
- Env: `OPENAI_API_KEY` optional; all other envs are local-only.

## Repo Layout (Cursor, please keep to this)

- `app/(admin)/admin/login/page.tsx`
- `app/(admin)/admin/forms/page.tsx` (list)
- `app/(admin)/admin/forms/new/page.tsx` (create)
- `app/(admin)/admin/forms/[id]/page.tsx` (view/edit lightweight)
- `app/form/[id]/page.tsx` (public render/submit)
- `app/api/forms/route.ts` (POST create, GET list)
- `app/api/forms/[id]/route.ts` (GET read, PATCH update)
- `app/api/forms/[id]/submissions/route.ts` (POST)
- `app/api/ai/suggest/route.ts` (POST) — optional
- `components/form-builder/*` (pure UI, client)
- `lib/prisma.ts`, `lib/auth.ts`, `lib/validation.ts`, `lib/types.ts`
- `prisma/schema.prisma`, `prisma/seed.ts`

## Project UI Functionality

- Admin builder:
- Inline create: Title input, “Add Section” (disabled at 2), within section “Add Field” (disabled at 3).
- Field editor: label input + select(type).
- Show live validity counts (sections/fields).
- Buttons: Save (primary), Generate with AI (secondary, optional).
- Forms list: title + public link `/form/[publicId]`.
- Public page: render fields exactly; client-side required field check, submit to `/api/forms/:id/submissions`, show success state.
