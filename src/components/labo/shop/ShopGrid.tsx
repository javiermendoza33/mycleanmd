"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CONCERNS, LINES, TYPES, type Concern, type Product, type ProductType } from "@/labo/clinic/products";
import { ProductCard } from "./ProductCard";

/** /shop — filter chips by type and concern (facile's Type / Concern menus, flattened to one row), then the boxed grid.
 *  `?c=Aging` or `?t=Serum` preselects a chip so the home page's concern tiles land filtered. */
export default function ShopGrid({ products }: { products: Product[] }) {
  const [type, setType] = useState<ProductType | "">("");
  const [concern, setConcern] = useState<Concern | "">("");
  const [line, setLine] = useState<string>("");
  const [best, setBest] = useState(false);
  const q = useSearchParams(); const qs = q.toString();
  useEffect(() => {
    // Nov 22 2026: read the URL on every change (the header's Shop menu links here with ?t= / ?c= / ?line= / ?best=1).
    const c = q.get("c"), t = q.get("t"), l = q.get("line");
    setLine(l && (LINES as readonly string[]).includes(l) ? l : "");
    setConcern(c && (CONCERNS as string[]).includes(c) ? (c as Concern) : "");
    setType(t && (TYPES as string[]).includes(t) ? (t as ProductType) : "");
    setBest(q.get("best") === "1");
  }, [qs]);  // eslint-disable-line react-hooks/exhaustive-deps
  const list = products.filter((p) => (!type || p.type === type) && (!concern || p.concerns.includes(concern)) && (!line || p.line === line) && (!best || p.bestSeller));
  return (
    <>
      <div className="chips" role="group" aria-label="Filter by line">
        <span className="kicker">Line</span>
        <button type="button" className={!line ? "on" : ""} onClick={() => setLine("")}>All</button>
        {LINES.map((l) => <button key={l} type="button" className={line === l ? "on" : ""} onClick={() => setLine(line === l ? "" : l)}>{l}</button>)}
      </div>
      {best && <p className="count mono">Best sellers · <button type="button" className="linkbtn" onClick={() => setBest(false)}>show all</button></p>}
      <div className="chips" role="group" aria-label="Filter by type">
        <span className="kicker">Type</span>
        <button type="button" className={!type ? "on" : ""} onClick={() => setType("")}>All</button>
        {TYPES.filter((t) => products.some((p) => p.type === t)).map((t) => <button key={t} type="button" className={type === t ? "on" : ""} onClick={() => setType(type === t ? "" : t)}>{t}</button>)}
      </div>
      <div className="chips" role="group" aria-label="Filter by concern">
        <span className="kicker">Concern</span>
        <button type="button" className={!concern ? "on" : ""} onClick={() => setConcern("")}>All</button>
        {CONCERNS.filter((c) => products.some((p) => p.concerns.includes(c))).map((c) => <button key={c} type="button" className={concern === c ? "on" : ""} onClick={() => setConcern(concern === c ? "" : c)}>{c}</button>)}
      </div>
      <p className="count mono">{list.length} product{list.length === 1 ? "" : "s"}</p>
      <div className="pgrid">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      {!list.length && <p className="sub" style={{ marginTop: 24 }}>Nothing matches both filters yet — try one at a time.</p>}
    </>
  );
}
