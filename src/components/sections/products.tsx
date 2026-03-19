const products = [
  {
    icon: '⚠',
    tag: 'Tier 1 — Active',
    tagStyle: 'text-red bg-red/10 border-red/20',
    name: 'Fraud Risk & Revenue Assurance Analyst',
    desc: 'Real-time fraud signal detection, transaction anomaly scoring, and revenue leakage prevention for financial and fintech operators.',
    features: ['Multi-source risk scoring engine', 'Real-time transaction monitoring', 'Chargeback & dispute intelligence', 'Revenue reconciliation dashboard', 'Automated compliance reporting'],
    flagship: true,
  },
  {
    icon: '🛡',
    tag: 'Security Research',
    tagStyle: 'text-amber bg-amber/10 border-amber/20',
    name: 'Sentinel Vulnerability Lab',
    desc: 'Authorized penetration testing, WAF bypass research, and adversary simulation for enterprise security teams and bug bounty programs.',
    features: ['Web application security audits', 'HackerOne-aligned disclosure reports', 'WAF/IDS evasion research', 'OAuth & redirect flow analysis'],
  },
  {
    icon: '🔍',
    tag: 'Intelligence',
    tagStyle: 'text-amber bg-amber/10 border-amber/20',
    name: 'OSINT & Recon Intelligence',
    desc: 'Deep-trace digital asset discovery, threat actor attribution, and external attack surface mapping using advanced reconnaissance.',
    features: ['Certificate transparency monitoring', 'BGP & infrastructure pivoting', 'Subdomain & asset enumeration', 'Threat profile construction'],
  },
  {
    icon: '📋',
    tag: 'Coming Soon',
    tagStyle: 'text-cyan bg-cyan/10 border-cyan/20',
    name: 'Compliance & Risk Advisory',
    desc: 'KYC/AML compliance consulting, security posture assessments, and regulatory alignment for fintechs and payment platforms.',
    features: ['PCI-DSS gap analysis', 'AML policy framework design', 'Risk register management', 'Regulatory reporting assistance'],
  },
  {
    icon: '🎯',
    tag: 'Coming Soon',
    tagStyle: 'text-cyan bg-cyan/10 border-cyan/20',
    name: 'Security Awareness Platform',
    desc: 'Phishing simulation, social engineering awareness training, and human-layer security testing — authorized and responsible.',
    features: ['Simulated phishing campaigns', 'Employee awareness scoring', 'Executive-facing risk reporting', 'Custom training modules'],
  },
  {
    icon: '⚡',
    tag: 'Developer',
    tagStyle: 'text-amber bg-amber/10 border-amber/20',
    name: 'Sentinel API',
    desc: 'Programmatic access to fraud scoring, threat intelligence feeds, and security signal enrichment for developers building secure applications.',
    features: ['RESTful fraud scoring endpoints', 'Webhook-based alert delivery', 'IP/device reputation lookups', 'SDKs for Python, JS, Go'],
  },
]

export function ProductsSection() {
  return (
    <section id="products" className="relative z-10 bg-surface px-6 md:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="section-label">Products & Services</div>
        <h2 className="font-syne font-extrabold text-4xl md:text-5xl leading-tight mb-4">
          A complete suite of security intelligence tools
        </h2>
        <p className="text-muted font-light text-base leading-relaxed max-w-xl mb-14">
          From fraud detection to adversary simulation, LEVELACE delivers production-ready SaaS products built for high-stakes environments.
        </p>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden"
        >
          {products.map((p) => (
            <div
              key={p.name}
              className={`relative p-10 transition-colors duration-200 group ${
                p.flagship ? 'bg-[#0f1118]' : 'bg-card hover:bg-[#141820]'
              }`}
            >
              {/* Left accent */}
              <div className={`absolute left-0 top-0 w-[3px] h-full bg-amber transition-opacity duration-200 ${
                p.flagship ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} />

              <div className="w-11 h-11 bg-amber/10 border border-amber/20 rounded-md flex items-center justify-center text-xl mb-6">
                {p.icon}
              </div>

              <span className={`inline-block px-2.5 py-0.5 border rounded-sm font-mono text-[0.62rem] tracking-[0.12em] uppercase mb-4 ${p.tagStyle}`}>
                {p.tag}
              </span>

              <h3 className="font-syne font-bold text-[1.1rem] leading-snug mb-3">{p.name}</h3>
              <p className="text-muted text-sm leading-relaxed font-light mb-6">{p.desc}</p>

              <ul className="flex flex-col gap-2">
                {p.features.map((f) => (
                  <li key={f} className="text-muted text-xs flex items-start gap-2">
                    <span className="text-amber/70 mt-0.5 flex-shrink-0">→</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
