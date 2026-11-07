"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { kind: "refill" | "lab"; enrollments: { id: string; name: string }[] };

const input: React.CSSProperties = { border: "1px solid var(--line)", borderRadius: 12, padding: "10px 12px", font: "inherit", background: "var(--paper)", color: "var(--ink)", width: "100%" };

export default function PatientRequestForm({ kind, enrollments }: Props) {
  const router = useRouter();
  const [enrollmentId, setEnrollmentId] = useState(enrollments[0]?.id ?? "");
  const [medication, setMedication] = useState("");
  const [dose, setDose] = useState("");
  const [pharmacy, setPharmacy] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      const r = await fetch("/api/labo/requests", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId, kind, medication, dose, pharmacy, patientNote: note }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || "Something went wrong.");
      setMedication(""); setDose(""); setPharmacy(""); setNote("");
      setMsg("Sent. Your provider will review it.");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 6 }}>
      {enrollments.length > 1 && (
        <div className="field"><label>Program</label>
          <select style={input} value={enrollmentId} onChange={(e) => setEnrollmentId(e.target.value)}>
            {enrollments.map((en) => <option key={en.id} value={en.id}>{en.name}</option>)}
          </select>
        </div>
      )}
      {kind === "refill" && (
        <>
          <div className="field"><label>Medication</label><input style={input} value={medication} onChange={(e) => setMedication(e.target.value)} required maxLength={120} /></div>
          <div className="field"><label>Dose (if you know it)</label><input style={input} value={dose} onChange={(e) => setDose(e.target.value)} maxLength={80} /></div>
          <div className="field"><label>Pharmacy</label><input style={input} value={pharmacy} onChange={(e) => setPharmacy(e.target.value)} maxLength={160} placeholder="Name and city, or the one on file" /></div>
        </>
      )}
      <div className="field"><label>{kind === "refill" ? "Anything to add" : "What was drawn, or your question"}</label>
        <textarea style={{ ...input, minHeight: 90, resize: "vertical" }} value={note} onChange={(e) => setNote(e.target.value)} required={kind === "lab"} maxLength={2000} />
      </div>
      <button className="btn btn-primary" type="submit" disabled={busy || !enrollmentId} style={{ alignSelf: "flex-start" }}>
        {busy ? "Sending…" : kind === "refill" ? "Request refill" : "Send"}
      </button>
      {msg && <p style={{ margin: 0, fontSize: ".9rem", color: "var(--graphite)" }}>{msg}</p>}
    </form>
  );
}
