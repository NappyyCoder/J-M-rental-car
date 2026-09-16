-- Signed rental agreements. Run in Supabase SQL Editor after schema.sql.

create table if not exists public.signed_documents (
  id uuid primary key,
  form_slug text not null,
  form_title text not null,
  form_version text not null default '',
  fields jsonb not null default '{}'::jsonb,
  signed_at timestamptz not null,
  retain_until timestamptz not null,
  pdf_base64 text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_signed_documents_signed_at
  on public.signed_documents (signed_at desc);

alter table public.signed_documents enable row level security;

create policy "anyone can submit signed documents"
  on public.signed_documents for insert
  with check (true);

create policy "staff read signed documents"
  on public.signed_documents for select
  to authenticated
  using (true);

create policy "staff delete signed documents"
  on public.signed_documents for delete
  to authenticated
  using (true);
