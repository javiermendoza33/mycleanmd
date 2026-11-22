-- Quiz answers (Nov 21 2026, Javier: "the data should be seen in admin portal as well"). One row per completed quiz on
-- the home page — anonymous by design (no name, email or IP). Two kinds in one table:
--   skincare  — skin feel, main concern, routine size, and the product slugs recommended
--   treatment — the five blueprint answers in `answers` (goal, sub, downtime, safety[], experience) and the treatment
--               keys recommended (see src/labo/clinic/treatment-quiz.ts)
-- Read on /clinic/quiz as demand data. Service-role only; the public site writes through /api/labo/quiz.
-- Applied to the mycleanmd project on Nov 21 2026 through the Supabase MCP connector (two migrations: labo_quiz,
-- labo_quiz_treatment_kind). Kept here as the schema of record.
create table if not exists public.labo_quiz (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null default 'skincare' check (kind in ('skincare','treatment')),
  skin        text check (skin in ('balanced','oily','dry','sensitive','combo')),
  concern     text check (concern in ('Acne','Aging','Dryness','Sensitive','Pigment')),
  routine     text check (routine in ('two','short','all')),
  answers     jsonb,                         -- treatment rows: {goal, sub, downtime, safety[], experience}
  picks       jsonb not null default '[]',   -- product slugs (skincare) or treatment keys (treatment), in the order shown
  created_at  timestamptz not null default now()
);
create index if not exists labo_quiz_created_at on public.labo_quiz (created_at desc);
alter table public.labo_quiz enable row level security;
