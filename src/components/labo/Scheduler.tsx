"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BOOKING, CATEGORIES, INTAKE, priceLabel, type Category, type MenuItem } from "@/labo/clinic/booking";
import { CLINIC_SITE } from "@/labo/clinic/site";
import { CONSENT_TEXT } from "@/labo/clinic/sms";

/** The clinic's own scheduler (sandbox, Nov 19 2026) — Vagaro's flow, our page: 1 service · 2 day & time · 3 details · done. */
type Step = 1 | 2 | 3 | 4;
const PT = BOOKING.tz;
const fmtDay = (d: string) => new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "short", month: "short", day: "numeric" }).format(new Date(d + "T12:00:00Z"));
const fmtTime = (iso: string) => new Intl.DateTimeFormat("en-US", { timeZone: PT, hour: "numeric", minute: "2-digit" }).format(new Date(iso));
const fmtLong = (iso: string) => new Intl.DateTimeFormat("en-US", { timeZone: PT, weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
const todayPT = () => new Intl.DateTimeFormat("en-CA", { timeZone: PT }).format(new Date());
const monthOf = (d: string) => d.slice(0, 7);
const addMonth = (m: string, n: number) => { const [y, mo] = m.split("-").map(Number); const d = new Date(Date.UTC(y, mo - 1 + n, 1)); return d.toISOString().slice(0, 7); };
const monthLabel = (m: string) => new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", year: "numeric" }).format(new Date(m + "-01T12:00:00Z"));
function monthGrid(m: string) { const [y, mo] = m.split("-").map(Number); const first = new Date(Date.UTC(y, mo - 1, 1)); const n = new Date(Date.UTC(y, mo, 0)).getUTCDate(); const cells: (string | null)[] = Array(first.getUTCDay()).fill(null); for (let d = 1; d <= n; d++) cells.push(`${m}-${String(d).padStart(2, "0")}`); return cells; }

export default function Scheduler({ preselect, menu }: { preselect?: string; menu: MenuItem[] }) {
  const MENU = menu;
  const getMenuItem = (slug: string) => MENU.find((m) => m.slug === slug);
  const [step, setStep] = useState<Step>(1);
  const [cat, setCat] = useState<Category>("Injectables");
  const [item, setItem] = useState<MenuItem | null>(null);
  const [month, setMonth] = useState(monthOf(todayPT()));
  const [days, setDays] = useState<string[] | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[] | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", phone: "", notes: "", smsConsent: false, policyConsent: false });
  const [intake, setIntake] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string; manageToken: string; starts_at: string } | null>(null);
  const last = useMemo(() => { const d = new Date(); d.setUTCDate(d.getUTCDate() + BOOKING.horizonDays); return d.toISOString().slice(0, 7); }, []);

  useEffect(() => { if (preselect) { const m = getMenuItem(preselect); if (m) { setItem(m); setCat(m.category); setStep(2); } } }, [preselect]);
  useEffect(() => { if (!item || step !== 2) return; setDays(null); fetch(`/api/labo/book?service=${item.slug}&month=${month}`).then((r) => r.json()).then((j) => setDays(j.days ?? [])).catch(() => setDays([])); }, [item, month, step]);
  useEffect(() => { if (!item || !day) return; setSlots(null); setSlot(null); fetch(`/api/labo/book?service=${item.slug}&date=${day}`).then((r) => r.json()).then((j) => setSlots(j.slots ?? [])).catch(() => setSlots([])); }, [item, day]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); if (!item || !slot) return; setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/labo/book", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug: item.slug, startsAt: slot, ...f, intake }) });
      const j = await r.json();
      if (!r.ok || !j.ok) { setErr(j.error || "Something went wrong."); if (r.status === 409) { setStep(2); setSlot(null); setDay(day); } setBusy(false); return; }
      setDone(j.booking); setStep(4); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch { setErr("Something went wrong — try again."); }
    setBusy(false);
  }

  if (step === 4 && done && item) {
    return (
      <div className="booked">
        <span className="kicker">You&rsquo;re booked</span>
        <h2>See you {fmtLong(done.starts_at)}.</h2>
        <p className="sub">{item.name} · {item.min} min · {priceLabel(item)}. Your confirmation is on its way to {f.email}, with a reminder before your visit.</p>
        <ul className="checks grid">
          <li>Arrive 10 minutes early.</li>
          <li>Skip retinol, exfoliants and alcohol the night before injectables or laser.</li>
          <li>Need to change it? Use the link in your email, or text {CLINIC_SITE.phoneDisplay}.</li>
        </ul>
        <div className="acts">
          <Link className="btn btn-primary" href="/patient-care">Pre-visit instructions</Link>
          <Link className="btn btn-ghost" href="/shop">Shop skincare</Link>
          <Link className="more" href={`/booking/manage?id=${done.id}&t=${done.manageToken}`}>Manage this appointment</Link>
        </div>
      </div>
    );
  }

  const am = (slots ?? []).filter((s) => +new Intl.DateTimeFormat("en-US", { timeZone: PT, hour: "numeric", hourCycle: "h23" }).format(new Date(s)) < 12);
  const pm = (slots ?? []).filter((s) => !am.includes(s));

  return (
    <div className="sched">
      <ol className="steps" aria-label="Booking steps">
        {["Service", "Day & time", "Your details"].map((l, i) => <li key={l} className={step === i + 1 ? "on" : step > i + 1 ? "done" : ""} onClick={() => { if (step > i + 1) setStep((i + 1) as Step); }}><b>{i + 1}</b>{l}</li>)}
      </ol>

      {step === 1 && (
        <section className="sv">
          <div className="chips" role="tablist">{CATEGORIES.map((c) => <button key={c} type="button" role="tab" aria-selected={cat === c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>{c}</button>)}</div>
          <ul className="menu">
            {MENU.filter((m) => m.category === cat).map((m) => (
              <li key={m.slug}>
                <div className="mi"><b>{m.name}{m.popular && <span className="ptag inline">Popular</span>}</b><p>{m.desc}</p><span className="mono">{m.min} min · {priceLabel(m)}</span>{m.serviceSlug && <Link className="more" href={`/services/${m.serviceSlug}`}>Learn more</Link>}</div>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => { setItem(m); setStep(2); setDay(null); setSlot(null); }}>Select</button>
              </li>
            ))}
          </ul>
          {!BOOKING.pricesConfirmed && <p className="note">Per-unit and per-area pricing is confirmed at your visit. Consultations are complimentary.</p>}
        </section>
      )}

      {step === 2 && item && (
        <section className="dt">
          <div className="pick"><span className="kicker">Booking</span><b>{item.name}</b><span className="mono">{item.min} min · {priceLabel(item)}</span><button type="button" className="more linkbtn" onClick={() => setStep(1)}>Change</button></div>
          <div className="cal">
            <div className="calhead"><button type="button" disabled={month <= monthOf(todayPT())} onClick={() => setMonth(addMonth(month, -1))} aria-label="Previous month">‹</button><b>{monthLabel(month)}</b><button type="button" disabled={month >= last} onClick={() => setMonth(addMonth(month, 1))} aria-label="Next month">›</button></div>
            <div className="dow">{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
            <div className="grid">{monthGrid(month).map((d, i) => d ? <button key={d} type="button" disabled={!days || !days.includes(d)} className={day === d ? "on" : ""} onClick={() => setDay(d)}>{+d.slice(8)}</button> : <i key={"e" + i} />)}</div>
            {days === null && <p className="note">Checking openings…</p>}
            {days && !days.length && <p className="note">Nothing open this month — try the next one, or text {CLINIC_SITE.phoneDisplay}.</p>}
          </div>
          <div className="times">
            {!day && <p className="note">Pick a day to see times. Pacific time, {BOOKING.leadHours}-hour notice.</p>}
            {day && <><b className="dl">{fmtDay(day)}</b>
              {slots === null && <p className="note">Loading times…</p>}
              {slots && !slots.length && <p className="note">That day just filled up — pick another.</p>}
              {am.length > 0 && <><span className="kicker">Morning</span><div className="slotgrid">{am.map((s) => <button key={s} type="button" className={slot === s ? "on" : ""} onClick={() => setSlot(s)}>{fmtTime(s)}</button>)}</div></>}
              {pm.length > 0 && <><span className="kicker">Afternoon</span><div className="slotgrid">{pm.map((s) => <button key={s} type="button" className={slot === s ? "on" : ""} onClick={() => setSlot(s)}>{fmtTime(s)}</button>)}</div></>}
            </>}
            <button type="button" className="btn btn-primary" disabled={!slot} onClick={() => { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Continue{slot ? ` · ${fmtTime(slot)}` : ""}</button>
          </div>
        </section>
      )}

      {step === 3 && item && slot && (
        <form className="det" onSubmit={submit}>
          <div className="pick"><span className="kicker">Booking</span><b>{item.name}</b><span className="mono">{fmtLong(slot)} PT · {item.min} min</span><button type="button" className="more linkbtn" onClick={() => setStep(2)}>Change time</button></div>
          <div className="two"><label>First name<input required value={f.firstName} onChange={(e) => setF({ ...f, firstName: e.target.value })} autoComplete="given-name" /></label><label>Last name<input required value={f.lastName} onChange={(e) => setF({ ...f, lastName: e.target.value })} autoComplete="family-name" /></label></div>
          <div className="two"><label>Mobile<input required type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" placeholder="(206) 555-0100" /></label><label>Email<input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" /></label></div>
          <h4>A few questions for Mónika</h4>
          {INTAKE.map((q) => (
            <label key={q.key}>{q.label}
              {q.type === "choice" ? (
                <div className="chips static sel">{q.options.map((o) => <button key={o} type="button" className={intake[q.key] === o ? "on" : ""} onClick={() => setIntake({ ...intake, [q.key]: o })}>{o}</button>)}</div>
              ) : <input value={intake[q.key] ?? ""} onChange={(e) => setIntake({ ...intake, [q.key]: e.target.value })} placeholder={"placeholder" in q ? q.placeholder : ""} />}
            </label>
          ))}
          <label>Anything else?<textarea rows={3} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></label>
          <label className="consent"><input type="checkbox" required checked={f.policyConsent} onChange={(e) => setF({ ...f, policyConsent: e.target.checked })} /><span>I understand appointments must be rescheduled or canceled at least {BOOKING.cancelHours} hours in advance; later cancellations and no-shows carry a {BOOKING.cancelFee} fee.</span></label>
          <label className="consent"><input type="checkbox" checked={f.smsConsent} onChange={(e) => setF({ ...f, smsConsent: e.target.checked })} /><span>{CONSENT_TEXT}</span></label>
          {err && <p className="err">{err}</p>}
          <button type="submit" className="addbar big" disabled={busy}>{busy ? "Booking…" : "Book appointment"}</button>
          <p className="note">No card needed to book. {CLINIC_SITE.promo}.</p>
        </form>
      )}
    </div>
  );
}
