import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct, SHOP } from "@/labo/clinic/products";

/**
 * The shop's checkout (Nov 19 2026): POST { lines: [{slug, qty}] } → a Stripe Checkout Session in payment mode, priced
 * from the catalog (ad-hoc price_data, so no Stripe Products/Prices need creating per item), US shipping address
 * collection, flat or free shipping from SHOP, and { url } back for the browser to follow. 503 until STRIPE_SECRET_KEY
 * is set on the mycleanmd Vercel project — the bag drawer then offers the text line instead. Same key the telehealth
 * programs route uses, so one Stripe account serves both; the webhook ignores `kind:"shop"` sessions (nothing to enrol).
 */
export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ ok: false, error: "Online checkout is not open yet." }, { status: 503 });

  let body: { lines?: Array<{ slug?: string; qty?: number }> } = {};
  try { body = await req.json(); } catch { /* fallthrough */ }
  const lines = (body.lines || [])
    .map((l) => ({ p: getProduct(String(l?.slug || "")), qty: Math.max(0, Math.min(10, Math.floor(Number(l?.qty) || 0))) }))
    .filter((l): l is { p: NonNullable<typeof l.p>; qty: number } => !!l.p && l.qty > 0)
    .slice(0, 30);
  if (!lines.length) return NextResponse.json({ ok: false, error: "Your bag is empty." }, { status: 400 });
  const notYet = lines.filter((l) => l.p.soon);
  if (notYet.length) return NextResponse.json({ ok: false, error: `${notYet.map((l) => l.p.name).join(", ")} ${notYet.length === 1 ? "is" : "are"} coming soon and can't be ordered yet.` }, { status: 400 });
  // Partner-store items (ALASTIN, Nov 21 2026) are bought on the partner's site, never through our checkout.
  const partnerItems = lines.filter((l) => l.p.partner);
  if (partnerItems.length) { const brand = { alastin: "ALASTIN Skincare®", skinbetter: "skinbetter science®" }[partnerItems[0].p.partner as string] ?? "partner"; return NextResponse.json({ ok: false, error: `${partnerItems.map((l) => l.p.name).join(", ")} ${partnerItems.length === 1 ? "is" : "are"} sold through our ${brand} partner store.` }, { status: 400 }); }

  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const shipping = subtotal >= SHOP.freeShippingOver ? 0 : SHOP.flatShipping;
  const origin = req.nextUrl.origin;
  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lines.map((l) => ({
      quantity: l.qty,
      price_data: { currency: SHOP.currency, unit_amount: Math.round(l.p.price * 100), product_data: { name: l.p.name, description: `${l.p.line} · ${l.p.size}`, metadata: { slug: l.p.slug } } },
    })),
    shipping_address_collection: { allowed_countries: ["US"] },
    shipping_options: [
      { shipping_rate_data: { type: "fixed_amount", display_name: shipping ? "Standard shipping" : "Free shipping", fixed_amount: { amount: shipping * 100, currency: SHOP.currency }, delivery_estimate: { minimum: { unit: "business_day", value: 3 }, maximum: { unit: "business_day", value: 7 } } } },
      { shipping_rate_data: { type: "fixed_amount", display_name: "Pick up where South Lake Union meets Eastlake", fixed_amount: { amount: 0, currency: SHOP.currency } } },
    ],
    phone_number_collection: { enabled: true },
    metadata: { kind: "shop", items: lines.map((l) => `${l.qty}x ${l.p.slug}`).join(", ").slice(0, 480) },
    success_url: `${origin}/shop/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop`,
  });
  if (!session.url) return NextResponse.json({ ok: false, error: "Stripe did not return a checkout URL" }, { status: 502 });
  return NextResponse.json({ ok: true, url: session.url });
}
