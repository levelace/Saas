'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toaster'

interface BillingActionsProps {
  hasSub: boolean
  plan: string
}

export function BillingActions({ hasSub, plan }: BillingActionsProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function openPortal() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.success) window.location.href = data.data.url
      else toast(data.error || 'Could not open billing portal', 'error')
    } catch { toast('Network error', 'error') }
    finally { setLoading(false) }
  }

  async function upgrade(planKey: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })
      const data = await res.json()
      if (data.success) window.location.href = data.data.url
      else toast(data.error || 'Could not start checkout', 'error')
    } catch { toast('Network error', 'error') }
    finally { setLoading(false) }
  }

  if (hasSub) {
    return (
      <button className="btn-ghost text-xs py-2.5 px-5" onClick={openPortal} disabled={loading}>
        {loading ? 'Opening...' : 'Manage Billing →'}
      </button>
    )
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {plan === 'FREE' && (
        <>
          <button className="btn-ghost text-xs py-2.5 px-5" onClick={() => upgrade('STARTER')} disabled={loading}>
            Upgrade to Starter
          </button>
          <button className="btn-primary text-xs py-2.5 px-5" onClick={() => upgrade('PROFESSIONAL')} disabled={loading}>
            {loading ? 'Redirecting...' : 'Upgrade to Pro'}
          </button>
        </>
      )}
      {plan === 'STARTER' && (
        <button className="btn-primary text-xs py-2.5 px-5" onClick={() => upgrade('PROFESSIONAL')} disabled={loading}>
          {loading ? 'Redirecting...' : 'Upgrade to Professional'}
        </button>
      )}
    </div>
  )
}
