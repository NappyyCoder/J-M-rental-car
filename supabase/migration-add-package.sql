-- Run this if you already created the database before packages were added.
-- Fixes Admin "Could not save vehicle" when the package column is missing.

alter table public.vehicles
  add column if not exists package text not null default 'silver';

alter table public.vehicles
  drop constraint if exists vehicles_package_check;

alter table public.vehicles
  add constraint vehicles_package_check check (package in ('gold', 'silver'));

create index if not exists idx_vehicles_package on public.vehicles (package);

-- Refresh PostgREST schema cache (Supabase usually picks this up within a few seconds)
notify pgrst, 'reload schema';
