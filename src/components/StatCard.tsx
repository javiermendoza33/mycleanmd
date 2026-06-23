import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  sub?: ReactNode
  accent?: string
}

export default function StatCard({ label, value, sub, accent = 'var(--teal)' }: StatCardProps) {
  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--card-bg)', border: '1px solid var(--divider)' }}>
      <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{sub}</p>}
    </div>
  )
}
