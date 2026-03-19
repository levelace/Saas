'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useToast } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const plans = [
  {
    key: 'STARTER',
    tier: 'Starter',
    price: '$149',
    period: '/mo',
    desc: 'For early-stage fintechs and small merchants starting their fraud defense program.',
    features: [
      { label: 'Up to 10K transactions/mo', included: true },
      { label: 'Real-time risk scoring', included: true },
      { label: 'Basic revenue dashboard', included: true },
      { label: 'Email alerts', included: true },
      { label: 'Standard support (48h SLA)', included: true },
      { label: 'Chargeback intelligence', included: false },
      { label: 'API access', included: false },
    ],
    featured: false,
    cta: 'Get Started',
  },
  {
    key: 'PROFESSIONAL',
    tier: 'Professional',
    price: '$499',
    period: '/mo',
    desc: 'For growing platforms with active payment volumes requiring full fraud stack coverage.',
    features: [
      { label: 'Up to 100K transactions/mo', included: true },
      { label: 'Full risk scoring engine', included: true },
      { label: 'Revenue assurance dashboard', included: true },
      { label: 'Chargeback intelligence', included: true },
      { label: 'Webhook + API access', included: true },
      { label: 'Priority support (8h SLA)', included: true },
      { label: 'Compliance report exports', included: true },
    ],
    featured: true,
    cta: 'Get Started',
  },
  {
    key: 'ENTERPRISE',
    tier: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For financial institutions and high-volume operators needing dedicated infrastructure.',
    features: [
      { label: 'Unlimited transactions', included: true },
      { label: 'Dedicated analyst support', included: true },
      { label: 'Custom model training', included: true },
      { label: 'On-premise deployment option', included: true },
      { label: 'SLA-backed 99.9% uptime', included: true },
      { label: 'White-label available', included: true },
      { label: 'Dedicated success manager', included: true },
    ],
    featured: false,
    cta: 'Contact Sales',
  },
]

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  async function handlePlan(plan: string) {
    if (!session) { router.push('/auth/register'); return }
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.success && data.data.url) {
        window.location.href = data.data.url
      } else {
        toast(data.error || 'Something went wrong', 'error')
      }
    } catch {
      toast('Failed to initiate checkout', 'error')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.2em] text-amber uppercase mb-4">
            <span className="text-[0.5rem]">▶</span> Pricing
          </div>
          <h1 className="font-syne font-extrabold text-5xl md:text-6xl leading-tight mb-5">
            Transparent,<br />
            <span className="text-amber">scalable pricing</span>
          </h1>
          <p className="text-muted font-light text-base max-w-md mx-auto">
            All plans include core fraud risk tooling. No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={cn(
                'relative rounded-lg p-9 transition-all duration-200',
                plan.featured
                  ? 'border border-amber/40 bg-gradient-to-b from-[#111419] to-[#0f1118]'
                  : 'card hover:border-border-bright'
              )}
            >
              {plan.featured && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-amber text-black font-mono text-[0.6rem] font-bold tracking-wider px-4 py-1 rounded-b-md">
                  MOST POPULAR
                </div>
              )}

              <p className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-2">{plan.tier}</p>
              <div className="font-syne font-extrabold text-4xl mb-1">
                {plan.price}<span className="text-base font-normal text-muted">{plan.period}</span>
              </div>
              <p className="text-muted text-sm font-light mb-6 leading-relaxed">{plan.desc}</p>

              <hr className="border-border mb-6" />

              <ul className="flex flex-col gap-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5 text-sm">
                    <span className={f.included ? 'text-cyan' : 'text-muted2'}>{f.included ? '✓' : '✗'}</span>
                    <span className={f.included ? 'text-white' : 'text-muted'}>{f.label}</span>
                  </li>
                ))}
              </ul>

              <button
                className={cn('w-full', plan.featured ? 'btn-primary' : 'btn-ghost')}
                onClick={() => handlePlan(plan.key)}
                disabled={loading === plan.key}
              >
                {loading === plan.key ? 'Redirecting...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="font-syne font-bold text-2xl mb-8 text-center">Common questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: 'Can I change plans?', a: 'Yes — upgrade or downgrade anytime from your billing dashboard. Changes take effect immediately on upgrade, and at the next billing cycle on downgrade.' },
              { q: 'Is there a free trial?', a: 'Yes. Professional plan includes a 14-day free trial with full access. No credit card required to start.' },
              { q: 'What payment methods are accepted?', a: 'All major credit and debit cards via Stripe. Enterprise customers can also pay via invoice.' },
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your dashboard with no penalties. You keep access until the end of your current billing period.' },
            ].map((item) => (
              <div key={item.q} className="card p-6">
                <h4 className="font-syne font-bold text-sm mb-2">{item.q}</h4>
                <p className="text-muted text-sm font-light leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
