-- Run after schema.sql. Allows the publishable key to insert demo data.
-- Dashboard → SQL Editor → paste → Run

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
