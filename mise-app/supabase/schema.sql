-- ============================================================================
-- Mise — Supabase schema
-- Mobile-first AI nutrition + cooking assistant.
--
-- Run order: extensions -> enums -> tables -> indexes -> RLS policies -> triggers.
-- Every user-owned table is protected by Row Level Security so a signed-in user
-- can only ever read/write their own rows. `auth.users` is managed by Supabase
-- Auth; our `public.users` mirror holds app-level profile bootstrapping.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums (kept in sync with src/types/profile.ts)
-- ----------------------------------------------------------------------------
do $$ begin
  create type activity_level as enum ('sedentary','light','moderate','active','very_active');
exception when duplicate_object then null; end $$;

do $$ begin
  create type cooking_skill_level as enum ('beginner','home_cook','confident','advanced');
exception when duplicate_object then null; end $$;

do $$ begin
  create type budget_range as enum ('tight','moderate','comfortable','flexible');
exception when duplicate_object then null; end $$;

do $$ begin
  create type meal_type as enum ('breakfast','lunch','dinner','snack');
exception when duplicate_object then null; end $$;

do $$ begin
  create type pet_mood as enum ('excited','happy','neutral','disappointed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ai_kind as enum ('vision','nutrition','recipe','coach');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- users — app mirror of auth.users (1:1)
-- ----------------------------------------------------------------------------
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- user_profiles — one personalized profile per user (1:1)
-- ----------------------------------------------------------------------------
create table if not exists public.user_profiles (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null unique references public.users(id) on delete cascade,
  age                      int  not null check (age between 13 and 120),
  gender                   text not null,
  height_cm                numeric(5,1) not null check (height_cm between 80 and 260),
  weight_kg                numeric(5,1) not null check (weight_kg between 25 and 400),
  activity_level           activity_level not null,
  dietary_preferences      text[] not null default '{}',
  allergies                text[] not null default '{}',
  cooking_skill_level      cooking_skill_level not null,
  cooking_time_per_day_min int not null default 30 check (cooking_time_per_day_min between 0 and 480),
  budget_range             budget_range not null default 'moderate',
  kitchen_equipment        text[] not null default '{}',
  -- Derived nutrition (computed at onboarding, recalculated as weight changes)
  bmr                      numeric(7,1),
  tdee                     numeric(7,1),
  target_calories          int,
  target_protein_g         int,
  target_carbs_g           int,
  target_fat_g             int,
  ai_summary               text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- health_goals — many goals per user, one flagged primary
-- ----------------------------------------------------------------------------
create table if not exists public.health_goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  goal        text not null,
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);
-- At most one primary goal per user.
create unique index if not exists health_goals_one_primary
  on public.health_goals(user_id) where is_primary;

-- ----------------------------------------------------------------------------
-- food_scans — AI meal scans
-- ----------------------------------------------------------------------------
create table if not exists public.food_scans (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.users(id) on delete cascade,
  image_path           text,                 -- path in Storage bucket 'scans'
  detected_ingredients jsonb not null default '[]',
  nutrition_estimate   jsonb,                -- { calories, proteinG, carbsG, fatG, confidence }
  model                text,
  confidence           numeric(3,2),
  created_at           timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- fridge_items — ingredients detected from fridge scans / manual entry
-- ----------------------------------------------------------------------------
create table if not exists public.fridge_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  name        text not null,
  quantity    text,
  source      text not null default 'scan',  -- 'scan' | 'manual'
  expires_on  date,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- meals_logged — meals the user logged (manual or from a scan)
-- ----------------------------------------------------------------------------
create table if not exists public.meals_logged (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  food_scan_id  uuid references public.food_scans(id) on delete set null,
  meal_type     meal_type not null,
  title         text not null,
  ingredients   jsonb not null default '[]',
  calories      int,
  protein_g     int,
  carbs_g       int,
  fat_g         int,
  logged_at     timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- recipes_generated — AI-generated recipes (coach + meal planner)
-- ----------------------------------------------------------------------------
create table if not exists public.recipes_generated (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.users(id) on delete cascade,
  title             text not null,
  description       text,
  difficulty        cooking_skill_level not null default 'beginner',
  servings          int not null default 2,
  total_minutes     int,
  ingredients       jsonb not null default '[]',
  steps             jsonb not null default '[]',
  nutrition         jsonb,
  techniques_taught text[] not null default '{}',
  model             text,
  created_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- meal_plans — daily/weekly plans (header + jsonb days)
-- ----------------------------------------------------------------------------
create table if not exists public.meal_plans (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.users(id) on delete cascade,
  start_date            date not null,
  daily_target_calories int,
  days                  jsonb not null default '[]',
  created_at            timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- cooking_progress — technique mastery / recipe completions (coach engine)
-- ----------------------------------------------------------------------------
create table if not exists public.cooking_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  recipe_id     uuid references public.recipes_generated(id) on delete set null,
  technique     text,                          -- technique practiced/unlocked
  completed     boolean not null default false,
  skill_xp      int not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists cooking_progress_user_tech
  on public.cooking_progress(user_id, technique);

-- ----------------------------------------------------------------------------
-- pet_states — latest evaluated state of the user's companion (1 row kept current)
-- ----------------------------------------------------------------------------
create table if not exists public.pet_states (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null unique references public.users(id) on delete cascade,
  level           int not null default 1,
  xp              int not null default 0,
  mood            pet_mood not null default 'neutral',
  animation_state text not null default 'idle_neutral',
  evaluated_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- ai_interactions_log — every model call (observability, cost, A/B)
-- ----------------------------------------------------------------------------
create table if not exists public.ai_interactions_log (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  kind            ai_kind not null,
  model           text not null,
  request_summary text,
  success         boolean not null default true,
  latency_ms      int,
  created_at      timestamptz not null default now()
);

-- ============================================================================
-- Indexes for the common access patterns (per-user, recent-first)
-- ============================================================================
create index if not exists food_scans_user_created      on public.food_scans(user_id, created_at desc);
create index if not exists fridge_items_user            on public.fridge_items(user_id);
create index if not exists meals_logged_user_logged     on public.meals_logged(user_id, logged_at desc);
create index if not exists recipes_generated_user       on public.recipes_generated(user_id, created_at desc);
create index if not exists meal_plans_user_start        on public.meal_plans(user_id, start_date desc);
create index if not exists ai_log_user_created          on public.ai_interactions_log(user_id, created_at desc);
create index if not exists health_goals_user            on public.health_goals(user_id);

-- ============================================================================
-- Row Level Security — owner-only access on every user-scoped table
-- ============================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'users','user_profiles','health_goals','food_scans','fridge_items',
    'meals_logged','recipes_generated','meal_plans','cooking_progress',
    'pet_states','ai_interactions_log'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- users: a row is owned by its own id.
drop policy if exists users_self on public.users;
create policy users_self on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Every other table: ownership via user_id.
do $$
declare t text;
begin
  foreach t in array array[
    'user_profiles','health_goals','food_scans','fridge_items',
    'meals_logged','recipes_generated','meal_plans','cooking_progress',
    'pet_states','ai_interactions_log'
  ] loop
    execute format('drop policy if exists %I_owner on public.%I;', t, t);
    execute format(
      'create policy %I_owner on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id);',
      t, t
    );
  end loop;
end $$;

-- ============================================================================
-- Triggers
-- ============================================================================

-- Keep user_profiles.updated_at fresh.
create or replace function public.touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end $$ language plpgsql;

drop trigger if exists user_profiles_touch on public.user_profiles;
create trigger user_profiles_touch
  before update on public.user_profiles
  for each row execute function public.touch_updated_at();

-- On new auth user, mirror into public.users and seed a level-1 pet.
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.users (id, email) values (new.id, new.email)
    on conflict (id) do nothing;
  insert into public.pet_states (user_id) values (new.id)
    on conflict (user_id) do nothing;
  return new;
end $$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- Storage bucket for scan images (run once; safe to re-run)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('scans', 'scans', false)
on conflict (id) do nothing;

drop policy if exists scans_owner_rw on storage.objects;
create policy scans_owner_rw on storage.objects
  for all using (
    bucket_id = 'scans' and auth.uid()::text = (storage.foldername(name))[1]
  ) with check (
    bucket_id = 'scans' and auth.uid()::text = (storage.foldername(name))[1]
  );
