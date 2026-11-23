import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { careFor } from "@/lib/labo/crm";
import { getProgram } from "@/labo/content";

export const dynamic = "force-dynamic";
const LABEL: Record<string, string> = { started: "Started", awaiting_payment: "Awaiting payment", filed: "With your clinician", active: "Active", declined: "Not approved", cancelled: "Cancelled" };

/** Every program the patient has started, newest first. */
export default async function CareIndex() {
  const { data: { user } } = await (await createClient()).auth.getUser(); if (!user) return null;
  const rows = await careFor(user.id);
  return (
    <div className="care">
      <p className="eyebrow">My care</p><h1>Your programs</h1>
      {rows.length === 0 ? <p className="muted">Nothing started yet. <Link href="/start">Get started</Link> takes about ten minutes.</p> : null}
      <ul className="care-list">{rows.map(r => <li key={r.id}><Link href={`/portal/care/${r.id}`}><b>{getProgram(r.program_slug)?.name || r.program_slug}</b><span>{LABEL[r.status] || r.status} · {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></Link></li>)}</ul>
    </div>
  );
}
