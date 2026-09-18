"use server";

import { Resend } from "resend";
import { PRACTICE } from "@/labo/content";

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
const FROM = `${PRACTICE.name} <onboarding@resend.dev>`;

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

  // Honeypot: a field positioned off-screen that only a bot fills in. Returning
  // success rather than an error means a bot learns nothing from the response.
  if (get("website")) return { status: "success" };

  if (!name || !email || !message) {
    return { status: "error", message: "Please give your name, email and a message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "That email address does not look right." };
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
  ];

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
        <p style="margin-top:26px;font-size:12px;color:#8A9791">
          Sent from the public contact form. Not a secure clinical channel —
          reply by email only for non-clinical matters.</p>
      </div>`,
    });
    if (error) throw new Error(error.message);
  } catch {
    return {
      status: "error",
      message: `Message could not be sent. Please email ${PRACTICE.email} directly.`,
    };
  }

  return { status: "success" };
}
