import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const GATE_COOKIE = '_gate'

export async function proxy(request: NextRequest) {
  const { pathname: path } = request.nextUrl

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

  // Public routes — always accessible (once past the gate)
  if (pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/onboarding')) return response

  // Not logged in → login
  if (!user) return NextResponse.redirect(new URL('/auth/login', request.url))

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
