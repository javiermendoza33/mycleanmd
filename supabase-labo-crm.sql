-- The Labo CRM (Nov 23 2026, Javier: "all data and clients reside on our CRM, so we can intake both LaboClinic and LaboMethod").
-- One person record across both brands. Clinical detail (intake answers, charts, prescriptions) lives in the EMR (Cuvo);
-- here: who they are, which brand(s), what happened, and the ids that point into Stripe / Cuvo / Vagaro.
create table if not exists public.labo_customers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,                          -- lower-cased
  first_name    text not null default '',
  last_name     text not null default '',
  phone         text,
  state         text,                                          -- 2-letter, where they live (telehealth licensure)
  brands        text[] not null default '{}',                  -- 'clinic' | 'method'
  source        text,                                          -- first touch: booking | shop | method-start | contact | import
  user_id       uuid references auth.users on delete set null, -- their sign-in, once they have one
  cuvo_patient_id   text,
  stripe_customer_id text,
  vagaro_customer_id text,
  sms_consent   boolean not null default false,
  email_consent boolean not null default false,
  tags          text[] not null default '{}',
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists labo_customers_name on public.labo_customers (last_name, first_name);
create index if not exists labo_customers_user on public.labo_customers (user_id);

-- What happened, per person, across brands: booking, visit, product order, program started, case status, lab result…
create table if not exists public.labo_customer_events (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.labo_customers on delete cascade,
  brand       text not null,                                   -- clinic | method
  kind        text not null,                                   -- booking | order | enrolled | case | rx | shipment | lab | visit | message | note
  title       text not null,
  data        jsonb not null default '{}'::jsonb,
  at          timestamptz not null default now()
);
create index if not exists labo_customer_events_cust on public.labo_customer_events (customer_id, at desc);

-- A Method program start: the bridge between our customer, their sign-in, the Cuvo patient/case and the Stripe payment.
create table if not exists public.labo_care (
  id              uuid primary key default gen_random_uuid(),
  customer_id     uuid not null references public.labo_customers on delete cascade,
  user_id         uuid references auth.users on delete set null,
  program_slug    text not null,
  cuvo_patient_id text,
  cuvo_case_id    text,
  cuvo_mode       text not null default 'mock',                -- mock | sandbox | live (which Cuvo the ids belong to)
  status          text not null default 'started',             -- started | awaiting_payment | filed | active | declined | cancelled
  stripe_checkout_session_id text unique,
  paid_at         timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists labo_care_user on public.labo_care (user_id, created_at desc);

-- Server-only tables: RLS on, no policies → only the service role (our API routes) reads or writes.
alter table public.labo_customers enable row level security;
alter table public.labo_customer_events enable row level security;
alter table public.labo_care enable row level security;

-- Backfill: everyone who ever booked at the clinic becomes a customer.
insert into public.labo_customers (email, first_name, last_name, phone, brands, source, sms_consent, created_at)
select lower(b.email), max(b.first_name), max(b.last_name), max(b.phone), '{clinic}', 'booking', bool_or(b.sms_consent), min(b.created_at)
from public.labo_bookings b where b.email is not null and b.email <> ''
group by lower(b.email)
on conflict (email) do nothing;
