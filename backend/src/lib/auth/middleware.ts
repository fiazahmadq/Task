import { auth } from '@/lib/auth/next-auth'
import { getBearerAuthUser } from '@/lib/auth/api-auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function requireAuth(req: NextRequest) {
  const session = await auth()
  const bearer = await getBearerAuthUser(req)
  if (!session?.user && !bearer) {
    return NextResponse.json(
      { error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
      { status: 401 }
    )
  }
  return null
}

export async function requireAdmin(req: NextRequest) {
  const session = await auth()
  const bearer = await getBearerAuthUser(req)
  if (!session?.user && !bearer) {
    return NextResponse.json(
      { error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
      { status: 401 }
    )
  }
  const role = session?.user?.role ?? bearer?.role
  if (role !== 'admin') {
    return NextResponse.json(
      { error: { message: 'Forbidden', code: 'FORBIDDEN' } },
      { status: 403 }
    )
  }
  return null
}
