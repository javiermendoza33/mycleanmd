import Link from "next/link";
import { money, type Product } from "@/labo/clinic/products";
import { Packshot } from "./Packshot";
import AddToBag from "./AddToBag";

export function ProductCard({ p }: { p: Product }) {
  return (
    <article className="pcard">
      {p.bestSeller && <span className="ptag">Best seller</span>}
      <Link href={`/shop/${p.slug}`} className="pimg" aria-label={p.name}><Packshot p={p} /></Link>
      <div className="pb">
        <span className="pline">{p.line}</span>
        <Link href={`/shop/${p.slug}`} className="pname">{p.name}</Link>
        <p>{p.tagline}</p>
        <span className="price">{money(p.price)} <small>· {p.size}</small></span>
      </div>
      <AddToBag slug={p.slug} soon={p.soon} partner={p.partner} buyUrl={p.buyUrl} />
    </article>
  );
}
