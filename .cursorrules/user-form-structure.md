## Data Model (Cursor, don’t deviate)

- Form: id (string uuid), title (string), sections (Json), createdAt (Date), updatedAt (Date), publicId (string uuid)
- Section JSON shape:
  {
  id: string, // uuid
  name: string,
  fields: Array<{
  id: string, // uuid
  label: string,
  type: 'text' | 'number'
  }>
  }

- Submission: id (uuid), formId (string), payload (Json), createdAt (Date)

## Constraints Enforcement (must implement)

- Max 2 sections per form.
- Max 3 fields per section.
- Allowed field types: 'text' | 'number'.
- Server-side validation using Zod schemas in `lib/validation.ts`.
- Reject requests that exceed limits with 400 + friendly message.
