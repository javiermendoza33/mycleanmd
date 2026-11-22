-- Rate plans for the online shop (Nov 22 2026). Applied as migration `labo_rate_plans` via the Supabase MCP connector;
-- this file is the schema of record. See src/lib/labo/rates.ts and /clinic/rates.
create table if not exists public.labo_rate_plans (
  slug text primary key,
  line text not null,
  name text not null,
  locked boolean not null default true,     -- partner lines: price is the brand's MSRP, not changed online
  cost numeric(10,2),                       -- wholesale unit cost (margin reports)
  price numeric(10,2),                      -- the published online price
  draft_price numeric(10,2),                -- adjustable lines: edited in admin, live only after Publish
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table public.labo_rate_plans enable row level security;
create table if not exists public.labo_rate_events (
  id bigserial primary key,
  slug text not null,
  kind text not null check (kind in ('cost','price')),
  old_value numeric(10,2),
  new_value numeric(10,2),
  at timestamptz not null default now(),
  by text
);
alter table public.labo_rate_events enable row level security;
-- Seed: the migration inserted every current product (ALASTIN costs from the May 2026 order form; skinbetter costs null).
