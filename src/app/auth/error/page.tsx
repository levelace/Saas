'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const errors: Record<string, string> = {
  Configuration: 'Server configuration error. Please contact support.',
  AccessDenied: 'Access denied. You do not have permission to sign in.',
  Verification: 'The verification link has expired or has already been used.',
  Default: 'An unexpected error occurred during sign in.',
}

export default function AuthErrorPage() {
  const params = useSearchParams()
  const error = params.get('error') || 'Default'
  const message = errors[error] || errors.Default

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-red mb-4">✗ Auth Error</div>
        <h1 className="font-syne font-extrabold text-3xl mb-4">Sign In Failed</h1>
        <p className="text-muted text-sm font-light mb-8">{message}</p>
        <div className="flex gap-3 justify-center">
          <Link href="/auth/login" className="btn-primary">Try Again</Link>
          <Link href="/" className="btn-ghost">Go Home</Link>
        </div>
      </div>
    </div>
  )
}
