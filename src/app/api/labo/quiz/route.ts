import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProduct } from "@/labo/clinic/products";

/** Records a completed skin quiz (Nov 21 2026). Anonymous: the three answers and the recommended slugs, nothing
 *  else. The quiz shows its result regardless of this call — a missing table (503) or a bad row (400) never blocks
 *  the visitor. Seen on /clinic/quiz. */
const SKIN = ["balanced", "oily", "dry", "sensitive", "combo"], CONCERN = ["Acne", "Aging", "Dryness", "Sensitive", "Pigment"], ROUTINE = ["two", "short", "all"];

export async function POST(req: NextRequest) {
  let b: Record<string, unknown> = {}; try { b = await req.json(); } catch { /* empty */ }
  const skin = String(b.skin ?? ""), concern = String(b.concern ?? ""), routine = String(b.routine ?? "");
  if (!SKIN.includes(skin) || !CONCERN.includes(concern) || !ROUTINE.includes(routine)) return NextResponse.json({ ok: false, error: "bad answers" }, { status: 400 });
  const picks = Array.isArray(b.picks) ? b.picks.filter((s): s is string => typeof s === "string" && !!getProduct(s)).slice(0, 20) : [];
  try {
    const { error } = await createAdminClient().from("labo_quiz").insert({ skin, concern, routine, picks });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: /does not exist|schema cache/i.test(error.message) ? 503 : 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    // No SUPABASE_SERVICE_ROLE_KEY in this environment (local preview) — same "not set up" answer as a missing table.
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 503 });
  }
}
