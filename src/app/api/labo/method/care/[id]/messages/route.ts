import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cuvo } from "@/lib/cuvo";
import { careById, addEvent } from "@/lib/labo/crm";

/** POST { body }: the patient writes to the clinician on their case. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: { user } } = await (await createClient()).auth.getUser(); if (!user) return NextResponse.json({ error: "Sign in." }, { status: 401 });
  const care = await careById(id); if (!care || care.user_id !== user.id || !care.cuvo_case_id) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const body = String(((await req.json().catch(() => ({}))) as { body?: string }).body || "").trim().slice(0, 2000); if (!body) return NextResponse.json({ error: "Write something." }, { status: 400 });
  try { const m = await cuvo().postMessage(care.cuvo_case_id, body); await addEvent(care.customer_id, "method", "message", "Message to clinician", { case: care.cuvo_case_id }); return NextResponse.json({ message: m }); }
  catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 502 }); }
}
