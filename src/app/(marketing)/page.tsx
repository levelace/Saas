import type { Metadata } from 'next'
import Link from 'next/link'
import { HeroSection } from '@/components/sections/hero'
import { ProductsSection } from '@/components/sections/products'
import { FlagshipSection } from '@/components/sections/flagship'
import { PoliciesSection } from '@/components/sections/policies'
import { ContactSection } from '@/components/sections/contact'

export const metadata: Metadata = {
  title: 'LEVELACE — Sentinel Intelligence Platform',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Trust bar */}
      <div className="relative z-10 bg-card border-y border-border px-6 md:px-12 py-5 flex items-center gap-8 overflow-x-auto">
        <span className="font-mono text-[0.65rem] tracking-[0.12em] text-muted uppercase whitespace-nowrap flex-shrink-0">
          Trusted by
        </span>
        <div className="flex items-center gap-8 md:gap-12">
          {[
            'Financial Institutions',
            'Fintech Platforms',
            'E-Commerce Operators',
            'Enterprise Security Teams',
            'HackerOne Verified Research',
          ].map((label) => (
            <span key={label} className="flex items-center gap-2 text-muted text-sm whitespace-nowrap">
              <span className="text-cyan font-bold">✓</span> {label}
            </span>
          ))}
        </div>
      </div>

      <ProductsSection />
      <FlagshipSection />

      <div className="h-px bg-border mx-6 md:mx-12" />

      <PoliciesSection />
      <ContactSection />
    </>
  )
}
