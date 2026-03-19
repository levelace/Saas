import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { stripe, getPlanFromPriceId } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendSubscriptionEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        if (!userId) break

        if (session.mode === 'subscription' && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = sub.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)

          await prisma.subscription.update({
            where: { userId },
            data: {
              stripeSubscriptionId: sub.id,
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
              status: 'ACTIVE',
              plan: plan || 'STARTER',
            },
          })

          const user = await prisma.user.findUnique({ where: { id: userId } })
          if (user) {
            sendSubscriptionEmail(user, plan || 'Starter').catch(console.error)
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = invoice.subscription as string
        if (!subId) break

        const sub = await stripe.subscriptions.retrieve(subId)
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subId },
          data: {
            status: 'ACTIVE',
            stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = invoice.subscription as string
        if (!subId) break

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subId },
          data: { status: 'PAST_DUE' },
        })
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const priceId = sub.items.data[0]?.price.id
        const plan = getPlanFromPriceId(priceId)

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
            status: sub.status === 'active' ? 'ACTIVE'
              : sub.status === 'trialing' ? 'TRIALING'
              : sub.status === 'past_due' ? 'PAST_DUE'
              : 'INACTIVE',
            plan: plan || 'FREE',
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: 'CANCELED', plan: 'FREE' },
        })
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return new Response('Handler error', { status: 500 })
  }

  return new Response('OK', { status: 200 })
}
