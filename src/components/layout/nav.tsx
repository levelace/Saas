'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Nav() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-black/85 backdrop-blur-xl border-b border-border">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 font-syne font-extrabold text-lg tracking-[0.1em] text-white">
        <span className="w-2 h-2 rounded-full bg-amber shadow-[0_0_12px_rgba(245,166,35,0.8)] animate-pulse-dot" />
        LEVELACE
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        {[
          { href: '/#products', label: 'Products' },
          { href: '/#flagship', label: 'Platform' },
          { href: '/pricing', label: 'Pricing' },
          { href: '/#policies', label: 'Policies' },
        ].map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-muted hover:text-white text-[0.82rem] tracking-[0.05em] uppercase font-medium transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="hidden md:flex items-center gap-3">
        {session ? (
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="btn-ghost text-xs py-2 px-4">Dashboard</Link>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-muted hover:text-white text-xs uppercase tracking-wider transition-colors">
              Sign out
            </button>
          </div>
        ) : (
          <>
            <Link href="/auth/login" className="text-muted hover:text-white text-[0.82rem] tracking-wider uppercase transition-colors">
              Sign in
            </Link>
            <Link href="/auth/register" className="btn-primary text-xs py-2.5 px-5">
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile toggle */}
      <button className="md:hidden text-muted hover:text-white" onClick={() => setOpen(!open)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-surface border-b border-border p-6 flex flex-col gap-5 md:hidden">
          {[
            { href: '/#products', label: 'Products' },
            { href: '/#flagship', label: 'Platform' },
            { href: '/pricing', label: 'Pricing' },
            { href: '/#policies', label: 'Policies' },
          ].map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className="text-muted hover:text-white text-sm uppercase tracking-wider transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            {session ? (
              <>
                <Link href="/dashboard" className="btn-ghost text-sm py-3" onClick={() => setOpen(false)}>Dashboard</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="text-muted text-sm uppercase tracking-wider">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost text-sm py-3" onClick={() => setOpen(false)}>Sign In</Link>
                <Link href="/auth/register" className="btn-primary text-sm py-3" onClick={() => setOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
