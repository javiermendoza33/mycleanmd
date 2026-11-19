import { NextRequest, NextResponse } from "next/server";
import { cancelBooking } from "@/lib/labo/booking";

/** POST { id, token } — the link in the confirmation email. */
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const r = await cancelBooking(String(b.id || ""), String(b.token || ""));
  return NextResponse.json(r, { status: r.ok ? 200 : 404 });
}
