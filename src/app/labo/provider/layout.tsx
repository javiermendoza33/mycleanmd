import { PRACTICE } from '@/labo/content'
import PortalSignOut from '@/components/labo/PortalSignOut'
import ProviderNav from './ProviderNav'
import { admin, getProvider, initials } from '@/lib/labo/provider'
import './provider.css'

export const dynamic = 'force-dynamic'

/** Provider portal shell (Monika). Auth is enforced in src/proxy.ts; this is belt-and-braces + the sidebar counts. */
export default async function ProviderLayout({ children }: { children: React.ReactNode }) {
  const user = await getProvider()
  if (!user) return <div data-provider><main className="main"><div className="card"><h3>Provider access only</h3><p className="muted" style={{ marginTop: 8 }}>Sign in with the provider account to open this area.</p></div></main></div>
  const db = admin()
  // Badge counts; each query fails soft so a missing table never breaks the shell.
  const [notes, requests, messages] = await Promise.all([
    db.from('labo_notes').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    db.from('labo_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('labo_messages').select('id', { count: 'exact', head: true }).eq('sender', 'patient').is('read_at', null),
  ])
  const counts = { '/provider/visits': notes.count ?? 0, '/provider/requests': requests.count ?? 0, '/provider/messages': messages.count ?? 0 }
  return (
    <div data-provider>
      <aside className="side">
        <div className="brand"><i>LM</i><div><b>{PRACTICE.name}</b><span>Provider</span></div></div>
        <ProviderNav counts={counts} />
        <div className="me"><div className="av">{initials(PRACTICE.provider)}</div><div style={{ flex: 1, minWidth: 0 }}><b>{PRACTICE.provider.split(',')[0]}</b><span>{user.email}</span></div><PortalSignOut /></div>
      </aside>
      <main className="main">{children}</main>
    </div>
  )
}
