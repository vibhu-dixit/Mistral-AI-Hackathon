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
