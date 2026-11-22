import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/labo/clinic";
import { createAdminClient } from "@/lib/supabase/admin";

/** Team (admin only). POST { email, name, role }  PATCH { id, role?, active?, name?, color? } */
export async function POST(req: NextRequest) {
  const s = await requireStaff("admin"); if (!s) return NextResponse.json({ ok: false, error: "Admin only" }, { status: 401 });
  const b = await req.json().catch(() => ({})); const email = String(b.email || "").trim().toLowerCase(), name = String(b.name || "").trim(), role = b.role === "admin" ? "admin" : "staff";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !name) return NextResponse.json({ ok: false, error: "Name and a valid email" }, { status: 400 });
  const { data, error } = await createAdminClient().from("labo_staff").upsert({ email, name, role, active: true, invited_by: s.staff.email }, { onConflict: "email" }).select("id").single();
  return error ? NextResponse.json({ ok: false, error: error.message }, { status: 500 }) : NextResponse.json({ ok: true, id: data.id });
}
export async function PATCH(req: NextRequest) {
  const s = await requireStaff("admin"); if (!s) return NextResponse.json({ ok: false, error: "Admin only" }, { status: 401 });
  const b = await req.json().catch(() => ({})); const id = String(b.id || ""); if (!id) return NextResponse.json({ ok: false, error: "id" }, { status: 400 });
  const patch: Record<string, unknown> = {};
  if (b.role) patch.role = b.role === "admin" ? "admin" : "staff";
  if (typeof b.active === "boolean") patch.active = b.active;
  if (typeof b.name === "string" && b.name.trim()) patch.name = b.name.trim();
  if (typeof b.color === "string") patch.color = b.color || null;
  // never let the last admin lock everyone out
  if (patch.role === "staff" || patch.active === false) {
    const { data } = await createAdminClient().from("labo_staff").select("id").eq("role", "admin").eq("active", true);
    if ((data ?? []).length <= 1 && (data ?? [])[0]?.id === id) return NextResponse.json({ ok: false, error: "That's the last admin" }, { status: 400 });
  }
  const { error } = await createAdminClient().from("labo_staff").update(patch).eq("id", id);
  return error ? NextResponse.json({ ok: false, error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
/** DELETE { id } — remove a team member outright (Nov 21 2026, Javier: "can i delete one as i made a mistake").
 *  Refuses yourself and the last active admin. Only the portal row goes; their sign-in account (if any) stays. */
export async function DELETE(req: NextRequest) {
  const s = await requireStaff("admin"); if (!s) return NextResponse.json({ ok: false, error: "Admin only" }, { status: 401 });
  const b = await req.json().catch(() => ({})); const id = String(b.id || ""); if (!id) return NextResponse.json({ ok: false, error: "id" }, { status: 400 });
  const db = createAdminClient();
  const { data: row } = await db.from("labo_staff").select("id,email,role,active").eq("id", id).maybeSingle();
  if (!row) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  if (row.email === s.user.email) return NextResponse.json({ ok: false, error: "You can't remove yourself" }, { status: 400 });
  if (row.role === "admin" && row.active) {
    const { data } = await db.from("labo_staff").select("id").eq("role", "admin").eq("active", true);
    if ((data ?? []).length <= 1) return NextResponse.json({ ok: false, error: "That's the last admin" }, { status: 400 });
  }
  const { error } = await db.from("labo_staff").delete().eq("id", id);
  return error ? NextResponse.json({ ok: false, error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
