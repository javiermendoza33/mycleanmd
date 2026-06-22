export default function CareShell({
  children,
  accentColor = 'var(--teal)',
}: {
  children: React.ReactNode
  accentColor?: string
}) {
  // accentColor is passed through to page content via CSS custom property
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', ['--care-accent' as string]: accentColor }}>
      {children}
    </div>
  )
}
