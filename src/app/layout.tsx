import type { Metadata } from 'next'
import { Syne, Space_Mono, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: { default: 'LEVELACE — Sentinel Intelligence Platform', template: '%s | LEVELACE' },
  description: 'Enterprise-grade fraud risk intelligence, security research, and revenue assurance SaaS — engineered for organizations that cannot afford to be wrong.',
  keywords: ['fraud detection', 'revenue assurance', 'security intelligence', 'fintech security', 'risk scoring'],
  authors: [{ name: 'LEVELACE SENTINEL LLC' }],
  creator: 'LEVELACE SENTINEL LLC',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ilevelace.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ilevelace.com',
    siteName: 'LEVELACE',
    title: 'LEVELACE — Sentinel Intelligence Platform',
    description: 'Enterprise fraud risk intelligence and revenue assurance SaaS.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LEVELACE — Sentinel Intelligence Platform',
    description: 'Enterprise fraud risk intelligence and revenue assurance SaaS.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceMono.variable} ${dmSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
