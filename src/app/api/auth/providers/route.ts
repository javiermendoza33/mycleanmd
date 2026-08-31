import { NextResponse } from 'next/server'

/**
 * Which OAuth providers are actually switched on in Supabase.
 *
 * WHY THIS EXISTS. `signInWithOAuth()` does not fail client-side for a provider
 * that is not enabled — it hard-navigates to Supabase, which answers with a raw
 * JSON 400:
 *
 *     {"code":400,"error_code":"validation_failed",
 *      "msg":"Unsupported provider: provider is not enabled"}
 *
 * A patient on a telehealth login would see that JSON. So the buttons must not
 * be rendered at all until the provider works, and this endpoint is how the
 * client knows. Enable a provider in the Supabase dashboard and its button
 * appears on the next page load — no deploy needed.
 *
 * The probe uses the PUBLIC authorize endpoint, which needs no key: 302 means
 * enabled, 400 means not. `/auth/v1/settings` would be tidier but requires the
 * anon key, which pulls blank from Vercel on this project.
 */
const PROVIDERS = ['google', 'apple', 'facebook'] as const

let cache: { at: number; value: Record<string, boolean> } | null = null
const TTL_MS = 5 * 60 * 1000

async function probe(base: string, provider: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${base}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(base)}`,
      { redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(4000) }
    )
    return res.status >= 300 && res.status < 400
  } catch {
    // A network blip must not silently hide a working provider, so treat an
    // unreachable probe as "leave it alone" — the caller keeps the last answer.
    return false
  }
}

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) return NextResponse.json({ enabled: [] })

  if (cache && Date.now() - cache.at < TTL_MS) {
    return NextResponse.json({ enabled: PROVIDERS.filter(p => cache!.value[p]) })
  }

  const results = await Promise.all(PROVIDERS.map(p => probe(base, p)))
  const value = Object.fromEntries(PROVIDERS.map((p, i) => [p, results[i]]))
  cache = { at: Date.now(), value }

  return NextResponse.json(
    { enabled: PROVIDERS.filter(p => value[p]) },
    { headers: { 'Cache-Control': 'private, max-age=300' } }
  )
}
