import { getStaff, missing } from "@/lib/labo/clinic";
import { createAdminClient } from "@/lib/supabase/admin";
import { fmtDate, fmtTime } from "@/lib/labo/provider";
import { getProduct } from "@/labo/clinic/products";
import { DOWNTIME_LABEL, EXPERIENCE_LABEL, GOAL_LABEL, SAFETY_LABEL, SUB_LABEL, TX } from "@/labo/clinic/treatment-quiz";

type Answers = { goal?: string; sub?: string; downtime?: string; safety?: string[]; experience?: string };
type Row = { id: string; kind: "skincare" | "treatment"; skin: string | null; concern: string | null; routine: string | null; answers: Answers | null; picks: string[]; created_at: string };
const SKIN: Record<string, string> = { balanced: "Balanced, wants more", oily: "Oily / breakout-prone", dry: "Dry / flaky", sensitive: "Sensitive / reactive", combo: "Combination" };
const CONCERN: Record<string, string> = { Acne: "Breakouts & congestion", Aging: "Lines, firmness & glow", Dryness: "Barrier & hydration", Sensitive: "Redness & reactivity", Pigment: "Dark spots & tone" };
const ROUTINE: Record<string, string> = { two: "Two products", short: "Short routine", all: "Everything" };
const txName = (k: string) => (k in TX ? TX[k as keyof typeof TX].name : k);

