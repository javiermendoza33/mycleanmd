-- Run this in your Supabase SQL editor to set up XeebiHealth

-- Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text not null default 'patient' check (role in ('patient', 'doctor', 'admin')),
  avatar_url text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'patient')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row-level security
alter table public.profiles enable row level security;
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ── Intake submissions ────────────────────────────────────────────────────────
create table if not exists public.intake_submissions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade not null,
  care_type   text not null,
  answers     jsonb not null default '{}',
  submitted_at timestamptz default now()
);

alter table public.intake_submissions enable row level security;

-- Patients can insert and read their own submissions
create policy "Patients can insert own submissions" on public.intake_submissions
  for insert with check (auth.uid() = user_id);

create policy "Patients can view own submissions" on public.intake_submissions
  for select using (auth.uid() = user_id);

-- Admins can read all submissions
create policy "Admins can view all submissions" on public.intake_submissions
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ── The Labo Method telehealth portal (Nov 6 2026) ─────────────────────────────
-- Deliberately separate from profiles/intake_submissions above: Labo Method is
-- its own patient population/clinical data model, not another MyCleanMD care
-- type. Provider-side reads always go through the service-role admin client
-- (same pattern as doctor/intakes), so there is no "provider can read all
-- rows" RLS policy here — only the patient-facing policies below are needed.

create table if not exists public.labo_enrollments (
  id                          uuid primary key default gen_random_uuid(),
  user_id                     uuid references auth.users on delete cascade,  -- null until linked post-checkout, see /join/success
  program_slug                text not null,
  stripe_customer_id          text,
  stripe_subscription_id      text,
  stripe_checkout_session_id  text unique,
  status                      text not null default 'pending_payment' check (status in ('pending_payment', 'active', 'canceled')),
  created_at                  timestamptz default now()
);
alter table public.labo_enrollments enable row level security;
create policy "Patients can view own enrollments" on public.labo_enrollments
  for select using (auth.uid() = user_id);

create table if not exists public.labo_intake_responses (
  id             uuid primary key default gen_random_uuid(),
  enrollment_id  uuid references public.labo_enrollments on delete cascade not null,
  answers        jsonb not null default '{}',
  submitted_at   timestamptz default now()
);
alter table public.labo_intake_responses enable row level security;
create policy "Patients can view own intake responses" on public.labo_intake_responses
  for select using (
    exists (select 1 from public.labo_enrollments e where e.id = enrollment_id and e.user_id = auth.uid())
  );

create table if not exists public.labo_visits (
  id             uuid primary key default gen_random_uuid(),
  enrollment_id  uuid references public.labo_enrollments on delete cascade not null,
  scheduled_at   timestamptz,
  zoom_link      text,
  status         text not null default 'scheduled' check (status in ('scheduled', 'completed', 'canceled')),
  created_at     timestamptz default now()
);
alter table public.labo_visits enable row level security;
create policy "Patients can view own visits" on public.labo_visits
  for select using (
    exists (select 1 from public.labo_enrollments e where e.id = enrollment_id and e.user_id = auth.uid())
  );

create table if not exists public.labo_prescriptions (
  id             uuid primary key default gen_random_uuid(),
  enrollment_id  uuid references public.labo_enrollments on delete cascade not null,
  medication     text not null,
  dose           text,
  status         text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  notes          text,
  written_at     timestamptz default now()
);
alter table public.labo_prescriptions enable row level security;
create policy "Patients can view own prescriptions" on public.labo_prescriptions
  for select using (
    exists (select 1 from public.labo_enrollments e where e.id = enrollment_id and e.user_id = auth.uid())
  );
