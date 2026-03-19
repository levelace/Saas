'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/toaster'

export function ContactSection() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', company: '', product: '', message: '',
  })

  const set = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }))

  async function submit() {
    if (!form.firstName || !form.email || !form.message) {
      toast('Please fill in all required fields.', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        toast('Message sent! We\'ll be in touch within 24 hours.', 'success')
        setForm({ firstName: '', lastName: '', email: '', company: '', product: '', message: '' })
      } else {
        toast(data.error || 'Something went wrong.', 'error')
      }
    } catch {
      toast('Failed to send. Please email us directly.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const contacts = [
    { icon: '✉', title: 'General Inquiries', value: 'hello@ilevelace.com', href: 'mailto:hello@ilevelace.com' },
    { icon: '🛠', title: 'Technical Support', value: 'support@ilevelace.com', href: 'mailto:support@ilevelace.com' },
    { icon: '💳', title: 'Billing & Accounts', value: 'billing@ilevelace.com', href: 'mailto:billing@ilevelace.com' },
    { icon: '⚖', title: 'Legal & Compliance', value: 'legal@ilevelace.com', href: 'mailto:legal@ilevelace.com' },
    { icon: '📍', title: 'Business Address', value: 'LEVELACE SENTINEL LLC\nUnited States of America', href: undefined },
  ]

  return (
    <section id="contact" className="relative z-10 px-6 md:px-12 py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left: info */}
        <div>
          <div className="section-label">Get in Touch</div>
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl leading-tight mb-4">
            Customer Support & Contact
          </h2>
          <p className="text-muted font-light text-base leading-relaxed max-w-lg mb-10">
            Our team is available to support onboarding, technical questions, billing, and compliance inquiries.
          </p>

          <div className="flex flex-col gap-3">
            {contacts.map((c) => (
              <div key={c.title} className="card-hover flex gap-4 items-start p-5 transition-colors duration-200">
                <div className="w-9 h-9 flex-shrink-0 bg-amber/10 border border-amber/15 rounded flex items-center justify-center text-base">
                  {c.icon}
                </div>
                <div>
                  <h4 className="font-syne font-bold text-sm mb-1">{c.title}</h4>
                  {c.href ? (
                    <a href={c.href} className="text-muted hover:text-amber text-sm transition-colors">{c.value}</a>
                  ) : (
                    <p className="text-muted text-sm whitespace-pre-line">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="card p-8">
          <div className="section-label mb-6">Request Demo</div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name *</label>
                <input className="input" placeholder="Jane" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
              </div>
              <div>
                <label className="label">Last Name *</label>
                <input className="input" placeholder="Doe" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Work Email *</label>
              <input className="input" type="email" placeholder="jane@company.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Company</label>
              <input className="input" placeholder="Acme Fintech Inc." value={form.company} onChange={(e) => set('company', e.target.value)} />
            </div>
            <div>
              <label className="label">Product Interest</label>
              <select className="input" value={form.product} onChange={(e) => set('product', e.target.value)}>
                <option value="">Select a product...</option>
                <option>Fraud Risk & Revenue Assurance Analyst</option>
                <option>Sentinel Vulnerability Lab</option>
                <option>OSINT & Recon Intelligence</option>
                <option>Compliance Advisory</option>
                <option>Enterprise / Custom</option>
              </select>
            </div>
            <div>
              <label className="label">Message *</label>
              <textarea className="input resize-y" rows={4} placeholder="Tell us about your use case..." value={form.message} onChange={(e) => set('message', e.target.value)} />
            </div>
            <button className="btn-primary w-full" onClick={submit} disabled={loading}>
              {loading ? 'Sending...' : 'Send Message →'}
            </button>
            <p className="text-muted/60 text-xs text-center">We typically respond within 24 hours on business days.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
