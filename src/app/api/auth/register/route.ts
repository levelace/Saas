import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, rateLimit } from '@/lib/utils'
import { sendWelcomeEmail } from '@/lib/email'

const schema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(100).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and a number'
  ),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const { success } = rateLimit(`register:${ip}`, 5, 60_000)
  if (!success) return apiError('Too many attempts. Try again in a minute.', 429)

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.errors[0].message, 422)

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existing) return apiError('An account with this email already exists.', 409)

  const hashed = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashed,
    },
  })

  // Welcome email (non-blocking)
  sendWelcomeEmail({ email: user.email, name: user.name }).catch(console.error)

  return apiSuccess({ message: 'Account created' }, 201)
}
