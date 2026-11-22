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

**Nov 18 2026 — SMS opt-in compliance page (Javier: "create an sms opt-in compliance page… for labo").** `/sms` (`(site)/sms/page.tsx` + `actions.ts`, `components/labo/SmsOptInForm.tsx`, consent text in `labo/clinic/sms.ts` because a "use server" file may only export async functions): program facts, UNCHECKED consent box with the full disclosure, email-only path, STOP/HELP, four terms tiles, opt-in methods, no-sharing privacy statement, support block. Each sign-up emails the practice inbox as the consent record (timestamp, IP, UA, disclosure text) — nothing is auto-texted; the number is added to the texting platform by hand. Privacy policy gained a "Mobile information and text messages" section; footer legal line links "SMS terms"; `/sms` is in the sitemap and indexable. Mirrors mycleantext-site/sms.html.

**Nov 18 2026 — contact page tied to SMS consent (Javier: "can we tie into contact us page?… or should we keep this separate idk" → tied in, reasoning: carriers only need unchecked + optional + full disclosure; the contact form is where consent is actually gathered, /sms stays the canonical terms).** ContactForm gained an optional mobile field and the same unchecked consent box (`CONSENT_TEXT`); `submitContact` records Mobile / SMS consent and, when ticked, the timestamp, IP, UA and the disclosure in the inbox email; contact page gained a "Text updates" tile → /sms.

**Nov 18 2026 (evening) — "a touch of luxury" outcome.** Previewed Fraunces serif display headings + ivory surfaces (~/Downloads/labo-luxury-*.png). Javier: "i like the luxury preview, not the font here" (the /sms page title) → "can we keep same font" → **Inter everywhere; only the ivory surfaces shipped**: `[data-labo] [data-clinic]{--canvas:#F7F4EF;--wash:#EFEAE2;--line/--hair warm}`. No Fraunces import. Gotcha from tonight: parking an uncommitted CSS block + `pull --rebase --autostash` duplicated the stylesheet tail — reset the file from HEAD and re-append instead.

## Nov 22 2026 — Favicons (Javier: "create favicon on both domains")
Two marks in one family, rendered by a PIL one-off (rounded square, Helvetica Neue Bold "L", accent dot): **clinic** navy #132238 / white L / teal #1E6B7B dot → `public/labo/favicon/` (favicon.ico 16·32·48, icon-32/192/512.png, apple-touch-icon.png), **Method** ink #2C3539 / ivory L / sage #8F9A94 dot → `public/labo/method-favicon/`. Wired as `metadata.icons` in `src/app/labo/layout.tsx` (clinic) and `src/app/labo/method/layout.tsx` (overrides for the Method host). `src/proxy.ts` matcher now bypasses `.ico` too, otherwise the Labo hosts redirect/rewrite `/labo/favicon/favicon.ico`. MyCleanMD's own icon moved from the `src/app/favicon.ico` file convention (which Next injects on EVERY route, so it leaked onto both Labo hosts as a competing `<link rel=icon>`) to `public/favicon.ico` + `icons` in the root layout metadata; nested layouts' `icons` then override it cleanly. The proxy matcher runs for the bare `/favicon.ico` (rewritten per host to the brand's .ico) and bypasses nested `*.ico` files.

## Nov 22 2026 — Domains: thelaboclinic.com = the clinic, thelabomethod.com = The Labo Method (telehealth)
Javier: "we bought thelaboclinic.com which this site should point to and the telehealth point to thelabomethod.com". GoDaddy keeps DNS (A @ → 76.76.21.21, CNAME www → cname.vercel-dns.com; "Keep Separate", never GoDaddy forwarding); both `thelaboclinic.com` + `www` (308 → apex) are on the Vercel project `mycleanmd`. `src/proxy.ts`: `LABO_HOSTS` = thelaboclinic.com/www + the sandbox; `METHOD_HOSTS` = thelabomethod.com/www + `method.thelabomethod.com` (308 → apex). On the Method host, the clinic-only paths (`CLINIC_ONLY_PATHS`, computed from `(site)/` minus `method/`), the 7 clinic blog slugs, `/portal*`, `/clinic*`, `/provider*` and the three Labo sign-in pages 308 to the same path on thelaboclinic.com — Google's old clinic URLs carry over, and one account serves both brands from the clinic host. `PRACTICE.domain` = thelaboclinic.com (metadataBase, canonicals, sitemap, JSON-LD), `METHOD.domain` = thelabomethod.com (Method sitemap/robots/metadataBase); the two telehealth deep links in services, the host regexes in `afterAuth.ts` + `auth/callback`, the consent-record source and the Supabase templates' site links follow. **Still manual:** Supabase Auth → Redirect URLs add `https://thelaboclinic.com/**`; Search Console property for thelaboclinic.com (+ sitemap); Resend/GA unchanged (GA4 561002714 keeps collecting; Pulse `labo` site unaffected). Deploy order matters: the routing swap goes live only after Vercel has issued the clinic domain's certificate, or the clinic would be unreachable in between.

