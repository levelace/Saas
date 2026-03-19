import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (session) redirect('/dashboard')

  return (
    <div className="relative min-h-screen bg-black">
      <div className="fixed inset-0 grid-texture pointer-events-none z-0" />
      <div className="fixed top-[-300px] right-[-200px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(245,166,35,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
