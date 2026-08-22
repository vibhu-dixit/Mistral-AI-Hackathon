-- Run once in the Supabase SQL Editor.
-- Adds street-use permit contractor fields looked up from GPS.

alter table public.hazards add column if not exists agent text;
alter table public.hazards add column if not exists agent_phone text;
alter table public.hazards add column if not exists permit_street_name text;
alter table public.hazards add column if not exists permit_number text;
alter table public.hazards add column if not exists permit_type text;
alter table public.hazards add column if not exists permit_status text;
alter table public.hazards add column if not exists permit_distance_m double precision;
