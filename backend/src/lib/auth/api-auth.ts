import type { NextRequest } from 'next/server'
import { verifyAuthToken } from './token'

export interface AuthUser {
  id: string
  role: 'user' | 'admin'
}

export async function getBearerAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const header = req.headers.get('authorization') ?? ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  if (!match) return null
  try {
    const payload = await verifyAuthToken(match[1])
    return { id: payload.sub, role: payload.role }
  } catch {
    return null
  }
}

