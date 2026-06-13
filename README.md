# Saral Mandal 12th Commerce App

A production-ready Next.js 15 study platform for 11th and 12th Commerce students.

## Features

- Public landing, features, about, login, signup, forgot password, and sample notes pages
- Student dashboard with streaks, XP, exam countdown, analytics, tasks, achievements, and progress
- Subject cards, notes library, bookmarks UI, PDF actions, private personal notes, score tracker, planner, quizzes, and profile
- Admin dashboard and management screens for students, subjects, notes/PDFs, announcements, and quizzes
- Supabase Auth with email/password, verification, password reset, protected routes, and role middleware
- Supabase PostgreSQL migrations with strict Row Level Security policies
- Supabase Storage policy for private PDF uploads and authenticated downloads
- Tailwind CSS, shadcn-style components, Recharts, TanStack Query, Lucide icons, dark mode, skeletons, toasts, and command search

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Supabase Auth, PostgreSQL, Storage
- TanStack Query
- Recharts
- Lucide Icons
- Vercel Free Tier

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

PowerShell users can run `npm.cmd install` and `npm.cmd run dev` if script execution blocks `npm.ps1`.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=only-for-server-admin-scripts
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Only expose `NEXT_PUBLIC_*` values to the browser. Never use `SUPABASE_SERVICE_ROLE_KEY` in client components.

## Supabase Setup

1. Create a Supabase project.
2. Run migrations in order:

```bash
supabase db push
```

Or paste the SQL files from `supabase/migrations` into the Supabase SQL editor in order.

3. In Supabase Auth, enable email/password auth and email verification.
4. Add these redirect URLs:

```text
http://localhost:3000/auth/callback
https://your-vercel-domain.vercel.app/auth/callback
http://localhost:3000/dashboard
https://your-vercel-domain.vercel.app/dashboard
```

5. Create the first admin:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

## Security Model

Private student tables are protected by RLS:

- `student_scores`
- `personal_notes`
- `bookmarks`
- `study_tasks`
- `study_sessions`
- `quiz_attempts`
- `student_achievements`

Students can only read and mutate rows where `user_id = auth.uid()`. Admin reads are allowed for operational views where appropriate, and admin writes are gated by `public.is_admin()`.

Shared academic content is separated:

- `subjects`
- `chapters`
- `public_notes`
- `announcements`
- `quizzes`
- `quiz_questions`
- `achievements`

Never replace RLS with frontend checks. Middleware improves navigation security, but Supabase policies enforce the actual data boundary.

## Project Structure

```text
src/app/(public)          Public pages
src/app/(student)         Protected student app
src/app/admin             Admin-only app
src/app/api               Server route handlers
src/components            UI, layout, dashboard, admin, student components
src/hooks                 TanStack Query hooks
src/lib                   Supabase clients, constants, utilities
src/types                 Database types
supabase/migrations       Schema, seed data, RLS, storage policies
```

## Deployment on Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to the Vercel URL or custom domain.
5. Deploy.
6. Add the Vercel callback URLs in Supabase Auth settings.

## Production Notes

- Replace sample dashboard data with hook-backed Supabase queries as content grows.
- Add audit logging before allowing destructive admin actions in production.
- Generate fresh database types with Supabase CLI after schema changes.
- Add Playwright end-to-end tests for auth, student privacy, and admin restrictions before public launch.
