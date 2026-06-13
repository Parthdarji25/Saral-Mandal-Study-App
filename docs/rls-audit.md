# RLS Audit Notes

Saral Mandal 12th Commerce App relies on Supabase Row Level Security for privacy.

## Student-Private Tables

Each of these tables has `user_id default auth.uid()` and policies that restrict student access to matching rows:

- `student_scores`
- `personal_notes`
- `bookmarks`
- `study_tasks`
- `study_sessions`
- `quiz_attempts`
- `student_achievements`

Students can never query other students' marks, private notes, tasks, planner data, analytics source rows, or quiz attempts.

## Admin Access

The `public.is_admin()` function checks `profiles.role = 'admin'` through a security-definer function. Admin-only write policies use that function. Middleware also blocks non-admin navigation to `/admin`, but the database remains the source of truth.

## Storage

The `study-pdfs` bucket is private. Authenticated users can read files; only admins can insert, update, or delete storage objects.
