'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS: [string, string, string][] = [
  ['/provider', '◎', 'Today'], ['/provider/calendar', '▦', 'Calendar'], ['/provider/patients', '◯', 'Patients'],
  ['/provider/visits', '✎', 'Visit notes'], ['/provider/requests', '⇄', 'Requests'], ['/provider/messages', '✉', 'Messages'], ['/provider/profile', '◉', 'Profile & hours'],
]
export default function ProviderNav({ counts }: { counts: Record<string, number> }) {
  const path = usePathname() || ''
  return (
    <nav className="nav">
      {ITEMS.map(([href, ic, label]) => {
        const on = href === '/provider' ? path === '/provider' || path === '/labo/provider' : path.startsWith(href) || path.startsWith('/labo' + href)
        const n = counts[href]
        return <Link key={href} href={href} className={on ? 'on' : ''}><span className="ic">{ic}</span>{label}{n ? <span className="n">{n}</span> : null}</Link>
      })}
    </nav>
  )
}
