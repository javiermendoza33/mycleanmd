import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const GATE_COOKIE = '_gate'

/**
 * thelabomethod.com is a PUBLIC marketing site sharing this app (and this
 * Vercel project) with the gated MyCleanMD portal. It is served from
 * src/app/labo/* but must have no /labo prefix in its URLs — the whole point
 * of the site is organic search, and a prefix would put it in every canonical.
 *
 * So: rewrite by hostname, and return before the gate. The gate exists to keep
 * the UNRELEASED MyCleanMD portal off the public internet; applying it here
 * would password-protect a marketing site, which is the opposite of the job.
 */
// Nov 19 2026: labo.benthicgroup.com = the Vercel branch domain for `sandbox-booking` (benthicgroup.com is on Vercel DNS, so no
// registrar step; Javier: "just host it on vercel… its temp anyways"). Same clinic site, same routing, noindex.
const SANDBOX_HOST = 'labo.benthicgroup.com'
// Nov 22 2026 (Javier: "we bought thelaboclinic.com which this site should point to and the telehealth point to
// thelabomethod.com"): the clinic moved to thelaboclinic.com; thelabomethod.com is The Labo Method (telehealth) now.
const CLINIC_HOST = 'thelaboclinic.com'
const METHOD_HOST = 'thelabomethod.com'
const LABO_HOSTS = [CLINIC_HOST, `www.${CLINIC_HOST}`, SANDBOX_HOST]
// Clinic-only URLs that Google indexed on thelabomethod.com before the move — 308 them to the same path on the clinic host.
const CLINIC_ONLY_PATHS = ['about', 'booking', 'contact', 'membership', 'patient-care', 'services', 'shop', 'testimonials', 'treatments']   // 'privacy-policy' left out Nov 23 2026: the Method has its own   // 'sms' left out Nov 23 2026: the Method has its own /sms
const CLINIC_BLOG_SLUGS = new Set(['why-exosomes-are-better-than-prp', 'concerns-can-be-addressed-with-chemical-peels', 'can-iv-therapy-help-you-reduce-stress', 'is-medical-weight-loss-right-for-you', 'botox-vs-dysport-deciphering-the-perfect', 'iv-therapy-vitamin-shots-5-benefits-you-need-to-know', 'what-are-pdo-threads-and-how-they-work-cosmetic-procedures'])
// The Labo Method (telehealth, white-labelled onto Healthie) is a SEPARATE
// brand from The Labo Clinic (in-person, served at the LABO_HOSTS above) —
// Nov 19 2026, Javier: split the two, don't reuse mycleanmd.com/MyCleanMD.
// It lives on its own subdomain of the same domain, sharing this Vercel
// project and this repo (src/app/labo/method/*), not a new domain to manage.
const METHOD_HOSTS = [METHOD_HOST, `www.${METHOD_HOST}`, `method.${METHOD_HOST}`]   // method.* is the pre-move subdomain, redirected below

