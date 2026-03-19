import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendContactEmail } from '@/lib/email'
import { apiSuccess, apiError, rateLimit } from '@/lib/utils'

const schema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  product: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const { success } = rateLimit(`contact:${ip}`, 3, 60_000)
  if (!success) return apiError('Too many requests. Please wait a moment.', 429)

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.errors[0].message, 422)

  const data = parsed.data

  // Persist to DB
  await prisma.contactForm.create({ data })

  // Send emails (non-blocking)
  sendContactEmail(data).catch(console.error)

  return apiSuccess({ message: 'Message sent successfully' })
}
