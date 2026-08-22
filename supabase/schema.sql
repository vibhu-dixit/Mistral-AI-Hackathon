-- RoadWatch — paste this into Supabase SQL Editor and run once.
-- Dashboard → SQL Editor → New query → Run

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
  agent text,
  agent_phone text,
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

-- Writes go through the backend using the service role key (bypasses RLS).

insert into storage.buckets (id, name, public)
values ('hazard-media', 'hazard-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read hazard media" on storage.objects;
create policy "Public read hazard media"
  on storage.objects for select
  using (bucket_id = 'hazard-media');
