"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/labo/(site)/contact/actions";
import { PRACTICE } from "@/labo/content";

const FIELDS = [
  { name: "name", label: "Name", ph: "First and last", type: "text", ac: "name" },
  { name: "email", label: "Email", ph: "you@example.com", type: "email", ac: "email" },
  { name: "state", label: "State of residence", ph: "California or Washington", type: "text", ac: "address-level1" },
  { name: "program", label: "Program of interest", ph: "GLP-1, peptides, testosterone, hormone therapy", type: "text", ac: "off" },
];

function Send() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-pine btn-block" disabled={pending}>
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, action] = useActionState(submitContact, { status: "idle" } as ContactState);

  if (state.status === "success") {
    return (
      <div className="ct-panel">
        <h2 className="h2-sub" style={{ fontSize: 28 }}>Message sent</h2>
        <p className="body-sm" style={{ marginTop: 14 }}>
          Thank you — it goes straight to the practice inbox and you will hear back from
          Monika, not an autoresponder. For anything clinical, please use the patient portal.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="ct-panel">
      <h2 className="h2-sub" style={{ fontSize: 28 }}>Send a message</h2>
      <p className="body-sm" style={{ margin: "10px 0 0", fontSize: 14 }}>
        For general questions. Not a secure channel — do not include medical information.
      </p>

      {state.status === "error" && <p className="ct-msg" role="alert" style={{ marginTop: 22 }}>{state.message}</p>}

      {/* honeypot — off-screen rather than display:none, which bots detect */}
      <div aria-hidden="true"
           style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
        <label>Your website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="ct-stack">
        {FIELDS.map((f) => (
          <div key={f.name} className="fld">
            <label htmlFor={`ct-${f.name}`}>{f.label}</label>
            <input id={`ct-${f.name}`} name={f.name} type={f.type} placeholder={f.ph}
                   autoComplete={f.ac} required={f.name === "name" || f.name === "email"} />
          </div>
        ))}
        <div className="fld">
          <label htmlFor="ct-message">Message</label>
          <textarea id="ct-message" name="message" rows={4} required
                    placeholder="What would you like to ask?" />
        </div>
        <Send />
        <p className="fine" style={{ margin: 0 }}>
          Or email <a href={`mailto:${PRACTICE.email}`} style={{ borderBottom: "1px solid var(--brass)" }}>
          {PRACTICE.email}</a> directly.
        </p>
      </div>
    </form>
  );
}
