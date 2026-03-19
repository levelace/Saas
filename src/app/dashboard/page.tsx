import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, AlertTriangle, Activity } from 'lucide-react'

async function getStats(userId: string) {
  const now = new Date()
  const thirtyAgo = new Date(now.getTime() - 30 * 86400000)
  const sevenAgo = new Date(now.getTime() - 7 * 86400000)

  const [total, last30, last7, byLevel, recent, avgScore, sub] = await Promise.all([
    prisma.fraudCase.count({ where: { userId } }),
    prisma.fraudCase.count({ where: { userId, createdAt: { gte: thirtyAgo } } }),
    prisma.fraudCase.count({ where: { userId, createdAt: { gte: sevenAgo } } }),
    prisma.fraudCase.groupBy({ by: ['riskLevel'], where: { userId }, _count: true }),
    prisma.fraudCase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.fraudCase.aggregate({ where: { userId }, _avg: { riskScore: true } }),
    prisma.subscription.findUnique({ where: { userId } }),
  ])

  return { total, last30, last7, byLevel, recent, avgScore: Math.round(avgScore._avg.riskScore || 0), sub }
}

const riskBadge: Record<string, string> = {
  CRITICAL: 'risk-critical',
  HIGH: 'risk-high',
  MEDIUM: 'risk-medium',
  LOW: 'risk-low',
}

const actionColor: Record<string, string> = {
  BLOCK: 'text-red',
  HOLD: 'text-amber',
  REVIEW: 'text-yellow-400',
  APPROVE: 'text-cyan',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)!
  const { total, last30, last7, byLevel, recent, avgScore, sub } = await getStats(session!.user.id)

  const byLevelMap = Object.fromEntries(byLevel.map((b) => [b.riskLevel, b._count]))
  const hasPlan = sub?.status === 'ACTIVE' && sub.plan !== 'FREE'

  const statCards = [
    { label: 'Total Cases', value: total.toLocaleString(), icon: Shield, delta: null },
    { label: 'Last 30 Days', value: last30.toLocaleString(), icon: TrendingUp, delta: null },
    { label: 'Last 7 Days', value: last7.toLocaleString(), icon: Activity, delta: null },
    { label: 'Avg Risk Score', value: `${avgScore}/100`, icon: AlertTriangle, delta: null },
  ]

  return (
    <div className="max-w-7xl space-y-8">
      {/* Plan banner */}
      {!hasPlan && (
        <div className="flex items-center justify-between p-4 bg-amber/8 border border-amber/20 rounded-lg">
          <div>
            <p className="font-syne font-bold text-sm text-amber mb-0.5">Activate your plan to start analyzing transactions</p>
            <p className="text-muted text-xs font-light">Upgrade to Starter or Professional to unlock fraud risk analysis and API access.</p>
          </div>
          <Link href="/pricing" className="btn-primary text-xs py-2 px-4 flex-shrink-0 ml-4">
            Upgrade Now
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted">{label}</span>
              <div className="w-7 h-7 bg-amber/8 border border-amber/15 rounded flex items-center justify-center">
                <Icon size={13} className="text-amber" />
              </div>
            </div>
            <div className="font-syne font-extrabold text-2xl">{value}</div>
          </div>
        ))}
      </div>

      {/* Risk distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted mb-5">Risk Distribution</div>
          <div className="space-y-3">
            {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((level) => {
              const count = byLevelMap[level] || 0
              const pct = total ? Math.round((count / total) * 100) : 0
              return (
                <div key={level}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-mono text-[0.65rem] tracking-wider uppercase ${
                      level === 'CRITICAL' ? 'text-red' :
                      level === 'HIGH' ? 'text-orange-400' :
                      level === 'MEDIUM' ? 'text-yellow-400' : 'text-cyan'
                    }`}>{level}</span>
                    <span className="text-muted text-xs">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        level === 'CRITICAL' ? 'bg-red' :
                        level === 'HIGH' ? 'bg-orange-400' :
                        level === 'MEDIUM' ? 'bg-yellow-400' : 'bg-cyan'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick start / API info */}
        <div className="lg:col-span-2 card p-6">
          <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted mb-5">Quick Start — API</div>
          <div className="bg-[#0a0c10] border border-border-bright rounded-lg p-4 font-mono text-xs leading-relaxed overflow-x-auto">
            <div className="text-muted mb-1"># Analyze a transaction</div>
            <div className="text-amber">curl</div>
            <div className="text-white pl-2">-X POST https://ilevelace.com/api/fraud/analyze \</div>
            <div className="text-white pl-2">-H <span className="text-cyan">"Authorization: Bearer lv_live_..."</span> \</div>
            <div className="text-white pl-2">-H <span className="text-cyan">"Content-Type: application/json"</span> \</div>
            <div className="text-white pl-2">-d <span className="text-cyan">'{`{"txId":"TX_001","amount":1250,"country":"US"}`}'</span></div>
            <div className="mt-3 text-muted"># Response</div>
            <div className="text-cyan">{'{ "riskScore": 24, "riskLevel": "LOW", "action": "APPROVE" }'}</div>
          </div>
          <div className="mt-4 flex gap-3">
            <Link href="/dashboard/api-keys" className="btn-ghost text-xs py-2 px-4">Manage API Keys</Link>
            <Link href="/docs" className="btn-ghost text-xs py-2 px-4">View Docs</Link>
          </div>
        </div>
      </div>

      {/* Recent cases */}
      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted">Recent Cases</div>
          <Link href="/dashboard/cases" className="flex items-center gap-1.5 text-amber text-xs hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted text-sm font-light">
            No fraud cases yet. Start by submitting a transaction to the analyze endpoint.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-card/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs text-white truncate">{c.txId}</span>
                    <span className={`px-2 py-0.5 rounded-sm font-mono text-[0.6rem] tracking-wider uppercase border ${riskBadge[c.riskLevel]}`}>
                      {c.riskLevel}
                    </span>
                  </div>
                  <span className="text-muted text-xs">{formatDate(c.createdAt)}</span>
                </div>
                <div className="text-right">
                  <div className="font-syne font-bold text-sm">{formatCurrency(c.amount, c.currency)}</div>
                  <div className={`text-xs font-mono ${actionColor[c.action]}`}>{c.action}</div>
                </div>
                <div className="text-right w-16">
                  <div className="font-syne font-bold text-lg">{c.riskScore}</div>
                  <div className="text-muted text-[0.65rem]">score</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
