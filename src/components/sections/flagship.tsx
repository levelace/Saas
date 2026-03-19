import Link from 'next/link'

const points = [
  { icon: '🔴', title: 'Real-Time Risk Scoring', desc: 'Multi-dimensional fraud signals evaluated at transaction time using behavioral, device, network, and velocity indicators.' },
  { icon: '📊', title: 'Revenue Assurance Dashboard', desc: 'Full-cycle visibility into payment flows, reconciliation gaps, and leakage sources across merchant and gateway layers.' },
  { icon: '🔒', title: 'Dispute & Chargeback Intelligence', desc: 'Proactively identifies dispute-prone transactions and automates evidence compilation for chargeback defense workflows.' },
  { icon: '🤖', title: 'Automated Compliance Reporting', desc: 'Generates audit-ready reports aligned with KYC, AML, and PCI-DSS frameworks — reducing analyst workload by up to 70%.' },
]

const terminalLines = [
  { type: 'cmd', content: 'analyze --tx TXN_8847FA --mode full' },
  { type: 'divider' },
  { type: 'amber', content: '[ LEVELACE SENTINEL ] Fraud Risk Engine v2.1' },
  { type: 'divider' },
  { type: 'muted', content: 'Transaction: ', value: 'TXN_8847FA' },
  { type: 'muted', content: 'Amount:      ', value: '$4,820.00' },
  { type: 'muted', content: 'Merchant:    ', value: 'E-COMM VENDOR #12' },
  { type: 'space' },
  { type: 'cmd', content: 'risk-signals --check all' },
  { type: 'green', content: '✓ Device fingerprint    [KNOWN]' },
  { type: 'green', content: '✓ IP reputation         [CLEAN]' },
  { type: 'red', content: '✗ Velocity anomaly      [FLAGGED]' },
  { type: 'red', content: '✗ Geo mismatch          [HIGH-RISK]' },
  { type: 'amber', content: '~ Behavioral pattern    [REVIEW]' },
  { type: 'space' },
  { type: 'cmd', content: 'score --output' },
  { type: 'red', content: 'FRAUD RISK SCORE: 78/100 — HOLD FOR REVIEW' },
  { type: 'amber', content: 'ACTION: Route to analyst queue → Case #4471' },
  { type: 'cursor' },
]

export function FlagshipSection() {
  return (
    <section id="flagship" className="relative z-10 px-6 md:px-12 py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left */}
        <div>
          <div className="section-label">Flagship Product</div>
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl leading-tight mb-4">
            Fraud Risk & Revenue Assurance Analyst
          </h2>
          <p className="text-muted font-light text-base leading-relaxed max-w-lg mb-10">
            A Tier 1 SaaS intelligence platform purpose-built to detect, investigate, and prevent financial fraud while protecting revenue streams across payment pipelines.
          </p>

          <div className="flex flex-col gap-7 mb-10">
            {points.map((p) => (
              <div key={p.title} className="flex gap-4 items-start">
                <div className="w-9 h-9 flex-shrink-0 bg-amber/10 border border-amber/20 rounded flex items-center justify-center text-base">
                  {p.icon}
                </div>
                <div>
                  <h4 className="font-syne font-bold text-sm mb-1">{p.title}</h4>
                  <p className="text-muted text-sm font-light leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/auth/register" className="btn-primary">Request Early Access</Link>
            <Link href="/pricing" className="btn-ghost">View Pricing</Link>
          </div>
        </div>

        {/* Terminal */}
        <div className="bg-[#0a0c10] border border-border-bright rounded-lg overflow-hidden font-mono">
          <div className="bg-border px-4 py-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan" />
            <span className="ml-auto text-muted text-[0.65rem] tracking-wider">sentinel@levelace ~ fraud-risk-analyzer</span>
          </div>
          <div className="p-6 text-[0.75rem] leading-[1.9] space-y-0">
            {terminalLines.map((line, i) => {
              if (line.type === 'space') return <div key={i} className="h-2" />
              if (line.type === 'divider') return <div key={i} className="text-border">────────────────────────────────</div>
              if (line.type === 'cursor') return (
                <div key={i} className="flex gap-2">
                  <span className="text-amber">▶</span>
                  <span className="w-2 h-3.5 bg-amber inline-block animate-blink" />
                </div>
              )
              if (line.type === 'cmd') return (
                <div key={i} className="flex gap-2">
                  <span className="text-amber">▶</span>
                  <span className="text-white">{line.content}</span>
                </div>
              )
              if (line.type === 'muted') return (
                <div key={i} className="pl-5 text-muted">
                  {line.content}<span className="text-white">{line.value}</span>
                </div>
              )
              return (
                <div key={i} className={`pl-5 ${
                  line.type === 'green' ? 'text-cyan'
                  : line.type === 'red' ? 'text-red'
                  : line.type === 'amber' ? 'text-amber'
                  : 'text-muted'
                }`}>
                  {line.content}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
