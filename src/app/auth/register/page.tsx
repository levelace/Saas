'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useToast } from '@/components/ui/toaster'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  async function handleSubmit() {
    if (!form.name || !form.email || !form.password) { toast('All fields required', 'error'); return }
    if (form.password !== form.confirm) { toast('Passwords do not match', 'error'); return }
    if (form.password.length < 8) { toast('Password must be at least 8 characters', 'error'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!data.success) { toast(data.error || 'Registration failed', 'error'); return }

      // Auto sign-in
      const signInRes = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      if (signInRes?.ok) {
        toast('Welcome to LEVELACE!', 'success')
        router.push('/dashboard')
      } else {
        router.push('/auth/login')
      }
    } catch {
      toast('Something went wrong', 'error')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = (p: string) => {
    if (!p) return null
    const strong = p.length >= 8 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /\d/.test(p)
    const medium = p.length >= 8
    return strong ? 'strong' : medium ? 'medium' : 'weak'
  }

  const strength = passwordStrength(form.password)

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2.5 font-syne font-extrabold text-lg tracking-[0.1em] mb-10">
          <span className="w-2 h-2 rounded-full bg-amber animate-pulse-dot" />
          LEVELACE
        </Link>

        <div className="card p-8">
          <div className="mb-7">
            <div className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-amber mb-2">▶ Create Account</div>
            <h1 className="font-syne font-extrabold text-3xl">Get Started</h1>
            <p className="text-muted text-sm font-light mt-2">Access the Sentinel Intelligence Platform.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="Jane Doe" value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div>
              <label className="label">Work Email</label>
              <input className="input" type="email" placeholder="jane@company.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Min. 8 chars, mixed case + number" value={form.password} onChange={(e) => set('password', e.target.value)} />
              {strength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {['weak', 'medium', 'strong'].map((s, i) => (
                      <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${
                        strength === 'weak' && i === 0 ? 'bg-red'
                        : strength === 'medium' && i <= 1 ? 'bg-amber'
                        : strength === 'strong' ? 'bg-cyan'
                        : 'bg-border'
                      }`} />
                    ))}
                  </div>
                  <span className={`text-[0.65rem] font-mono uppercase ${
                    strength === 'strong' ? 'text-cyan' : strength === 'medium' ? 'text-amber' : 'text-red'
                  }`}>{strength}</span>
                </div>
              )}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input className="input" type="password" placeholder="Repeat password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
            </div>

            <button className="btn-primary w-full mt-2" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-muted text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-amber hover:underline">Sign in</Link>
            </p>
          </div>
        </div>

        <p className="text-muted/50 text-xs text-center mt-6">
          By registering you agree to our{' '}
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>{' '}
          and{' '}
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
