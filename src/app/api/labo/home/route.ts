import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isProviderEmail } from '@/lib/labo/provider'

// Where a Labo user belongs after signing in: the provider (allowlisted email) → /provider, everyone else → /portal.
// Login/signup/callback ask this on thelabomethod.com instead of pushing MyCleanMD's /patient/dashboard (404 there).
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ path: '/auth/login' }, { status: 401 })
  return NextResponse.json({ path: isProviderEmail(user.email) ? '/provider' : '/portal' })
}
