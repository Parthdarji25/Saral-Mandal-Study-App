-- Strict Row Level Security policies for Commerce Study Hub.
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.public_notes enable row level security;
alter table public.announcements enable row level security;
alter table public.student_scores enable row level security;
alter table public.personal_notes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.study_tasks enable row level security;
alter table public.study_sessions enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.achievements enable row level security;
alter table public.student_achievements enable row level security;

create policy "profiles_select_own_or_admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
on public.profiles for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "profiles_insert_self"
on public.profiles for insert
with check (id = auth.uid());

create policy "subjects_read_all"
on public.subjects for select
using (true);

create policy "subjects_admin_write"
on public.subjects for all
using (public.is_admin())
with check (public.is_admin());

create policy "chapters_read_all"
on public.chapters for select
using (true);

create policy "chapters_admin_write"
on public.chapters for all
using (public.is_admin())
with check (public.is_admin());

create policy "public_notes_read_authenticated"
on public.public_notes for select
using (auth.role() = 'authenticated');

create policy "public_notes_admin_write"
on public.public_notes for all
using (public.is_admin())
with check (public.is_admin());

create policy "announcements_read_authenticated"
on public.announcements for select
using (auth.role() = 'authenticated');

create policy "announcements_admin_write"
on public.announcements for all
using (public.is_admin())
with check (public.is_admin());

create policy "student_scores_private_select"
on public.student_scores for select
using (user_id = auth.uid() or public.is_admin());

create policy "student_scores_private_insert"
on public.student_scores for insert
with check (user_id = auth.uid());

create policy "student_scores_private_update"
on public.student_scores for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "student_scores_private_delete"
on public.student_scores for delete
using (user_id = auth.uid());

create policy "personal_notes_private_select"
on public.personal_notes for select
using (user_id = auth.uid() or public.is_admin());

create policy "personal_notes_private_insert"
on public.personal_notes for insert
with check (user_id = auth.uid());

create policy "personal_notes_private_update"
on public.personal_notes for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "personal_notes_private_delete"
on public.personal_notes for delete
using (user_id = auth.uid());

create policy "bookmarks_private_select"
on public.bookmarks for select
using (user_id = auth.uid() or public.is_admin());

create policy "bookmarks_private_insert"
on public.bookmarks for insert
with check (user_id = auth.uid());

create policy "bookmarks_private_delete"
on public.bookmarks for delete
using (user_id = auth.uid());

create policy "study_tasks_private_select"
on public.study_tasks for select
using (user_id = auth.uid() or public.is_admin());

create policy "study_tasks_private_insert"
on public.study_tasks for insert
with check (user_id = auth.uid());

create policy "study_tasks_private_update"
on public.study_tasks for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "study_tasks_private_delete"
on public.study_tasks for delete
using (user_id = auth.uid());

create policy "study_sessions_private_select"
on public.study_sessions for select
using (user_id = auth.uid() or public.is_admin());

create policy "study_sessions_private_insert"
on public.study_sessions for insert
with check (user_id = auth.uid());

create policy "study_sessions_private_update"
on public.study_sessions for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "study_sessions_private_delete"
on public.study_sessions for delete
using (user_id = auth.uid());

create policy "quizzes_read_authenticated"
on public.quizzes for select
using (auth.role() = 'authenticated');

create policy "quizzes_admin_write"
on public.quizzes for all
using (public.is_admin())
with check (public.is_admin());

create policy "quiz_questions_read_authenticated"
on public.quiz_questions for select
using (auth.role() = 'authenticated');

create policy "quiz_questions_admin_write"
on public.quiz_questions for all
using (public.is_admin())
with check (public.is_admin());

create policy "quiz_attempts_private_select"
on public.quiz_attempts for select
using (user_id = auth.uid() or public.is_admin());

create policy "quiz_attempts_private_insert"
on public.quiz_attempts for insert
with check (user_id = auth.uid());

create policy "quiz_attempts_private_update"
on public.quiz_attempts for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "achievements_read_authenticated"
on public.achievements for select
using (auth.role() = 'authenticated');

create policy "achievements_admin_write"
on public.achievements for all
using (public.is_admin())
with check (public.is_admin());

create policy "student_achievements_private_select"
on public.student_achievements for select
using (user_id = auth.uid() or public.is_admin());

create policy "student_achievements_private_insert"
on public.student_achievements for insert
with check (user_id = auth.uid() or public.is_admin());

insert into storage.buckets (id, name, public)
values ('study-pdfs', 'study-pdfs', false)
on conflict (id) do nothing;

create policy "study_pdfs_authenticated_read"
on storage.objects for select
using (bucket_id = 'study-pdfs' and auth.role() = 'authenticated');

create policy "study_pdfs_admin_insert"
on storage.objects for insert
with check (bucket_id = 'study-pdfs' and public.is_admin());

create policy "study_pdfs_admin_update"
on storage.objects for update
using (bucket_id = 'study-pdfs' and public.is_admin())
with check (bucket_id = 'study-pdfs' and public.is_admin());

create policy "study_pdfs_admin_delete"
on storage.objects for delete
using (bucket_id = 'study-pdfs' and public.is_admin());
