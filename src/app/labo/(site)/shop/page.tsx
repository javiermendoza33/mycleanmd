import Link from "next/link";
import { CONCERNS, products, SHOP } from "@/labo/clinic/products";
import { BookCta } from "@/components/labo/Clinic";
import ShopGrid from "@/components/labo/shop/ShopGrid";

export const metadata = {
  title: "Shop medical-grade skincare",
  description: "ALASTIN Skincare® and skinbetter science® skincare curated by The Labo Clinic in Seattle — serums, retinoids, mineral sunscreen and moisturizers, chosen by our providers and sold through each brand's partner store.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      <section className="shophero">
        <div className="wrap">
          <span className="kicker">The shop · medical-grade skincare</span>
          <h1>Skincare vetted by our providers&mdash;and trusted in our own daily routines</h1>
          <p className="sub">ALASTIN Skincare® anti-aging and serums and skinbetter science® best sellers — the brands we use in the treatment room. Curated by us, with a routine that fits yours — no 12-step anything unless you want it, no judgement here.</p>
          <div className="chips tiles" aria-label="Shop by concern">
            <Link href="/shop?line=ALASTIN%20Skincare%C2%AE" className="cchip own">ALASTIN Skincare®</Link>
            <Link href="/shop?line=skinbetter%20science" className="cchip own">skinbetter science®</Link>
            {CONCERNS.map((c) => <Link key={c} href={`/shop?c=${c}`} className="cchip">{c}</Link>)}
          </div>
          {!SHOP.pricesConfirmed && <p className="note">Pricing is being finalized — text us for today&rsquo;s price on any item.</p>}
        </div>
      </section>
      <section className="shopgrid">
        <div className="wrap"><ShopGrid products={products} /></div>
      </section>
      <section className="grey" style={{ paddingBlock: 70 }}>
        <div className="wrap values">
          <div><b>Chosen, not stocked</b><p>Every product here is one we&rsquo;ve tested ourselves and use in-clinic or send home after a treatment.</p></div>
          <div><b>Bought from the brand, direct</b><p>Each product links to the brand&rsquo;s own partner store for our clinic &mdash; you order there and it ships straight from them.</p></div>
          <div><b>Ask before you buy</b><p>Not sure what your skin needs? Text us a photo and a line about your goals — we&rsquo;ll point you to two products, not ten.</p></div>
        </div>
      </section>
      <BookCta />
    </>
  );
}
