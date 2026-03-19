import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Admin-only routes
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        // Protect /dashboard routes
        if (pathname.startsWith('/dashboard')) return !!token
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
