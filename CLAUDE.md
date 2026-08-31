@AGENTS.md

# XeebiHealth — Project Context

Full-stack telehealth portal with a public marketing landing page, patient onboarding flow, 11 care-type portals with intake forms, and three internal dashboards (Patient, Doctor, Admin). Built with Next.js 16 App Router, Supabase auth + DB, Tailwind CSS v4, deployed on Vercel.

## Quick start on any machine

```bash
git clone https://github.com/javiermendoza33/mycleanmd
cd mycleanmd
npm install
vercel link        # links to mycleantext/mycleanmd
vercel env pull .env.local
npm run dev        # http://localhost:3000
```

> npm cache permission issue? Run: `sudo chown -R $(whoami) ~/.npm && npm install`

## Names — three of them, all current

| Thing | Name |
|---|---|
| GitHub repo | `javiermendoza33/mycleanmd` (renamed from xeebihealth; local dir is still `~/xeebihealth`) |
| Vercel project | `mycleanmd` |
| Domains | mycleanmd.com · thelabomethod.com (added Aug 2026) · xeebihealth.vercel.app |
| Brand in the product | **MyCleanMD** — rename in `src/lib/brand.ts` only |

The Labo Method rebrand is planned; change `src/lib/brand.ts` rather than hunting
strings. The brand used to be hardcoded across ~10 files, which is how production
ended up saying MyCleanMD while the code still said XeebiHealth.

## Site-access gate

Everything except `/gate` redirects there unless the `_gate` cookie matches
`NEXT_PUBLIC_GATE_TOKEN` (see `src/proxy.ts`). Soft gate only — unsigned cookie,
password checked client-side. It keeps the unreleased site off the public
internet; it is not security. Real auth is still Supabase, behind it.

Local dev needs `NEXT_PUBLIC_GATE_PASSWORD` and `NEXT_PUBLIC_GATE_TOKEN` in
`.env.local`; `vercel env pull` does not supply them.

## Social sign-in (Google / Apple / Facebook)

`src/components/SocialAuth.tsx` renders the buttons on `/auth/login` and
`/auth/signup`. All three are built. **Only providers that are actually enabled
in Supabase are rendered**, and the list comes from `/api/auth/providers`, which
probes Supabase server-side (5-minute cache).

**Enable a provider in the Supabase dashboard and its button appears on the next
page load. No deploy, no code change.**

### Why it works that way

`signInWithOAuth()` does **not** return an error for a disabled provider. It
hard-navigates to Supabase, which answers with a raw JSON 400:

```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

A patient on a telehealth login would see that JSON in their browser. Hence the
probe: `/auth/v1/authorize?provider=X` returns **302 when enabled, 400 when
not**, and needs no API key. (`/auth/v1/settings` is tidier but wants the anon
key, which pulls blank from Vercel on this project.)

⚠️ `/api/auth/providers` is in the **public routes list in `src/proxy.ts`**. It
starts with `/api`, not `/auth`, so without that entry the auth guard bounces it
to `/auth/login` and the login page silently renders **no** social buttons.

### Status

| Provider | State | What it needs |
|---|---|---|
| Google | ✅ enabled | already configured |
| Apple | ⬜ off | Apple Developer paid account → Services ID, Sign in with Apple key (.p8), Team ID, Key ID |
| Facebook | ⬜ off | Meta app → App ID + App Secret, "Facebook Login" product added, app taken Live |

**Callback URL for every provider:**
`https://hprtecdhqozcytihmqvg.supabase.co/auth/v1/callback`

Apple additionally needs `thelabomethod.com` / `mycleanmd.com` registered as a
verified domain and Return URL on the Services ID.

### Role handling

`/auth/signup` passes the doctor/patient choice through the OAuth round-trip as
`?role=` on the callback URL. Without it every social signup landed as a patient
and the role selector was silently ignored.

The callback whitelists `patient | doctor` and applies the role **only when the
profile has no role yet** — otherwise a crafted `?role=doctor` link would let an
existing patient re-sign-in as a doctor. `admin` is deliberately not accepted
from a URL at all.

⚠️ **Pre-existing, not introduced here:** the email signup form already lets
anyone self-select `doctor`, which grants the doctor dashboard. Worth locking to
an invite or an admin approval before real patients use the portal.

### Names from providers

Google and Facebook return a name every time. **Apple returns it only on the
FIRST authorization and never again** — the callback saves it when it arrives so
onboarding does not ask twice.

## Live URLs

- Production: https://mycleanmd.com and https://thelabomethod.com
- Figma: https://www.figma.com/design/ZebttRC419nXGKZZYLs0dF/XeebiHealth-%E2%80%94-Telehealth-Portal

