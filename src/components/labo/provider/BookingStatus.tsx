'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/** Status buttons for a clinic booking in the provider portal → PATCH /api/labo/book. */
export default function BookingStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter(); const [busy, setBusy] = useState(false)
  const set = async (s: string) => { setBusy(true); await fetch('/api/labo/book', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id, status: s }) }); setBusy(false); router.refresh() }
  return (
    <span className="row" style={{ gap: 6 }}>
      {status === 'booked' && <button type="button" className="btn l sm" disabled={busy} onClick={() => set('confirmed')}>Confirm</button>}
      {['booked', 'confirmed'].includes(status) && <><button type="button" className="btn l sm" disabled={busy} onClick={() => set('completed')}>Done</button><button type="button" className="btn l sm" disabled={busy} onClick={() => set('no_show')}>No-show</button><button type="button" className="btn l sm" disabled={busy} onClick={() => set('canceled')}>Cancel</button></>}
    </span>
  )
}
