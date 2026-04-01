import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/db/models/User.model'
import { successResponse } from '@/types/api.types'
import { getBearerAuthUser } from '@/lib/auth/api-auth'

export const GET = withErrorHandler(async (req: NextRequest) => {
  const bearer = await getBearerAuthUser(req)
  if (!bearer?.id) {
    return NextResponse.json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } }, { status: 401 })
  }

  await connectDB()
  const user = await User.findById(bearer.id).lean()
  if (!user) {
    return NextResponse.json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } }, { status: 401 })
  }

  return NextResponse.json(successResponse({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role ?? 'user',
    language: user.language ?? 'EN',
    onboardingCompleted: user.onboardingCompleted ?? false,
    subscriptionTier: user.subscriptionTier ?? 'free',
  }))
})

