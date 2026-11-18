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

## The Labo Method homepage — ported from the 18 Sep 2026 prototype (Sep 18)

`~/Downloads/labo-home-prototype.html` + `HANDOFF.md` ("Labo White Room") replaced the
homepage. The handoff's rule: port it, don't reinterpret it.

- **The whole of `src/app/labo/` is on the White Room system** (inner pages ported
  Sep 18, same day, second session). `labo/layout.tsx` owns metadata/robots/JSON-LD
  plus the fonts (Inter + IBM Plex Mono via next/font) and the `[data-labo]` wrapper;
  `labo.css` is the prototype CSS rescoped `[data-labo-home]`→`[data-labo]` with an
  "inner pages" block appended (defs rows, hlrow, faq, fld inputs, car carousel, tl
  lists — same tokens and shapes). `(home)/page.tsx` keeps the prototype's header
  inline and shares `Footer` from `components/labo/Chrome.tsx`; `(site)/layout.tsx`
  wraps the inner pages in the route-aware `Header` + shared `Footer`. Like the
  prototype, there is NO mobile nav drawer — nav hides under 880px and the footer is
  the site map. The old Newsreader/brass/pine system is gone. Route groups don't
  change URLs; imports of the moved server action must include the group:
  `@/app/labo/(site)/contact/actions`.
- **The gate stores and submits NOTHING** (handoff §8, HIPAA): answers live in React
  state only. Out-of-state → honest decline + a `mailto:` waitlist link the visitor
  sends themselves. Adding any POST here needs a BAA on every hop first.
- **Still placeholder, on purpose:** the four photos in `public/labo/shot-0*.jpg`
  (stock, captioned with shot numbers for the shoot), the example lab panel (values
  FABRICATED — labelled illustrative; Monika must correct/remove), and every CTA goes
  through `HEALTHIE.*` in `src/labo/content.ts`, which still point at the bare
  `app.gethealthie.com` — the handoff says that is the exact bug to fix once the
  practice supplies its registration / booking / login URLs. `LAUNCH_READY` stays
  false (noindex) until Monika's items clear. NPP / privacy / terms don't exist yet;
  the footer links point at `/legal` meanwhile.
- **Next per the handoff:** port the inner pages onto the new token system, wire the
  three Healthie URLs, privacy-safe analytics, then lead capture (blocked on the BAA).
- **Testing trap:** headless Chrome's minimum viewport is 500px — a `--window-size=420`
  screenshot CROPS the right edge and looks like horizontal overflow. Measure
  `scrollWidth` before believing it. To reach the Labo home locally send
  `-H 'Host: thelabomethod.com'` (or `--host-resolver-rules`) — `/labo` on localhost
  hits the portal gate and 307s.

## Oct 26 2026 — CLINIC FIRST (thelabomethod.com)

