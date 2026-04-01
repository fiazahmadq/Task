import { SignJWT, jwtVerify } from 'jose'

export interface AuthTokenPayload {
  sub: string
  role: 'user' | 'admin'
  email?: string
  name?: string
}

const secret = () => {
  const value = process.env.AUTH_SECRET
  if (!value) throw new Error('AUTH_SECRET is not set')
  return new TextEncoder().encode(value)
}

export async function signAuthToken(payload: AuthTokenPayload) {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret())
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload> {
  const { payload } = await jwtVerify(token, secret())
  return payload as unknown as AuthTokenPayload
}

