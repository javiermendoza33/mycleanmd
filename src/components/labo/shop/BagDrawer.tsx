"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProduct, money, SHOP } from "@/labo/clinic/products";
import { CLINIC_SITE } from "@/labo/clinic/site";
import { Packshot } from "./Packshot";
import { useBag } from "./bag";

/** The bag drawer, mounted once per clinic layout. Checkout posts the lines to /api/labo/shop/checkout, which re-prices
 *  them from the catalog and returns a Stripe Checkout URL — or 503 until STRIPE_SECRET_KEY exists, in which case the
 *  drawer offers the text line instead of a dead button. */
export default function BagDrawer() {
  const { lines, count, subtotal, set, open, setOpen } = useBag();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [open, setOpen]);
  if (!open) return null;
  const away = SHOP.freeShippingOver - subtotal;
  async function checkout() {
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/labo/shop/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lines }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.url) { window.location.href = j.url; return; }
      setErr(r.status === 503 ? "unavailable" : (j.error || "Something went wrong — try again."));
    } catch { setErr("Something went wrong — try again."); }
    setBusy(false);
  }
  return (
    <div className="bagwrap" role="dialog" aria-modal="true" aria-label="Your bag">
      <div className="bagbg" onClick={() => setOpen(false)} />
      <aside className="bag">
        <header><h3>Your bag <span className="mono">({count})</span></h3><button type="button" className="x" onClick={() => setOpen(false)} aria-label="Close bag">✕</button></header>
        {!lines.length ? (
          <div className="bagempty"><p className="sub">Your bag is empty.</p><Link className="btn btn-primary" href="/shop" onClick={() => setOpen(false)}>Shop skincare</Link></div>
        ) : (
          <>
            <ul className="baglines">
              {lines.map((l) => { const p = getProduct(l.slug); if (!p) return null; return (
                <li key={l.slug}>
                  <Packshot p={p} className="pthumb" />
                  <div className="bl"><span className="pline">{p.line}</span><b>{p.name}</b><span className="mono">{money(p.price)} · {p.size}</span>
                    <div className="qty" aria-label="Quantity"><button type="button" onClick={() => set(l.slug, l.qty - 1)} aria-label="Remove one">−</button><span className="mono">{l.qty}</span><button type="button" onClick={() => set(l.slug, Math.min(10, l.qty + 1))} aria-label="Add one">+</button><button type="button" className="rm" onClick={() => set(l.slug, 0)}>Remove</button></div>
                  </div>
                  <span className="mono lt">{money(p.price * l.qty)}</span>
                </li>
              ); })}
            </ul>
            <div className="bagfoot">
              <p className="ship mono">{away > 0 ? `${money(away)} away from free shipping` : "Free shipping unlocked"}</p>
              <div className="bar"><i style={{ width: `${Math.min(100, (subtotal / SHOP.freeShippingOver) * 100)}%` }} /></div>
              <div className="tot"><span>Subtotal</span><b className="mono">{money(subtotal)}</b></div>
              <p className="note">Shipping{away > 0 ? ` (${money(SHOP.flatShipping)} under ${money(SHOP.freeShippingOver)})` : ""} and tax at checkout. {SHOP.shipsTo}.</p>
              {err === "unavailable" ? (
                <div className="bagalt">
                  <p>Online checkout opens soon. Text us what you&rsquo;d like and we&rsquo;ll set it aside for pick-up or shipping.</p>
                  <a className="btn btn-primary" href={`${CLINIC_SITE.sms}?&body=${encodeURIComponent("Hi! I'd like to order: " + lines.map((l) => `${l.qty} × ${getProduct(l.slug)?.name}`).join(", "))}`}>Text {CLINIC_SITE.phoneDisplay}</a>
                  <a className="more" href={SHOP.skinbetterStore} target="_blank" rel="noopener noreferrer">Or buy skinbetter online now ↗</a>
                </div>
              ) : (
                <>
                  {err && <p className="err">{err}</p>}
                  <button type="button" className="addbar big" onClick={checkout} disabled={busy}>{busy ? "Opening checkout…" : "Checkout"}</button>
                </>
              )}
              <button type="button" className="more cont" onClick={() => setOpen(false)}>Continue shopping</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
