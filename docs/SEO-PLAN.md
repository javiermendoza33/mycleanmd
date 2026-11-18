# The Labo Method — SEO & indexing plan (Nov 18 2026)

## Where it stood on Nov 18
- `robots.txt` was `Disallow: /` and every page carried `noindex, nofollow` (the `LAUNCH_READY` gate), so nothing on
  thelabomethod.com was indexable. Search Console shows what Google actually holds; nothing should be there yet.
- The same copy is live on skinhavenclinic.com (WordPress, Growth99), which Google already knows. Two sites with the
  same text compete with each other; the older domain wins by default.
- No GA4 property, no Google Business Profile for "The Labo Method", structured data described a telehealth
  endocrinology practice with no address.

## Done in code (this commit)
1. **Split gate.** `CLINIC_INDEX = true` opens the clinic pages (home, services + 10 detail pages, about, contact,
   booking, patient care, testimonials, blog + 7 posts, privacy). `GATED` keeps `/programs`, `/pricing`,
   `/how-it-works`, `/join`, `/legal`, `/faq`, `/treatments` noindex (per-page meta + robots.txt + out of the
   sitemap) until Monika clears the placeholder prices and the legal copy — then flip `LAUNCH_READY`.
2. **Metadata.** Clinic-first title and description ("Medical Spa in Seattle & Ruston, WA — Botox, Fillers, Laser,
   Sculptra"), Open Graph image, canonicals on every page.
3. **Structured data.** `MedicalBusiness` with both locations (addresses, phone, hours, map links), the service list,
   the founder, Instagram as `sameAs`; `MedicalProcedure` + `FAQPage` + `BreadcrumbList` on every service page;
   `BlogPosting` on every post. (Rich-result eligible: FAQ and breadcrumbs.)
4. **Speed.** The hero video (5 MB) is desktop-only; phones get the poster. Images are lazy except above the fold.

## Javier's checklist (accounts — nothing here can be done from the repo)
1. **Search Console.** Add the Domain property `thelabomethod.com` (DNS TXT at the registrar/Vercel), submit
   `https://thelabomethod.com/sitemap.xml`, then "Request indexing" for `/`, `/services`, `/about`, `/booking` and the
   ten service pages. The Pulse board already lists `sc-domain:thelabomethod.com` — share the property with the
   service account so Pulse shows clicks (same account as the other sites).
2. **GA4.** Create the property → Vercel env `LABO_GA_PROPERTY_ID` (Pulse) and `NEXT_PUBLIC_LABO_GA_ID` (the site's
   `Analytics.tsx` is a no-op until it exists) → redeploy.
3. **Google Business Profile — the biggest local lever.** The clinic's two listings (South Lake Union, Ruston) exist
   under the Skin Haven name with reviews. Rename them to The Labo Method and set the website to thelabomethod.com
   rather than creating new listings: the reviews, photos and ranking carry over. Match the name/address/phone exactly
   to the site (NAP). Then Apple Maps, Yelp, Bing Places, RealSelf, Instagram bio — same NAP and URL.
4. **Decide what happens to skinhavenclinic.com** (see below). This is the decision the rest of the plan hangs on.

## The skinhavenclinic.com decision
**Recommended: retire it with 301 redirects to thelabomethod.com.** That moves the old domain's history to the new one
and removes the duplicate-content competition. It needs control of the skinhavenclinic.com DNS (Cloudflare zone under
Growth99 — the July audit's cutover blocker) or of the WordPress site (a redirect plugin / `.htaccess`). Point the
domain at Vercel and the map below ships as `redirects` in `next.config.ts`; or hand the map to Growth99.

| Old URL (skinhavenclinic.com) | New URL (thelabomethod.com) |
|---|---|
| `/` | `/` |
| `/about-us/` | `/about` |
| `/services/` | `/services` |
| `/wrinkle-relaxers-in-seattle-wa/` | `/services/wrinkle-relaxers` |
| `/dermal-fillers-in-seattle-wa/` | `/services/dermal-fillers` |
| `/sculptra-biostimulator-in-seattle-wa/` | `/services/sculptra` |
| `/microneedling-in-seattle-wa/` | `/services/microneedling` |
| `/prp-prf-exosomes-in-seattle-wa/` | `/services/prp-exosomes` |
| `/pdo-threads-in-seattle-wa/` | `/services/pdo-threads` |
| `/chemical-peels-in-seattle-wa/` | `/services/chemical-peels` |
| `/cosmetic-rx-in-seattle-wa/` | `/services/cosmetic-rx` |
| `/wellness-in-seattle-wa/` | `/services/wellness` |
| `/medical-weight-loss-in-seattle-wa/` | `/services/medical-weight-loss` |
| `/patient-care/`, `/pre-and-post-treatment-instructions-in-seattle-wa/` | `/patient-care` |
| `/testimonials/` | `/testimonials` |
| `/blog/` | `/blog` |
| `/<post-slug>/` (7 posts, same slugs) | `/blog/<post-slug>` |
| `/booking/` | `/booking` |
| `/contact/` | `/contact` |
| `/privacy-policy/` | `/privacy-policy` |
| anything else | `/` |

**If both brands stay:** the old site keeps its rankings and the new site mostly won't rank for the same copy. Then
the new site needs its own copy over time (rewrite service pages, not just the brand name) and a canonical plan.

## Content plan (after indexing is open)
- Targets: "med spa seattle", "botox seattle", "dermal fillers seattle", "sculptra seattle", "laser hair removal
  seattle", "microneedling seattle", "botox tacoma / ruston", "pdo threads seattle", "iv therapy seattle".
- Location pages: `/seattle` (South Lake Union) and `/ruston` (Tacoma area) with their own copy, hours, parking, map.
- Service pages: add a short "at The Labo Method" paragraph to each (what's different: NP-led, exam first), prices
  once Monika sets them, before/after galleries when she has consented photos.
- Blog: the 7 posts exist; the Content Autopilot (VPS) can draft one Labo article a month like FT/MCT/MCO.
- Reviews: a "leave a review" link to the Google listing on the thank-you flow and in the booking confirmation.

## How to check it worked
- `curl -s https://thelabomethod.com/robots.txt` — Allow / with the gated Disallows.
- `curl -s https://thelabomethod.com/ | grep -o '<meta name="robots"[^>]*>'` — nothing (indexable); the same on
  `/programs` shows `noindex, follow`.
- Search Console → Pages: indexed count climbing over 2–4 weeks; Enhancements → FAQ / Breadcrumbs valid.
- Pulse board → The Labo Method card shows Search Console clicks once the property is shared.
