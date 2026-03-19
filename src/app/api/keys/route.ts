import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, generateApiKey } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return apiError('Authentication required', 401)

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id, revoked: false },
    select: { id: true, name: true, prefix: true, lastUsed: true, expiresAt: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  return apiSuccess(keys)
}

const createSchema = z.object({
  name: z.string().min(1).max(60),
  expiresIn: z.enum(['never', '30d', '90d', '1y']).default('never'),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return apiError('Authentication required', 401)

  // Check subscription
  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } })
  if (!subscription || subscription.plan === 'FREE' || subscription.status !== 'ACTIVE') {
    return apiError('Active subscription required to create API keys', 403)
  }

  const count = await prisma.apiKey.count({ where: { userId: session.user.id, revoked: false } })
  if (count >= 10) return apiError('Maximum of 10 API keys allowed', 400)

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.errors[0].message, 422)

  const { name, expiresIn } = parsed.data

  const expiresAt = expiresIn === 'never' ? null
    : expiresIn === '30d' ? new Date(Date.now() + 30 * 86400000)
    : expiresIn === '90d' ? new Date(Date.now() + 90 * 86400000)
    : new Date(Date.now() + 365 * 86400000)

  const { key, hash, prefix } = generateApiKey()

  await prisma.apiKey.create({
    data: {
      userId: session.user.id,
      name,
      keyHash: hash,
      prefix,
      expiresAt,
    },
  })

  // Return raw key ONCE — never stored
  return apiSuccess({ key, prefix, name }, 201)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return apiError('Authentication required', 401)

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return apiError('Key ID required', 400)

  const key = await prisma.apiKey.findFirst({ where: { id, userId: session.user.id } })
  if (!key) return apiError('Key not found', 404)

  await prisma.apiKey.update({ where: { id }, data: { revoked: true } })
  return apiSuccess({ message: 'Key revoked' })
}
