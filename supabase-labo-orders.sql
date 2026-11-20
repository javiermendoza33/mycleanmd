-- Shop orders (sandbox, Nov 20 2026): one row per paid Stripe Checkout session from the skincare shop, worked by the clinic
-- team on /clinic/orders (own-line items are placed with Selfnamed by hand until a store bridge exists). Service-role only.
create table if not exists public.labo_orders (
  id                 uuid primary key default gen_random_uuid(),
  stripe_session_id  text not null unique,
  stripe_payment_id  text,
  status             text not null default 'paid' check (status in ('paid','placed','shipped','done','refunded','canceled')),
  fulfillment        text not null default 'ship' check (fulfillment in ('ship','pickup')),
  name               text,
  email              text,
  phone              text,
  ship_to            jsonb,
  items              jsonb not null,          -- [{slug, name, qty, unit, own}]
  subtotal           numeric(10,2) not null default 0,
  shipping           numeric(10,2) not null default 0,
  tax                numeric(10,2) not null default 0,
  total              numeric(10,2) not null default 0,
  currency           text not null default 'usd',
  vendor_order_id    text,                    -- the Selfnamed order number once placed
  tracking           text,
  staff_notes        text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists labo_orders_created_at on public.labo_orders (created_at desc);
alter table public.labo_orders enable row level security;
