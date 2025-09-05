# Mini Form Builder - Execution Plan

## Project Overview

- **Goal**: Minimal form builder with admin auth, CRUD operations, public forms, and optional AI suggestions
- **Tech Stack**: Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Prisma + SQLite, Zod validation
- **Key Constraints**: Max 2 sections per form, max 3 fields per section, field types: text/number only

## Execution Checklist

### Phase 1: Foundation & Database Setup

- [x] **Fix Prisma Schema** - Change from PostgreSQL to SQLite and add proper models

  - [x] Update `datasource` to use SQLite (`./prisma/dev.db`)
  - [x] Create `Form` model (id, title, sections JSON, createdAt, updatedAt, publicId)
  - [x] Create `Submission` model (id, formId, payload JSON, createdAt)
  - [x] Run `npx prisma migrate dev --name init && npx prisma generate`

- [x] **Core Library Setup**

  - [x] Create `lib/prisma.ts` - Prisma client singleton
  - [x] Create `lib/types.ts` - TypeScript interfaces for Section/Field shapes
  - [x] Create `lib/validation.ts` - Zod schemas for form validation with constraints
  - [x] Create `lib/auth.ts` - Basic Auth header validation utilities

- [x] **Dependencies**
  - [x] Add missing package: `uuid`

### Phase 2: Authentication System

- [x] **Admin Login**
  - [x] Create `app/(admin)/admin/login/page.tsx` - Login form
  - [x] Implement localStorage storage for `isAdmin=true` client-side state
  - [x] Add client-side route protection for admin pages

### Phase 3: API Layer

- [x] **Forms API with Basic Auth**

  - [x] `app/api/forms/route.ts` - POST (create), GET (list)
    - [x] Decode `Authorization: Basic <base64>` header
    - [x] Compare against hardcoded `admin/password123` credentials
    - [x] Return 401 on auth failure
  - [x] `app/api/forms/[id]/route.ts` - GET (read only — NO PATCH)
    - [x] Same Basic Auth validation for admin endpoints
  - [x] `app/api/forms/[id]/submissions/route.ts` - POST (submit)
    - [x] Public endpoint (no auth required)
  - [x] Apply server-side validation with constraint enforcement (2 sections max, 3 fields per section max)

- [ ] **Optional AI API**
  - [ ] `app/api/ai/suggest/route.ts` - OpenAI integration for form suggestions
    - [ ] Require Basic Auth validation

### Phase 4: Admin Interface

- [x] **Forms Management**

  - [x] `app/(admin)/admin/forms/page.tsx` - Forms list with public links
  - [x] `app/(admin)/admin/forms/new/page.tsx` - Form creation interface
  - [x] `app/(admin)/admin/forms/[id]/page.tsx` - Form read-only view interface
  - [x] Add Basic Auth headers to all API calls from admin interface

- [ ] **Form Builder Components**
  - [ ] `components/form-builder/FormBuilder.tsx` - Main builder interface
  - [ ] `components/form-builder/SectionEditor.tsx` - Section management (max 2)
  - [ ] `components/form-builder/FieldEditor.tsx` - Field management (max 3 per section)
  - [ ] Real-time validation counters and constraint enforcement
  - [ ] Include a preview window that auser may see the entire time. This should update while a user is building their form

### Phase 5: Public Form Interface

- [ ] **Public Form Rendering**
  - [ ] `app/form/[id]/page.tsx` - Public form display and submission
  - [ ] Client-side required field validation
  - [ ] Success confirmation screen
  - [ ] Error handling for invalid/missing forms

### Phase 6: Polish & Testing

- [ ] **UI/UX Refinements**
  - [ ] Responsive design using Tailwind
  - [ ] Loading states and error boundaries
  - [ ] Form validation feedback

### Phase 7: Documentation & Deployment Prep

- [ ] **Final Steps**
  - [ ] Update README with setup instructions
  - [ ] Verify all requirements are met per specification

## Key Technical Decisions Made

1. **Database**: SQLite with file storage (needs correction from current PostgreSQL)
2. **Auth**: Basic Auth headers with localStorage for client-side state
3. **Validation**: Zod schemas with strict constraint enforcement
4. **State Management**: React state (no external state management needed for this scope)
5. **Styling**: Pure Tailwind + shadcn/ui components only

## Critical Implementation Notes

- Enforce constraints server-side: reject requests exceeding 2 sections or 3 fields per section
- Use UUIDs for all IDs (both internal and public)
- Store form structure as JSON in Prisma (sections field)
- Keep AI suggestions optional and gracefully degrade if OpenAI key missing
- Basic Auth format: `Authorization: Basic YWRtaW46cGFzc3dvcmQxMjM=` (admin:password123 base64 encoded)

## Progress Tracking

Use this file to track progress by checking off completed items. Update as we build each phase.
