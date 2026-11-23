import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cuvo } from "@/lib/cuvo";
import { careById } from "@/lib/labo/crm";
import { getProgram } from "@/labo/content";

/** GET: everything the portal timeline shows for one care row — the case, its status history, prescriptions, orders, messages. Owner only. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: { user } } = await (await createClient()).auth.getUser(); if (!user) return NextResponse.json({ error: "Sign in." }, { status: 401 });
  const care = await careById(id); if (!care || care.user_id !== user.id) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const program = getProgram(care.program_slug);
  if (!care.cuvo_case_id) return NextResponse.json({ care, program: program?.name, case: null, history: [], prescriptions: [], orders: [], messages: [] });
  const c = cuvo();
  try {
    const [kase, history, prescriptions, orders, messages] = await Promise.all([c.case(care.cuvo_case_id), c.statusHistory(care.cuvo_case_id), c.prescriptions(care.cuvo_case_id), c.orders(care.cuvo_case_id), c.messages(care.cuvo_case_id)]);
    return NextResponse.json({ care, program: program?.name, case: kase, history, prescriptions, orders, messages });
  } catch (e) {
    // the mock sandbox is in-memory: after a redeploy its cases are gone, which the page explains instead of failing
    return NextResponse.json({ care, program: program?.name, case: null, history: [], prescriptions: [], orders: [], messages: [], note: (e as Error).message });
  }
}
