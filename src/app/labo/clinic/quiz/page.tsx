import { getStaff, missing } from "@/lib/labo/clinic";
import { createAdminClient } from "@/lib/supabase/admin";
import { fmtDate, fmtTime } from "@/lib/labo/provider";
import { getProduct } from "@/labo/clinic/products";

type Row = { id: string; skin: string; concern: string; routine: string; picks: string[]; created_at: string };
const SKIN: Record<string, string> = { balanced: "Balanced, wants more", oily: "Oily / breakout-prone", dry: "Dry / flaky", sensitive: "Sensitive / reactive", combo: "Combination" };
const CONCERN: Record<string, string> = { Acne: "Breakouts & congestion", Aging: "Lines, firmness & glow", Dryness: "Barrier & hydration", Sensitive: "Redness & reactivity", Pigment: "Dark spots & tone" };
const ROUTINE: Record<string, string> = { two: "Two products", short: "Short routine", all: "Everything" };

function tally(rows: Row[], key: keyof Row, labels: Record<string, string>) {
  const m = new Map<string, number>(); for (const r of rows) { const k = String(r[key]); m.set(k, (m.get(k) ?? 0) + 1); }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ k, label: labels[k] ?? k, n, pct: rows.length ? Math.round((n / rows.length) * 100) : 0 }));
}

/** Skin quiz answers (Nov 21 2026): what the home-page quiz is being asked, and what it pointed people to. Anonymous rows. */
export default async function ClinicQuiz({ searchParams }: { searchParams: Promise<{ all?: string }> }) {
  if (!(await getStaff())) return null; const sp = await searchParams;
  const { data, error } = await createAdminClient().from("labo_quiz").select("*").order("created_at", { ascending: false }).limit(sp.all ? 1000 : 200);
  const rows = (data ?? []) as Row[];
  const since30 = rows.filter((r) => Date.now() - new Date(r.created_at).getTime() < 30 * 864e5);
  const base = since30.length ? since30 : rows;
  const products = new Map<string, number>(); for (const r of base) for (const s of r.picks ?? []) products.set(s, (products.get(s) ?? 0) + 1);
  const topProducts = [...products.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const Bars = ({ title, items }: { title: string; items: { label: string; n: number; pct: number }[] }) => (
    <div className="card" style={{ flex: 1, minWidth: 240 }}><div className="lbl">{title}</div>
      {items.length === 0 ? <div className="empty">No answers yet.</div> : items.map((i) => (
        <div key={i.label} style={{ marginTop: 10 }}><div className="row" style={{ justifyContent: "space-between" }}><span className="sm">{i.label}</span><span className="sm muted">{i.n} · {i.pct}%</span></div>
          <div style={{ height: 6, background: "var(--wash, #eee)", borderRadius: 3, marginTop: 4 }}><div style={{ width: `${i.pct}%`, height: "100%", background: "var(--accent)", borderRadius: 3 }} /></div></div>
      ))}
    </div>
  );
  return (
    <>
      <div className="top"><div><h1>Skin quiz</h1><p>{since30.length ? `Last 30 days · ${since30.length} completed` : `${rows.length} completed`} · {rows.length} loaded · <a href={sp.all ? "/clinic/quiz" : "/clinic/quiz?all=1"}>{sp.all ? "show recent" : "show all"}</a></p></div></div>
      {missing(error) && <div className="setup">Run supabase-labo-quiz.sql in the Supabase SQL editor first.</div>}
      <div className="card"><div className="sm muted">What this is: every completed skin quiz on the home page lands here, anonymously (no name, email or IP — three answers and the products the quiz pointed to). Use it as demand data: which skin types and concerns people arrive with, and which products the quiz is sending them to.</div></div>
      <div className="row" style={{ gap: 14, flexWrap: "wrap", alignItems: "stretch" }}>
        <Bars title="How their skin feels" items={tally(base, "skin", SKIN)} />
        <Bars title="What they want to change" items={tally(base, "concern", CONCERN)} />
        <Bars title="How much routine" items={tally(base, "routine", ROUTINE)} />
      </div>
      <div className="card"><div className="lbl">Most-recommended products</div>
        {topProducts.length === 0 ? <div className="empty">No answers yet.</div> : topProducts.map(([slug, n]) => { const p = getProduct(slug); return <div key={slug} className="row sm" style={{ justifyContent: "space-between", marginTop: 8 }}><span>{p?.name ?? slug} <span className="muted">· {p?.line}</span></span><span className="muted">{n}×</span></div>; })}
      </div>
      <div className="card"><div className="lbl">Recent answers</div>
        {rows.length === 0 && !error && <div className="empty">No answers yet.</div>}
        {rows.map((r) => (
          <div key={r.id} className="row sm" style={{ justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--hair, #eee)" }}>
            <span className="muted" style={{ minWidth: 150 }}>{fmtDate(r.created_at, { month: "short", day: "numeric" })} · {fmtTime(r.created_at)}</span>
            <span style={{ flex: 1, minWidth: 260 }}>{SKIN[r.skin] ?? r.skin} → <b>{CONCERN[r.concern] ?? r.concern}</b> · {ROUTINE[r.routine] ?? r.routine}</span>
            <span className="muted" style={{ flex: 1, minWidth: 220 }}>{(r.picks ?? []).map((s) => getProduct(s)?.name ?? s).join(", ") || "—"}</span>
          </div>
        ))}
      </div>
    </>
  );
}
