-- Labo Method provider portal (Nov 6 2026). Run in the Supabase SQL editor AFTER supabase-schema.sql.
-- Idempotent: every statement is "if not exists" or drop/create of a policy, so re-running is safe.

-- visits: give the provider room to schedule (type, length, no-show, notes).
alter table public.labo_visits add column if not exists visit_type text not null default 'follow_up';
alter table public.labo_visits add column if not exists duration_min int not null default 15;
alter table public.labo_visits add column if not exists reason text;
alter table public.labo_visits drop constraint if exists labo_visits_status_check;
alter table public.labo_visits add constraint labo_visits_status_check check (status in ('scheduled','completed','canceled','no_show'));

-- visit notes (SOAP-lite). One per visit at most; drafts until signed.
create table if not exists public.labo_notes (
  id             uuid primary key default gen_random_uuid(),
  enrollment_id  uuid references public.labo_enrollments on delete cascade not null,
  visit_id       uuid references public.labo_visits on delete set null,
  fields         jsonb not null default '{}',   -- weight, bmi, change, current_med, next_med, side_effects, refills
  plan           text,
  status         text not null default 'draft' check (status in ('draft','signed')),
  signed_at      timestamptz,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);
alter table public.labo_notes enable row level security;
drop policy if exists "Patients can view own signed notes" on public.labo_notes;
create policy "Patients can view own signed notes" on public.labo_notes
  for select using (status = 'signed' and exists (select 1 from public.labo_enrollments e where e.id = enrollment_id and e.user_id = auth.uid()));

-- requests: refills and labs. Patients create, the provider decides.
create table if not exists public.labo_requests (
  id              uuid primary key default gen_random_uuid(),
  enrollment_id   uuid references public.labo_enrollments on delete cascade not null,
  patient_user_id uuid references auth.users on delete cascade not null,
  kind            text not null check (kind in ('refill','lab')),
  status          text not null default 'pending' check (status in ('pending','approved','denied','completed')),
  medication      text,
  dose            text,
  pharmacy        text,
  patient_note    text,
  result          jsonb,          -- labs: [{test, value, unit, range, flag}] + file_url
  provider_note   text,           -- what the patient sees
  decided_at      timestamptz,
  created_at      timestamptz default now()
);
alter table public.labo_requests enable row level security;
drop policy if exists "Patients can view own requests" on public.labo_requests;
create policy "Patients can view own requests" on public.labo_requests
  for select using (patient_user_id = auth.uid());

-- messages: one thread per patient (enrollment-agnostic), both directions.
create table if not exists public.labo_messages (
  id              uuid primary key default gen_random_uuid(),
  patient_user_id uuid references auth.users on delete cascade not null,
  sender          text not null check (sender in ('patient','provider')),
  body            text not null,
  read_at         timestamptz,
  created_at      timestamptz default now()
);
create index if not exists labo_messages_patient_idx on public.labo_messages (patient_user_id, created_at);
alter table public.labo_messages enable row level security;
drop policy if exists "Patients can view own messages" on public.labo_messages;
create policy "Patients can view own messages" on public.labo_messages
  for select using (patient_user_id = auth.uid());

-- provider settings: a single row (id = 1). Hours, visit types, public bio.
create table if not exists public.labo_provider_settings (
  id           int primary key default 1 check (id = 1),
  bio          text,
  specialties  jsonb not null default '[]',
  hours        jsonb not null default '{}',   -- {"mon":{"on":true,"from":"09:00","to":"17:00"}, ...}
  visit_types  jsonb not null default '[]',   -- [{"key":"initial","label":"Initial consultation","min":30}, ...]
  timezone     text not null default 'America/Los_Angeles',
  updated_at   timestamptz default now()
);
alter table public.labo_provider_settings enable row level security;
insert into public.labo_provider_settings (id) values (1) on conflict (id) do nothing;
