@AGENTS.md

# XeebiHealth — Project Context

Full-stack telehealth portal. Three role-based portals (Patient, Doctor, Admin) built with Next.js 16 App Router, Supabase auth + database, Tailwind CSS v4, deployed on Vercel.

## Quick start on any machine

```bash
npm install
vercel link        # links to mycleantext/xeebihealth
vercel env pull .env.local
npm run dev        # http://localhost:3000
```

## Live URLs

- Production: https://xeebihealth.vercel.app
- Figma: https://www.figma.com/design/ZebttRC419nXGKZZYLs0dF/XeebiHealth-%E2%80%94-Telehealth-Portal

## Architecture

```
src/
  app/
    auth/login          # Supabase email/password login
    auth/signup         # Signup — sets role via raw_user_meta_data
    patient/            # Patient portal (layout + dashboard)
    doctor/             # Doctor portal (layout + dashboard)
    admin/              # Super Admin portal (layout + dashboard)
  components/
    Sidebar.tsx         # Role-aware sidebar, accepts navItems prop
    TopBar.tsx          # Page header with title + subtitle
    StatCard.tsx        # KPI stat card with optional accent color
  lib/supabase/
    client.ts           # Browser Supabase client
    server.ts           # Server Supabase client (SSR)
  proxy.ts              # Auth guard middleware (redirects unauthenticated → /auth/login)
```

## Database (Supabase)

- Project URL: https://hprtecdhqozcytihmqvg.supabase.co
- One table: `public.profiles` — extends `auth.users` with `role` (patient | doctor | admin)
- RLS enabled. Auth trigger auto-creates profile on signup.
- Schema is in `supabase-schema.sql` — run in Supabase SQL editor if setting up fresh.

## Design system (globals.css)

```
--bg-dark:    #0B1828   (page background)
--sidebar-bg: #071018   (sidebar)
--card-bg:    #0E1D30   (cards/panels)
--teal:       #7ECFCF   (primary accent)
--teal-dim:   #193F3F   (active nav bg)
--muted:      #7D99AF   (secondary text)
--divider:    #1A2E42   (borders)
--green:      #64C88C   (success/prescriptions)
--amber:      #F79E3C   (warnings/messages)
```

## Current state

All three portal layouts are scaffolded with hardcoded placeholder data — no live Supabase queries yet.

**Built:**
- Login / Signup pages (wired to Supabase auth)
- Patient dashboard (appointments list, messages list, stat cards)
- Doctor dashboard (placeholder)
- Admin dashboard (placeholder)
- Sidebar, TopBar, StatCard components

**In Figma but not yet built:**
- Patient: Appointments page, Messages page, Prescriptions page, Lab Results page, Video Call screen
- Doctor: Patient list, Schedule, Prescriptions management
- Admin: User management, analytics

## Portals & nav

Each portal has its own layout that passes `navItems` to `<Sidebar>`. To add a new page, create the route under the portal folder and add it to the layout's `navItems` array.

## Auth flow

1. User signs up → Supabase creates `auth.users` row + trigger creates `profiles` row with role
2. `proxy.ts` middleware protects all non-`/auth` routes
3. Role-based routing is manual — middleware currently redirects to login only; portal access by URL convention

## Env vars (all in Vercel, pull with `vercel env pull .env.local`)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```
