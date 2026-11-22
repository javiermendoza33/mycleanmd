import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, money, products, SHOP } from "@/labo/clinic/products";
import { PRACTICE } from "@/labo/content";
import { Packshot } from "@/components/labo/shop/Packshot";
import AddToBag from "@/components/labo/shop/AddToBag";
import { ProductCard } from "@/components/labo/shop/ProductCard";
import { BookCta } from "@/components/labo/Clinic";

export function generateStaticParams() { return products.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return { title: `${p.name} · ${p.line}`, description: `${p.tagline} ${p.blurb}`.slice(0, 160), alternates: { canonical: `/shop/${p.slug}` } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const also = products.filter((x) => x.slug !== p.slug && (x.type === p.type || x.concerns.some((c) => p.concerns.includes(c)))).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, brand: { "@type": "Brand", name: p.line }, description: p.blurb,
    offers: { "@type": "Offer", priceCurrency: "USD", price: p.price, availability: "https://schema.org/InStock", seller: { "@type": "Organization", name: PRACTICE.name } },
  };
  return (
    <>
      <section className="pdp">
        <div className="wrap">
          <p className="crumb"><Link href="/shop">Shop</Link> / <Link href={`/shop?t=${p.type}`}>{p.type}s</Link> / <b>{p.name}</b></p>
          <div className="pdpgrid">
            <div className="pdpimg"><Packshot p={p} /></div>
            <div className="pdpinfo">
              <span className="pline">{p.line}</span>
              <h1>{p.name}</h1>
              <p className="sub">{p.tagline}</p>
              <div className="pmeta"><span className="price">{money(p.price)}</span><span className="mono">{p.size}</span>{p.bestSeller && <span className="ptag inline">Best seller</span>}</div>
              <AddToBag slug={p.slug} big soon={p.soon} partner={p.partner} buyUrl={p.buyUrl} />
              {p.partner === "alastin" && <p className="note" style={{ marginTop: 10 }}>Sold through our ALASTIN Skincare® partner store — it ships from ALASTIN, not from the clinic.</p>}
              {!p.partner && <p className="note">{SHOP.shipsTo}. Free US shipping over {money(SHOP.freeShippingOver)}.</p>}
              <div className="prose" style={{ marginTop: 28 }}><p>{p.blurb}</p></div>
              <h4 style={{ marginTop: 30 }}>How to use</h4>
              <ul className="howto">{p.how.map((h) => <li key={h}>{h}</li>)}</ul>
              <h4 style={{ marginTop: 26 }}>Key actives</h4>
              <div className="chips static">{p.actives.map((a) => <span key={a}>{a}</span>)}</div>
              <div className="chips static" style={{ marginTop: 10 }}>{p.concerns.map((c) => <Link key={c} href={`/shop?c=${c}`} className="cchip sm">{c}</Link>)}</div>
            </div>
          </div>
        </div>
      </section>
      {also.length > 0 && (
        <section className="grey" style={{ paddingTop: 70 }}>
          <div className="wrap">
            <div className="rowhead"><h2>Goes well with</h2><Link className="more" href="/shop">Shop all</Link></div>
            <div className="pgrid three">{also.map((x) => <ProductCard key={x.slug} p={x} />)}</div>
          </div>
        </section>
      )}
      <BookCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
