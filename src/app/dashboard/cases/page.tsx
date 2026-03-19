'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toaster'
import { Filter, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'

type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
type CaseStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ESCALATED' | 'CLOSED'

interface FraudCase {
  id: string
  txId: string
  amount: number
  currency: string
  riskScore: number
  riskLevel: RiskLevel
  action: string
  status: CaseStatus
  createdAt: string
}

const riskBadge: Record<RiskLevel, string> = {
  CRITICAL: 'risk-critical',
  HIGH: 'risk-high',
  MEDIUM: 'risk-medium',
  LOW: 'risk-low',
}

const actionColor: Record<string, string> = {
  BLOCK: 'text-red', HOLD: 'text-amber', REVIEW: 'text-yellow-400', APPROVE: 'text-cyan',
}

const statusColor: Record<CaseStatus, string> = {
  OPEN: 'text-white', INVESTIGATING: 'text-amber', RESOLVED: 'text-cyan',
  ESCALATED: 'text-red', CLOSED: 'text-muted',
}

export default function CasesPage() {
  const { toast } = useToast()
  const [cases, setCases] = useState<FraudCase[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [riskLevel, setRiskLevel] = useState('')
  const [status, setStatus] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchCases = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' })
      if (riskLevel) params.set('riskLevel', riskLevel)
      if (status) params.set('status', status)
      const res = await fetch(`/api/fraud/cases?${params}`)
      const data = await res.json()
      if (data.success) {
        setCases(data.data.cases)
        setTotal(data.data.total)
        setPages(data.data.pages)
      }
    } catch {
      toast('Failed to load cases', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, riskLevel, status])

  useEffect(() => { fetchCases() }, [fetchCases])

  async function updateStatus(caseId: string, newStatus: CaseStatus) {
    setUpdating(caseId)
    try {
      const res = await fetch('/api/fraud/cases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setCases((prev) => prev.map((c) => c.id === caseId ? { ...c, status: newStatus } : c))
        toast('Case updated', 'success')
      }
    } catch {
      toast('Failed to update case', 'error')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="max-w-7xl space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-muted">
          <Filter size={14} />
          <span className="font-mono text-[0.65rem] tracking-wider uppercase">Filters</span>
        </div>

        <select
          className="input w-auto text-xs py-2 px-3"
          value={riskLevel}
          onChange={(e) => { setRiskLevel(e.target.value); setPage(1) }}
        >
          <option value="">All Risk Levels</option>
          {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <select
          className="input w-auto text-xs py-2 px-3"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
        >
          <option value="">All Statuses</option>
          {['OPEN', 'INVESTIGATING', 'RESOLVED', 'ESCALATED', 'CLOSED'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <button onClick={fetchCases} className="flex items-center gap-2 text-muted hover:text-white text-xs transition-colors ml-auto">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>

        <span className="text-muted text-xs font-mono">{total.toLocaleString()} total</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Transaction ID', 'Amount', 'Risk Score', 'Risk Level', 'Action', 'Status', 'Date', 'Update'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-mono text-[0.62rem] tracking-[0.1em] uppercase text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3 bg-border rounded animate-pulse w-16" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted text-sm font-light">
                    No cases found matching your filters.
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} className="hover:bg-card/40 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-white">{c.txId}</td>
                    <td className="px-5 py-4 font-syne font-bold text-sm">{formatCurrency(c.amount, c.currency)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.riskScore >= 75 ? 'bg-red' :
                              c.riskScore >= 55 ? 'bg-orange-400' :
                              c.riskScore >= 30 ? 'bg-yellow-400' : 'bg-cyan'
                            }`}
                            style={{ width: `${c.riskScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs">{c.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-sm font-mono text-[0.6rem] tracking-wider uppercase border ${riskBadge[c.riskLevel]}`}>
                        {c.riskLevel}
                      </span>
                    </td>
                    <td className={`px-5 py-4 font-mono text-xs ${actionColor[c.action]}`}>{c.action}</td>
                    <td className={`px-5 py-4 font-mono text-xs ${statusColor[c.status]}`}>{c.status}</td>
                    <td className="px-5 py-4 text-muted text-xs">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-4">
                      <select
                        className="bg-transparent border border-border rounded px-2 py-1 text-xs text-muted hover:border-border-bright transition-colors cursor-pointer outline-none"
                        value={c.status}
                        disabled={updating === c.id}
                        onChange={(e) => updateStatus(c.id, e.target.value as CaseStatus)}
                      >
                        {['OPEN', 'INVESTIGATING', 'RESOLVED', 'ESCALATED', 'CLOSED'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border">
            <span className="text-muted text-xs">Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-1 text-muted hover:text-white text-xs transition-colors disabled:opacity-30"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                className="flex items-center gap-1 text-muted hover:text-white text-xs transition-colors disabled:opacity-30"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
