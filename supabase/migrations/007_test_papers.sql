-- Shared test papers and solutions uploaded by admins and visible to students.
create table if not exists public.test_papers (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  description text,
  paper_url text,
  solution_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_test_papers_subject on public.test_papers(subject_id);

alter table public.test_papers enable row level security;

create policy "test_papers_read_authenticated"
on public.test_papers for select
using (auth.role() = 'authenticated');

create policy "test_papers_admin_write"
on public.test_papers for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('test-papers', 'test-papers', false)
on conflict (id) do nothing;

create policy "test_papers_files_authenticated_read"
on storage.objects for select
using (bucket_id = 'test-papers' and auth.role() = 'authenticated');

create policy "test_papers_files_admin_insert"
on storage.objects for insert
with check (bucket_id = 'test-papers' and public.is_admin());

create policy "test_papers_files_admin_update"
on storage.objects for update
using (bucket_id = 'test-papers' and public.is_admin())
with check (bucket_id = 'test-papers' and public.is_admin());

create policy "test_papers_files_admin_delete"
on storage.objects for delete
using (bucket_id = 'test-papers' and public.is_admin());
