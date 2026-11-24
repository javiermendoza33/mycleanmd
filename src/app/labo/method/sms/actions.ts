"use server";
import { Resend } from "resend";
import { headers } from "next/headers";
import { METHOD, PRACTICE } from "@/labo/content";
import { METHOD_CONSENT_TEXT } from "@/labo/method/sms";
import { upsertCustomer, addEvent } from "@/lib/labo/crm";

/* SMS opt-in for The Labo Method (Nov 23 2026, Javier: "build a sms opt in page compliance for THELABOMETHOD"). Records a
   consent the carriers can audit — who, which number, the exact disclosure ticked, when, from where — in the CRM (customer
   sms_consent + an sms_consent event with the record) and by email to the practice inbox. Texting is OPTIONAL: the box is
   unchecked by default and an email-only sign-up is accepted. No health data is collected here. */
export interface SmsState { status: "idle" | "success" | "error"; message?: string; emailOnly?: boolean }
const TO = process.env.LABO_CONTACT_EMAIL ?? "javier.mendoza@upm.ai";
const FROM = process.env.LABO_CONTACT_FROM ?? `${METHOD.name} <support@mycleantext.com>`;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function submitMethodSmsOptIn(_prev: SmsState, formData: FormData): Promise<SmsState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const name = get("firstName"), mobile = get("mobile").replace(/[^\d]/g, ""), email = get("email").toLowerCase();
  const consent = get("consent") === "yes";
  if (get("website")) return { status: "success", emailOnly: !consent };   // honeypot
  if (!name) return { status: "error", message: "Please give us your first name." };
  if (consent && !/^1?\d{10}$/.test(mobile)) return { status: "error", message: "Please enter a 10-digit US mobile number to receive texts." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: "error", message: consent ? "Add your email too, so we can send you a copy of what you agreed to." : "Texting is optional — tick the box to get texts, or add an email address to get updates by email only." };

  const h = await headers();
  const record = { recorded_at: new Date().toISOString(), ip: (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown", user_agent: h.get("user-agent") ?? "unknown", source: `https://${METHOD.domain}/sms`, mobile: consent ? mobile : null, disclosure: consent ? METHOD_CONSENT_TEXT : null };

  // the CRM record (one person across both brands)
  const customer = await upsertCustomer({ email, first_name: name, phone: consent ? mobile : undefined, brand: "method", source: "sms-optin", sms_consent: consent || undefined, email_consent: true });
  await addEvent(customer?.id, "method", consent ? "sms_consent" : "email_consent", consent ? "SMS opt-in on thelabomethod.com/sms" : "Email-only sign-up on thelabomethod.com/sms", record);

  const key = process.env.RESEND_API_KEY;
  if (key) {
    const rows: [string, string][] = [["First name", name], ["Mobile", consent ? mobile : "— (email only)"], ["Email", email], ["SMS consent", consent ? "YES — box ticked by the subscriber" : "No — email updates only"], ["Recorded at", record.recorded_at], ["IP", record.ip], ["Browser", record.user_agent], ["Form", record.source]];
    try {
      await new Resend(key).emails.send({ from: FROM, to: TO, replyTo: email, subject: `${METHOD.name} — ${consent ? "SMS opt-in" : "email-only sign-up"}: ${name}`,
        html: `<div style="font-family:system-ui,sans-serif;color:#101820"><h2 style="font-weight:500">${consent ? "New SMS opt-in" : "New email-only sign-up"} via ${METHOD.domain}/sms</h2><table cellpadding="0" cellspacing="0">${rows.map(([k, v]) => `<tr><td style="padding:6px 18px 6px 0;color:#55637A">${esc(k)}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`).join("")}</table>${consent ? `<p style="margin-top:20px;font-size:13px;color:#3A4556"><b>Disclosure shown next to the box:</b><br>${esc(METHOD_CONSENT_TEXT)}</p>` : ""}<p style="margin-top:22px;font-size:12px;color:#55637A">This is the consent record for this subscriber; the same record is on their CRM timeline. Nothing is sent automatically.</p></div>` });
    } catch (e) { console.error("[method sms opt-in] email failed:", e instanceof Error ? e.message : e); }
  }
  return { status: "success", emailOnly: !consent };
}
