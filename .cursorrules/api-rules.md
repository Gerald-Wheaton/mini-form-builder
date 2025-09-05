## Auth (hardcoded)

- `admin/password123` stored in env: `ADMIN_USERNAME`, `ADMIN_PASSWORD`.
- On login, set `isAdmin=true` in `localStorage` (or React context) to gate client-side navigation.
- For server validation, send an `Authorization: Basic <base64>` header with all admin API requests.  
  Example: `Authorization: Basic admin:password123` → encoded as `Basic YWRtaW46cGFzc3dvcmQxMjM=`.
- In API route handlers, decode the header and compare against env values; reject with 401 on mismatch.
- Gate all `/admin/*` pages client-side and also enforce this check in `api/forms*` endpoints to prevent unauthorized access.

## API Contracts (Cursor, adhere exactly)

- `POST /api/forms` → body `{ title: string, sections: Section[] }` → returns `{ id, publicId }`
- `GET /api/forms` → returns array `{ id, title, publicUrl }[]`
- `GET /api/forms/:id` → returns `{ id, title, sections, publicId }`
- `PATCH /api/forms/:id` → same shape as POST, partial allowed
- `POST /api/forms/:id/submissions` → body `{ values: Record<string, string | number> }` → 201
- Optional: `POST /api/ai/suggest` → body `{ prompt: string }` → returns `{ title, sections }` in the exact Section shape above
