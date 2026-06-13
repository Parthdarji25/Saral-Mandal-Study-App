-- Consolidates Commerce subjects to the 5-subject setup used by the app.
insert into public.subjects (name, description)
values ('Mathematics & Statistics', 'Mathematics and Statistics resources for Commerce students.')
on conflict (name) do update set description = excluded.description;

do $$
declare
  combined_id uuid;
  old_id uuid;
begin
  select id into combined_id
  from public.subjects
  where name = 'Mathematics & Statistics';

  for old_id in
    select id from public.subjects where name in ('Mathematics', 'Statistics')
  loop
    update public.chapters
    set subject_id = combined_id
    where subject_id = old_id;

    update public.public_notes
    set subject_id = combined_id
    where subject_id = old_id;

    update public.student_scores
    set subject_id = combined_id
    where subject_id = old_id;
  end loop;

  delete from public.subjects
  where name in ('Mathematics', 'Statistics');
end $$;
