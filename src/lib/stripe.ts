import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const PLANS = {
  STARTER: {
    name: 'Starter',
    priceId: process.env.STRIPE_PRICE_STARTER!,
    price: 149,
    txLimit: '10K',
    features: [
      'Up to 10K transactions/mo',
      'Real-time risk scoring',
      'Basic revenue dashboard',
      'Email alerts',
      'Standard support (48h SLA)',
    ],
    excluded: ['Chargeback intelligence', 'API access'],
  },
  PROFESSIONAL: {
    name: 'Professional',
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL!,
    price: 499,
    txLimit: '100K',
    features: [
      'Up to 100K transactions/mo',
      'Full risk scoring engine',
      'Revenue assurance dashboard',
      'Chargeback intelligence',
      'Webhook + API access',
      'Priority support (8h SLA)',
      'Compliance report exports',
    ],
    excluded: [],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    priceId: process.env.STRIPE_PRICE_ENTERPRISE!,
    price: null,
    txLimit: 'Unlimited',
    features: [
      'Unlimited transactions',
      'Dedicated analyst support',
      'Custom model training',
      'On-premise deployment option',
      'SLA-backed 99.9% uptime',
      'White-label available',
      'Dedicated success manager',
    ],
    excluded: [],
  },
} as const

export type PlanKey = keyof typeof PLANS

export function getPlanFromPriceId(priceId: string): PlanKey | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) return key as PlanKey
  }
  return null
}
