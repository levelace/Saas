'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/toaster'
import { formatDate } from '@/lib/utils'
import { Plus, Trash2, Copy, Eye, EyeOff, Key } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  prefix: string
  lastUsed: string | null
  expiresAt: string | null
  createdAt: string
}

export default function ApiKeysPage() {
  const { toast } = useToast()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', expiresIn: 'never' })

  useEffect(() => { fetchKeys() }, [])

  async function fetchKeys() {
    try {
      const res = await fetch('/api/keys')
      const data = await res.json()
      if (data.success) setKeys(data.data)
      else toast(data.error || 'Failed to load keys', 'error')
    } catch { toast('Network error', 'error') }
    finally { setLoading(false) }
  }

  async function createKey() {
    if (!form.name.trim()) { toast('Key name required', 'error'); return }
    setCreating(true)
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setNewKey(data.data.key)
        setShowForm(false)
        setForm({ name: '', expiresIn: 'never' })
        fetchKeys()
        toast('API key created — copy it now, it won\'t be shown again', 'info')
      } else {
        toast(data.error || 'Failed to create key', 'error')
      }
    } catch { toast('Network error', 'error') }
    finally { setCreating(false) }
  }

  async function revokeKey(id: string) {
    if (!confirm('Revoke this API key? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/keys?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setKeys((prev) => prev.filter((k) => k.id !== id))
        toast('Key revoked', 'success')
      } else toast(data.error || 'Failed to revoke', 'error')
    } catch { toast('Network error', 'error') }
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key)
    toast('Copied to clipboard', 'success')
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* New key reveal */}
      {newKey && (
        <div className="p-5 bg-cyan/8 border border-cyan/25 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-syne font-bold text-sm text-cyan">✓ New API Key Created — Save This Now</span>
            <button onClick={() => setNewKey(null)} className="text-muted hover:text-white text-xs">✕ Dismiss</button>
          </div>
          <p className="text-muted text-xs mb-3 font-light">This key will only be shown once. Copy and store it securely.</p>
          <div className="flex items-center gap-3 bg-[#0a0c10] border border-border rounded px-4 py-3">
            <code className="font-mono text-xs text-white flex-1 break-all">{newKey}</code>
            <button onClick={() => copyKey(newKey)} className="text-muted hover:text-amber transition-colors flex-shrink-0">
              <Copy size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-syne font-bold text-xl mb-1">API Keys</h2>
          <p className="text-muted text-sm font-light">Authenticate requests to the Fraud Risk API using Bearer tokens.</p>
        </div>
        <button
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
          onClick={() => { setShowForm(true); setNewKey(null) }}
        >
          <Plus size={14} /> New Key
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card p-6 space-y-4">
          <div className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-amber mb-1">▶ New API Key</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Key Name</label>
              <input
                className="input"
                placeholder="e.g. Production, Staging, Testing"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Expires</label>
              <select
                className="input"
                value={form.expiresIn}
                onChange={(e) => setForm((p) => ({ ...p, expiresIn: e.target.value }))}
              >
                <option value="never">Never</option>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
                <option value="1y">1 Year</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn-primary text-xs py-2.5 px-5" onClick={createKey} disabled={creating}>
              {creating ? 'Creating...' : 'Create Key'}
            </button>
            <button className="btn-ghost text-xs py-2.5 px-5" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Keys list */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted text-sm">Loading keys...</div>
        ) : keys.length === 0 ? (
          <div className="p-12 text-center">
            <Key size={32} className="text-muted mx-auto mb-4" />
            <p className="text-muted text-sm font-light mb-4">No API keys yet. Create one to start making authenticated requests.</p>
            <button className="btn-primary text-xs py-2.5 px-5" onClick={() => setShowForm(true)}>
              Create First Key
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Name', 'Key Prefix', 'Last Used', 'Expires', 'Created', ''].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-mono text-[0.62rem] tracking-[0.1em] uppercase text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-card/40 transition-colors">
                  <td className="px-5 py-4 font-syne font-semibold text-sm">{k.name}</td>
                  <td className="px-5 py-4 font-mono text-xs text-amber">{k.prefix}••••••••</td>
                  <td className="px-5 py-4 text-muted text-xs">{k.lastUsed ? formatDate(k.lastUsed) : 'Never'}</td>
                  <td className="px-5 py-4 text-xs">
                    {k.expiresAt ? (
                      <span className={new Date(k.expiresAt) < new Date() ? 'text-red' : 'text-muted'}>
                        {formatDate(k.expiresAt)}
                      </span>
                    ) : (
                      <span className="text-cyan text-[0.65rem] font-mono">Never</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-muted text-xs">{formatDate(k.createdAt)}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => revokeKey(k.id)}
                      className="text-muted hover:text-red transition-colors"
                      title="Revoke key"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Usage example */}
      <div className="card p-6">
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted mb-4">Usage</div>
        <div className="bg-[#0a0c10] border border-border-bright rounded p-4 font-mono text-xs leading-loose overflow-x-auto">
          <div className="text-muted"># Include in Authorization header</div>
          <div><span className="text-amber">Authorization:</span> <span className="text-cyan">Bearer lv_live_your_key_here</span></div>
          <div className="mt-3 text-muted"># Example request</div>
          <div><span className="text-amber">POST</span> <span className="text-white">https://ilevelace.com/api/fraud/analyze</span></div>
        </div>
      </div>
    </div>
  )
}
