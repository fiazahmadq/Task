import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { requireAuth } from '@/lib/auth/middleware'
import { auth } from '@/lib/auth/next-auth'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/db/models/User.model'
import { signupSchema } from '@/features/auth/schemas/auth.schema'
import { successResponse } from '@/types/api.types'
import { ConflictError } from '@/lib/errors'
import bcrypt from 'bcrypt'

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

// GET /api/v1/users/me
export const GET = withErrorHandler(async (req: NextRequest) => {
  const authError = await requireAuth(req)
  if (authError) {
    getCORSHeaders(req).forEach((value, key) => authError.headers.set(key, value))
    return authError
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    const response = NextResponse.json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } }, { status: 401 })
    getCORSHeaders(req).forEach((value, key) => response.headers.set(key, value))
    return response
  }
  await connectDB()

  const user = await User.findById(userId).lean()
  const response = NextResponse.json(successResponse(user))
  getCORSHeaders(req).forEach((value, key) => response.headers.set(key, value))
  return response
})

// POST /api/v1/users — signup
export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = signupSchema.parse(await req.json())
  await connectDB()

  const existing = await User.findOne({ email: body.email })
  if (existing) throw new ConflictError('Email already registered')

  const passwordHash = await bcrypt.hash(body.password, 12)
  const user = await User.create({ email: body.email, name: body.name, passwordHash })

  const { passwordHash: _, ...safeUser } = user.toObject()
  const response = NextResponse.json(successResponse(safeUser), { status: 201 })
  getCORSHeaders(req).forEach((value, key) => response.headers.set(key, value))
  return response
})

// PATCH /api/v1/users/me — update profile
export const PATCH = withErrorHandler(async (req: NextRequest) => {
  const authError = await requireAuth(req)
  if (authError) {
    getCORSHeaders(req).forEach((value, key) => authError.headers.set(key, value))
    return authError
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    const response = NextResponse.json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } }, { status: 401 })
    getCORSHeaders(req).forEach((value, key) => response.headers.set(key, value))
    return response
  }
  const body = await req.json()
  const allowed = ['name', 'language']
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)))

  await connectDB()
  const user = await User.findByIdAndUpdate(userId, updates, { new: true }).lean()
  const response = NextResponse.json(successResponse(user))
  getCORSHeaders(req).forEach((value, key) => response.headers.set(key, value))
  return response
})
