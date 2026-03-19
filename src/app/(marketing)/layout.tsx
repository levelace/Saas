import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 grid-texture pointer-events-none z-0" />
      <Nav />
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  )
}
