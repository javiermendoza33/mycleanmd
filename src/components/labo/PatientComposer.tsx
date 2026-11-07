"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PatientComposer() {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/labo/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: text }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || "Could not send.");
      setBody("");
      router.refresh();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Could not send.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={send} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
      <textarea
        value={body} onChange={(e) => setBody(e.target.value)} maxLength={4000} placeholder="Write a message…" required
        style={{ flex: "1 1 260px", minHeight: 70, border: "1px solid var(--line)", borderRadius: 14, padding: "10px 14px", font: "inherit", background: "var(--canvas)", color: "var(--ink)", resize: "vertical" }}
      />
      <button className="btn btn-primary" type="submit" disabled={busy || !body.trim()}>{busy ? "Sending…" : "Send"}</button>
      {err && <p style={{ width: "100%", margin: 0, fontSize: ".9rem", color: "var(--graphite)" }}>{err}</p>}
    </form>
  );
}
