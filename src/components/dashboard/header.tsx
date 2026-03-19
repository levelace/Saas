'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Menu } from 'lucide-react'

const titles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/cases': 'Fraud Cases',
  '/dashboard/api-keys': 'API Keys',
  '/dashboard/billing': 'Billing',
}

interface DashboardHeaderProps {
  user: { name?: string | null; email: string; image?: string | null }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname()
  const title = titles[pathname] || 'Dashboard'

  return (
    <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-border bg-black/60 backdrop-blur-md flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="font-syne font-bold text-base tracking-wide">{title}</h1>
        <span className="hidden md:flex items-center gap-1.5 font-mono text-[0.62rem] tracking-[0.1em] text-amber uppercase px-2 py-0.5 bg-amber/10 border border-amber/20 rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-dot" />
          Live
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-muted hover:text-white transition-colors">
          <Bell size={17} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center font-syne font-bold text-amber text-sm">
            {(user.name || user.email)[0].toUpperCase()}
          </div>
          <span className="hidden md:block text-sm text-muted font-light">{user.name || user.email.split('@')[0]}</span>
        </div>
      </div>
    </header>
  )
}
