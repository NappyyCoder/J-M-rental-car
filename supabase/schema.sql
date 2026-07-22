-- J&M Car Rental — run in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  make text not null,
  model text not null,
  year int not null check (year >= 1990 and year <= 2100),
  category text not null check (category in ('economy', 'sedan', 'suv', 'truck', 'van')),
  package text not null default 'silver' check (package in ('gold', 'silver')),
  daily_rate numeric(10, 2) not null check (daily_rate > 0),
  seats int not null check (seats >= 2 and seats <= 15),
  transmission text not null check (transmission in ('automatic', 'manual')),
  image_url text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.vehicle_unavailable_dates (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  unavailable_date date not null,
  unique (vehicle_id, unavailable_date)
);

create index if not exists idx_unavailable_vehicle_date
  on public.vehicle_unavailable_dates (vehicle_id, unavailable_date);

create index if not exists idx_vehicles_package
  on public.vehicles (package);

alter table public.vehicles enable row level security;
alter table public.vehicle_unavailable_dates enable row level security;

-- Anyone can view fleet + availability (public website)
create policy "public read vehicles"
  on public.vehicles for select
  using (true);

create policy "public read unavailable dates"
  on public.vehicle_unavailable_dates for select
  using (true);

-- Only logged-in staff can manage inventory
create policy "staff insert vehicles"
  on public.vehicles for insert
  to authenticated
  with check (true);

create policy "staff update vehicles"
  on public.vehicles for update
  to authenticated
  using (true);

create policy "staff delete vehicles"
  on public.vehicles for delete
  to authenticated
  using (true);

create policy "staff insert unavailable dates"
  on public.vehicle_unavailable_dates for insert
  to authenticated
  with check (true);

create policy "staff delete unavailable dates"
  on public.vehicle_unavailable_dates for delete
  to authenticated
  using (true);

-- Photo storage (Dashboard → Storage → New bucket, or run below)
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;

create policy "public read vehicle images"
  on storage.objects for select
  using (bucket_id = 'vehicle-images');

create policy "staff upload vehicle images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vehicle-images');

create policy "staff delete vehicle images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'vehicle-images');