Javier: "Now that you know what we will be offering with laser, let's create a better, more premium site" → **one brand, clinic first; photo placeholders; Seattle clinic, address to come.**
- **Homepage** `(home)/page.tsx`, in order:
  - laser-clinic hero;
  - numbered treatment rows (→ /treatments#slug);
  - "The laser": GentleMax Pro Plus, the Fitzpatrick I–VI wavelength row (755 nm on I–III, 1064 nm on I–VI) and the specs;
  - first visit;
  - clinician;
  - the clinic (Seattle, "address announced soon", "Join the opening list" → /contact);
  - **telehealth as the second section with the eligibility `Gate` kept**;
  - close.
- **New `/treatments`:** one section per service plus the laser FAQ (FAQPage JSON-LD). `Faq` now takes an `items` prop.
- **Content** lives in `src/labo/content.ts`: `CLINIC`, `TREATMENTS`, `FIRST_VISIT`, `LASER_SPECS`, `LASER_FAQ`.
  - **Blocking item #5: the "from" prices are Seattle-comp placeholders until Monika confirms them.**
  - `CLINIC.address` = null → not published.
- **Photo placeholders:** `.ph` frames are labelled placeholders (no stock in the clinic sections); real photos replace them.
- **Header / footer:** the header nav is Treatments · Telehealth · …, with a "Request a consultation" button (patient login moved to the footer). The footer has a Clinic column and a laser line in the legal text.
- **Metadata:** the default title is now "The Labo Method — Laser Clinic, Seattle".
- Still noindex (LAUNCH_READY false).

## Oct 26 2026 — Injectables + skin added; menu grouped (Laser · Injectables · Skin)
Javier: "add these services: Botox, dermal fillers, Sculptra, microneedling" + SkinSpirit / LaserAway as layout references.
`Treatment` now has `group` (laser|injectables|skin) + `techLabel` ('Product'/'Technique'; laser rows default 'Wavelength'). `GROUPS`, `GROUP_NOTE`, `CONCERNS` (browse-by-concern chips → treatment anchors) in content.ts.
Home "What we treat" = concern chips + one list per group; home nav = Laser / Injectables / Skin → /treatments#group-*. /treatments = grouped jump chips + `#group-<g>` sections. Two injectable FAQs added.
Placeholder "from" prices (blocking item #5), from Seattle comps Oct 26 2026: Botox $13/unit (Well Medical Arts $15, Seattle Face $16), filler $650/syringe ($650–850), Sculptra $850/vial ($850–990), microneedling $350/session ($350–425). Monika sets the real ones.
Don't add links to the shared inner-page header (Chrome.tsx): at 1440 it already wraps "How it works".

## Oct 26 2026 — California taken out (Washington only, "for now")
Javier: "take out all things California for now". `AVAILABILITY = "Washington"` (content.ts) drives the footer, FAQ, program notes and the telehealth eyebrow. Also changed by hand: the licensure credential line, the legal scope-of-licensure text, the Chrome.tsx footer legal paragraph, the JSON-LD areaServed, the Gate (WA / Elsewhere, 2-column), the home telehealth heading and clinician licensure, and the contact-form placeholder. The bio still names Cedars-Sinai and Cal State Long Beach; that's her history, not a service area. To bring CA back, restore those strings (git show this commit).
Analytics: src/components/labo/Analytics.tsx loads GA4 only when NEXT_PUBLIC_LABO_GA_ID is set (Vercel project mycleanmd). It's off on /programs, /contact, /start and /intake.

## Oct 26 2026 — Palette: Deep Emerald & Matte Gold (replaces the White Room ember)
Javier asked for an emerald ground with matte-gold UI accents, a regal look: green = prosperity, life, natural beauty; gold = auspicious luxury.
- **Tokens** live in labo.css `[data-labo]`: paper #0B3D2E · canvas #0F4636 · wash #15523F · ink (ivory) #F3EDDC · muted (sage) #A3B8A9 · accent (matte gold) #C5A562 · on-accent #0A2E23 · lines are gold at 26%. `color-scheme: dark`.
- **Gold is reserved for UI accents:** buttons, kickers, the wordmark, prices, group heads. Headlines stay ivory.
- **Photos:** the blend gradients fade to emerald. An emerald multiply wash (`.chero.blend::before`, `<i class="tint">` in #clinic and .close) turns the stock photos' white backdrops green. Keep it off the faces; at higher strength skin went green.
- The MyCleanMD portal isn't affected; everything stays scoped to [data-labo].
- **Hero photo (Oct 27 2026, Javier: "try new photo and better quality one on home page… but similar"):** clinic-hero-wide.jpg (3000×1333, 2.25:1) + clinic-hero-m.jpg (1400×980) now come from Unsplash **IQJ-LKTHb3w** (Look Studio, free licence, 6720×4480 source) — same model and white backdrop as the previous AYdqXiJ_MBM, hand at the temple, bare shoulders, no cream. The left 41% of the wide file is a synthesised backdrop extension (per-row tone from the source's left strip, 600 px blend, light grain) so her face lands at 76.5% of the frame (72% put her fingers on the end of "medicine."); it sits under the opaque wash. CSS unchanged: `auto 880px` at `88% 90px`, top and bottom fades. Alternate from the same shoot without cream: 5zbd6xOgE6A (hands on both cheeks, white top). Builder: scratch `hero-build.py` logic — full-height band, face x≈3136 → 76.5%.
- **Photo fades:** the clinic and consultation photos use long eased ::before/::after fades. Next minifies rgba() to hex, so to confirm a deploy, grep the live CSS for a px or keyword value, not for rgba strings.

## Labo Method portals (Nov 6 2026) — patient + provider, branch `feature/labo-portal`
- **Patient** `/portal` (thelabomethod.com): dashboard (programs/intake, next visit + Zoom, latest signed plan, medications, requests, messages) + `/portal/visits`, `/portal/requests` (refill + lab forms → `api/labo/requests`), `/portal/messages` (→ `api/labo/messages`). Labo white-room look (labo.css).
- **Provider** `/provider` (Monika): Apple look from the Figma "Provider (Monika)" page — `src/app/labo/provider/*` (Today · Calendar · Patients · Visit notes · Requests · Messages · Profile & hours), shell in `layout.tsx` + `provider.css`, helpers `src/lib/labo/provider.ts`, types `src/lib/labo/types.ts`. APIs under `api/labo/provider/{visits,notes,requests,messages,settings}`.
- **Gate:** `src/proxy.ts` — `/portal*` needs a Supabase session; `/provider*` also needs the email in `LABO_PROVIDER_EMAIL` (comma list). `/api/*` and `/auth/*` pass through untouched on the Labo host (before this fix they 404'd there).
- **DB:** run `supabase-labo-provider.sql` after `supabase-schema.sql` (idempotent). Pages show a yellow "Database not set up yet" note until it runs.
- **Env:** `bash scripts/labo-portal-env.sh monika@…[,javier@…]` sets `LABO_PROVIDER_EMAIL` (+ optional Stripe keys) and redeploys. Checkout stays 503 until `STRIPE_SECRET_KEY` + price ids exist.

## Nov 18 2026 — The clinic site: Skin Haven's pages, content and photos on thelabomethod.com
- Javier: "make TLM like the site was with same content and photos". The Skin Haven Cosmetic Clinic site (WordPress/Elementor, Growth99) was pulled through its public REST API into the **skinhaven repo** (`content/wp/`: pages.json, posts.json, media.json, `text/*.md`, `media/` 55 files incl. the hero mp4) — no login needed. The July Next.js rebuild in that repo (`lib/data/*`) already held the content verbatim as TS modules; those were copied to `src/labo/clinic/` (types, services/, posts/, patient-care, testimonials, privacy, **site.ts** = phone/hours/two locations/Vagaro/shop links) and rebranded by sed (Skin Haven → The Labo Method; `/images/` → `/labo/img/`).
- Photos: `public/labo/img/{about,partners,services,misc}` + `hero.mp4` / `hero-poster.png` (22 MB). Skin Haven logos were NOT copied; the signature png is Mónika's.
- Routes added under `(site)`: `/services`, `/services/[slug]` (10 detail pages; the Laser card has `href:"/treatments"` and no detail page), `/patient-care`, `/testimonials`, `/blog`, `/blog/[slug]` (7), `/booking` (Vagaro srcDoc iframe — blank in headless Chrome, fine in a real browser), `/privacy-policy`. Rewritten: `/contact` (phone/text tiles, hours, Instagram, the Resend form, both locations with Google map embeds), `/about` (clinic intro + Mónika's own bio + the DNP credentials/history + promise + team photo), the home (`(home)/page.tsx`: video hero, services grid, welcome, quotes, locations, the laser row, partners, telehealth + Gate, booking band). Header nav = `NAV` in content.ts (Services · Laser · About · Patient Care · Testimonials · Blog · Contact, Book now → /booking); footer = Explore / Treatments / Telehealth / Visit us.
- Shared pieces: `src/components/labo/Clinic.tsx` (SectionHead, ServiceCard, TestimonialCard, LocationCard, MapEmbed, PartnerLogos, Acc = `<details>` accordion, Rich = "- " bullets, BookCta, VagaroWidget). CSS: the "Clinic pages" block at the end of `labo.css` (.vhero .cards .card .quotes .locs .loc .partners .acc .rich .bookcta .split .frame .checks .post …). Partner logos are dark-on-white JPGs: `invert + mix-blend-mode:screen` puts them in ivory on the emerald.
- Still Skin Haven's, deliberately, until Javier/Monika say otherwise: the 877-756-4286 line, both addresses, the Vagaro account, the Instagram handle, the skinbetter shop link, the "haven" / "beauty bestie" copy. Email is hello@thelabomethod.com. Sitemap lists every new route.
- Local check: `next start -p 3011` and a copy of shot-mobile.mjs with `--host-resolver-rules=MAP thelabomethod.com 127.0.0.1` → `http://thelabomethod.com:3011/…` (the proxy keys on the Host header). Desktop full-page shots must run at deviceScaleFactor 1 — at 2× anything taller than ~3000 css px hangs Chrome's capture.
- Branches: `feature/labo-portal` was STALE — main had moved on after the Nov 6 merge (Apple-light palette 83201ee, auth landing, pdx1, SQL). The clinic site was merged onto origin/main (5bd7088) with the clinic CSS block re-tuned for white (video hero with a white wash, multiply partner logos, no signature inversion). **main is the line again; it auto-deploys on push.** The feature branch is behind main now — build on main.
- **Same day, after launch:** hero video re-encoded for the web (18.5 MB → 5.2 MB, faststart, no audio), poster = its own first frame (`hero-poster.jpg`) and `HeroVideo.tsx` fades the video in over it — Javier saw "a photo appear quickly then goes to video". `proxy.ts` matcher now skips `.mp4` like images (the video took a 308 hop on the Labo host). **Phone menu** (`MobileNav.tsx`, Javier: "is this mobile friendly"): ☰ in both headers opens a sheet with the site links, Book now and the phone line; the sheet is portalled to the `[data-labo]` root because `header.site`'s backdrop-filter makes the header the containing block for position:fixed.
- **SEO (Nov 18 2026, Javier: "we do need to work on seo plan with indexing"):** `docs/SEO-PLAN.md` is the plan. Code: **split gate** — `CLINIC_INDEX = true` opens the clinic pages; `GATED` (programs, pricing, how-it-works, join, legal, faq, treatments) stays noindex via `GATE_ROBOTS` in each page's metadata, the robots.txt route and the sitemap filter, until `LAUNCH_READY`. Clinic-first title/description + OG image in layout.tsx; `MedicalBusiness` JSON-LD with both locations/phone/hours/services/founder; `MedicalProcedure` + `FAQPage` + `BreadcrumbList` on service pages; `BlogPosting` on posts; the hero video is desktop-only (`HeroVideo.tsx` matchMedia). Facts found: thelabomethod.com DNS is at GoDaddy (ns47/48.domaincontrol.com), a google-site-verification TXT already exists (Search Console likely verified), **no MX record — hello@thelabomethod.com cannot receive mail**, no Resend DKIM (domain not verified in Resend). `NEXT_PUBLIC_LABO_GA_ID` exists in Production; `LABO_CONTACT_EMAIL` does not (form goes to javier.mendoza@upm.ai).
- **Contact form (Nov 18 2026, Javier: "i cant send a test message"):** reproduced on production with a headless submit. Cause: `onboarding@resend.dev` only delivers to the Resend account owner's own address. Sender switched to the verified `support@mycleantext.com` (`LABO_CONTACT_FROM` overrides); the catch now `console.error`s the Resend message. Vercel MCP runtime logs returned 403 and `vercel logs` streams only the moment it is running — stream first, then trigger.

**Nov 18 2026 — clinic accent (Javier: "not sure about the colors black and blue… lets try changing the accents").** Research first (no study ties a palette to bookings; the field converges on warm, restrained palettes over clinical blue). Result: `[data-clinic]` wrapper on the (home) and (site) route groups (`(home)/layout.tsx` new, `(site)/layout.tsx`) and a labo.css block `[data-labo] [data-clinic]{--accent:#9A5636; --accent-rgb:154,86,54; --accent-tint…}` — a clay sampled from the clinic photos (cta-bg/clinic/testimonials midtones #CC8865/#995532; 5.6:1 on white). Tinted glows now use `rgba(var(--accent-rgb),…)`. The portals (/portal, /provider) stay Apple blue. MobileNav mounts into `[data-clinic]` first. Preview: build → `npx next start -p 3011` → scratch `shot-labo.mjs http://thelabomethod.com:3011/…` (host mapped to 127.0.0.1; NOT https).

**Nov 18 2026 — hero video on phones too (Javier: "make the mobile version with the video movement of swimmer as well").** `HeroVideo.tsx` now plays on every width; phones (≤760px) get `public/labo/img/hero-mobile.mp4` (720px, crf 30, 1.4 MB) and desktop keeps `hero.mp4` (5.2 MB); only data-saver and prefers-reduced-motion keep the still poster. Verified at 390px: currentSrc = hero-mobile.mp4, playing, class "on". Vercel project name is **mycleanmd** (not xeebihealth) — `vercel ls` in the repo lists it; `vercel ls xeebihealth` prints nothing. The CSS minifier lowercases hex — grep the live stylesheet case-insensitively.
