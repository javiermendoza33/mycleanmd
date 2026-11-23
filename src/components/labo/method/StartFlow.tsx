"use client";
/* The Labo Method sign-up (Nov 23 2026): program → quick check → account → about you → consents → intake → pay → filed.
   Everything is held in the browser until the last step, then one POST /api/labo/method/enroll creates the sign-in, the CRM
   customer, the Cuvo patient + consents and files the case on hold; payment releases the hold. */
import { useMemo, useState } from "react";
import type { QuestionSet, QuestionSetQuestion } from "@/lib/cuvo/types";

export type FlowProgram = { slug: string; name: string; blurb: string; price: string; questionSet: string };
type Props = { programs: FlowProgram[]; initial: string; states: { code: string; name: string }[]; availability: string; sets: Record<string, QuestionSet>; signedIn: { email: string } | null; mode: "mock" | "sandbox" | "live" };
const STEPS = ["Program", "Quick check", "Account", "About you", "Consent", "Intake", "Review"] as const;
const CONSENT_VERSION = "2026-11-23";


/** One intake question, typed the way Cuvo's question sets are (boolean / number / string / choice). Declared at module level so inputs keep focus between keystrokes. */
function Q({ q, v, setV }: { q: QuestionSetQuestion; v: string | number | boolean | undefined; setV: (x: string | number | boolean) => void }) {
  return <label className="sq"><span className="sq-q">{q.question}{q.required ? <i aria-hidden> *</i> : null}</span>{q.help ? <span className="sq-help">{q.help}</span> : null}
    {q.type === "boolean" ? <span className="sq-yn"><button type="button" className={v === true ? "on" : ""} onClick={() => setV(true)}>Yes</button><button type="button" className={v === false ? "on" : ""} onClick={() => setV(false)}>No</button></span>
      : q.type === "choice" ? <select value={String(v ?? "")} onChange={e => setV(e.target.value)}><option value="">Choose…</option>{(q.options || []).map(o => <option key={o} value={o}>{o}</option>)}</select>
      : q.type === "number" ? <input type="number" inputMode="decimal" value={v === undefined ? "" : String(v)} onChange={e => setV(e.target.value === "" ? "" : Number(e.target.value))} />
      : <input type="text" value={String(v ?? "")} onChange={e => setV(e.target.value)} />}
  </label>;
}

