import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Role requested at signup, carried through the OAuth round-trip. Without it
  // every social signup landed as a patient, silently ignoring the doctor
  // choice on the form.
  //
  // WHITELISTED, and 'admin' is deliberately absent: this value arrives in a
  // URL and a URL is attacker-controlled. Self-selecting 'doctor' is already
  // possible through the email signup form, so allowing it here changes
  // nothing; letting 'admin' through would hand out the admin dashboard to
  // anyone who could type.
  const requested = searchParams.get('role')
  const wantedRole = requested === 'doctor' || requested === 'patient' ? requested : null

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      const { data: profile } = await supabase
        .from('profiles').select('role, full_name').eq('id', data.user.id).single()

      // Apply the requested role only when the account does not already have
      // one — an existing patient must not be able to re-sign-in through a
      // crafted ?role=doctor link and come back as a doctor.
      let role = profile?.role ?? 'patient'
      if (wantedRole && !profile?.role) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          role: wantedRole,
          email: data.user.email,
          full_name: profile?.full_name
            ?? (data.user.user_metadata?.full_name as string | undefined)
            ?? (data.user.user_metadata?.name as string | undefined)
            ?? null,
        })
        role = wantedRole
      }

      // Providers vary in what they return: Google and Facebook give a name,
      // Apple gives one only on the FIRST authorization and never again. If a
      // name did arrive, save it so onboarding does not ask twice.
      const providerName =
        (data.user.user_metadata?.full_name as string | undefined) ??
        (data.user.user_metadata?.name as string | undefined)
      if (!profile?.full_name && providerName && !wantedRole) {
        await supabase.from('profiles')
          .upsert({ id: data.user.id, full_name: providerName, email: data.user.email, role })
      }
      if (role === 'doctor') return NextResponse.redirect(`${origin}/doctor/dashboard`)
      if (role === 'admin') return NextResponse.redirect(`${origin}/admin/dashboard`)
      // New patient (no name set) → onboarding
      if (!profile?.full_name && !providerName) return NextResponse.redirect(`${origin}/onboarding`)
      return NextResponse.redirect(`${origin}/patient/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=oauth_failed`)
}
