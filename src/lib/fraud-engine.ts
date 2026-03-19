import { RiskLevel, CaseAction } from '@prisma/client'

export interface TransactionInput {
  txId: string
  amount: number
  currency?: string
  ipAddress?: string
  deviceId?: string
  userId?: string
  merchantId?: string
  country?: string
  billingCountry?: string
  email?: string
  metadata?: Record<string, unknown>
}

export interface RiskSignals {
  velocity: { score: number; flag: boolean; detail: string }
  geo: { score: number; flag: boolean; detail: string }
  device: { score: number; flag: boolean; detail: string }
  behavioral: { score: number; flag: boolean; detail: string }
  amount: { score: number; flag: boolean; detail: string }
}

export interface FraudAnalysis {
  txId: string
  riskScore: number
  riskLevel: RiskLevel
  action: CaseAction
  signals: RiskSignals
  reasoning: string[]
  processingMs: number
}

export async function analyzeFraudRisk(
  tx: TransactionInput,
  recentTxCount?: number
): Promise<FraudAnalysis> {
  const start = Date.now()
  const signals: RiskSignals = {
    velocity: scoreVelocity(recentTxCount),
    geo: scoreGeo(tx.country, tx.billingCountry),
    device: scoreDevice(tx.deviceId),
    behavioral: scoreBehavioral(tx.amount, tx.email),
    amount: scoreAmount(tx.amount),
  }

  // Weighted composite score
  const weights = { velocity: 0.25, geo: 0.2, device: 0.2, behavioral: 0.2, amount: 0.15 }
  const riskScore = Math.round(
    signals.velocity.score * weights.velocity +
    signals.geo.score * weights.geo +
    signals.device.score * weights.device +
    signals.behavioral.score * weights.behavioral +
    signals.amount.score * weights.amount
  )

  const riskLevel = getRiskLevel(riskScore)
  const action = getAction(riskLevel)
  const reasoning = buildReasoning(signals)

  return {
    txId: tx.txId,
    riskScore,
    riskLevel,
    action,
    signals,
    reasoning,
    processingMs: Date.now() - start,
  }
}

function scoreVelocity(recentCount = 0): RiskSignals['velocity'] {
  if (recentCount > 20) return { score: 90, flag: true, detail: 'Extreme velocity — 20+ tx in window' }
  if (recentCount > 10) return { score: 70, flag: true, detail: 'High velocity — 10+ tx in window' }
  if (recentCount > 5) return { score: 40, flag: false, detail: 'Moderate velocity — 5+ tx in window' }
  return { score: 10, flag: false, detail: 'Normal velocity' }
}

function scoreGeo(country?: string, billingCountry?: string): RiskSignals['geo'] {
  const highRiskCountries = ['XX', 'YY'] // placeholder — configure via env/db
  if (!country) return { score: 30, flag: false, detail: 'No geo data' }
  if (highRiskCountries.includes(country)) return { score: 85, flag: true, detail: `High-risk geo: ${country}` }
  if (country !== billingCountry && billingCountry)
    return { score: 60, flag: true, detail: `Geo mismatch: ${country} vs billing ${billingCountry}` }
  return { score: 5, flag: false, detail: `Clean geo: ${country}` }
}

function scoreDevice(deviceId?: string): RiskSignals['device'] {
  if (!deviceId) return { score: 50, flag: true, detail: 'No device fingerprint' }
  // In production: query device reputation DB
  return { score: 10, flag: false, detail: 'Known device fingerprint' }
}

function scoreBehavioral(amount: number, email?: string): RiskSignals['behavioral'] {
  // Disposable email domains
  const disposableDomains = ['tempmail.com', 'guerrillamail.com', 'mailinator.com', 'throwaway.email']
  if (email) {
    const domain = email.split('@')[1]?.toLowerCase()
    if (disposableDomains.includes(domain))
      return { score: 80, flag: true, detail: 'Disposable email domain detected' }
  }
  if (amount > 10000) return { score: 55, flag: true, detail: 'High-value transaction anomaly' }
  return { score: 15, flag: false, detail: 'Normal behavioral pattern' }
}

function scoreAmount(amount: number): RiskSignals['amount'] {
  if (amount > 50000) return { score: 90, flag: true, detail: `Extreme amount: $${amount.toLocaleString()}` }
  if (amount > 10000) return { score: 65, flag: true, detail: `High amount: $${amount.toLocaleString()}` }
  if (amount > 2500) return { score: 35, flag: false, detail: `Elevated amount: $${amount.toLocaleString()}` }
  return { score: 10, flag: false, detail: `Normal amount: $${amount.toLocaleString()}` }
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 75) return 'CRITICAL'
  if (score >= 55) return 'HIGH'
  if (score >= 30) return 'MEDIUM'
  return 'LOW'
}

function getAction(level: RiskLevel): CaseAction {
  switch (level) {
    case 'CRITICAL': return 'BLOCK'
    case 'HIGH': return 'HOLD'
    case 'MEDIUM': return 'REVIEW'
    default: return 'APPROVE'
  }
}

function buildReasoning(signals: RiskSignals): string[] {
  return Object.values(signals)
    .filter((s) => s.flag)
    .map((s) => s.detail)
}
