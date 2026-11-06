import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getProgram } from '@/labo/content'

// Creates a Stripe Checkout Session for one Labo Method program and redirects
// the browser straight to Stripe's hosted checkout page. Mirrors the
// auth-then-service-role pattern in /api/intake/save: verify the session with
// the anon client, then use the service-role client for anything privileged.
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('program')
  const program = slug ? getProgram(slug) : undefined
  if (!program) {
    return NextResponse.json({ ok: false, error: 'Unknown program' }, { status: 404 })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey || program.stripePriceId === 'PRICE_ID_NOT_SET') {
    // Expected until Javier creates a Stripe account + the 4 Products/Prices
    // and fills STRIPE_SECRET_KEY + each program's stripePriceId in.
    return NextResponse.json(
      { ok: false, error: 'Stripe not configured yet for this program.' },
      { status: 503 }
    )
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()

  const origin = req.nextUrl.origin
  const stripe = new Stripe(secretKey)

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: program.stripePriceId, quantity: 1 }],
    // Payment methods (card, US bank account, Link) are controlled from the
    // Stripe Dashboard's own Payment Methods settings, not hardcoded here —
    // that's also where Javier enables the ACH "$5 back"-style incentive seen
    // on Mochi's checkout, if he wants it.
    // Not logged in yet is fine — the success page and the webhook both carry
    // enough to link the subscription to an account once one exists.
    customer_email: user?.email ?? undefined,
    client_reference_id: user?.id,
    metadata: { programSlug: program.slug, userId: user?.id ?? '' },
    success_url: `${origin}/join/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/join/${program.slug}`,
  })

  if (!session.url) {
    return NextResponse.json({ ok: false, error: 'Stripe did not return a checkout URL' }, { status: 502 })
  }
  return NextResponse.redirect(session.url, 303)
}
