import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login?callbackUrl=/dashboard')

  return (
    <div className="min-h-screen bg-black flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-60">
        <DashboardHeader user={session.user} />
        <main className="flex-1 px-6 md:px-8 py-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
