-- Clinic staff portal (sandbox, Nov 19 2026): staff + roles, time blocks, service overrides, and three columns on the
-- bookings table. Run AFTER supabase-labo-bookings.sql in the Supabase SQL editor (Javier). Service-role only.
create table if not exists public.labo_staff (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,                 -- stored lower-case; must match the Supabase sign-in email
  name        text not null,
  role        text not null default 'staff' check (role in ('admin','staff')),
  active      boolean not null default true,
  color       text,
  user_id     uuid references auth.users on delete set null,
  invited_by  text,
  created_at  timestamptz not null default now()
);
create table if not exists public.labo_blocks (
  id          uuid primary key default gen_random_uuid(),
  staff_id    uuid references public.labo_staff on delete cascade,   -- null = the whole clinic (holiday, closure)
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  reason      text,
  created_by  text,
  created_at  timestamptz not null default now()
);
create index if not exists labo_blocks_starts_at on public.labo_blocks (starts_at);
create table if not exists public.labo_services (
  slug          text primary key,                   -- matches MENU in src/labo/clinic/booking.ts
  name          text,
  duration_min  int,
  price         numeric(10,2),
  price_note    text,
  active        boolean not null default true,
  updated_at    timestamptz not null default now()
);
alter table public.labo_bookings
  add column if not exists provider_id uuid references public.labo_staff on delete set null,
  add column if not exists staff_notes text,
  add column if not exists created_by  text;
alter table public.labo_staff    enable row level security;
alter table public.labo_blocks   enable row level security;
alter table public.labo_services enable row level security;
