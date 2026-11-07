'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProviderComposer({ patientUserId }: { patientUserId: string }) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  async function send() {
    const text = body.trim(); if (!text) return
    setBusy(true); setErr(null)
    try {
      const r = await fetch('/api/labo/provider/messages', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ patientUserId, body: text }) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`)
      setBody(''); router.refresh()
    } catch (e) { setErr(e instanceof Error ? e.message : String(e)) } finally { setBusy(false) }
  }
  return (
    <div className="col" style={{ gap: 8 }}>
      {err && <div className="setup">{err}</div>}
      <div className="row" style={{ gap: 10, alignItems: 'flex-end' }}>
        <textarea className="in" style={{ flex: 1, minHeight: 44 }} rows={2} value={body} placeholder="Write a message…" onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send() }} />
        <button className="btn b" disabled={busy || !body.trim()} onClick={send}>{busy ? 'Sending…' : 'Send'}</button>
      </div>
      <div className="tiny">⌘↵ to send · patients see replies in their portal</div>
    </div>
  )
}
