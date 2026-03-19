import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return apiError('Authentication required', 401)

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'))
  const riskLevel = searchParams.get('riskLevel') || undefined
  const status = searchParams.get('status') || undefined

  const where: any = { userId: session.user.id }
  if (riskLevel) where.riskLevel = riskLevel
  if (status) where.status = status

  const [cases, total] = await Promise.all([
    prisma.fraudCase.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { events: { orderBy: { createdAt: 'desc' }, take: 1 } },
    }),
    prisma.fraudCase.count({ where }),
  ])

  return apiSuccess({ cases, total, page, pages: Math.ceil(total / limit) })
}

const updateSchema = z.object({
  caseId: z.string(),
  status: z.enum(['OPEN', 'INVESTIGATING', 'RESOLVED', 'ESCALATED', 'CLOSED']).optional(),
  note: z.string().max(500).optional(),
})

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return apiError('Authentication required', 401)

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.errors[0].message, 422)

  const { caseId, status, note } = parsed.data

  const fraudCase = await prisma.fraudCase.findFirst({
    where: { id: caseId, userId: session.user.id },
  })
  if (!fraudCase) return apiError('Case not found', 404)

  const updated = await prisma.fraudCase.update({
    where: { id: caseId },
    data: { ...(status && { status }) },
  })

  if (note || status) {
    await prisma.caseEvent.create({
      data: {
        caseId,
        type: status ? 'STATUS_CHANGE' : 'NOTE',
        note: note || `Status changed to ${status}`,
      },
    })
  }

  return apiSuccess(updated)
}
