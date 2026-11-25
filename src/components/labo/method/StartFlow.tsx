"use client";
/* The Labo Method sign-up (Nov 23 2026): program → quick check → account → about you → consents → intake → pay → filed.
   Everything is held in the browser until the last step, then one POST /api/labo/method/enroll creates the sign-in, the CRM
   customer, the Cuvo patient + consents and files the case on hold; payment releases the hold. */
import { useEffect, useMemo, useRef, useState } from "react";
import type { QuestionSet, QuestionSetQuestion } from "@/lib/cuvo/types";
import { METHOD_CONSENT_TEXT } from "@/labo/method/sms";
const SMS_TEXT = METHOD_CONSENT_TEXT.replace(" See our Privacy Policy and SMS Terms.", "");

export type FlowProgram = { slug: string; name: string; blurb: string; price: string; questionSet: string };
type Props = { programs: FlowProgram[]; initial: string; states: { code: string; name: string }[]; availability: string; sets: Record<string, QuestionSet>; signedIn: { email: string } | null; mode: "mock" | "sandbox" | "live" };
const STEPS = ["Program", "Quick check", "Account", "About you", "Consent", "Intake", "Review"] as const;
const CONSENT_VERSION = "2026-11-23";
// the browser's date picker otherwise scrolls to year 275760 (Javier, Nov 23 2026): adults only, born 1920 or later
const DOB_MAX = (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return d.toISOString().slice(0, 10); })();
const phoneOk = (v: string) => { const d = v.replace(/\D/g, ""); return d.length === 10 || (d.length === 11 && d.startsWith("1")) || /^\+\d{8,15}$/.test(v.trim()); };
const dobOk = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && v >= "1920-01-01" && v <= DOB_MAX;


/** Height asked in inches (Cuvo's number question) answered in feet + inches (Javier, Nov 23 2026: "easier for adding feet and inches"). */
function HeightFtIn({ v, setV }: { v: number | undefined; setV: (x: number | string) => void }) {
  const ft = v ? Math.floor(v / 12) : "", inch = v ? v % 12 : "";
  const upd = (f: string, i: string) => setV(f === "" ? "" : Number(f) * 12 + (i === "" ? 0 : Number(i)));
  return <span className="sq-ftin"><select aria-label="Feet" value={ft} onChange={e => upd(e.target.value, String(inch))}><option value="">ft</option>{[4, 5, 6, 7].map(f => <option key={f} value={f}>{f} ft</option>)}</select><select aria-label="Inches" value={ft === "" ? "" : inch} onChange={e => upd(String(ft), e.target.value)} disabled={ft === ""}><option value="">in</option>{Array.from({ length: 12 }, (_, i) => <option key={i} value={i}>{i} in</option>)}</select>{v ? <em>{ft}′ {inch}″ · {v} in</em> : null}</span>;
}

type Val = string | number | boolean | string[] | undefined;
type Answers = Record<string, Val>;
/** Is this question asked, given the answers so far? (`ask_when`: another question's answer — id, or ids for a multi — is in `any_of`.) */
export function asked(q: QuestionSetQuestion, a: Answers): boolean {
  if (!q.ask_when) return true;
  const v = a[q.ask_when.question]; const picked = Array.isArray(v) ? v : v === undefined || v === "" ? [] : [String(v)];
  return picked.some(x => q.ask_when!.any_of.includes(x));
}
const labelOf = (q: QuestionSetQuestion, id: string) => (q.options || []).find(o => o.id === id)?.label ?? id;
/** Turn the browser's answers into what Cuvo validates: option LABELS exactly as written (multi joined with "; "), numbers as numbers,
 *  `send_as` questions split into their sub-answers, hidden conditionals left out. */
