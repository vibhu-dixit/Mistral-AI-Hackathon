create table if not exists observations (
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
  created_at timestamptz not null
);

create index if not exists observations_created_at_idx on observations (created_at desc);
create index if not exists observations_hazard_type_idx on observations (hazard_type);
