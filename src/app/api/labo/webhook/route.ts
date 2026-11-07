import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

// Stripe webhook — on checkout.session.completed, record (or update) a
// labo_enrollments row via the service-role client, same pattern as
// /api/intake/save. Signature-verified so this can't be spoofed.
export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ ok: false, error: 'Stripe not configured yet' }, { status: 503 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ ok: false, error: 'Missing stripe-signature' }, { status: 400 })
  }

  const stripe = new Stripe(secretKey)
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const programSlug = session.metadata?.programSlug
    const userId = session.metadata?.userId || session.client_reference_id || null

    if (!programSlug) {
      console.error('checkout.session.completed with no programSlug metadata:', session.id)
      return NextResponse.json({ ok: true }) // ack — nothing we can do with this one
    }

    const admin = createAdminClient()
    const { error } = await admin.from('labo_enrollments').upsert(
      {
        // user_id can be null here if the patient checked out before creating
        // an account — /join/success links it up once they sign in/up.
        user_id: userId,
        program_slug: programSlug,
        stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null,
        stripe_subscription_id:
          typeof session.subscription === 'string' ? session.subscription : session.subscription?.id ?? null,
        stripe_checkout_session_id: session.id,
        status: 'active',
      },
      { onConflict: 'stripe_checkout_session_id' }
    )

    if (error) {
      console.error('labo_enrollments upsert error:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
