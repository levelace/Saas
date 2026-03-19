import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return apiError('Authentication required', 401)

  const userId = session.user.id
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalCases,
    casesLast30,
    casesLast7,
    byRiskLevel,
    byAction,
    recentCases,
    avgScore,
  ] = await Promise.all([
    prisma.fraudCase.count({ where: { userId } }),
    prisma.fraudCase.count({ where: { userId, createdAt: { gte: thirtyDaysAgo } } }),
    prisma.fraudCase.count({ where: { userId, createdAt: { gte: sevenDaysAgo } } }),
    prisma.fraudCase.groupBy({
      by: ['riskLevel'],
      where: { userId },
      _count: true,
    }),
    prisma.fraudCase.groupBy({
      by: ['action'],
      where: { userId },
      _count: true,
    }),
    prisma.fraudCase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.fraudCase.aggregate({
      where: { userId },
      _avg: { riskScore: true },
    }),
  ])

  // Daily volume for chart (last 14 days)
  const dailyVolume = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
    SELECT DATE(created_at)::text as date, COUNT(*)::bigint as count
    FROM "FraudCase"
    WHERE user_id = ${userId}
      AND created_at >= NOW() - INTERVAL '14 days'
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `

  return apiSuccess({
    summary: {
      totalCases,
      casesLast30,
      casesLast7,
      avgRiskScore: Math.round(avgScore._avg.riskScore || 0),
    },
    byRiskLevel: Object.fromEntries(byRiskLevel.map((r) => [r.riskLevel, r._count])),
    byAction: Object.fromEntries(byAction.map((a) => [a.action, a._count])),
    recentCases,
    dailyVolume: dailyVolume.map((d) => ({ date: d.date, count: Number(d.count) })),
  })
}
