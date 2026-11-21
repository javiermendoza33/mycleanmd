import Link from "next/link";
import { CONCERNS, products, SHOP } from "@/labo/clinic/products";
import { BookCta } from "@/components/labo/Clinic";
import ShopGrid from "@/components/labo/shop/ShopGrid";

export const metadata = {
  title: "Shop medical-grade skincare",
  description: "skinbetter science, Alastin and SkinMedica skincare curated by The Labo Clinic — serums, retinoids, mineral sunscreen and cleansers, shipped in the US or picked up in Eastlake, Seattle.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      <section className="shophero">
        <div className="wrap">
          <span className="kicker">The shop · medical-grade skincare</span>
          <h1>Skincare we&rsquo;d put on our own faces.</h1>
          <p className="sub">Our own line, made for us, plus the clinic brands we use in the treatment room. Curated by us, with a routine that fits yours — no 12-step anything unless you want it, no judgement here.</p>
          <div className="chips tiles" aria-label="Shop by concern">
            <Link href="/shop?line=The%20Labo%20Clinic" className="cchip own">Our own line</Link>
            {CONCERNS.map((c) => <Link key={c} href={`/shop?c=${c}`} className="cchip">{c}</Link>)}
          </div>
          {!SHOP.pricesConfirmed && <p className="note">Pricing is being finalized — text us for today&rsquo;s price on any item, or buy skinbetter directly from <a href={SHOP.skinbetterStore} target="_blank" rel="noopener noreferrer">the clinic&rsquo;s authorized store ↗</a>.</p>}
        </div>
      </section>
      <section className="shopgrid">
        <div className="wrap"><ShopGrid products={products} /></div>
      </section>
      <section className="grey" style={{ paddingBlock: 70 }}>
        <div className="wrap values">
          <div><b>Chosen, not stocked</b><p>Every product here is one we&rsquo;ve tested ourselves and use in-clinic or send home after a treatment.</p></div>
          <div><b>Free shipping over ${SHOP.freeShippingOver}</b><p>US shipping in 3–7 business days, or free pick-up at the clinic in Eastlake.</p></div>
          <div><b>Ask before you buy</b><p>Not sure what your skin needs? Text us a photo and a line about your goals — we&rsquo;ll point you to two products, not ten.</p></div>
        </div>
      </section>
      <BookCta />
    </>
  );
}
