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
- `app/(admin)/admin/forms/[id]/page.tsx` (read-only view)
- `app/form/[id]/page.tsx` (public render/submit)
- `app/api/forms/route.ts` (POST create, GET list)
- `app/api/forms/[id]/route.ts` (GET read only — NO PATCH)
- `app/api/forms/[id]/submissions/route.ts` (POST)
- `app/api/ai/suggest/route.ts` (POST) — optional
- `components/form-builder/*` (pure UI, client)
- `lib/prisma.ts`, `lib/auth.ts`, `lib/validation.ts`, `lib/types.ts`
- `prisma/schema.prisma`, `prisma/seed.ts`

## API Contracts

- `POST /api/forms` → `{ title: string, sections: Section[] }` → `{ id, publicId }`
- `GET /api/forms` → `Array<{ id, title, publicUrl }>`
- `GET /api/forms/:id` → `{ id, title, sections, publicId }`
- `POST /api/forms/:id/submissions` → body `{ values: Record<string, string | number> }` → 201
- Optional: `POST /api/ai/suggest` → `{ prompt: string }` → `{ title, sections }`

## Data Model

- `Form` (JSON sections) and `Submission` ONLY. Do not normalize sections/fields into tables.

## Auth (hardcoded)

- Header-based validation (Basic auth) and localStorage flag. No cookies or server sessions.

## What NOT to build

- No edit/update endpoints (no `PATCH`); create-only.
- No submission viewer/analytics UI.
- No sessions/JWT/RBAC.

## UI Rules

- `app/(admin)/admin/forms/new/page.tsx` is create-only.
- `app/(admin)/admin/forms/[id]/page.tsx` is **read-only view** (optional). If present, it must not allow editing.
- Keep the optional AI button as real (not stubbed).

## Project UI Functionality

- Admin builder:
- Inline create: Title input, "Add Section" (disabled at 2), within section "Add Field" (disabled at 3).
- Field editor: label input + select(type).
- Show live validity counts (sections/fields).
- Buttons: Save (primary), Generate with AI (secondary, optional).
- Forms list: title + public link `/form/[publicId]`.
- Public page: render fields exactly; client-side required field check, submit to `/api/forms/:id/submissions`, show success state.
