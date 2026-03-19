'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/components/ui/toaster'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const callbackUrl = params.get('callbackUrl') || '/dashboard'

  async function handleSubmit() {
    if (!form.email || !form.password) { toast('All fields required', 'error'); return }
    setLoading(true)
    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    setLoading(false)
    if (res?.ok) {
      router.push(callbackUrl)
    } else {
      toast(res?.error || 'Invalid credentials', 'error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-syne font-extrabold text-lg tracking-[0.1em] mb-10">
          <span className="w-2 h-2 rounded-full bg-amber animate-pulse-dot" />
          LEVELACE
        </Link>

        <div className="card p-8">
          <div className="mb-7">
            <div className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-amber mb-2">▶ Secure Access</div>
            <h1 className="font-syne font-extrabold text-3xl">Sign In</h1>
            <p className="text-muted text-sm font-light mt-2">Access your Sentinel dashboard.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <button className="btn-primary w-full mt-2" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In →'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-muted text-sm">
              No account?{' '}
              <Link href="/auth/register" className="text-amber hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
