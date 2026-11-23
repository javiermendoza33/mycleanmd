"use client";
/* Portal care timeline (Nov 23 2026): the three rows of the hero card, for real. Polls the care API while the case moves. */
import { useEffect, useState } from "react";
import type { Case, Message, Order, Prescription, StatusHistoryEntry } from "@/lib/cuvo/types";

type Data = { care: { status: string; paid_at: string | null; cuvo_mode: string }; program?: string; case: Case | null; history: StatusHistoryEntry[]; prescriptions: Prescription[]; orders: Order[]; messages: Message[]; note?: string };
const CASE: Record<string, [string, string]> = { received: ["Received", "Your intake is in."], queued: ["In the queue", "A clinician licensed in your state picks it up next."], in_review: ["Clinician reviewing", "Reading your intake and any labs."], visit_required: ["Visit needed", "Your clinician wants to see you on video first."], waiting_on_patient: ["Waiting on you", "Your clinician asked a question. Reply below."], waiting_on_integration: ["Waiting on us", "Something on our side needs a fix."], approved: ["Approved", "Your plan is written."], declined: ["Not approved", "Your clinician explains why below."], cancelled: ["Cancelled", ""], withdrawn: ["Withdrawn", ""] };
const ORDER: Record<string, string> = { created: "Sent to the pharmacy", at_pharmacy: "Being prepared", shipped: "Shipped, cold-chain", delivered: "Delivered", blocked: "On hold at the pharmacy", failed: "Pharmacy couldn't fill it", ready_for_pickup: "Ready for pickup", picked_up: "Picked up" };
const when = (s: string) => new Date(s).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export function CareTimeline({ id, programName, justPaid }: { id: string; programName: string; justPaid: boolean }) {
  const [d, setD] = useState<Data | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => {
    let dead = false, t: ReturnType<typeof setTimeout>;
    const pull = async () => { try { const r = await fetch(`/api/labo/method/care/${id}`, { cache: "no-store" }); const j = await r.json(); if (!dead) setD(j); } catch {} if (!dead) { const live = !d?.case || !["approved", "declined", "cancelled", "withdrawn"].includes(d.case.status) || (d.orders[0] && !["delivered", "picked_up", "failed"].includes(d.orders[0].status)); t = setTimeout(pull, live ? 4000 : 20000); } };
    pull(); return () => { dead = true; clearTimeout(t); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const send = async () => { if (!text.trim()) return; setSending(true); try { await fetch(`/api/labo/method/care/${id}/messages`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ body: text }) }); setText(""); } finally { setSending(false); } };

  if (!d) return <p className="muted">Loading your care…</p>;
  const st = d.case?.status || (d.care.paid_at ? "received" : "awaiting_payment");
  const rows: { k: string; title: string; sub: string; on: boolean; done: boolean }[] = [
    { k: "paid", title: "Payment", sub: d.care.paid_at ? `Received ${when(d.care.paid_at)}` : "Waiting for payment", on: !d.care.paid_at, done: !!d.care.paid_at },
    { k: "review", title: "Clinician review", sub: d.case ? (CASE[st]?.[1] || "") : "Starts when payment clears", on: ["received", "queued", "in_review", "visit_required", "waiting_on_patient"].includes(st), done: ["approved", "declined"].includes(st) },
    { k: "plan", title: "Your plan", sub: d.prescriptions[0] ? `${d.prescriptions[0].medication} · ${d.prescriptions[0].sig || ""}` : "Written once your case is approved", on: st === "approved" && !d.prescriptions.length, done: !!d.prescriptions.length },
    { k: "ship", title: "Pharmacy", sub: d.orders[0] ? `${ORDER[d.orders[0].status] || d.orders[0].status}${d.orders[0].tracking_number ? ` · ${d.orders[0].carrier} ${d.orders[0].tracking_number}` : ""}` : "Ships after your plan is written", on: !!d.orders[0] && !["delivered", "picked_up"].includes(d.orders[0].status), done: !!d.orders[0] && ["delivered", "picked_up"].includes(d.orders[0].status) },
  ];
  return (
    <div className="care">
      <p className="eyebrow">{programName}{d.care.cuvo_mode !== "live" ? ` · ${d.care.cuvo_mode}` : ""}</p>
      <h1>{CASE[st]?.[0] || (justPaid ? "Payment received" : "Your care")}</h1>
      {d.note && !d.case ? <p className="snote">This sandbox case is no longer on the simulator (it restarts on every deploy). Start a new one from Get started.</p> : null}
      <ol className="care-steps">{rows.map(r => <li key={r.k} className={r.done ? "done" : r.on ? "on" : ""}><i /><div><b>{r.title}</b><span>{r.sub}</span></div></li>)}</ol>
      {d.orders[0]?.tracking_url ? <p><a className="btn btn-soft" href={d.orders[0].tracking_url} target="_blank" rel="noopener">Track the package</a></p> : null}
      {d.case?.decline_reason ? <p className="snote bad">{d.case.decline_reason}</p> : null}
      <section className="care-msgs"><h2>Messages with your clinician</h2>
        {d.messages.length === 0 ? <p className="muted">Nothing yet. Your clinician writes here when your plan is ready, and you can ask anything.</p> : <ul>{d.messages.map(m => <li key={m.id} className={m.author === "patient" ? "me" : ""}><span>{m.author === "patient" ? "You" : "Clinician"} · {when(m.created_at)}</span><p>{m.body}</p></li>)}</ul>}
        {d.case ? <div className="care-compose"><textarea rows={3} value={text} onChange={e => setText(e.target.value)} placeholder="Ask your clinician anything…" /><button type="button" className="btn btn-primary" disabled={sending || !text.trim()} onClick={send}>Send</button></div> : null}
      </section>
      <details className="care-hist"><summary>Status history</summary><ul>{d.history.map((h, i) => <li key={i}><b>{CASE[h.status]?.[0] || h.status}</b> <span>{when(h.at)}</span>{h.note ? <em> · {h.note}</em> : null}</li>)}</ul></details>
    </div>
  );
}
