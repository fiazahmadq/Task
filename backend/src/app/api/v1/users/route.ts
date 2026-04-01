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

// GET /api/v1/users/me
export const GET = withErrorHandler(async (req: NextRequest) => {
  const authError = await requireAuth(req)
  if (authError) return authError

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } }, { status: 401 })
  }
  await connectDB()

  const user = await User.findById(userId).lean()
  return NextResponse.json(successResponse(user))
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
  return NextResponse.json(successResponse(safeUser), { status: 201 })
})

// PATCH /api/v1/users/me — update profile
export const PATCH = withErrorHandler(async (req: NextRequest) => {
  const authError = await requireAuth(req)
  if (authError) return authError

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } }, { status: 401 })
  }
  const body = await req.json()
  const allowed = ['name', 'language']
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)))

  await connectDB()
  const user = await User.findByIdAndUpdate(userId, updates, { new: true }).lean()
  return NextResponse.json(successResponse(user))
})
