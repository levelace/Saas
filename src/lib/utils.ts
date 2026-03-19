import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createHash, randomBytes } from 'crypto'

// ─── CLASSNAMES ───────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── API KEY GENERATION ───────────────────────────────────────────────────────
export function generateApiKey(): { key: string; hash: string; prefix: string } {
  const raw = `lv_live_${randomBytes(32).toString('hex')}`
  const hash = createHash('sha256').update(raw).digest('hex')
  const prefix = raw.slice(0, 15) // "lv_live_" + 7 chars
  return { key: raw, hash, prefix }
}

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

// ─── RATE LIMITING (in-memory, use Upstash Redis in production) ───────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  identifier: string,
  limit = 10,
  windowMs = 60_000
): { success: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 }
  }

  entry.count++
  return { success: true, remaining: limit - entry.count }
}

// ─── API RESPONSE HELPERS ─────────────────────────────────────────────────────
export function apiSuccess<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status })
}

export function apiError(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status })
}

// ─── FORMAT HELPERS ───────────────────────────────────────────────────────────
export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(date))
}

export function riskColor(level: string) {
  switch (level) {
    case 'CRITICAL': return 'text-red-400'
    case 'HIGH': return 'text-orange-400'
    case 'MEDIUM': return 'text-yellow-400'
    default: return 'text-cyan'
  }
}

export function riskBg(level: string) {
  switch (level) {
    case 'CRITICAL': return 'bg-red-500/10 border-red-500/20'
    case 'HIGH': return 'bg-orange-500/10 border-orange-500/20'
    case 'MEDIUM': return 'bg-yellow-500/10 border-yellow-500/20'
    default: return 'bg-cyan/10 border-cyan/20'
  }
}
