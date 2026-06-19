# XeebiHealth — Telehealth Portal

A full-stack telehealth platform with three role-based portals, built with Next.js 16, Supabase, and Tailwind CSS. Deployed on Vercel.

## Live App

**Production:** https://xeebihealth.vercel.app

## Portals

| Portal | Route | Access |
|---|---|---|
| Patient | `/patient/dashboard` | Role: `patient` |
| Doctor | `/doctor/dashboard` | Role: `doctor` |
| Super Admin | `/admin/dashboard` | Role: `admin` |

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Auth & Database:** Supabase
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Project Structure

```
src/
  app/
    auth/           # Login + Signup
    patient/        # Patient portal
    doctor/         # Doctor portal
    admin/          # Super Admin portal
  components/
    Sidebar.tsx     # Role-aware sidebar nav
    TopBar.tsx      # Page header
    StatCard.tsx    # KPI card
  lib/
    supabase/       # Supabase client (browser + server)
  proxy.ts          # Auth guard (Next.js 16 middleware)
```

## Local Development

```bash
npm install
# Add .env.local with Supabase keys (see below)
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://hprtecdhqozcytihmqvg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Database Setup

Run `supabase-schema.sql` in your Supabase SQL Editor to create the `profiles` table and auth trigger.

## Design

Figma: [XeebiHealth — Telehealth Portal](https://www.figma.com/design/ZebttRC419nXGKZZYLs0dF/XeebiHealth-%E2%80%94-Telehealth-Portal)
