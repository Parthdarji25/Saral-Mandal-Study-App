-- Adds first-login onboarding state and guarantees fresh student defaults.
alter table public.profiles
add column if not exists onboarding_completed boolean not null default false;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    xp_points,
    study_streak,
    onboarding_completed
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'student',
    0,
    0,
    false
  );
  return new;
end;
$$;

-- Optional helper for testing: reset one student to a clean first-login state.
-- Replace the email and run manually in Supabase SQL Editor when needed.
-- update public.profiles
-- set xp_points = 0,
--     study_streak = 0,
--     onboarding_completed = false
-- where email = 'student@example.com';
