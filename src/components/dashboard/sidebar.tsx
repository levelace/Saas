'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, AlertTriangle, Key, CreditCard,
  Settings, LogOut, ExternalLink, Shield
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/cases', label: 'Fraud Cases', icon: AlertTriangle },
  { href: '/dashboard/api-keys', label: 'API Keys', icon: Key },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-surface border-r border-border flex-col z-40">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-6 h-16 font-syne font-extrabold text-[1.05rem] tracking-[0.1em] border-b border-border flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-amber shadow-[0_0_10px_rgba(245,166,35,0.7)] animate-pulse-dot" />
          LEVELACE
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
          <div className="px-3 mb-2">
            <span className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-muted">Platform</span>
          </div>

          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-150',
                  active
                    ? 'bg-amber/10 text-amber border border-amber/20'
                    : 'text-muted hover:text-white hover:bg-card'
                )}
              >
                <Icon size={15} className="flex-shrink-0" />
                {label}
              </Link>
            )
          })}

          <div className="px-3 mt-5 mb-2">
            <span className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-muted">Links</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-muted hover:text-white hover:bg-card transition-all duration-150"
          >
            <ExternalLink size={15} />
            Website
          </Link>

          <Link
            href="/docs"
            className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-muted hover:text-white hover:bg-card transition-all duration-150"
          >
            <Shield size={15} />
            API Docs
          </Link>
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-muted hover:text-red hover:bg-red/5 transition-all duration-150"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
