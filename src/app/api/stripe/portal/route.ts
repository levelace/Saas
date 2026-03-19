import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { apiError } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return apiError('Authentication required', 401)

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  if (!subscription?.stripeCustomerId) return apiError('No billing account found', 404)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${baseUrl}/dashboard/billing`,
  })

  return Response.json({ success: true, data: { url: portalSession.url } })
}
