# Mini Form Builder

A dynamic form builder built with Next.js, Prisma, and SQLite. Create and manage forms with a simple admin interface and public form submission pages.

## Features

- **Form Builder**: Create forms with multiple sections and field types
- **Field Types**: Support for text, number, email, phone, and textarea fields
- **Admin Interface**: Manage forms with authentication
- **Public Forms**: Share forms via public URLs for submissions
- **AI Generation**: Generate forms using AI prompts
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your system

### Setup

1. **Run the setup command**

   ```bash
   bun run setup
   ```

   This will install dependencies, generate the Prisma client, and set up the database.

2. **Start the development server**

   ```bash
   bun run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

- `/admin` - Admin interface for creating and managing forms
- `/public/[id]` - Public form submission pages
- `/api` - API routes for form CRUD operations and submissions
- `/components` - Reusable UI components and form builder

## Available Scripts

- `bun run setup` - Install dependencies and set up the database
- `bun run dev` - Start the development server
- `bun run build` - Build the application for production

## Database

This project uses SQLite with Prisma ORM. The database file is located at `prisma/dev.db`.

### Database Commands

```bash
# Generate Prisma client. AUTOMATICALLY RUN if you ran 'bun setup'
bunx prisma generate

# Push schema changes to database. AUTOMATICALLY RUN if you ran 'bun setup'
bunx prisma db push

# Open Prisma Studio (database GUI)
bunx prisma studio
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: shadcn
- **Package Manager**: Bun
- **TypeScript**

## Future Work

- **Editing forms**: Add `PATCH /api/forms/:id` and an editable admin detail page
- **Submission viewer**: Admin UI to list and filter submissions
- **Auth hardening**: Replace Basic header with real sessions and CSRF protection if multi-user is required
- **Field types**: Extend beyond text/number (select, radio, date) and richer validation
- **Field Type UI Fix**: When the "Field Type" is selected, the color state of the Field editing card reverts to its inactive orange. Ensure that it remains white even when the dropdown is opened
- **Component Abstraction**: Go through and further abstract some of the components, particularly the functionality inside of FormBuilder. That file is too busy to be helpful in a production version
- **Enhanced AI Chat**: Build out the AI functionality to allow the user to chat ongoing with the AI. Maybe position the chat off to the side so that they can see the form being filled in, in real time instead of the chat being a one time use
- **AI Response Parameters**: Include realistic parameters for the AI's responses so that it can better help the user understand when their request is unable to be met, or simply prevent the AI from trying to do something it can't logically do in the app
- **Form Editing**: Give admins the ability to edit forms they're made previously. Currently, when you save a form, it's set in stone, you cannot change it
- **Draggable Fields**: Add draggable fields on the admin form creation. That is a relatively simple UI feature that would give the user better dynamic control
