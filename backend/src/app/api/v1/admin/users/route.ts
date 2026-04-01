import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { requireAdmin } from '@/lib/auth/middleware'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/db/models/User.model'
import { successResponse } from '@/types/api.types'

export const GET = withErrorHandler(async (req: NextRequest) => {
  const authError = await requireAdmin(req)
  if (authError) return authError

  const page = parseInt(req.nextUrl.searchParams.get('page') ?? '1')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '50')

  await connectDB()
  const skip = (page - 1) * limit
  const [users, total] = await Promise.all([
    User.find().select('-passwordHash').skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    User.countDocuments(),
  ])

  return NextResponse.json(successResponse(users, { total, page, limit }))
})
