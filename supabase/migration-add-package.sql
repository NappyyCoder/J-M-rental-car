-- Run this if you already created the database before packages were added.

alter table public.vehicles
  add column if not exists package text not null default 'silver'
  check (package in ('gold', 'silver'));

create index if not exists idx_vehicles_package on public.vehicles (package);