## Nov 22 2026 — Palette: "Crisp Medical Modern" (replaces the clay storefront accent; Sage shipped for ~1 h first)
**Current tokens** (`labo.css` `[data-labo] [data-clinic]`): paper #F6F8FA (cool mist) · canvas/wash #E6ECF2 · ink #132238 (deep navy) · graphite #3C495B · muted #858D99 · **accent #1E6B7B (clinical teal — buttons/links/italic "you")** · rule #B6BCC4 · `--hero #E6ECF2` · `--strip #E6ECF2` · `--sage #DCE4EC` (Best-seller tag). Hero CTAs are ink (navy); promo bar, members band, telehealth band and the sign-in aside are navy with #F6F8FA type; the telehealth pill/menu link take the teal. `clinic.css` (admin) and the `data-portal` block use the same values; invite email + Supabase templates regenerated in teal/navy (**re-apply to Supabase pending**). Javier: "im having hard time on site color palette… give me sample with… 2. Crisp Medical Modern" → full-page set rendered (~/Downloads/Labo-Palette-CrispMedicalModern-FullSet.png) → "i actually like that better". The sage history below is kept because the Labo Method Skin product line still uses those tones.

### Earlier the same day — "Labo Skin · Sage" (superseded)
Javier: "can you give me a sample look based off these color palettes" (a 3-direction PDF) → "more color samples… milder" → "add these color tones" (Monika's Labo Method Skin homepage mock) → "lets run with this one and update site and mobile… and admin portal/client color schemes". Samples were rendered by injecting token overrides into the real homepage over CDP (`scratch palette9361.mjs <url> <out> <w> <h> <css>`; sheets in ~/Downloads/Labo-Palette-Samples*.png — 12 directions). Winner = the brand-kit tones sampled from the mock.
- **Tokens** (`labo.css` `[data-labo] [data-clinic]`): paper #F4EFEB (ivory) · canvas/wash #EEE6DE · ink #2C3539 (slate) · graphite #505759 · muted #909292 · **accent #6F7A73 (deep sage, buttons/links/italic "you")** · rule #BCBBB9 · line rgba(44,53,57,.18) · `--hero #BFC3BD` (sage panel, the hero surface) · `--strip #A2ACA4` (ticker) · `--sage #CBCEC8` (Best-seller tag). Hero = tinted surface with ink type and **ink** CTAs (per the 60/30/10 rule); promo bar + members band + telehealth band = ink; the telehealth pill/menu link = accent (Method purple stays on the method subdomain); sign-in aside = ink with ivory type.
- **Admin portal** `clinic.css` tokens → same palette (`--blue/--em` = sage, chip #EEE6DE, avatar gradient sage, pills/setup toned to the palette). **Patient portal** `/portal` layout carries `data-portal` → a token block in labo.css (palette + Outfit) without touching its minimal chrome. Emails: invite route + `supabase/email-templates/build.py` regenerated in sage/slate — **the Supabase templates still need re-applying (one Management-API token round)**.
- Hardcoded colors left on purpose: the Method subdomain's own `[data-method]` overrides; `brand/labo-method-skin/` kit is already these tones.

## Nov 19 2026 — Storefront look (facileskin.com) + the skincare shop
Javier: "Monika wanted a look and feel like https://facileskin.com/ she wants to sell products as well. can we do something now a bit different."
- **Look** (labo.css "Storefront system" block, scoped `[data-clinic]`): warm paper #F8F4EE, ONE signature colour #C8432A (red-clay), ink rules (1px, `--rule`), 6px radii, Inter at 800 for display, promo bar (promo + free-shipping line, `SHOP`), split hero (type left, the swimmer video boxed right; on phones the video goes first), a sage value ticker (`.strip`), boxed grids with borders on the cells (`.cards`/`.pgrid`/`.quotes`/`.ctiles` — border-right/bottom per cell + top/left on the container, so a short last row never shows a dark empty cell; the old gap-trick did), full-width `.addbar` "Add to bag". The portals keep Apple blue. Class names deliberately avoid the older `.concerns`, `.tile`, `.thumb`, `.pack` rules — collisions bit twice (pill-shaped concern tiles, invisible bag thumbnails).
- **Shop:** catalog `src/labo/clinic/products.ts` (12 items from the partner lines skinbetter / Alastin / SkinMedica, typical US retail as placeholders — `SHOP.pricesConfirmed:false` prints "pricing is being finalized"); `/shop` (ShopGrid: Type + Concern chips, `?c=`/`?t=` preselect), `/shop/[slug]` (Product JSON-LD, "Goes well with"), `/shop/thank-you`. Bag = localStorage `labo-bag` (`components/labo/shop/bag.ts`, window events, `#bag` opens it); `BagDrawer` mounted in both clinic layouts; `BagLink` in both headers; "Your bag" in the phone menu (sheet top now measured from the header's real bottom because the promo bar sits above it).
- **Checkout:** `POST /api/labo/shop/checkout` → Stripe Checkout in payment mode with ad-hoc `price_data` (no Products/Prices to create), US shipping address, flat $8 / free over $75 / free pick-up options, phone collection, `metadata.kind:"shop"` (the webhook acks and skips those). **503 until `STRIPE_SECRET_KEY` is set on the mycleanmd project** — the drawer then offers "Text 877-756-4286" with the bag pre-filled and the skinbetter store link. Stripe Tax not enabled (add `automatic_tax` once Stripe Tax is on). Note skinbetter is pro-channel only: selling it on her own site needs the line's OK; the authorized-store link stays as the fallback.
- **Packshots:** no product photos yet → `Packshot.tsx` draws a bottle/jar/tube in the product's `tone` (sized in `cqw` of the `.pshot` container — percentage padding resolved against the drawer's width and collapsed the bottle; container units fixed it). A `product.image` replaces the drawing per product.
- Verified: tsc clean, `next build` (Turbopack's Google-font fetch fails intermittently with "next/font/google queries have exactly one entry" — just rebuild), local `next start -p 3011` + headless Chrome with `--host-resolver-rules=MAP thelabomethod.com 127.0.0.1`; scratch `shot-cdp.mjs` (raw CDP over Node's WebSocket, no puppeteer) clicks Add-to-bag / the ☰ before capturing. A stale `next start` from the day before still held :3011 — check `lsof -iTCP:3011` first.
- **Same morning, three follow-ups from Javier's screenshots:** (1) "body same as top bar color" → the hero band is the signature orange with ivory type and inverted buttons (facile's red hero); promo bar orange, header paper, hero orange. (2) "highest resolution picture we have that fits… instead of the video" → `img/about/team.jpg` (1877×2560 portrait, the sharpest file for the tall box; `object-position:50% 18%`); `HeroVideo.tsx` is unused now but kept. (3) "lets try this font as well" → facile's type is **Syne** (free, Google): loaded in `layout.tsx` as `--font-syne`, applied to `[data-clinic]` only (body 16px, tracking relaxed, headings -.02em); the portals stay Inter. Syne is wide, so the header got nowrap + tighter gaps, and under 430px the bar's Book now hides (the ☰ sheet has it). Headless Chrome's `--screenshot` clamps the window to 500px — phone shots come from `shot-cdp.mjs` (device-metrics override), or they look cropped and you chase a non-bug.
- **Font, round two (Javier: "i like the font but.. something similar but not so wide?"):** Syne → **Outfit** (`--font-clinic`, weights 400–800), same geometric warmth at normal width; tracking back to -.03em on h1, body 16.5px. A side-by-side of Syne / Outfit / Plus Jakarta Sans / Urbanist / Sora is in ~/Downloads/Labo-Font-Options-2026-11-19.png (scratch fonts.html via the Google Fonts CSS link) — swapping is one import + the variable name in layout.tsx.

## Nov 19 2026 — SANDBOX BRANCH `sandbox-booking`: the clinic's own scheduler (main keeps Vagaro)
Javier: "for sandbox lets remove [Vagaro] and copy as much as we could to build our own… on live site we keep Vagaro". Vagaro's public API cannot create appointments (only outbound webhooks + widget postMessage events — see memory project-mycleanmd), so the sandbox replaces the widget outright.
- **Catalog/config** `src/labo/clinic/booking.ts`: `BOOKING` (Pacific, 30-min grid, 15-min buffer, 24 h lead, 60-day horizon, 24 h / $150 policy), `MENU` (14 items in Consultations · Injectables · Skin · Laser · Wellness; durations are working defaults, prices "at consult" until Monika pastes her Vagaro menu — `pricesConfirmed:false` prints the note), `INTAKE` (5 quick questions).
- **Hours** come from `labo_provider_settings.hours` (Monika edits them at /provider/profile), else `DEFAULT_HOURS` (Mon–Fri 10–6). No holiday calendar yet.
- **Server** `src/lib/labo/booking.ts`: slots = hours − (labo_bookings ∪ labo_visits, both Pacific) − lead; `openDays(month)` is one query per month; `createBooking` re-checks the slot, inserts with a `cancel_token`, emails the customer (Resend, from LABO_CONTACT_FROM / support@mycleantext.com, "Manage or cancel" link) and the practice (LABO_BOOKING_EMAIL → LABO_CONTACT_EMAIL → javier.mendoza@upm.ai); `cancelBooking(id, token)`. Without SUPABASE_SERVICE_ROLE_KEY (local preview) the book reads as empty and POST fails clearly.
- **API** `GET/POST/PATCH /api/labo/book` (month days · day slots · create · provider status), `POST /api/labo/book/cancel`. **Table:** `supabase-labo-bookings.sql` (service-role only) — Javier runs it; until then POST returns 503 "Online booking isn't switched on yet".
- **UI** `components/labo/Scheduler.tsx` (steps Service → Day & time → Your details → booked; `?service=slug` preselects), `/booking` on this branch renders it, `/booking/manage?id&t` cancels. Provider portal: Today gets a "Clinic bookings today" card, Calendar lists them above telehealth visits, `BookingStatus` buttons (Confirm / Done / No-show / Cancel).
- **Host** labo.benthicgroup.com (branch domain; benthicgroup.com is on Vercel DNS). It sits behind Vercel SSO — branch domains count as previews even with `all_except_custom_domains` — so Javier (logged into Vercel) can open it; for Monika he generates a Protection Bypass secret (classifier blocked Claude doing it) and shares `?x-vercel-protection-bypass=<secret>&x-vercel-set-bypass-cookie=true`, or sets Deployment Protection to production-only while the sandbox is in use.
- Verified locally (build + `next start -p 3011` + CDP): month availability JSON, calendar/slots, details form, phone layout. Not yet verified: a real POST (needs the table + service key on the deployment).

## Nov 19 2026 — SANDBOX: the clinic staff portal `/clinic` (Javier: "each person who works in clinic can login, and work appointments, adjust calendar, then full admin who controls it all")
- **Access** `src/lib/labo/clinic.ts`: `getStaff()` = signed-in Supabase user whose lower-cased email has an active `labo_staff` row; `LABO_PROVIDER_EMAIL` addresses are always admin (bootstrap). Roles: `admin` (everything) / `staff` (Today, Calendar, Appointments, Customers, Hours & time off — hours read-only). `src/proxy.ts` sends a signed-out `/clinic*` to `/auth/login?redirect=`; the layout renders "Clinic team only" for a signed-in non-member. Joining = admin adds the email on /clinic/team → the person signs up at /auth/signup with that email.
- **Tables** `supabase-labo-clinic.sql` (run after supabase-labo-bookings.sql): `labo_staff`, `labo_blocks` (time off; `staff_id` null = whole clinic), `labo_services` (overrides: name/duration/price/price_note/active), and `provider_id` / `staff_notes` / `created_by` on `labo_bookings`.
- **Pages** `src/app/labo/clinic/*` (same shell + `provider.css` as the provider portal, `data-provider`): Today (KPIs, today's list, "to confirm this week"), Calendar (month dots, day list incl. canceled, detail panel with status / Move / provider / staff notes, time-off for the day), Appointments (search name/phone/email + status), Customers (derived from bookings by email: visits, no-shows, last, next), Hours & time off (`HoursForm` → labo_provider_settings.hours, admin-only edit; `BlocksForm` + list), Services & prices (admin; `ServicesTable` → labo_services), Team (admin; `TeamForm`; the last active admin cannot be demoted/deactivated).
- **APIs** `/api/labo/clinic/{bookings,blocks,staff,services,hours}`: staff bookings may be placed at ANY time (outside public hours), overlaps return 409 and the form offers "Save anyway" (`force`); status PATCH, Move (re-computes `ends_at`), provider, staff notes.
- **Scheduler integration**: `getMenu()` in `lib/labo/booking.ts` applies the overrides and drops inactive items (the booking page passes the merged `menu` to `Scheduler`); `busy()` subtracts `labo_blocks` as well as bookings and telehealth visits.
- Not yet: per-provider calendars/availability (bookings carry `provider_id` but slots are clinic-wide), customer records as their own table, SMS reminders, deposits. Verified: tsc + build, signed-out redirect, booking page still 200. Not verified signed-in (needs the two SQL files + an account on the deployment).
- **Re-brand, step 1 (Javier: "change the login page to reflect the labo clinic style… and same with admin portal… we will start to re-brand all"):** Labo-host sign-in pages `src/app/labo/auth/{login,signup,forgot}` (proxy rewrites `/auth/login|signup|forgot` → `/labo/auth/*` on Labo hosts; `/auth/callback` stays shared). Email + password only (Google/OAuth and reset links go through Supabase's Site URL = mycleanmd.com and its gate until `https://labo.benthicgroup.com/**` and `https://thelabomethod.com/**` are added under Supabase Auth → URL Configuration → Redirect URLs). After sign-in without `?redirect`: provider/staff → /clinic, else /portal. Clinic portal skin `src/app/labo/clinic/clinic.css` on `[data-provider][data-clinicp]` (paper, red-clay, Outfit, 6–8px radii) layered over provider.css. The provider and patient portals are still Apple-blue — next in the re-brand.

## Nov 20 2026 — White label (Selfnamed) on the sandbox
Javier: "working on white label for Labo… selfnamed.com… we can do sandbox with the url we have now". Selfnamed = private-label skincare, no minimum, dropship per unit, US orders ship from Charlotte NC (2–5 days), formulas CPNP/FDA-stated/COSMOS, plugins for Shopify/Woo/Wix/Squarespace, NO public API, manual orders allowed (shipper name on the label is theirs).
- **Catalog:** six `own: true` placeholder items under line "The Labo Clinic" in `products.ts` (`ownLine`, `LINES`); names/prices/copy/drawn bottles are placeholders until Monika picks formulas from the sample set and sends unit costs + packshot mockups. /shop has a Line chip row (+ `?line=` preselect, "Our own line" red chip in the hero); the home page has an "Our own line" row above Services.
- **Orders:** `supabase-labo-orders.sql` (Javier runs) → `labo_orders`; the Stripe webhook records `kind:"shop"` sessions (line items with product metadata slug, ship-to from `collected_information.shipping_details` or the older field, pickup detection) → **/clinic/orders** (open orders, copy ship-to, Selfnamed order # → Placed, tracking → Shipped, Done/Cancel, notes; `PATCH /api/labo/clinic/orders`). Nothing fires until STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET exist.
- Javier has a Selfnamed account; to-do on his side: brand + logo, shortlist 6 formulas, sample set, send per-formula name/cost/size/INCI/mockup, billing method. Later: a minimal Shopify store with the Selfnamed app as the automatic bridge if volume grows.

## Nov 20 2026 — sandbox promoted to main (Selfnamed own line live, as "Coming soon")
Javier: "use the sandbox setup for Selfnamed and put that in the live site… most likely we will go through with it". `main` fast-forwarded to `sandbox-booking` (clinic staff portal /clinic, Labo sign-in pages, own-brand line in the shop + home, `labo_orders` recording in the Stripe webhook, /clinic/orders, brand kit folder), then merged with the other Mac's Method-subdomain commits (proxy keeps SANDBOX_HOST + METHOD_HOSTS; labo.css keeps both appended blocks).
- **Booking stays on Vagaro** on the live site: `src/app/labo/(site)/booking/page.tsx` was restored from the old main (VagaroWidget). The own scheduler (`Scheduler.tsx`, /booking/manage, book APIs) is in the tree and still live on labo.benthicgroup.com; switching the live page is a one-file change when Javier says so.
- **Own-line items are `soon: true`** (Product.soon): the card/PDP button reads "Coming soon" (disabled, `.addbar.soon`) and `/api/labo/shop/checkout` refuses them (400). Flip `soon` off per product once Monika's formula, price and packshot are real. Stripe checkout is LIVE (keys on production since today), so never ship a purchasable placeholder.
- `supabase-labo-orders.sql` was run by Javier on Nov 20 (5 PM): checkout → webhook → labo_orders → /clinic/orders is live end to end.
- `git pull --rebase` on this repo conflicts badly when both Macs touch labo.css/proxy.ts: prefer a merge commit (both sides append), resolve, push.

## Nov 21 2026 — Skin quiz on the home page (replaces the Best sellers row) + /clinic/quiz
Javier: "i like this idea of take our quiz… replace this area with a quiz" → "build it, then the data should be seen in admin portal as well."
- **Quiz** `components/labo/shop/SkinQuiz.tsx`, mounted in `(home)/page.tsx` where Best sellers was. Three questions (skin feel → main concern → routine size), answers as `.cchip` buttons (selected = `.own`), result = 2–4 products scored from the catalog's `concerns`/`type` tags and rendered with `ProductCard` (Add to bag / Coming soon as on /shop; own-line "soon" items are penalised so results stay buyable unless nothing else fits), plus a link to `/shop?c=<concern>`. Deterministic, client-side. CSS block `.quiz` in labo.css (after `.rowhead`); `.rowhead .more` is nowrap now (it wrapped on phones).
- **Data:** every completed quiz POSTs to `/api/labo/quiz` (anonymous: the three answers + recommended slugs; no name/email/IP) → table `labo_quiz` (`supabase-labo-quiz.sql`, service-role only — **Javier runs it**). The route answers 503 when the table or `SUPABASE_SERVICE_ROLE_KEY` is missing; the quiz shows its result regardless (fire-and-forget, once per completion).
- **Admin:** `/clinic/quiz` (staff + admin; nav item "Skin quiz" in `ClinicNav.tsx`): 30-day tallies by skin feel / concern / routine with bars, most-recommended products, recent rows; "run supabase-labo-quiz.sql first" note until the table exists.
- Verified with a CDP click-through (`/tmp/quiz-run9343.mjs` pattern): Dry → Barrier & hydration → short routine gives cleanser · serum · moisturizer · SPF; signed-out `/clinic/quiz` → login redirect; bad POST → 400; no key → 503.

- **Brand kit (Nov 20 2026):** `brand/labo-method-skin/` — "The Labo Method Skin" is the product line's name (the clinic stays The Labo Clinic). Outlined SVG lockups (fontTools, `source/logos.py`), print PDFs (card with bleed, letterhead, label system, 7-page guide) rendered from `source/*.html` with headless Chrome and local `@font-face` (Google Fonts `@import` is unreliable headless), web tokens/favicon/avatar/OG. Palette ink #2C3539 · sage #8F9A94 · taupe #A8A199 · white; Bebas Neue + Montserrat (OFL). Next: rename the shop's own-line items to this brand, real-size labels from Selfnamed die lines.
- **Treatment finder (same day, from Javier's "Medical Spa Treatment Quiz Blueprint" PDF):** the home quiz card is now two tabs (`QuizTabs.tsx`: **In-clinic treatment** first, **Skincare routine** second) and the treatment finder is also mounted on `/treatments`. Five steps per the blueprint (goal → branched sub-concern → downtime → safety flags multi-select → experience); data + `recommendTreatment()` in `src/labo/clinic/treatment-quiz.ts` (server-safe, shared with the admin page). **Every matrix cell was re-mapped to this clinic's real menu** — the blueprint named devices the clinic doesn't have (Hydrafacial, Morpheus8, BBL/IPL, Pico, CO2, Halo, Moxi, Sofwave); keys are `TX` (botox, filler, sculptra, threads, microneedling, prp, vipeel, cosmelan, laserRejuv, laserSpots, laserVeins, rx, iv, skincare) with `from` prices from TREATMENTS. Safety overrides kept verbatim: pregnancy strips injectable/laser/peel/needle and shows the pregnancy-safe banner; melasma branch never gets laser; recent sun adds the 2–4-week laser notice only when a laser is recommended; sensitive/rosacea/cold-sore adds the antiviral-first note. Result = `.txrecs` rows + banners + "Book a consultation" (/booking) and "Ask us first" (/contact); the `routine` branch hands off to the Skincare tab.
- **Data model:** `labo_quiz` gained `kind` ('skincare'|'treatment', default skincare) and `answers jsonb`; `skin/concern/routine` are nullable now (migration `labo_quiz_treatment_kind`, applied via the Supabase MCP connector — **the connector is authorized for org MyCleanText, so Claude applies migrations directly now; `supabase-labo-quiz.sql` is the schema of record, not a to-do**). `/api/labo/quiz` validates both kinds; `/clinic/quiz` shows two tally blocks (treatment: goal/sub/downtime/safety/experience + most-recommended treatments; skincare: as before) and one recent-answers list with a kind pill.
- Verified with CDP click-throughs on home, /treatments and 390px: melasma + 4–7 days + sun&sensitive flags → Cosmelan only, two banners, no laser; skincare tab unchanged. Local POST = 503 (no service key locally), production = 200.
- **/clinic/team (same evening, Javier: "can i delete one as i made a mistake… how can i email Monika as admin so she can login"):** **Remove** (`DELETE /api/labo/clinic/staff {id}` — refuses yourself and the last active admin; only the portal row goes, the Supabase auth user stays) and **Send invite** (`POST /api/labo/clinic/staff/invite {id}` — Resend, same sender as bookings/contact, reply-to = the inviting admin; the email gives the three steps with links on the host the admin is using, and insists on the exact email; stamps `labo_staff.invited_at`, shown as "Invited <date>" and the button becomes "Resend invite"). Column added via the Supabase MCP connector; `supabase-labo-clinic.sql` carries the `alter table` line. Known gotcha still open: Supabase's Site URL is mycleanmd.com, so if "confirm email" is on, a new member's confirmation link lands on the gated mycleanmd.com after confirming — the invite tells them to then go to /auth/login. The typo row monikajauregui@**rockmail**.com was deleted via SQL; the real admin is monikajauregui@rocketmail.com.
- **Auth landing on the Labo host (same evening, Javier: "i want the bounce gone and just go right to CRM we are building"):** `src/app/auth/callback/route.ts` now honors a safe `?next=` on Labo hosts (thelabomethod.com + labo.benthicgroup.com) and otherwise sends active `labo_staff` + the provider allowlist to **/clinic**, patients to /portal (it used to hard-route provider→/provider, everyone else→/portal, and didn't know the sandbox host). The invite email links carry `?redirect=/clinic`; the Labo forgot page no longer forces `next=/portal`. **Done Nov 21 2026 (Javier, dashboard — the Supabase MCP connector can't write auth config):** Redirect URLs now hold `https://thelabomethod.com/**` and `https://labo.benthicgroup.com/**` (plus the old xeebihealth.vercel.app callback), so `emailRedirectTo`/`redirectTo` are honored and confirmation/reset links land on the Labo host; before this they fell back to the Site URL (mycleanmd.com) — the "bounce". Site URL stays mycleanmd.com on purpose (MyCleanMD's own OAuth still uses it).

## Nov 21 2026 (night) — ALASTIN Skincare® replaces the Selfnamed own line in the shop
Javier: "now we will be selling these Alastin products, Anti-Ageing and Serums. Can we build the products on the shop (remove our own brand, replace with Alastin). We will add the unique links once we have them from Alastin."
- **Catalog** (`products.ts`): the six `own: true` Selfnamed placeholders and the three old Alastin guesses are gone; 11 real ALASTIN Skincare® products from alastin.com's Anti-Aging + Serums collections (kits/holiday sets skipped) with live MSRP (Nov 21 2026: C-RADICAL $218, HA IMMERSE $134, A-LUMINATE $198, RSC TriHex+ $258, Renewal Retinol $81, Eye $128, Neck $158, Ultra Nourishing/Light $98, HydraTint $84, SilkSHIELD $78), packshots **hotlinked from ALASTIN's Shopify CDN** (replace with partner-kit files when they arrive), concerns/types mapped to our filters. `line` = "ALASTIN Skincare®" (trademark casing per their spec); `LINES` lost "The Labo Clinic"; `ownLine` → `alastinLine`; `Product.own` stays only for historical labo_orders rows.
- **Partner-store model:** `partner: "alastin"` + `buyUrl?`. `AddToBag` renders an outbound "Shop at ALASTIN Skincare® ↗" (new tab) when `buyUrl` is set, else a disabled "Available soon at ALASTIN Skincare®". **To go live per product: paste the unique partner link into that product's `buyUrl`.** Checkout refuses partner items (400) as a backstop; `notInBag()` helper. PDP shows "ships from ALASTIN, not the clinic". The skin quiz ranks link-less partner items below buyable ones until links exist. MAP: no discount copy near those buttons (the promo bar's "$20 off first treatment" is a treatment promo, not a product discount).
- Home row = "ALASTIN Skincare®" (first 4 of the line); /shop hero chip + lede switched; ShopGrid line chips plain.
- Still Selfnamed-era and now dormant: `/clinic/orders` Selfnamed pill (`it.own`), `brand/labo-method-skin/` kit. Leave until Javier says the own line is dead for good.
- **Mobile sideways pan (same night, Javier: "the page actually can be moved a bit left to right"):** measured at 390px — every page is viewport-width in Chrome; the only element past the edge is the home ticker's transform-animated `.track`, which `.strip{overflow:hidden}` clips in Chrome but iOS Safari still pans into. Fix: `html,body,[data-labo]{overflow-x:clip}` (not `hidden` — that would make scroll containers and kill the sticky header; verified the header still pins after the change). Headless Chrome cannot reproduce the iOS pan; Javier confirms on his phone.
- **skinbetter science® best sellers (same night, Javier: "since we will also sell Skinbetter, lets use just the best sellers for now" → skinbetter.com/best-sellers):** skinbetter.com (and store.skinbetter.com, which 301s to it) is behind a Cloudflare challenge — curl, headless Chrome and WebFetch all get "Just a moment…"/403; **don't keep hitting it from Javier's IP**. The 10 items in `products.ts` are the 2026 ranked best-seller set with sizes/MSRP from an independent guide (skincrew.com), cross-checked against search snippets of skinbetter's own pages (AlphaRet $145, Alto $175/30 mL, sunbetter SPF 75 $75, EyeMax $135…). **Open: Javier sends a screenshot of the official Best Sellers page → reconcile names/prices.** Same partner model as ALASTIN (`partner: "skinbetter"`, `buyUrl` per product, button "Shop at skinbetter science®" once set; `PARTNER_NAME` in AddToBag.tsx holds both brands' trademark casing). No skinbetter packshots yet (drawn Packshot). `CLINIC_SITE.shopUrl` now points at skinbetter.com instead of Skin Haven's connect.skinbetter.com store (footer "skinbetter store ↗", bag-drawer fallback); the shop-hero note dropped that link. Monika's note "Chosen, not stocked" = both brands are referral/partner sales, not shelf stock.
- **Gotcha found on production right after (Nov 21/22 2026):** `PARTNER_NAME` was exported from the `"use client"` AddToBag module and imported by the server PDP — a non-component export of a client module is a client-reference stub on the server, so the live page rendered "Sold through our $undefined partner store" while the local checks (which only grepped the button) passed. The map now lives in `products.ts` (plain module) and AddToBag, the PDP and the checkout route import it from there. Rule: shared constants go in `src/labo/clinic/*`, never in a client component file. Also: React SSR puts `<!-- -->` between adjacent text expressions, so grep live HTML with a pattern that tolerates it.
- **skinbetter packshots (Nov 22 2026, Javier: "can you get the images like you did for Alastin?"):** skinbetter.com is bot-walled, but authorized-provider Shopify stores expose the standard `/products.json?limit=250` feed with skinbetter's own brand photos — `shop.greatskinkc.com` (3000–3600px PNGs on transparent), `shop.vivadayspa.com` (2130×2840 JPGs), `shop.signaturemedispa.com` (930px webp); `shop.lazskincare.com` shots sit on a light-blue backdrop with a LAZ watermark — skipped. The Shopify `search/suggest.json` endpoint returned HTML on all of them; the product feed worked. All ten normalized by a PIL pass (alpha → white, near-white trim, 22% square pad, 1200×1200 progressive JPG q88, ~45 KB) into `public/labo/img/shop/skinbetter/<slug>.jpg`, self-hosted (not hotlinked — these are other clinics' CDNs, unlike ALASTIN's own). Mystro Active Balance's only source had award badges to the right of the bottle → cropped to the left half, re-trimmed. `.pshot.photo` multiplies the image over #F4F0EA so the white matte disappears. Replace with the partner kit's files when they arrive.
- **No SkinMedica, no shipping promise (Nov 21 2026, Javier's two screenshots):** the three SkinMedica products, the Line chip, the home partner-strip logo (+ its png) and the orders help copy are gone; `LINES` = ALASTIN + skinbetter only. The shop's "Free shipping over $75" tile became "Bought from the brand, direct", and both promo bars (`(home)/page.tsx`, `Chrome.tsx`) lost the free-shipping line — every product is a partner-store item now, nothing ships from the clinic, so the claim was false. `SHOP.freeShippingOver/flatShipping/shipsTo` and the Stripe checkout + bag stay in the tree for the day a clinic-stocked line returns. ShopGrid hides Type/Concern chips that match no product (SkinMedica held the only Cleanser/Exfoliant — the chips led to "0 products"). Later the same night the home ticker (`STRIP`) lost "Free skincare shipping over $75" too.
- **Telehealth call-out (Nov 21 2026, Javier: "move [the Telehealth link] somewhere else in menu and put like 'interested in Weight Loss and Peptides? click here' … for Mobile as well in a very premium looking way"):** `components/labo/TeleCallout.tsx` — `<TelePill />` (beside the wordmark ≥1340px: tinted purple capsule, pulse dot, "Weight loss & peptides? **Click here ›**") and `<TeleBand />` (under the header <1340px: purple gradient band, full sentence, pill-shaped "Click here ›"). Plain "Telehealth" entry = `TELE_LINK` (content.ts), appended after NAV in the desktop nav (purple) and the phone sheet (with a "weight loss & peptides, by video" sub-line); kept out of NAV so the footer's Explore column doesn't double it. Both headers (Chrome.tsx + `(home)/page.tsx`) render pill + band. Layout facts: the clinic header bar now has its own wrap (`header.site .wrap.bar{max-width:1360px}`) because brand + pill + 9 links + search + bag + Book now need ~1270px and the page wrap is 1140 — before this the bar silently overflowed its wrap at every width ≤1360; the brand's `margin-right:auto` pushes the row right and is zeroed only while the pill is shown (the old inline `marginRight:0` on `.brand` is gone). Gotcha: `.tele` was already a class (home telehealth rows, `overflow:hidden`) — the nav/sheet link is `.telelink`. Purple #6E3F99 is hard-coded in the clinic scope (its --accent is clay). Verified with CDP measurements at 1600/1440/1366/1340/1280/1024/390 (bookRight < barRight everywhere) and screenshots. Later that night "Members" joined NAV, so the bar wrap went to 1440px and the pill/band breakpoint to 1400px (re-measured 1600→1280 clean).
- **Members (Nov 21 2026, Javier: "tie in website and admin portal — a sign up to be a member feature… build that into site that links to portal, advertise why people should join"):** the membership IS the free portal account. `/membership` (`(site)/membership/page.tsx`: PageHero, Join free → `/auth/signup?redirect=%2Fportal`, Sign in → `/auth/login?redirect=%2Fportal`, six perks grid `.perks` — each one something /portal already does (visits/plan/meds, messages, requests, faster booking, offers first, one login for clinic + Method), three steps `.steps`, a `.values` row: private, not a subscription, already-a-patient). Home band `#members.memband` (ink background, five ✓ perks, Join free + Why join) sits before Testimonials. "Members" is in NAV → desktop nav, phone sheet, footer Explore; `/membership` in the sitemap. **Admin:** `/clinic/members` (staff + admin; ClinicNav "✦ Members") lists every `profiles` row with role `patient` minus the team (`labo_staff` + LABO_PROVIDER_EMAIL), joined = profiles.created_at, last sign-in + confirmed from `auth.admin.listUsers` (first 1000), search by name/email; the Today header links "N members" (`countMembers()`, 0 when the table/key is missing). Soft promise to keep: "members hear first" about offers/events = Monika emails members. Gotchas: a `page.tsx` may not export arbitrary consts (Next's page-export check) — helpers are module-local; a Supabase query builder is thenable but has no `.catch` — wrap in try/await; The Customers page (from bookings) and Members (from accounts) are different lists until there is a customer record.
- **Member sign-up: optional mobile + SMS consent (Nov 22 2026, Javier: "add the phone number as option… which is our compliance area"):** `/auth/signup` has a "Mobile number (optional, for texts)" field and the same UNCHECKED consent box as the contact form / `/sms` (`CONSENT_TEXT`, links to Privacy Policy + SMS Terms). Ticked → the number must be 10 US digits (stored E.164 `+1…`). Stored on `profiles` (migration `labo_profiles_phone_sms_consent`: `phone`, `sms_consent`, `sms_consent_at`, `sms_consent_meta`; `handle_new_user()` copies phone/consent from the sign-up metadata so the row is right even before the client upsert). The carrier-auditable record = `POST /api/labo/members/consent {email}` fired right after sign-up: stamps IP / user agent / disclosure / timestamp into `sms_consent_meta` and emails the practice inbox the record (Resend, same FROM/TO as the contact form). It can only annotate an existing consent (sms_consent true, no meta yet) — never create or flip one — so it needs no session. `/clinic/members` shows Mobile + Texts ("Opted in" pill), counts opt-ins, and searches by digits. Nothing is auto-texted; numbers go into the texting platform by hand, as with /sms.
- **Branded Auth emails (Nov 21 2026, Javier: "can we brand this" — the Supabase default confirmation mail):** `supabase/email-templates/` — `build.py` renders one inline-styled table layout (paper/clay, system sans) into `confirm-signup.html`, `reset-password.html`, `magic-link.html` + `.subject.txt`; the brand is a Go-template conditional on `{{ .Data.brand }}` because the project is shared with MyCleanMD — the Labo sign-up page now sends `brand: "labo"` in `options.data`. **Javier pastes** them in Supabase → Authentication → Emails, and turns on custom SMTP via Resend (`smtp.resend.com:465`, user `resend`, password = the Resend API key, sender `The Labo Clinic <support@mycleantext.com>` until thelabomethod.com is verified in Resend) — the connector can't write Auth config. Steps in `supabase/email-templates/README.md`. Preview: render with the `if` branch resolved (see the scratch snippet pattern) — leftover `{{` count must be 0. **Applied the same night via the Management API** (Javier created a 7-day token scoped to mycleanmd; a token with only Auth Config read-write got `403 project_admin_write` — it also needs **Project Settings: Read-write**): templates + subjects, and custom SMTP = Resend (`smtp.resend.com:465`, user `resend`, key `supabase-smtp` scoped to mycleantext.com, sender The Labo Clinic <support@mycleantext.com>, rate limit 60/h). Secrets were read from the clipboard / an owner-only scratch file and shredded; nothing printed or committed. Javier deletes the tokens after.
