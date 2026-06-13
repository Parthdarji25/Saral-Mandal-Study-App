-- Stores real per-student chapter completion.
create table if not exists public.student_chapter_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  subject_name text not null,
  chapter_number integer not null check (chapter_number > 0),
  created_at timestamptz not null default now(),
  unique (user_id, subject_name, chapter_number)
);

create index if not exists idx_student_chapter_progress_user
on public.student_chapter_progress(user_id);

alter table public.student_chapter_progress enable row level security;

create policy "student_chapter_progress_private_select"
on public.student_chapter_progress for select
using (user_id = auth.uid() or public.is_admin());

create policy "student_chapter_progress_private_insert"
on public.student_chapter_progress for insert
with check (user_id = auth.uid());

create policy "student_chapter_progress_private_delete"
on public.student_chapter_progress for delete
using (user_id = auth.uid());