export function StartFlow({ programs, initial, states, availability, sets, signedIn, mode }: Props) {
  const [step, setStep] = useState(0);
  const [program, setProgram] = useState(initial);
  const [check, setCheck] = useState({ state: "", age: "", sex: "" });
  const [account, setAccount] = useState({ email: signedIn?.email || "", password: "" });
  const [about, setAbout] = useState({ first_name: "", last_name: "", dob: "", phone: "", line1: "", city: "", postal_code: "" });
  const [consent, setConsent] = useState({ telehealth: false, privacy: false, sms: false });
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const prog = programs.find(p => p.slug === program);
  const set = prog ? sets[prog.questionSet] : undefined;
  const qs: QuestionSetQuestion[] = set?.questions || [];
  const stateOk = states.some(s => s.code === check.state);
  const ageOk = Number(check.age) >= 18 && Number(check.age) < 100;

  const can = useMemo(() => [!!prog, stateOk && ageOk && !!check.sex, /\S+@\S+\.\S+/.test(account.email) && (!!signedIn || account.password.length >= 8), !!about.first_name && !!about.last_name && !!about.dob && !!about.phone && !!about.line1 && !!about.city && !!about.postal_code, consent.telehealth && consent.privacy, qs.every(q => !q.required || answers[q.id] !== undefined && answers[q.id] !== ""), true][step], [step, prog, stateOk, ageOk, check, account, signedIn, about, consent, qs, answers]);

  const submit = async () => {
    setBusy("Creating your account and filing your intake…"); setErr(null);
    try {
      const r = await fetch("/api/labo/method/enroll", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ program, check, account, about, consent, consent_version: CONSENT_VERSION, question_set: set ? { id: set.id, version: set.version } : null, answers: qs.map(q => ({ id: q.id, question: q.question, type: q.type, answer: answers[q.id] ?? (q.type === "boolean" ? false : ""), important: q.important, critical: q.critical, displayed_options: q.options })) }) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error || "Something went wrong.");
      window.location.href = j.url;
    } catch (e) { setErr((e as Error).message); setBusy(null); }
  };

  return (
    <div className="sflow">
      <ol className="sflow-steps" aria-label="Steps">{STEPS.map((s, i) => <li key={s} className={i === step ? "on" : i < step ? "done" : ""}><span>{i + 1}</span>{s}</li>)}</ol>
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
            <label className="field"><span>Date of birth</span><input type="date" value={about.dob} onChange={e => setAbout({ ...about, dob: e.target.value })} /></label>
            <label className="field"><span>Mobile phone</span><input type="tel" autoComplete="tel" value={about.phone} onChange={e => setAbout({ ...about, phone: e.target.value })} /></label>
            <label className="field wide"><span>Shipping address</span><input autoComplete="address-line1" value={about.line1} onChange={e => setAbout({ ...about, line1: e.target.value })} /></label>
            <label className="field"><span>City</span><input autoComplete="address-level2" value={about.city} onChange={e => setAbout({ ...about, city: e.target.value })} /></label>
            <label className="field"><span>ZIP</span><input inputMode="numeric" autoComplete="postal-code" value={about.postal_code} onChange={e => setAbout({ ...about, postal_code: e.target.value })} /></label>
          </div></>}
        {step === 4 && <><h2>Consent</h2><p className="sub">Two agreements a licensed clinician needs before reviewing your case.</p>
          <label className="scheck"><input type="checkbox" checked={consent.telehealth} onChange={e => setConsent({ ...consent, telehealth: e.target.checked })} /><span><b>Telehealth consent.</b> I understand my care is delivered by video, messaging and e-prescribing, that a clinician licensed in my state makes every medical decision, and that I can stop at any time. <a href="/legal/telehealth-consent" target="_blank" rel="noopener">Read it</a>.</span></label>
          <label className="scheck"><input type="checkbox" checked={consent.privacy} onChange={e => setConsent({ ...consent, privacy: e.target.checked })} /><span><b>Privacy practices.</b> I have read how my health information is used, stored and shared. <a href="/legal/privacy" target="_blank" rel="noopener">Read it</a>.</span></label>
          <label className="scheck"><input type="checkbox" checked={consent.sms} onChange={e => setConsent({ ...consent, sms: e.target.checked })} /><span>Text me about my visits, shipments and results. Message and data rates may apply. Reply STOP to end.</span></label></>}
        {step === 5 && <><h2>Your intake</h2><p className="sub">{set ? `${set.title} · ${qs.length} questions. Your clinician reads every answer.` : "Intake questions aren't published for this program yet."}</p>
          <div className="sqs">{qs.map(q => <Q key={q.id} q={q} v={answers[q.id]} setV={x => setAnswers(a => ({ ...a, [q.id]: x }))} />)}</div></>}
        {step === 6 && <><h2>Review and pay</h2><p className="sub">Your case is filed the moment payment clears. A clinician reviews it, orders labs if you need them, and writes your plan.</p>
          <dl className="srev"><dt>Program</dt><dd>{prog?.name} · {prog?.price}/mo, cancel any month</dd><dt>You</dt><dd>{about.first_name} {about.last_name} · {check.state} · {account.email}</dd><dt>Ships to</dt><dd>{about.line1}, {about.city} {about.postal_code}</dd><dt>Intake</dt><dd>{qs.length} answers · {qs.filter(q => q.critical && answers[q.id] === true).length ? "flagged for clinician attention" : "no flags"}</dd></dl>
          {mode !== "live" && <p className="snote">Sandbox: no card is charged. Payment is simulated and your case goes straight to the (simulated) clinician.</p>}
          {err && <p className="snote bad">{err}</p>}</>}
        <div className="sflow-acts">
          {step > 0 && <button type="button" className="btn btn-ghost" onClick={() => setStep(s => s - 1)} disabled={!!busy}>Back</button>}
          {step < STEPS.length - 1 ? <button type="button" className="btn btn-primary" disabled={!can} onClick={() => setStep(s => s + 1)}>Continue</button>
            : <button type="button" className="btn btn-primary" disabled={!!busy} onClick={submit}>{busy || (mode === "live" ? "Continue to secure checkout" : "Pay (sandbox) and file my case")}</button>}
        </div>
      </div>
    </div>
  );
}
