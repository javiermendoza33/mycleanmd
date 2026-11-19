"use server";

import { Resend } from "resend";
import { PRACTICE } from "@/labo/content";
import { headers } from "next/headers";
import { CONSENT_TEXT } from "@/labo/clinic/sms";

/**
 * Contact form handler.
 *
 * The design shipped this form inert (handoff open item #6). A dead form on a
 * medical marketing site loses patients silently, so it is wired here.
 *
 * NOT a clinical channel. The page copy already tells visitors not to send
 * medical information by email, and this routing matches that promise: the
 * message goes to the practice inbox by ordinary email, never into a chart and
 * never into Supabase. Anything clinical belongs in the Healthie portal.
 *
 * Resend is constructed PER REQUEST. `new Resend()` throws without a key, and
 * module-scope construction runs during `next build` — which is what once made
 * a fresh clone of this repo unbuildable.
 */
export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
}

const TO = process.env.LABO_CONTACT_EMAIL ?? "javier.mendoza@upm.ai";
// Nov 18 2026: onboarding@resend.dev can only deliver to the Resend account owner's own address, which is why the
// live form failed for everyone. Until thelabomethod.com is verified in Resend (dashboard → Domains → the DKIM/SPF
// records at GoDaddy), send from the already-verified mycleantext.com domain. LABO_CONTACT_FROM overrides.
const FROM = process.env.LABO_CONTACT_FROM ?? `${PRACTICE.name} <support@mycleantext.com>`;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const name = get("name");
  const email = get("email");
  const state = get("state");
  const program = get("program");
  const message = get("message");
  const mobile = get("mobile").replace(/[^\d]/g, "");
  const consent = get("consent") === "yes";

  // Honeypot: a field positioned off-screen that only a bot fills in. Returning
  // success rather than an error means a bot learns nothing from the response.
  if (get("website")) return { status: "success" };

  if (!name || !email || !message) {
    return { status: "error", message: "Please give your name, email and a message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "That email address does not look right." };
  }
  if (consent && !/^1?\d{10}$/.test(mobile)) {
    return { status: "error", message: "To receive texts, please enter a 10-digit US mobile number (or untick the text box)." };
  }
  if (message.length > 4000) {
    return { status: "error", message: "Please keep the message under 4,000 characters." };
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Fail loudly rather than showing a success panel that sends nothing.
    return {
      status: "error",
      message: `Message could not be sent right now. Please email ${PRACTICE.email} directly.`,
    };
  }

  const rows: [string, string][] = [
    ["Name", name], ["Email", email], ["State", state || "—"],
    ["Program of interest", program || "—"],
    ["Mobile", mobile || "—"],
    ["SMS consent", consent ? "YES — box ticked by the sender" : "No"],
  ];
  if (consent) {   // the consent record a carrier can audit
    const h = await headers();
    rows.push(["Consent recorded", new Date().toISOString()], ["IP", (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown"], ["Browser", h.get("user-agent") ?? "unknown"]);
  }

  try {
    const { error } = await new Resend(key).emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `${PRACTICE.name} — enquiry from ${name}`,
      html: `<div style="font-family:system-ui,sans-serif;color:#12312A">
        <h2 style="font-weight:400">New enquiry via ${PRACTICE.domain}</h2>
        <table cellpadding="0" cellspacing="0">${rows
          .map(([k, v]) => `<tr><td style="padding:6px 18px 6px 0;color:#5A6B63">${esc(k)}</td>
            <td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`)
          .join("")}</table>
        <p style="margin-top:20px;white-space:pre-wrap">${esc(message)}</p>
        ${consent ? `<p style="margin-top:18px;font-size:13px;color:#424245"><b>Disclosure shown next to the ticked box:</b><br>${esc(CONSENT_TEXT)}</p>` : ""}
        <p style="margin-top:26px;font-size:12px;color:#8A9791">
          Sent from the public contact form. Not a secure clinical channel —
          reply by email only for non-clinical matters.</p>
      </div>`,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("[labo contact] send failed:", e instanceof Error ? e.message : e, { from: FROM, to: TO });
    return {
      status: "error",
      message: `Message could not be sent. Please email ${PRACTICE.email} directly.`,
    };
  }

  return { status: "success" };
}