function tally(values: string[], labels: Record<string, string>) {
  const m = new Map<string, number>(); for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
  const total = values.length;
  return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ label: labels[k] ?? k, n, pct: total ? Math.round((n / total) * 100) : 0 }));
}
function Bars({ title, items }: { title: string; items: { label: string; n: number; pct: number }[] }) {
  return (
    <div className="card" style={{ flex: 1, minWidth: 240 }}><div className="lbl">{title}</div>
      {items.length === 0 ? <div className="empty">No answers yet.</div> : items.map((i) => (
        <div key={i.label} style={{ marginTop: 10 }}><div className="row" style={{ justifyContent: "space-between" }}><span className="sm">{i.label}</span><span className="sm muted">{i.n} · {i.pct}%</span></div>
          <div style={{ height: 6, background: "var(--wash, #eee)", borderRadius: 3, marginTop: 4 }}><div style={{ width: `${i.pct}%`, height: "100%", background: "var(--accent)", borderRadius: 3 }} /></div></div>
      ))}
    </div>
  );
}
function TopPicks({ title, rows, name }: { title: string; rows: Row[]; name: (k: string) => string }) {
  const m = new Map<string, number>(); for (const r of rows) for (const s of r.picks ?? []) m.set(s, (m.get(s) ?? 0) + 1);
  const top = [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  return (
    <div className="card"><div className="lbl">{title}</div>
      {top.length === 0 ? <div className="empty">No answers yet.</div> : top.map(([k, n]) => <div key={k} className="row sm" style={{ justifyContent: "space-between", marginTop: 8 }}><span>{name(k)}</span><span className="muted">{n}×</span></div>)}
    </div>
  );
}

/** Quiz answers (Nov 21 2026): the home page's two finders — in-clinic treatment and skincare routine — anonymous rows. */
export default async function ClinicQuiz({ searchParams }: { searchParams: Promise<{ all?: string }> }) {
  if (!(await getStaff())) return null; const sp = await searchParams;
  const { data, error } = await createAdminClient().from("labo_quiz").select("*").order("created_at", { ascending: false }).limit(sp.all ? 1000 : 300);
  const rows = (data ?? []) as Row[];
  const recent = rows.filter((r) => Date.now() - new Date(r.created_at).getTime() < 30 * 864e5);
  const base = recent.length ? recent : rows;
  const tx = base.filter((r) => r.kind === "treatment"), sk = base.filter((r) => r.kind !== "treatment");
  const describe = (r: Row) => r.kind === "treatment"
    ? `${GOAL_LABEL[(r.answers?.goal ?? "") as keyof typeof GOAL_LABEL] ?? r.answers?.goal} → ${SUB_LABEL[(r.answers?.sub ?? "") as keyof typeof SUB_LABEL] ?? r.answers?.sub} · ${(DOWNTIME_LABEL[(r.answers?.downtime ?? "") as keyof typeof DOWNTIME_LABEL] ?? "").split(" — ")[0]} downtime${r.answers?.safety?.length ? " · " + r.answers.safety.map((s) => SAFETY_LABEL[s as keyof typeof SAFETY_LABEL] ?? s).join(", ") : ""}`
    : `${SKIN[r.skin ?? ""] ?? r.skin} → ${CONCERN[r.concern ?? ""] ?? r.concern} · ${ROUTINE[r.routine ?? ""] ?? r.routine}`;
  return (
    <>
      <div className="top"><div><h1>Skin quiz</h1><p>{recent.length ? `Last 30 days · ${tx.length} treatment · ${sk.length} skincare` : `${rows.length} completed`} · {rows.length} loaded · <a href={sp.all ? "/clinic/quiz" : "/clinic/quiz?all=1"}>{sp.all ? "show recent" : "show all"}</a></p></div></div>
      {missing(error) && <div className="setup">Run supabase-labo-quiz.sql in the Supabase SQL editor first.</div>}
      <div className="card"><div className="sm muted">What this is: every completed quiz on the home page (and the treatment finder on /treatments) lands here, anonymously — no name, email or IP. <b>Treatment</b> rows are what people want fixed, how much downtime they'll accept, any safety flags, and the treatment the quiz pointed them to. <b>Skincare</b> rows are skin type, concern, routine size and the products recommended. Use it as demand data.</div></div>

      <div className="card" style={{ background: "transparent", border: 0, padding: "6px 0 0" }}><div className="lbl">In-clinic treatment finder</div></div>
      <div className="row" style={{ gap: 14, flexWrap: "wrap", alignItems: "stretch" }}>
        <Bars title="Primary goal" items={tally(tx.map((r) => r.answers?.goal ?? ""), GOAL_LABEL)} />
        <Bars title="Sub-concern" items={tally(tx.map((r) => r.answers?.sub ?? ""), SUB_LABEL)} />
        <Bars title="Downtime they'll accept" items={tally(tx.map((r) => r.answers?.downtime ?? ""), Object.fromEntries(Object.entries(DOWNTIME_LABEL).map(([k, v]) => [k, v.split(" — ")[0]])))} />
      </div>
      <div className="row" style={{ gap: 14, flexWrap: "wrap", alignItems: "stretch" }}>
        <Bars title="Safety flags (of treatment quizzes)" items={tally(tx.flatMap((r) => r.answers?.safety ?? []), SAFETY_LABEL).map((i) => ({ ...i, pct: tx.length ? Math.round((i.n / tx.length) * 100) : 0 }))} />
        <Bars title="Experience" items={tally(tx.map((r) => r.answers?.experience ?? ""), EXPERIENCE_LABEL)} />
      </div>
      <TopPicks title="Most-recommended treatments" rows={tx} name={txName} />

      <div className="card" style={{ background: "transparent", border: 0, padding: "6px 0 0" }}><div className="lbl">Skincare routine finder</div></div>
      <div className="row" style={{ gap: 14, flexWrap: "wrap", alignItems: "stretch" }}>
        <Bars title="How their skin feels" items={tally(sk.map((r) => r.skin ?? ""), SKIN)} />
        <Bars title="What they want to change" items={tally(sk.map((r) => r.concern ?? ""), CONCERN)} />
        <Bars title="How much routine" items={tally(sk.map((r) => r.routine ?? ""), ROUTINE)} />
      </div>
      <TopPicks title="Most-recommended products" rows={sk} name={(s) => { const p = getProduct(s); return p ? `${p.name} · ${p.line}` : s; }} />

      <div className="card"><div className="lbl">Recent answers</div>
        {rows.length === 0 && !error && <div className="empty">No answers yet.</div>}
        {rows.map((r) => (
          <div key={r.id} className="row sm" style={{ justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--hair, #eee)" }}>
            <span className="muted" style={{ minWidth: 150 }}>{fmtDate(r.created_at, { month: "short", day: "numeric" })} · {fmtTime(r.created_at)}</span>
            <span className={`pill ${r.kind === "treatment" ? "em" : ""}`} style={{ alignSelf: "flex-start" }}>{r.kind === "treatment" ? "Treatment" : "Skincare"}</span>
            <span style={{ flex: 1, minWidth: 260 }}>{describe(r)}</span>
            <span className="muted" style={{ flex: 1, minWidth: 220 }}>{(r.picks ?? []).map((s) => (r.kind === "treatment" ? txName(s) : getProduct(s)?.name ?? s)).join(", ") || "—"}</span>
          </div>
        ))}
      </div>
    </>
  );
}
