import { BRAND } from '@/lib/brand'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: BRAND.title,
  description: 'Modern telehealth platform for patients, doctors, and administrators.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
