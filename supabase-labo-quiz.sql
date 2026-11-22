-- Skin quiz answers (Nov 21 2026, Javier: "the data should be seen in admin portal as well"). One row per completed
-- quiz on the home page — anonymous by design (no name, email or IP): skin feel, main concern, routine size, and the
-- product slugs the quiz recommended. Read on /clinic/quiz as demand data (what Seattle skin is asking for).
-- Service-role only; the public site writes through /api/labo/quiz.
create table if not exists public.labo_quiz (
  id          uuid primary key default gen_random_uuid(),
  skin        text not null check (skin in ('balanced','oily','dry','sensitive','combo')),
  concern     text not null check (concern in ('Acne','Aging','Dryness','Sensitive','Pigment')),
  routine     text not null check (routine in ('two','short','all')),
  picks       jsonb not null default '[]',   -- [slug, …] in the order shown
  created_at  timestamptz not null default now()
);
create index if not exists labo_quiz_created_at on public.labo_quiz (created_at desc);
alter table public.labo_quiz enable row level security;
