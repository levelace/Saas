import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { analyzeFraudRisk } from '@/lib/fraud-engine'
import { apiSuccess, apiError, rateLimit, hashApiKey } from '@/lib/utils'

const schema = z.object({
  txId: z.string().min(1).max(100),
  amount: z.number().positive(),
  currency: z.string().length(3).optional().default('USD'),
  ipAddress: z.string().optional(),
  deviceId: z.string().optional(),
  country: z.string().optional(),
  billingCountry: z.string().optional(),
  email: z.string().email().optional(),
  metadata: z.record(z.unknown()).optional(),
})

async function resolveAuth(req: NextRequest): Promise<string | null> {
  // Try session first
  const session = await getServerSession(authOptions)
  if (session?.user?.id) return session.user.id

  // Try API key
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const key = authHeader.slice(7)
    const keyHash = hashApiKey(key)
    const apiKey = await prisma.apiKey.findUnique({
      where: { keyHash },
      include: { user: true },
    })
    if (apiKey && !apiKey.revoked && (!apiKey.expiresAt || apiKey.expiresAt > new Date())) {
      // Update last used
      prisma.apiKey.update({ where: { id: apiKey.id }, data: { lastUsed: new Date() } }).catch(() => {})
      return apiKey.userId
    }
  }

  return null
}

export async function POST(req: NextRequest) {
  const userId = await resolveAuth(req)
  if (!userId) return apiError('Authentication required', 401)

  // Rate limit per user
  const { success } = rateLimit(`fraud:${userId}`, 100, 60_000)
  if (!success) return apiError('Rate limit exceeded (100 req/min)', 429)

  // Check subscription allows API usage
  const subscription = await prisma.subscription.findUnique({ where: { userId } })
  if (!subscription || subscription.plan === 'FREE' || subscription.status !== 'ACTIVE') {
    return apiError('Active subscription required for fraud analysis', 403)
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.errors[0].message, 422)

  const tx = parsed.data

  // Get recent tx count for velocity scoring
  const recentCount = await prisma.fraudCase.count({
    where: {
      userId,
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }, // last hour
    },
  })

  const analysis = await analyzeFraudRisk(tx, recentCount)

  // Persist case
  const fraudCase = await prisma.fraudCase.create({
    data: {
      userId,
      txId: analysis.txId,
      amount: tx.amount,
      currency: tx.currency || 'USD',
      riskScore: analysis.riskScore,
      riskLevel: analysis.riskLevel,
      signals: analysis.signals as any,
      action: analysis.action,
      metadata: tx.metadata as any,
    },
  })

  return apiSuccess({
    caseId: fraudCase.id,
    txId: analysis.txId,
    riskScore: analysis.riskScore,
    riskLevel: analysis.riskLevel,
    action: analysis.action,
    signals: analysis.signals,
    reasoning: analysis.reasoning,
    processingMs: analysis.processingMs,
  })
}
