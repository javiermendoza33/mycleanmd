"use server";
import { Resend } from "resend";
import { METHOD } from "@/labo/content";
import { upsertCustomer, addEvent } from "@/lib/labo/crm";
import { US_STATES } from "@/labo/method/states";

/* The opening list (Nov 27 2026): while The Labo Method is not taking patients (METHOD_OPEN in content.ts) the sign-up page
   collects an email, and optionally a state, so we can write once on opening day. Kept deliberately thin: no name, no program,
   no health information — only who to email. The person lands in the CRM (brand "method", source "method-waitlist", an event
   of kind "waitlist") and the practice inbox gets a line. */
export interface WaitlistState { status: "idle" | "success" | "error"; error?: "email" | "save" }
const TO = process.env.LABO_CONTACT_EMAIL ?? METHOD.email;
const FROM = process.env.LABO_CONTACT_FROM ?? `${METHOD.name} <support@mycleantext.com>`;

export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  if (get("website")) return { status: "success" };   // honeypot
  const email = get("email").toLowerCase();
  const state = US_STATES.some((s) => s.code === get("state")) ? get("state") : "";
  const lang = get("lang") === "es" ? "es" : "en";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return { status: "error", error: "email" };
  try {
    const customer = await upsertCustomer({ email, state: state || undefined, brand: "method", source: "method-waitlist", email_consent: true });
    await addEvent(customer?.id, "method", "waitlist", "Joined the opening list on thelabomethod.com", { recorded_at: new Date().toISOString(), state: state || null, lang });
  } catch (e) {
    console.error("[method waitlist] save failed:", e instanceof Error ? e.message : e);
    return { status: "error", error: "save" };
  }
  const key = process.env.RESEND_API_KEY;
  if (key) {
    try {
      await new Resend(key).emails.send({ from: FROM, to: TO, replyTo: email, subject: `${METHOD.name} — opening list: ${email}`,
        text: `${email} joined the opening list on ${METHOD.domain}${state ? ` (state: ${state})` : ""}, language ${lang}. They are in the CRM under source "method-waitlist". Nothing was sent to them.` });
    } catch (e) { console.error("[method waitlist] email failed:", e instanceof Error ? e.message : e); }
  }
  return { status: "success" };
}
