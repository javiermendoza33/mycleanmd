import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProduct } from "@/labo/clinic/products";
import { DOWNTIME_LABEL, EXPERIENCE_LABEL, GOAL_LABEL, SAFETY_LABEL, SUB_LABEL, TX } from "@/labo/clinic/treatment-quiz";

/** Records a completed quiz (Nov 21 2026). Two kinds, one table (labo_quiz): "skincare" (skin/concern/routine +
 *  product slugs) and "treatment" (answers jsonb + treatment keys). Anonymous — nothing else is stored. The quiz
 *  shows its result regardless of this call: a missing table/key (503) or a bad row (400) never blocks the visitor.
 *  Seen on /clinic/quiz. */
const SKIN = ["balanced", "oily", "dry", "sensitive", "combo"], CONCERN = ["Acne", "Aging", "Dryness", "Sensitive", "Pigment"], ROUTINE = ["two", "short", "all"];
const bad = (m: string) => NextResponse.json({ ok: false, error: m }, { status: 400 });

export async function POST(req: NextRequest) {
  let b: Record<string, unknown> = {}; try { b = await req.json(); } catch { /* empty */ }
  const kind = b.kind === "treatment" ? "treatment" : "skincare";
  let row: Record<string, unknown>;
  if (kind === "skincare") {
    const skin = String(b.skin ?? ""), concern = String(b.concern ?? ""), routine = String(b.routine ?? "");
    if (!SKIN.includes(skin) || !CONCERN.includes(concern) || !ROUTINE.includes(routine)) return bad("bad answers");
    const picks = Array.isArray(b.picks) ? b.picks.filter((s): s is string => typeof s === "string" && !!getProduct(s)).slice(0, 20) : [];
    row = { kind, skin, concern, routine, picks };
  } else {
    const a = (b.answers && typeof b.answers === "object" ? b.answers : {}) as Record<string, unknown>;
    const goal = String(a.goal ?? ""), sub = String(a.sub ?? ""), downtime = String(a.downtime ?? ""), experience = String(a.experience ?? "");
    const safety = Array.isArray(a.safety) ? a.safety.filter((s): s is string => typeof s === "string" && s in SAFETY_LABEL) : [];
    if (!(goal in GOAL_LABEL) || !(sub in SUB_LABEL) || !(downtime in DOWNTIME_LABEL) || !(experience in EXPERIENCE_LABEL)) return bad("bad answers");
    const picks = Array.isArray(b.picks) ? b.picks.filter((s): s is string => typeof s === "string" && s in TX).slice(0, 10) : [];
    row = { kind, answers: { goal, sub, downtime, safety, experience }, picks };
  }
  try {
    const { error } = await createAdminClient().from("labo_quiz").insert(row);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: /does not exist|schema cache/i.test(error.message) ? 503 : 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    // No SUPABASE_SERVICE_ROLE_KEY in this environment (local preview) — same "not set up" answer as a missing table.
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 503 });
  }
}