## Architecture

```
src/
  app/
    page.tsx                    # Public landing page — GLP-1 / medical weight loss
    gate/                       # Site-access gate (see above)
    auth/login                  # Supabase email/password login
    auth/signup                 # Signup with role selection
    auth/callback/route.ts      # OAuth callback handler
    onboarding/                 # 6-step patient onboarding (name, DOB, state, care type, insurance, goals)
    patient/
      layout.tsx                # Patient portal layout with sidebar
      dashboard/                # Dashboard with stat cards + appointments + messages
      care/
        primary/                # Each care type: landing page + intake/page.tsx form
        mental/
        dermatology/
        urgent/
        womens/
        weight/                 # Also has weight/plan/page.tsx — personalized weight loss plan
        male/
        hair/
        longevity/
        menopause/
        nutrition/
    doctor/                     # Doctor portal (dashboard, scaffold)
    admin/                      # Admin portal (dashboard, scaffold)
  components/
    Sidebar.tsx                 # Role-aware sidebar, accepts navItems prop
    TopBar.tsx                  # Page header with title + subtitle
    StatCard.tsx                # KPI stat card with optional accent color
    CareShell.tsx               # Shared wrapper for care landing pages
    IntakeFlow.tsx              # Multi-step intake form component (reused across care types)
    HeroCanvas.tsx              # Animated canvas element for the landing page hero
  lib/supabase/
    client.ts                   # Browser Supabase client
    server.ts                   # Server Supabase client (SSR)
  proxy.ts                      # Auth guard middleware (redirects unauthenticated → /auth/login)
```

## Database (Supabase)

- Project URL: https://hprtecdhqozcytihmqvg.supabase.co
- One table: `public.profiles` — extends `auth.users` with `role` (patient | doctor | admin)
- RLS enabled. Auth trigger auto-creates profile on signup.
- Schema is in `supabase-schema.sql` — run in Supabase SQL editor if setting up fresh.

## Design system (globals.css)

Default (dark, used by Doctor/Admin portals and landing page):
```
--bg-dark:    #0B1828   page background
--sidebar-bg: #071018   sidebar
--card-bg:    #0E1D30   cards/panels
--teal:       #7ECFCF   primary accent
--teal-dim:   #193F3F   active nav bg
--muted:      #7D99AF   secondary text
--divider:    #1A2E42   borders
--green:      #64C88C   success/prescriptions
--amber:      #F79E3C   warnings/messages
```

Patient portal overrides (warm light/beige theme — `.patient-portal` class on layout wrapper):
```
--bg-dark:    #F4F7F5
--sidebar-bg: #F5F0E8
--card-bg:    #FFFFFF
--divider:    #E2ECE7
--muted:      #7A9386
--teal-dim:   #EBF5EF
--fg:         #1C2D26
```

## Care types (11 total)

Each lives at `/patient/care/<key>/` (landing) and `/patient/care/<key>/intake/` (intake form):

| Key | Label |
|---|---|
| primary | Primary Care |
| mental | Mental Health |
| dermatology | Skincare / Dermatology |
| urgent | Urgent Care |
| womens | Women's Health |
| weight | Weight Loss (also has `/plan/` page with personalized projection) |
| male | Male Sexual Health |
| hair | Hair Loss |
| longevity | Longevity |
| menopause | Menopause |
| nutrition | Nutrition |

## Current state

- Landing page: GLP-1 weight-loss marketing page (hero `/public/hero.png`, how-it-works, what's-included, stats, footer). Rebuilt Aug 2026 from the live production build — it had been deployed from an uncommitted tree and existed nowhere in git.
- Onboarding: 6-step flow (name → DOB → state → care type → insurance → goals), saves to Supabase profiles
- All 11 care landing + intake pages: built using `CareShell` and `IntakeFlow` components
- Weight care: most detailed — BMI visualization, 6-month projection chart, personalized plan page
- Patient portal: light/beige theme, dashboard with hardcoded placeholder data
- Doctor + Admin dashboards: scaffold only, no real data
- Auth: login, signup, and OAuth callback all wired to Supabase

## Env vars (all in Vercel — pull with `vercel env pull .env.local`)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
NEXT_PUBLIC_GATE_PASSWORD     # gate only — not in Vercel, set locally
NEXT_PUBLIC_GATE_TOKEN        # gate only — not in Vercel, set locally
```

⚠️ These pull **blank** from Vercel (they're marked sensitive), so a fresh
`vercel env pull` leaves you unable to run locally. Put real values in
`.env.local` by hand. Nothing should construct a client at module scope —
that used to break `next build` outright whenever a key was missing.
