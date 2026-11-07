"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PortalSignOut() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await createClient().auth.signOut();
        router.push("/auth/login");
        router.refresh();
      }}
      style={{
        background: "none", border: "none", cursor: "pointer",
        color: "var(--muted)", fontSize: ".85rem", fontFamily: "inherit",
      }}
    >
      Sign out
    </button>
  );
}
