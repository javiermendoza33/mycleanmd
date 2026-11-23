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
    // Nov 19 2026: shop orders (the skincare bag, /api/labo/shop/checkout) carry kind:"shop" — nothing to enrol, Stripe's own
    // dashboard + receipt emails are the order record for now. Acknowledge and move on.
    if (session.metadata?.kind === 'shop') {
      // Nov 20 2026: record the shop order for the clinic team (/clinic/orders); own-line items are then placed with Selfnamed.
      try {
        const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100, expand: ['data.price.product'] })
        const lines = items.data.map((li) => { const prod = li.price?.product as Stripe.Product | string | null; const meta = prod && typeof prod === 'object' ? prod.metadata : {}; return { slug: meta?.slug ?? '', name: li.description ?? '', qty: li.quantity ?? 1, unit: (li.price?.unit_amount ?? 0) / 100, own: String(meta?.slug ?? '').startsWith('labo-') } })
        // Stripe moved shipping_details under collected_information in newer API versions; read either.
        const sx = session as unknown as { collected_information?: { shipping_details?: { name?: string; address?: Record<string, string> } }; shipping_details?: { name?: string; address?: Record<string, string> } }
        const ship = sx.collected_information?.shipping_details ?? sx.shipping_details ?? session.customer_details
        const pickup = (session.shipping_cost?.amount_total ?? 0) === 0 && /pick/i.test(String((session as unknown as { shipping_cost?: { shipping_rate?: { display_name?: string } } }).shipping_cost?.shipping_rate?.display_name ?? ''))
        const { error } = await createAdminClient().from('labo_orders').upsert({
          stripe_session_id: session.id, stripe_payment_id: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
          status: 'paid', fulfillment: pickup ? 'pickup' : 'ship',
          name: ship?.name ?? session.customer_details?.name ?? null, email: session.customer_details?.email ?? null, phone: session.customer_details?.phone ?? null,
          ship_to: ship?.address ?? null, items: lines,
          subtotal: (session.amount_subtotal ?? 0) / 100, shipping: (session.shipping_cost?.amount_total ?? 0) / 100, tax: (session.total_details?.amount_tax ?? 0) / 100, total: (session.amount_total ?? 0) / 100, currency: session.currency ?? 'usd',
        }, { onConflict: 'stripe_session_id' })
        if (error) console.error('labo_orders upsert error:', error)
      } catch (e) { console.error('shop order record failed:', e) }
      return NextResponse.json({ ok: true })
    }
    // Nov 23 2026: a Method program start from /start carries kind:"method" + careId — payment releases the Cuvo case hold.
    if (session.metadata?.kind === 'method' && session.metadata.careId) {
      const { careById, updateCare, addEvent } = await import('@/lib/labo/crm'); const { cuvo } = await import('@/lib/cuvo')
      const care = await careById(session.metadata.careId)
      if (care) {
        if (care.cuvo_case_id) { try { await cuvo().releaseHold(care.cuvo_case_id) } catch (e) { console.error('[method] release_hold failed:', (e as Error).message) } }
        await updateCare(care.id, { status: 'filed', paid_at: new Date().toISOString(), stripe_checkout_session_id: session.id })
        await addEvent(care.customer_id, 'method', 'case', 'Paid · case filed for clinician review', { case: care.cuvo_case_id, session: session.id })
      }
      return NextResponse.json({ ok: true })
    }
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
