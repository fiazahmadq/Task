import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(req: NextRequest) {
  // Add CORS headers for all requests
  const response = NextResponse.next()
  
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:4000',
  ]
  
  const origin = req.headers.get('origin') || ''
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  if (req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
  return response
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
