-- Commerce Study Hub initial schema
create extension if not exists "pgcrypto";

create type public.user_role as enum ('student', 'admin');
create type public.task_status as enum ('todo', 'doing', 'done');
create type public.answer_option as enum ('a', 'b', 'c', 'd');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  role public.user_role not null default 'student',
  xp_points integer not null default 0 check (xp_points >= 0),
  study_streak integer not null default 0 check (study_streak >= 0),
  created_at timestamptz not null default now()
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null,
  chapter_number integer not null check (chapter_number > 0),
  created_at timestamptz not null default now(),
  unique (subject_id, chapter_number)
);

create table public.public_notes (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete set null,
  title text not null,
  content text not null,
  pdf_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.student_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  test_name text not null,
  marks_obtained numeric(6,2) not null check (marks_obtained >= 0),
  total_marks numeric(6,2) not null check (total_marks > 0),
  test_date date not null,
  created_at timestamptz not null default now(),
  check (marks_obtained <= total_marks)
);

create table public.personal_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  note_id uuid not null references public.public_notes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, note_id)
);

create table public.study_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  status public.task_status not null default 'todo',
  created_at timestamptz not null default now()
);

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  studied_on date not null default current_date,
  minutes integer not null default 25 check (minutes > 0),
  created_at timestamptz not null default now(),
  unique (user_id, studied_on)
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer public.answer_option not null,
  created_at timestamptz not null default now()
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score integer not null check (score >= 0),
  total_questions integer not null check (total_questions > 0),
  created_at timestamptz not null default now(),
  check (score <= total_questions)
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null,
  xp_reward integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.student_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create index idx_chapters_subject on public.chapters(subject_id);
create index idx_public_notes_subject on public.public_notes(subject_id);
create index idx_public_notes_chapter on public.public_notes(chapter_id);
create index idx_student_scores_user on public.student_scores(user_id);
create index idx_personal_notes_user on public.personal_notes(user_id);
create index idx_bookmarks_user on public.bookmarks(user_id);
create index idx_study_tasks_user on public.study_tasks(user_id);
create index idx_quiz_questions_quiz on public.quiz_questions(quiz_id);
create index idx_quiz_attempts_user on public.quiz_attempts(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger personal_notes_updated_at
before update on public.personal_notes
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin(check_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = check_user and role = 'admin'
  );
$$;

insert into public.subjects (name, description)
values
  ('Accountancy', 'Accounting concepts, partnership, company accounts, and analysis.'),
  ('Business Studies', 'Management principles, business environment, marketing, and finance.'),
  ('Economics', 'Microeconomics, macroeconomics, national income, and policy concepts.'),
  ('English', 'Reading, writing, grammar, and literature support.'),
  ('Statistics', 'Data handling, averages, dispersion, probability, and interpretation.'),
  ('Mathematics', 'Optional mathematics resources for Commerce students.')
on conflict (name) do nothing;

insert into public.achievements (code, title, description, xp_reward)
values
  ('first_note_created', 'First Note Created', 'Create your first private study note.', 50),
  ('seven_day_streak', '7 Day Streak', 'Study for seven days in a row.', 150),
  ('ten_tests_added', '10 Tests Added', 'Track ten test scores.', 100),
  ('chapter_completion', '100% Chapter Completion', 'Complete every chapter in a subject.', 250)
on conflict (code) do nothing;
