-- The clinic's own scheduler (sandbox, Nov 19 2026). Run in the Supabase SQL editor (Javier). Service-role only: no RLS
-- policies on purpose — the site's API writes with the admin client, the provider portal reads with it.
create table if not exists public.labo_bookings (
  id              uuid primary key default gen_random_uuid(),
  service_slug    text not null,
  service_name    text not null,
  duration_min    int  not null,
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  status          text not null default 'booked' check (status in ('booked','confirmed','completed','canceled','no_show')),
  first_name      text not null,
  last_name       text not null,
  email           text not null,
  phone           text not null,
  notes           text,
  intake          jsonb,
  sms_consent     boolean not null default false,
  policy_consent  boolean not null default false,
  cancel_token    text not null,
  source          text not null default 'web',
  user_id         uuid references auth.users on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists labo_bookings_starts_at on public.labo_bookings (starts_at);
create index if not exists labo_bookings_email on public.labo_bookings (lower(email));
alter table public.labo_bookings enable row level security;
