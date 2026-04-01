import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/chat/:path*',
    '/marketplace/:path*',
    '/agents/:path*',
    '/research/:path*',
    '/admin/:path*',
    '/api/v1/admin/:path*',
  ],
}
