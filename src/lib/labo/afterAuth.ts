'use client'
/** On thelabomethod.com, the page a user should land on after auth; null on every other host. */
export async function laboHomeOrNull(): Promise<string | null> {
  if (typeof window === 'undefined' || !/(^|\.)thelabomethod\.com$/.test(window.location.hostname)) return null
  try { const r = await fetch('/api/labo/home', { cache: 'no-store' }); const j = await r.json(); return typeof j.path === 'string' ? j.path : '/portal' }
  catch { return '/portal' }
}
