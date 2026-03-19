import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, PLANS, type PlanKey } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { apiError } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  plan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return apiError('Authentication required', 401)

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return apiError('Invalid plan', 422)

  const { plan } = parsed.data as { plan: PlanKey }
  const planConfig = PLANS[plan]

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  if (!subscription) return apiError('Subscription record not found', 404)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Enterprise: redirect to contact
  if (plan === 'ENTERPRISE') {
    return Response.json({
      success: true,
      data: { url: `${baseUrl}/contact?plan=enterprise` },
    })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: subscription.stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?upgraded=true`,
    cancel_url: `${baseUrl}/pricing`,
    metadata: {
      userId: session.user.id,
      plan,
    },
    subscription_data: {
      metadata: { userId: session.user.id, plan },
    },
    allow_promotion_codes: true,
  })

  return Response.json({ success: true, data: { url: checkoutSession.url } })
}
