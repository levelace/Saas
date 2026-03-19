import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative z-10 bg-black border-t border-border pt-16 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 font-syne font-extrabold text-lg tracking-[0.1em] mb-4">
              <span className="w-2 h-2 rounded-full bg-amber animate-pulse-dot" />
              LEVELACE
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-sm font-light">
              LEVELACE SENTINEL LLC — Enterprise fraud risk intelligence, security research, and revenue assurance infrastructure for organizations that cannot afford to be wrong.
            </p>
            <p className="text-muted/50 text-xs mt-4">ilevelace.com</p>
          </div>

          <div>
            <h4 className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted mb-5">Products</h4>
            <ul className="flex flex-col gap-3">
              {[
                ['/#flagship', 'Fraud Risk Analyst'],
                ['/#products', 'Sentinel Lab'],
                ['/#products', 'OSINT Intelligence'],
                ['/#products', 'Sentinel API'],
              ].map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="text-muted hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted mb-5">Company</h4>
            <ul className="flex flex-col gap-3">
              {[
                ['/pricing', 'Pricing'],
                ['/#contact', 'Contact'],
                ['/#policies', 'Policies'],
                ['/auth/register', 'Sign Up'],
              ].map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="text-muted hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-muted/60 text-xs">© 2024–2026 LEVELACE SENTINEL LLC. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            {[
              ['/terms', 'Terms of Service'],
              ['/privacy', 'Privacy Policy'],
              ['/#policies', 'Refund Policy'],
              ['mailto:legal@ilevelace.com', 'Legal Contact'],
            ].map(([href, label]) => (
              <Link key={label} href={href} className="text-muted/60 hover:text-white text-xs transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