export function toCuvoAnswers(qs: QuestionSetQuestion[], a: Answers) {
  const out: { id: string; question: string; type: string; answer: string | number | boolean; important?: boolean; critical?: boolean }[] = [];
  for (const q of qs) {
    if (!asked(q, a)) continue;
    if (q.send_as?.length) { for (const sub of q.send_as) { const v = a[sub.id]; if (v !== undefined && v !== "") out.push({ id: sub.id, question: sub.question, type: sub.type, answer: Number(v) }); } continue; }
    const v = a[q.id]; if (v === undefined || v === "") continue;
    const answer = q.type === "choice" ? (Array.isArray(v) ? v.map(x => labelOf(q, x)).join("; ") : labelOf(q, String(v))) : q.type === "number" ? Number(v) : q.type === "boolean" ? v === true : String(v);
    out.push({ id: q.id, question: q.question, type: q.type, answer, important: q.important, critical: q.critical });
  }
  return out;
}
const answered = (q: QuestionSetQuestion, a: Answers) => q.send_as?.length ? q.send_as.every(sub => a[sub.id] !== undefined && a[sub.id] !== "") : Array.isArray(a[q.id]) ? (a[q.id] as string[]).length > 0 : a[q.id] !== undefined && a[q.id] !== "";

/** One intake question as Cuvo's question sets define it (single/multi choice with {id,label} options, text, number, height+weight via send_as). Module level so inputs keep focus. */
function Q({ q, a, set }: { q: QuestionSetQuestion; a: Answers; set: (id: string, x: Val) => void }) {
  const v = a[q.id];
  const title = q.send_as?.length ? "Height and weight" : q.question;
  const body = q.send_as?.length ? <span className="sq-sub">{q.send_as.map(sub => /height/i.test(sub.question) ? <span key={sub.id} className="sq-subq"><span className="sq-q">Height</span><HeightFtIn v={typeof a[sub.id] === "number" ? a[sub.id] as number : undefined} setV={x => set(sub.id, x)} /></span>
      : <span key={sub.id} className="sq-subq"><span className="sq-q">{sub.question}</span><input type="number" inputMode="decimal" value={a[sub.id] === undefined ? "" : String(a[sub.id])} onChange={e => set(sub.id, e.target.value === "" ? "" : Number(e.target.value))} /></span>)}</span>
    : q.input === "multi_choice" ? <span className="sq-multi">{(q.options || []).map(o => { const cur = Array.isArray(v) ? v : []; const on = cur.includes(o.id); return <label key={o.id} className={on ? "on" : ""}><input type="checkbox" checked={on} onChange={() => {
        let next = on ? cur.filter(x => x !== o.id) : [...cur, o.id];
        if (q.none_option) next = o.id === q.none_option && !on ? [o.id] : next.filter(x => x !== q.none_option || o.id === q.none_option);   // "none" can't combine with others
        set(q.id, next); }} />{o.label}</label>; })}</span>
    : q.type === "choice" ? <select value={String(v ?? "")} onChange={e => set(q.id, e.target.value)}><option value="">Choose…</option>{(q.options || []).map(o => <option key={o.id} value={o.id}>{o.label}</option>)}</select>
    : q.type === "boolean" ? <span className="sq-yn"><button type="button" className={v === true ? "on" : ""} onClick={() => set(q.id, true)}>Yes</button><button type="button" className={v === false ? "on" : ""} onClick={() => set(q.id, false)}>No</button></span>
    : q.type === "number" ? <input type="number" inputMode="decimal" value={v === undefined ? "" : String(v)} onChange={e => set(q.id, e.target.value === "" ? "" : Number(e.target.value))} />
    : <input type="text" value={String(v ?? "")} onChange={e => set(q.id, e.target.value)} />;
  return <label className="sq"><span className="sq-q">{title}{q.required ? <i aria-hidden> *</i> : null}</span>{q.help ? <span className="sq-help">{q.help}</span> : null}{body}</label>;
}

