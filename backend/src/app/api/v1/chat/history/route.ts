import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { requireAuth } from '@/lib/auth/middleware'
import { connectDB } from '@/lib/db/mongoose'
import { Message } from '@/lib/db/models/Message.model'
import { ChatSession } from '@/lib/db/models/ChatSession.model'
import { auth } from '@/lib/auth/next-auth'
import { chatHistorySchema } from '@/features/chat/schemas/chat.schema'
import { successResponse } from '@/types/api.types'
import mongoose from 'mongoose'

export const GET = withErrorHandler(async (req: NextRequest) => {
  const authError = await requireAuth(req)
  if (authError) return authError

  const session = await auth()
  const { sessionId, page, limit } = chatHistorySchema.parse(
    Object.fromEntries(req.nextUrl.searchParams)
  )

  await connectDB()
  const skip = (page - 1) * limit

  const [messages, total] = await Promise.all([
    Message.find({ sessionId: new mongoose.Types.ObjectId(sessionId) })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Message.countDocuments({ sessionId: new mongoose.Types.ObjectId(sessionId) }),
  ])

  return NextResponse.json(successResponse(messages, { total, page, limit }))
})
