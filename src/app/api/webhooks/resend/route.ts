import { NextRequest } from 'next/server'
import { Webhook } from 'svix'

const secret = process.env.RESEND_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const headers = {
    'svix-id':        req.headers.get('svix-id') ?? '',
    'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
    'svix-signature': req.headers.get('svix-signature') ?? '',
  }

  // Verify the webhook signature
  let event: any
  try {
    const wh = new Webhook(secret)
    event = wh.verify(payload, headers)
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { type, data } = event

  switch (type) {
    case 'email.sent':
      console.log('Email sent:', data.email_id)
      break

    case 'email.delivered':
      console.log('Email delivered:', data.email_id, 'to', data.to)
      break

    case 'email.delivery_delayed':
      console.warn('Delivery delayed:', data.email_id)
      break

    case 'email.bounced':
      console.error('Email bounced:', data.email_id, 'to', data.to)
      // TODO: flag email in DB, stop sending to this address
      break

    case 'email.complained':
      console.error('Spam complaint:', data.email_id, 'from', data.to)
      // TODO: unsubscribe user immediately
      break

    case 'email.opened':
      console.log('Email opened:', data.email_id)
      break

    case 'email.clicked':
      console.log('Link clicked:', data.click?.link)
      break
  }

  return Response.json({ received: true })
}
