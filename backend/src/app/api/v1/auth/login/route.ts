import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/db/models/User.model'
import { successResponse } from '@/types/api.types'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { signAuthToken } from '@/lib/auth/token'

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:4000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:4000',
]

function getCORSHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || ''
  const headers = new Headers()
  
  if (allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  return headers
}

export const OPTIONS = (req: NextRequest) => {
  return new NextResponse(null, { headers: getCORSHeaders(req) })
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = loginSchema.parse(await req.json())
  await connectDB()

  const user = await User.findOne({ email: body.email.toLowerCase().trim() }).select('+passwordHash').lean()
  if (!user) {
    const response = NextResponse.json({ error: { message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' } }, { status: 401 })
    getCORSHeaders(req).forEach((value, key) => response.headers.set(key, value))
    return response
  }

  const valid = await bcrypt.compare(body.password, (user as any).passwordHash)
  if (!valid) {
    const response = NextResponse.json({ error: { message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' } }, { status: 401 })
    getCORSHeaders(req).forEach((value, key) => response.headers.set(key, value))
    return response
  }

  const token = await signAuthToken({
    sub: user._id.toString(),
    role: user.role ?? 'user',
    email: user.email,
    name: user.name,
  })

  const response = NextResponse.json(successResponse({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role ?? 'user',
      language: user.language ?? 'EN',
      onboardingCompleted: user.onboardingCompleted ?? false,
      subscriptionTier: user.subscriptionTier ?? 'free',
    },
  }))
  
  getCORSHeaders(req).forEach((value, key) => response.headers.set(key, value))
  return response
})

