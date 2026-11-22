import { BRAND } from '@/lib/brand'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: BRAND.title,
  icons: { icon: "/favicon.ico" },   // Nov 22 2026: moved from src/app/favicon.ico so the Labo layouts can override icons cleanly
  description: 'Modern telehealth platform for patients, doctors, and administrators.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
