import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { requireAuth } from '@/lib/auth/middleware'
import { connectDB } from '@/lib/db/mongoose'
import { ChatSession } from '@/lib/db/models/ChatSession.model'
import { auth } from '@/lib/auth/next-auth'
import { successResponse } from '@/types/api.types'
import mongoose from 'mongoose'

export const GET = withErrorHandler(async (req: NextRequest) => {
  const authError = await requireAuth(req)
  if (authError) return authError

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } }, { status: 401 })
  }
  const page = parseInt(req.nextUrl.searchParams.get('page') ?? '1')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '20')

  await connectDB()
  const skip = (page - 1) * limit

  const [sessions, total] = await Promise.all([
    ChatSession.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ChatSession.countDocuments({ userId: new mongoose.Types.ObjectId(userId) }),
  ])

  return NextResponse.json(successResponse(sessions, { total, page, limit }))
})