export function StartFlow({ programs, initial, states, availability, sets, signedIn, mode }: Props) {
  const [step, setStep] = useState(0);
  const top = useRef<HTMLDivElement>(null);
  const restored = useRef(false);
  // each step starts at the top of the card (Javier, Nov 24 2026: "sometimes doesn't flow up or down right after finishing one area")
  useEffect(() => { const el = top.current; if (!el) return; const y = el.getBoundingClientRect().top + window.scrollY - 96; if (Math.abs(window.scrollY - y) > 8) window.scrollTo({ top: Math.max(0, y), behavior: "smooth" }); }, [step]);
  const [program, setProgram] = useState(initial);
  const [check, setCheck] = useState({ state: "", age: "", sex: "" });
  const [account, setAccount] = useState({ email: signedIn?.email || "", password: "" });
  const [about, setAbout] = useState({ first_name: "", last_name: "", dob: "", phone: "", line1: "", city: "", postal_code: "" });
  const [consent, setConsent] = useState({ telehealth: false, privacy: false, sms: false });
  const [answers, setAnswers] = useState<Answers>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  // Nov 24 2026 (Javier: "when i had the wrong email… i had to start over and answers were gone"): the draft lives in sessionStorage
  // (this tab only, never the password) so a reload, a failed submit or a Back never costs the answers.
  useEffect(() => {
    try { const d = JSON.parse(sessionStorage.getItem("labo-start-draft") || "null"); if (d && d.v === 1) { if (d.program) setProgram(d.program); if (d.check) setCheck(d.check); if (d.account?.email && !signedIn) setAccount(a => ({ ...a, email: d.account.email })); if (d.about) setAbout(d.about); if (d.consent) setConsent(d.consent); if (d.answers) setAnswers(d.answers); if (typeof d.step === "number") setStep(d.step); } } catch { /* fresh start */ }
    restored.current = true;
  }, [signedIn]);
  useEffect(() => {
    if (!restored.current) return;
    try { sessionStorage.setItem("labo-start-draft", JSON.stringify({ v: 1, step, program, check, account: { email: account.email }, about, consent, answers })); } catch { /* private mode */ }
  }, [step, program, check, account.email, about, consent, answers]);
  const prog = programs.find(p => p.slug === program);
  const set = prog ? sets[prog.questionSet] : undefined;
  const qs: QuestionSetQuestion[] = set?.questions || [];
  const visible = qs.filter(q => asked(q, answers));
  const stateOk = states.some(s => s.code === check.state);
  const ageOk = Number(check.age) >= 18 && Number(check.age) < 100;

  const can = useMemo(() => [!!prog, stateOk && ageOk && !!check.sex, /\S+@\S+\.\S+/.test(account.email) && (!!signedIn || account.password.length >= 8), !!about.first_name && !!about.last_name && dobOk(about.dob) && phoneOk(about.phone) && !!about.line1 && !!about.city && !!about.postal_code, consent.telehealth && consent.privacy, visible.every(q => !q.required || answered(q, answers)), true][step], [step, prog, stateOk, ageOk, check, account, signedIn, about, consent, visible, answers]);

  const submit = async () => {
    setBusy("Creating your account and filing your intake…"); setErr(null);
    try {
      const r = await fetch("/api/labo/method/enroll", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ program, check, account, about, consent, consent_version: CONSENT_VERSION, question_set: set ? { id: set.id, version: set.version } : null, answers: toCuvoAnswers(qs, answers) }) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error || "Something went wrong.");
      try { sessionStorage.removeItem("labo-start-draft"); } catch { /* ignore */ }
      window.location.href = j.url;
    } catch (e) {
      const m = (e as Error).message; setErr(m); setBusy(null);
      // take the person to the step that fixes it, answers intact
      if (/already an account|sign in|password|email/i.test(m)) setStep(2); else if (/answer|intake|question/i.test(m)) setStep(5); else if (/date of birth|phone|address|name/i.test(m)) setStep(3);
    }
  };

  return (
    <div className="sflow" ref={top}>
      <ol className="sflow-steps" aria-label="Steps">{STEPS.map((s, i) => { const reachable = i < step || (i === step + 1 && can) || i === step; return <li key={s} className={i === step ? "on" : i < step ? "done" : ""}>{reachable ? <button type="button" onClick={() => { setErr(null); setStep(i); }} aria-current={i === step ? "step" : undefined} aria-label={`Step ${i + 1}: ${s}`}><span>{i + 1}</span>{s}</button> : <><span>{i + 1}</span>{s}</>}</li>; })}</ol>
      <div className="sflow-card">
        {step === 0 && <><h2>Choose your program</h2><p className="sub">Each one starts from your own labs. You can switch later.</p>
          <div className="sprog">{programs.map(p => <button key={p.slug} type="button" className={p.slug === program ? "on" : ""} onClick={() => setProgram(p.slug)}><b>{p.name}</b><span>{p.blurb}</span><em>{p.price}<small>/mo</small></em></button>)}</div></>}
        {step === 1 && <><h2>Quick check</h2><p className="sub">Telehealth rules mean you need to be in {availability} at the time of your visit. Nothing here is saved until you create an account.</p>
          <div className="sgrid">
            <label className="field"><span>State you live in</span><select value={check.state} onChange={e => setCheck({ ...check, state: e.target.value })}><option value="">Choose…</option>{states.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}<option value="XX">Somewhere else</option></select></label>
            <label className="field"><span>Age</span><input type="number" inputMode="numeric" value={check.age} onChange={e => setCheck({ ...check, age: e.target.value })} /></label>
            <label className="field"><span>Sex at birth</span><select value={check.sex} onChange={e => setCheck({ ...check, sex: e.target.value })}><option value="">Choose…</option><option value="female">Female</option><option value="male">Male</option></select></label>
          </div>
          {check.state === "XX" && <p className="snote bad">We can only treat residents of {availability} right now. Leave your email on the home page and we'll tell you when your state opens.</p>}
          {check.age && !ageOk && <p className="snote bad">You need to be 18 or older.</p>}</>}
        {step === 2 && <><h2>{signedIn ? "Signed in" : "Create your account"}</h2><p className="sub">{signedIn ? `Continuing as ${signedIn.email}.` : "This is how you'll reach your portal, your clinician and your plan."}</p>
          {!signedIn && <div className="sgrid"><label className="field"><span>Email</span><input type="email" autoComplete="email" value={account.email} onChange={e => setAccount({ ...account, email: e.target.value })} /></label><label className="field"><span>Password (8+ characters)</span><input type="password" autoComplete="new-password" value={account.password} onChange={e => setAccount({ ...account, password: e.target.value })} /></label></div>}
          {!signedIn && <p className="snote">Already have an account? <a href="/auth/login?redirect=/start">Sign in</a> and come back.</p>}</>}
        {step === 3 && <><h2>About you</h2><p className="sub">What the pharmacy and your clinician need. Your medical details come next.</p>
          <div className="sgrid">
            <label className="field"><span>First name</span><input value={about.first_name} onChange={e => setAbout({ ...about, first_name: e.target.value })} /></label>
            <label className="field"><span>Last name</span><input value={about.last_name} onChange={e => setAbout({ ...about, last_name: e.target.value })} /></label>
            <label className="field"><span>Date of birth</span><input type="date" min="1920-01-01" max={DOB_MAX} value={about.dob} onChange={e => setAbout({ ...about, dob: e.target.value })} /></label>
            <label className="field"><span>Mobile phone</span><input type="tel" inputMode="tel" autoComplete="tel" placeholder="(949) 555-0123" value={about.phone} onChange={e => setAbout({ ...about, phone: e.target.value })} />{about.phone && !phoneOk(about.phone) ? <small className="snote bad">Enter a 10-digit US mobile number.</small> : null}</label>
            <label className="field wide"><span>Shipping address</span><input autoComplete="address-line1" value={about.line1} onChange={e => setAbout({ ...about, line1: e.target.value })} /></label>
            {about.dob && !dobOk(about.dob) ? <p className="snote bad wide">Enter a real date of birth. You need to be 18 or older.</p> : null}
            <label className="field"><span>City</span><input autoComplete="address-level2" value={about.city} onChange={e => setAbout({ ...about, city: e.target.value })} /></label>
            <label className="field"><span>ZIP</span><input inputMode="numeric" autoComplete="postal-code" value={about.postal_code} onChange={e => setAbout({ ...about, postal_code: e.target.value })} /></label>
          </div></>}
        {step === 4 && <><h2>Consent</h2><p className="sub">Two agreements a licensed clinician needs before reviewing your case.</p>
          <label className="scheck"><input type="checkbox" checked={consent.telehealth} onChange={e => setConsent({ ...consent, telehealth: e.target.checked })} /><span><b>Telehealth consent.</b> I understand my care is delivered by video, messaging and e-prescribing, that a clinician licensed in my state makes every medical decision, and that I can stop at any time. <a href="/legal#telehealth" target="_blank" rel="noopener">Read it</a>.</span></label>
          <label className="scheck"><input type="checkbox" checked={consent.privacy} onChange={e => setConsent({ ...consent, privacy: e.target.checked })} /><span><b>Privacy practices.</b> I have read how my health information is used, stored and shared. <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a> · <a href="/legal" target="_blank" rel="noopener">notices</a>.</span></label>
          <label className="scheck"><input type="checkbox" checked={consent.sms} onChange={e => setConsent({ ...consent, sms: e.target.checked })} /><span>{SMS_TEXT} See our <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a> and <a href="/sms" target="_blank" rel="noopener">SMS Terms</a>.</span></label></>}
        {step === 5 && <><h2>Your intake</h2><p className="sub">{set ? `${set.title} · ${visible.length} questions. Your clinician reads every answer.` : "Intake questions aren't published for this program yet."}</p>
          <div className="sqs">{visible.map(q => <Q key={q.id} q={q} a={answers} set={(id, x) => setAnswers(a => ({ ...a, [id]: x }))} />)}</div></>}
        {step === 6 && <><h2>Review and pay</h2><p className="sub">Your case is filed the moment payment clears. A clinician reviews it, orders labs if you need them, and writes your plan.</p>
          <dl className="srev"><dt>Program</dt><dd>{prog?.name} · {prog?.price}/mo, cancel any month</dd><dt>You</dt><dd>{about.first_name} {about.last_name} · {check.state} · {account.email}</dd><dt>Ships to</dt><dd>{about.line1}, {about.city} {about.postal_code}</dd><dt>Intake</dt><dd>{visible.length} answers · {visible.filter(q => q.critical && answers[q.id] === true).length ? "flagged for clinician attention" : "no flags"}</dd></dl>
          {mode !== "live" && <p className="snote">Sandbox: no card is charged. Payment is simulated and your case goes straight to the (simulated) clinician.</p>}</>}
        {err && <p className="snote bad" role="alert">{err}{/already an account/i.test(err) ? <> <a href="/auth/login?redirect=/start">Sign in</a> and your answers will still be here.</> : null}</p>}
        <div className="sflow-acts">
          {step > 0 && <button type="button" className="btn btn-ghost" onClick={() => setStep(s => s - 1)} disabled={!!busy}>Back</button>}
          {step < STEPS.length - 1 ? <button type="button" className="btn btn-primary" disabled={!can} onClick={() => setStep(s => s + 1)}>Continue</button>
            : <button type="button" className="btn btn-primary" disabled={!!busy} onClick={submit}>{busy || (mode === "live" ? "Continue to secure checkout" : "Pay (sandbox) and file my case")}</button>}
        </div>
      </div>
    </div>
  );
}
