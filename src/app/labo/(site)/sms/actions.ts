"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import { PRACTICE } from "@/labo/content";
import { CONSENT_TEXT } from "@/labo/clinic/sms";

/**
 * SMS opt-in (Nov 18 2026, Javier: "create an sms opt-in compliance page… for labo"). The form on /sms records a
 * consent the carriers can audit: who, which number, the exact disclosure they ticked, when, and from where. It is
 * emailed to the practice inbox like the contact form (not stored in Supabase; the clinic's texting platform keeps
 * the subscriber list). Texting is OPTIONAL: the consent box is unchecked by default and an email-only sign-up is
 * accepted when the box stays unticked (memory: feedback-no-prechecked-optin-mockups).
 */
export interface SmsState { status: "idle" | "success" | "error"; message?: string; emailOnly?: boolean }

const TO = process.env.LABO_CONTACT_EMAIL ?? "javier.mendoza@upm.ai";
const FROM = process.env.LABO_CONTACT_FROM ?? `${PRACTICE.name} <support@mycleantext.com>`;


const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function submitSmsOptIn(_prev: SmsState, formData: FormData): Promise<SmsState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const name = get("firstName"), mobile = get("mobile").replace(/[^\d]/g, ""), email = get("email");
  const consent = get("consent") === "yes";
  if (get("website")) return { status: "success", emailOnly: !consent };   // honeypot

  if (!name) return { status: "error", message: "Please give us your first name." };
  if (consent && !/^1?\d{10}$/.test(mobile)) return { status: "error", message: "Please enter a 10-digit US mobile number to receive texts." };
  if (!consent && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Texting is optional — tick the box to get texts, or add an email address to get updates by email only." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: "error", message: "That email address does not look right." };

  const key = process.env.RESEND_API_KEY;
  if (!key) return { status: "error", message: `We could not save your request right now. Please text ${PRACTICE.name} at the number on the contact page.` };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const ua = h.get("user-agent") ?? "unknown";
  const at = new Date().toISOString();
  const rows: [string, string][] = [
    ["First name", name], ["Mobile", consent ? mobile : "— (email only)"], ["Email", email || "—"],
    ["SMS consent", consent ? "YES — box ticked by the subscriber" : "No — email updates only"],
    ["Recorded at", at], ["IP", ip], ["Browser", ua], ["Form", `https://${PRACTICE.domain}/sms`],
  ];
  try {
    const { error } = await new Resend(key).emails.send({
      from: FROM, to: TO, replyTo: email || undefined,
      subject: `${PRACTICE.name} — ${consent ? "SMS opt-in" : "email-only sign-up"}: ${name}`,
      html: `<div style="font-family:system-ui,sans-serif;color:#1D1D1F">
        <h2 style="font-weight:400">${consent ? "New SMS opt-in" : "New email-only sign-up"} via ${PRACTICE.domain}/sms</h2>
        <table cellpadding="0" cellspacing="0">${rows.map(([k, v]) => `<tr><td style="padding:6px 18px 6px 0;color:#6E6E73">${esc(k)}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`).join("")}</table>
        ${consent ? `<p style="margin-top:20px;font-size:13px;color:#424245"><b>Disclosure shown next to the box:</b><br>${esc(CONSENT_TEXT)}</p>` : ""}
        <p style="margin-top:22px;font-size:12px;color:#6E6E73">Keep this email: it is the consent record for this subscriber. Add the number to the texting platform by hand; nothing is sent automatically.</p>
      </div>`,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("[labo sms opt-in] send failed:", e instanceof Error ? e.message : e, { from: FROM, to: TO });
    return { status: "error", message: `We could not save your request. Please text ${PRACTICE.name} directly from the contact page.` };
  }
  return { status: "success", emailOnly: !consent };
}
