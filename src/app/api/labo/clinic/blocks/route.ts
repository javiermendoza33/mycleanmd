import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/labo/clinic";
import { createAdminClient } from "@/lib/supabase/admin";

/** Time off / closures. POST { startsAt, endsAt, reason?, staffId? }  DELETE ?id= */
export async function POST(req: NextRequest) {
  const s = await requireStaff(); if (!s) return NextResponse.json({ ok: false, error: "Staff only" }, { status: 401 });
  const b = await req.json().catch(() => ({})); const a = new Date(String(b.startsAt || "")), z = new Date(String(b.endsAt || ""));
  if (isNaN(+a) || isNaN(+z) || z <= a) return NextResponse.json({ ok: false, error: "Start and end, in order" }, { status: 400 });
  const { data, error } = await createAdminClient().from("labo_blocks").insert({ starts_at: a.toISOString(), ends_at: z.toISOString(), reason: String(b.reason || "").slice(0, 200) || null, staff_id: b.staffId || null, created_by: s.staff.email }).select("id").single();
  return error ? NextResponse.json({ ok: false, error: error.message }, { status: 500 }) : NextResponse.json({ ok: true, id: data.id });
}
export async function DELETE(req: NextRequest) {
  const s = await requireStaff(); if (!s) return NextResponse.json({ ok: false, error: "Staff only" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") || ""; if (!id) return NextResponse.json({ ok: false, error: "id" }, { status: 400 });
  const { error } = await createAdminClient().from("labo_blocks").delete().eq("id", id);
  return error ? NextResponse.json({ ok: false, error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
