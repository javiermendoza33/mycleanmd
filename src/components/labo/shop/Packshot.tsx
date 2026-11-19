import type { CSSProperties } from "react";
import type { Product } from "@/labo/clinic/products";

/** A drawn packshot in the product's tone — the shop has no product photography yet (Nov 19 2026). A real photo in
 *  `product.image` replaces it per product; the box, shadow and label proportions match the facile-style grid either way. */
export function Packshot({ p, className = "" }: { p: Product; className?: string }) {
  if (p.image) return <div className={`pshot photo ${className}`}><img src={p.image.src} alt={p.image.alt} loading="lazy" /></div>;
  return (
    <div className={`pshot pshot-${p.form} ${className}`} style={{ "--tone": p.tone } as CSSProperties} role="img" aria-label={`${p.name} by ${p.line}`}>
      <div className="pbottle"><span className="pcap" /><span className="plbl"><b>{p.lineShort}</b><i>{p.label}</i></span></div>
    </div>
  );
}
