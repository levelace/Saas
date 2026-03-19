import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { BillingActions } from '@/components/dashboard/billing-actions'
import { CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react'

const planDetails = {
  FREE: { name: 'Free', price: '$0/mo', color: 'text-muted' },
  STARTER: { name: 'Starter', price: '$149/mo', color: 'text-amber' },
  PROFESSIONAL: { name: 'Professional', price: '$499/mo', color: 'text-cyan' },
  ENTERPRISE: { name: 'Enterprise', price: 'Custom', color: 'text-white' },
}

const statusIcon = {
  ACTIVE: <CheckCircle size={14} className="text-cyan" />,
  TRIALING: <Clock size={14} className="text-amber" />,
  PAST_DUE: <AlertCircle size={14} className="text-red" />,
  CANCELED: <AlertCircle size={14} className="text-muted" />,
  INACTIVE: <AlertCircle size={14} className="text-muted" />,
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions)
  const sub = await prisma.subscription.findUnique({ where: { userId: session!.user.id } })

  const plan = sub?.plan || 'FREE'
  const status = sub?.status || 'INACTIVE'
  const planInfo = planDetails[plan as keyof typeof planDetails]
  const isActive = status === 'ACTIVE' || status === 'TRIALING'

  return (
    <div className="max-w-3xl space-y-6">
      {/* Current plan */}
      <div className="card p-6">
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted mb-5">Current Plan</div>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className={`font-syne font-extrabold text-2xl ${planInfo.color}`}>{planInfo.name}</h2>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-card border border-border rounded-full">
                {statusIcon[status as keyof typeof statusIcon]}
                <span className="font-mono text-[0.62rem] tracking-wider uppercase">{status}</span>
              </div>
            </div>
            <p className="text-muted text-sm font-light">{planInfo.price}</p>
            {sub?.stripeCurrentPeriodEnd && (
              <p className="text-muted text-xs mt-1">
                Next billing: {formatDate(sub.stripeCurrentPeriodEnd)}
              </p>
            )}
          </div>

          <BillingActions
            hasSub={isActive && plan !== 'FREE'}
            plan={plan}
          />
        </div>
      </div>

      {/* Plan features */}
      {!isActive || plan === 'FREE' ? (
        <div className="card p-6">
          <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted mb-4">Upgrade to Unlock</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { tier: 'Starter', price: '$149/mo', highlight: 'Up to 10K transactions/mo' },
              { tier: 'Professional', price: '$499/mo', highlight: 'Full platform + API access', featured: true },
              { tier: 'Enterprise', price: 'Custom', highlight: 'Unlimited + dedicated support' },
            ].map((p) => (
              <div key={p.tier} className={`p-4 rounded-lg border ${p.featured ? 'border-amber/30 bg-amber/5' : 'border-border'}`}>
                <p className={`font-syne font-bold text-sm mb-1 ${p.featured ? 'text-amber' : 'text-white'}`}>{p.tier}</p>
                <p className="text-muted text-xs mb-2">{p.price}</p>
                <p className="text-muted text-xs font-light">{p.highlight}</p>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <a href="/pricing" className="btn-primary text-xs py-2.5 px-5">View Full Pricing →</a>
          </div>
        </div>
      ) : (
        <div className="card p-6">
          <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted mb-4">Plan Includes</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {(plan === 'STARTER' ? [
              'Up to 10K transactions/month',
              'Real-time risk scoring',
              'Basic revenue dashboard',
              'Email alerts',
              'Standard support (48h SLA)',
            ] : [
              'Up to 100K transactions/month',
              'Full risk scoring engine',
              'Revenue assurance dashboard',
              'Chargeback intelligence',
              'Webhook + API access',
              'Priority support (8h SLA)',
              'Compliance report exports',
            ]).map((f) => (
              <div key={f} className="flex items-center gap-2 text-muted">
                <span className="text-cyan">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing info */}
      <div className="card p-6">
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted mb-4">Billing Information</div>
        <div className="space-y-3 text-sm">
          {[
            ['Payment Method', 'Managed via Stripe — click "Manage Billing" to update'],
            ['Invoices', 'Available in the Stripe billing portal'],
            ['Refund Policy', '7-day refund window from billing date'],
            ['Cancellation', 'Cancel anytime, access until end of period'],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
              <span className="text-muted w-36 flex-shrink-0 text-xs font-mono tracking-wider uppercase">{k}</span>
              <span className="text-white/70 font-light text-xs">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