export async function proxy(request: NextRequest) {
  const { pathname: path } = request.nextUrl
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? ''
  const isLabo = LABO_HOSTS.includes(host)
  const isMethod = METHOD_HOSTS.includes(host)

  if (isLabo || isMethod) {
    // Browsers that ask for the bare /favicon.ico get this host's brand mark (Nov 22 2026).
    if (path === '/favicon.ico') {
      const url = request.nextUrl.clone(); url.pathname = isMethod ? '/labo/method-favicon/favicon.ico' : '/labo/favicon/favicon.ico'
      return NextResponse.rewrite(url)
    }
    // www → apex, so one canonical host owns the index. Only applies to the
    // Clinic host — method.thelabomethod.com has no www variant.
    if (host.startsWith('www.') || host === `method.${METHOD_HOST}`) {
      const url = new URL(request.url)
      url.host = isMethod ? METHOD_HOST : CLINIC_HOST
      return NextResponse.redirect(url, 308)
    }
    // The clinic's old URLs on thelabomethod.com (services, shop, booking, the portals, sign-in…) live on
    // thelaboclinic.com now; one account serves both brands, so the portal/auth pages redirect too.
    if (isMethod) {
      const first = '/' + (path.split('/')[1] ?? '')
      const clinicBlog = path.startsWith('/blog/') && CLINIC_BLOG_SLUGS.has(path.split('/')[2] ?? '')
      // Nov 23 2026: Method patients sign in and use /portal on thelabomethod.com itself (the sign-up flow lands there with its
      // session cookies); only the staff portals still live on the clinic host.
      const portalish = ['/clinic', '/provider'].includes(first)
      if (CLINIC_ONLY_PATHS.includes(first.slice(1)) || clinicBlog || portalish) {
        const url = new URL(request.url); url.host = CLINIC_HOST
        return NextResponse.redirect(url, 308)
      }
    }
    // Internal path prefix for this host: Clinic pages live at /labo/*,
    // Method pages at /labo/method/* (so Method inherits the Clinic's own
    // layout — fonts, [data-labo] base tokens, analytics — for free; it just
    // never gets the [data-clinic] override, so it renders the original
    // Apple-blue "White Room" system instead of the clinic's clay storefront).
    const prefix = isMethod ? '/labo/method' : '/labo'
    // Asking for the internal path directly on this host would duplicate
    // every page at two URLs, so send it to the clean one.
    if (path === prefix || path.startsWith(prefix + '/')) {
      const url = request.nextUrl.clone()
      url.pathname = path.slice(prefix.length) || '/'
      return NextResponse.redirect(url, 308)
    }

    // The patient portal (/portal*) is the one part of this host that is NOT
    // public marketing — it needs a real Supabase session, same mechanism the
    // mycleanmd.com guard uses lower in this file (that guard never runs for
    // this host, since we return before reaching it).
    // API routes and the auth pages live at the app root and are shared by both brands — pass them
    // through untouched, otherwise the catch-all rewrite below turns /auth/login into /labo/auth/login (404).
    // Verified Nov 6 2026: login, /api/auth/providers and /api/labo/checkout all 404'd on this host before this.
    // Nov 19 2026: the Labo hosts get their own sign-in pages in the clinic look (src/app/labo/auth/*); the callback and
    // everything else under /auth and /api stays the shared root app.
    if (path === '/auth/login' || path === '/auth/signup' || path === '/auth/forgot' || path === '/auth/reset' || path === '/auth/confirm') {
      const url = request.nextUrl.clone(); url.pathname = `/labo${path}`
      return NextResponse.rewrite(url)
    }
    if (path.startsWith('/api/') || path === '/auth' || path.startsWith('/auth/')) {
      return NextResponse.next({ request })
    }
    // The provider portal (/provider*, Nov 6 2026) is gated the same way PLUS an email allowlist
    // (LABO_PROVIDER_EMAIL, comma-separated). A signed-in patient who tries it lands on their own portal.
    const isProvider = path === '/provider' || path.startsWith('/provider/')
    const isClinic = path === '/clinic' || path.startsWith('/clinic/')   // Nov 19 2026: the clinic staff portal (roles checked in its layout)
    if (path === '/portal' || path.startsWith('/portal/') || isProvider || isClinic) {
      let portalResponse = NextResponse.next({ request })
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return request.cookies.getAll() },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
              portalResponse = NextResponse.next({ request })
              cookiesToSet.forEach(({ name, value, options }) =>
                portalResponse.cookies.set(name, value, options)
              )
            },
          },
        }
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('redirect', path)
        return NextResponse.redirect(loginUrl)
      }
      if (isProvider) {
        const allow = (process.env.LABO_PROVIDER_EMAIL || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
        if (!allow.includes((user.email || '').toLowerCase())) return NextResponse.redirect(new URL('/portal', request.url))
      }
      const url = request.nextUrl.clone()
      url.pathname = `/labo${path}`
      const rewritten = NextResponse.rewrite(url)
      // Carry over any refreshed session cookies Supabase set above.
      portalResponse.cookies.getAll().forEach((c) => rewritten.cookies.set(c))
      return rewritten
    }

    const url = request.nextUrl.clone()
    url.pathname = `${prefix}${path === '/' ? '' : path}`
    const rewritten = NextResponse.rewrite(url)
    if (host === SANDBOX_HOST) rewritten.headers.set('X-Robots-Tag', 'noindex, nofollow')   // the sandbox never gets indexed
    return rewritten
  }

  // MyCleanMD's own favicon (public/favicon.ico) must not be gated — browsers fetch it before any login.
  if (path === '/favicon.ico') return NextResponse.next()

  // Site-access gate — keeps the in-progress site off the public internet.
  // Runs before Supabase auth so an unreleased site never even reaches login.
  // Soft gate only: the token is unsigned and checked client-side, so it stops
  // casual visitors and crawlers, not a determined one. Everything sensitive
  // still sits behind Supabase auth below.
  // FAIL CLOSED. If the token isn't configured, `cookies.get()?.value` and the
  // env var are both undefined, and `undefined !== undefined` is false — which
  // would wave every visitor straight through and publish an unreleased
  // telehealth site. Missing config must lock the door, not open it.
  const gateToken = process.env.NEXT_PUBLIC_GATE_TOKEN
  if (path !== '/gate' && (!gateToken || request.cookies.get(GATE_COOKIE)?.value !== gateToken)) {
    const url = new URL('/gate', request.url)
    url.searchParams.set('from', path)
    return NextResponse.redirect(url)
  }
  if (path === '/gate') return NextResponse.next({ request })

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = path

  // Public routes — always accessible (once past the gate).
  // /api/auth/providers returns only WHICH OAuth buttons to draw. The login
  // page needs it before anyone is signed in, and it starts with /api rather
  // than /auth, so without this line the auth guard bounced it to /auth/login
  // and the login page silently rendered no social buttons at all.
  if (
    pathname === '/' ||
    pathname.startsWith('/auth') ||
    pathname === '/api/auth/providers' ||
    pathname.startsWith('/onboarding')
  ) return response

  // Not logged in → login
  if (!user) return NextResponse.redirect(new URL('/auth/login', request.url))

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$|.*/.*\\.ico$).*)'],   // Nov 22 2026: bare /favicon.ico runs through the proxy (per-host icon); nested .ico files bypass it
}
