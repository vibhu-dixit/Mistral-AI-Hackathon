-- RoadWatch — paste this once into Supabase SQL Editor and Run.
-- Dashboard → SQL Editor → New query → paste → Run
-- You do not need the database password. Being signed into the project is enough.

-- =============================================================================
-- supabase/schema.sql
-- =============================================================================

create extension if not exists "pgcrypto";

do $$ begin
  create type hazard_type as enum (
    'pothole',
    'road_debris',
    'blocked_lane',
    'flooding',
    'collision',
    'damaged_signage'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type severity_tier as enum ('routine', 'urgent', 'critical');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type hazard_status as enum (
    'detected',
    'report_ready',
    'reported',
    'in_progress',
    'resolved'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type observation_source as enum ('photo', 'video', 'fleet');
exception when duplicate_object then null;
end $$;

create table if not exists public.hazards (
  id uuid primary key default gen_random_uuid(),
  hazard_type hazard_type not null,
  severity severity_tier not null,
  status hazard_status not null default 'detected',
  confidence numeric(4,3) not null check (confidence >= 0 and confidence <= 1),
  latitude double precision not null,
  longitude double precision not null,
  location_label text,
  location_confidence text,
  ocr_text text,
  description text not null,
  ai_reasoning text,
  lane_impact text,
  image_url text,
  priority_score integer not null default 0 check (priority_score >= 0 and priority_score <= 100),
  sighting_count integer not null default 1,
  is_duplicate boolean not null default false,
  duplicate_of uuid references public.hazards(id) on delete set null,
  civic_category text,
  target_agency text,
  generated_report text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  hazard_id uuid not null references public.hazards(id) on delete cascade,
  civic_category text not null,
  generated_text text not null,
  target_agency text,
  external_case_id text,
  status text not null default 'ready_for_submission',
  created_at timestamptz not null default now()
);

create table if not exists public.observations (
  id uuid primary key default gen_random_uuid(),
  hazard_id uuid not null references public.hazards(id) on delete cascade,
  observed_at timestamptz not null default now(),
  latitude double precision not null,
  longitude double precision not null,
  image_url text,
  source observation_source not null default 'photo',
  video_id text,
  frame_index integer
);

create index if not exists hazards_geo_idx
  on public.hazards (latitude, longitude);

create index if not exists hazards_status_idx
  on public.hazards (status);

create index if not exists hazards_type_idx
  on public.hazards (hazard_type);

create index if not exists hazards_severity_idx
  on public.hazards (severity);

create index if not exists hazards_created_at_idx
  on public.hazards (created_at desc);

create index if not exists observations_hazard_idx
  on public.observations (hazard_id);

create index if not exists reports_hazard_idx
  on public.reports (hazard_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists hazards_set_updated_at on public.hazards;
create trigger hazards_set_updated_at
before update on public.hazards
for each row execute function public.set_updated_at();

alter table public.hazards enable row level security;
alter table public.reports enable row level security;
alter table public.observations enable row level security;

drop policy if exists "Public read hazards" on public.hazards;
create policy "Public read hazards"
  on public.hazards for select
  using (true);

drop policy if exists "Public read reports" on public.reports;
create policy "Public read reports"
  on public.reports for select
  using (true);

drop policy if exists "Public read observations" on public.observations;
create policy "Public read observations"
  on public.observations for select
  using (true);

insert into storage.buckets (id, name, public)
values ('hazard-media', 'hazard-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read hazard media" on storage.objects;
create policy "Public read hazard media"
  on storage.objects for select
  using (bucket_id = 'hazard-media');

-- =============================================================================
-- supabase/rls-writes.sql
-- =============================================================================

drop policy if exists "Public insert hazards" on public.hazards;
create policy "Public insert hazards"
  on public.hazards for insert
  with check (true);

drop policy if exists "Public update hazards" on public.hazards;
create policy "Public update hazards"
  on public.hazards for update
  using (true)
  with check (true);

drop policy if exists "Public insert reports" on public.reports;
create policy "Public insert reports"
  on public.reports for insert
  with check (true);

drop policy if exists "Public insert observations" on public.observations;
create policy "Public insert observations"
  on public.observations for insert
  with check (true);

drop policy if exists "Public insert hazard media" on storage.objects;
create policy "Public insert hazard media"
  on storage.objects for insert
  with check (bucket_id = 'hazard-media');

drop policy if exists "Public update hazard media" on storage.objects;
create policy "Public update hazard media"
  on storage.objects for update
  using (bucket_id = 'hazard-media')
  with check (bucket_id = 'hazard-media');

-- =============================================================================
-- backend/supabase/001_observations.sql
-- =============================================================================

create table if not exists public.image_observations (
  id uuid primary key,
  asset_name text not null,
  coordinates jsonb,
  location_source text not null,
  location_confidence double precision not null default 0,
  ocr_text text,
  hazard_type text,
  severity text,
  confidence double precision,
  description text,
  processing_status text not null,
  generated_report text,
  duplicate boolean not null default false,
  hazard_id uuid,
  created_at timestamptz not null
);

create index if not exists image_observations_created_at_idx
  on public.image_observations (created_at desc);

create index if not exists image_observations_hazard_type_idx
  on public.image_observations (hazard_type);

alter table public.image_observations enable row level security;

drop policy if exists "Public read image observations" on public.image_observations;
create policy "Public read image observations"
  on public.image_observations for select
  using (true);

drop policy if exists "Public insert image observations" on public.image_observations;
create policy "Public insert image observations"
  on public.image_observations for insert
  with check (true);
