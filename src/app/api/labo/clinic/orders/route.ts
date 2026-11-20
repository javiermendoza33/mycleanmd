import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/labo/clinic";
import { createAdminClient } from "@/lib/supabase/admin";

/** Shop orders worked by the team: PATCH { id, status?, vendorOrderId?, tracking?, staffNotes? } */
const STATUSES = ["paid", "placed", "shipped", "done", "refunded", "canceled"];
export async function PATCH(req: NextRequest) {
  const s = await requireStaff(); if (!s) return NextResponse.json({ ok: false, error: "Staff only" }, { status: 401 });
  const b = await req.json().catch(() => ({})); const id = String(b.id || ""); if (!id) return NextResponse.json({ ok: false, error: "id" }, { status: 400 });
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (b.status) { if (!STATUSES.includes(b.status)) return NextResponse.json({ ok: false, error: "bad status" }, { status: 400 }); patch.status = b.status; }
  if (typeof b.vendorOrderId === "string") patch.vendor_order_id = b.vendorOrderId.slice(0, 80) || null;
  if (typeof b.tracking === "string") patch.tracking = b.tracking.slice(0, 120) || null;
  if (typeof b.staffNotes === "string") patch.staff_notes = b.staffNotes.slice(0, 2000) || null;
  const { error } = await createAdminClient().from("labo_orders").update(patch).eq("id", id);
  return error ? NextResponse.json({ ok: false, error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
