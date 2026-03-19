const policies = [
  {
    icon: '↩',
    title: 'Refund & Dispute Policy',
    body: 'Subscription fees are charged monthly in advance. You may request a refund within 7 days of the billing date if the platform has not been materially used. Disputes must be submitted in writing to billing@ilevelace.com. We aim to resolve all disputes within 10 business days. For annual plans, prorated refunds are available for unused months upon cancellation.',
  },
  {
    icon: '✕',
    title: 'Cancellation Policy',
    body: 'You may cancel your subscription at any time from your account dashboard or by emailing support@ilevelace.com. Cancellations take effect at the end of the current billing period — you retain full access until then. No penalties or exit fees apply. Data export tools are available for 30 days post-cancellation.',
  },
  {
    icon: '🔒',
    title: 'Terms & Conditions',
    body: 'By accessing LEVELACE services, you agree to use them solely for lawful purposes within your authorized operational scope. Unauthorized API abuse or use of outputs for illegal activity will result in immediate account termination. Full Terms of Service are available at ilevelace.com/terms.',
  },
  {
    icon: '🌍',
    title: 'Legal & Export Restrictions',
    body: 'LEVELACE services are subject to applicable export control laws and regulations. Services may not be used in jurisdictions under international sanctions or in violation of applicable trade compliance requirements. Users are responsible for ensuring compliance with local laws.',
  },
  {
    icon: '🔁',
    title: 'Service Level Agreement',
    body: 'Professional and Enterprise plans include a 99.9% monthly uptime SLA. In the event of an SLA breach, customers are entitled to service credits as outlined in their subscription agreement. Planned maintenance windows are announced at least 48 hours in advance.',
  },
  {
    icon: '📢',
    title: 'Promotions & Discounts',
    body: 'Promotional pricing, trial offers, and discount codes are valid only for the period specified at the time of offer. Promotions cannot be combined unless explicitly stated. Trial periods automatically convert to paid subscriptions unless cancelled before the trial end date. One trial per customer entity.',
  },
]

export function PoliciesSection() {
  return (
    <section id="policies" className="relative z-10 bg-surface px-6 md:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="section-label">Legal & Compliance</div>
        <h2 className="font-syne font-extrabold text-4xl md:text-5xl leading-tight mb-4">Policies & Terms</h2>
        <p className="text-muted font-light text-base leading-relaxed max-w-xl mb-14">
          LEVELACE SENTINEL LLC operates under transparent, legally-compliant terms. All policies are effective as of the date of service activation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((p) => (
            <div key={p.title} className="card-hover p-7 transition-colors duration-200">
              <h3 className="font-syne font-bold text-base mb-4 flex items-center gap-3">
                <span className="w-7 h-7 bg-amber/5 border border-amber/15 rounded flex items-center justify-center text-sm flex-shrink-0">
                  {p.icon}
                </span>
                {p.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed font-light">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
