import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-28 pb-20 overflow-hidden">
      {/* Glows */}
      <div className="absolute top-[-200px] right-[-200px] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(245,166,35,0.07)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(59,232,192,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber/10 border border-amber/20 rounded-sm font-mono text-[0.7rem] tracking-[0.15em] text-amber uppercase mb-8 animate-fade-up"
          style={{ animationDelay: '0ms' }}
        >
          <span className="text-[0.5rem]">▶</span>
          LEVELACE SENTINEL LLC — est. 2024
        </div>

        <h1
          className="font-syne font-extrabold leading-[0.95] tracking-tight mb-7 animate-fade-up"
          style={{ fontSize: 'clamp(3rem,7.5vw,6.8rem)', animationDelay: '80ms' }}
        >
          <span className="block" style={{ WebkitTextStroke: '1px rgba(240,242,247,0.25)', color: 'transparent' }}>
            INTELLIGENCE
          </span>
          <span className="block text-white">SECURITY &</span>
          <span className="block text-amber">ASSURANCE</span>
        </h1>

        <p
          className="text-muted font-light text-[1.05rem] leading-relaxed max-w-xl mb-11 animate-fade-up"
          style={{ animationDelay: '160ms' }}
        >
          Enterprise-grade cybersecurity SaaS, fraud risk intelligence, and revenue assurance infrastructure — engineered for organizations that cannot afford to be wrong.
        </p>

        <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '240ms' }}>
          <Link href="#flagship" className="btn-primary">
            Explore Fraud Risk Platform
          </Link>
          <Link href="#contact" className="btn-ghost">
            Request Demo
          </Link>
        </div>

        <div className="flex flex-wrap gap-10 mt-16 animate-fade-up" style={{ animationDelay: '320ms' }}>
          {[
            { num: 'T1', label: 'Security Tier' },
            { num: '99.9%', label: 'Uptime SLA' },
            { num: '24/7', label: 'Monitoring' },
            { num: 'SOC2', label: 'Aligned' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="font-syne font-extrabold text-3xl text-amber">{stat.num}</span>
              <span className="font-mono text-[0.72rem] tracking-[0.1em] uppercase text-muted">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
