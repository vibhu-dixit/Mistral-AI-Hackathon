-- Run once in the Supabase SQL Editor after apply_all.sql.
-- Adds the two dashboard fields that were not in the original hazards table.
-- Dashboard → SQL Editor → New query → paste → Run

alter table public.hazards
  add column if not exists votes integer not null default 0;

alter table public.hazards
  add column if not exists duplicate_distance_m double precision;
