import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { requireAuth } from '@/lib/auth/middleware'
import { auth } from '@/lib/auth/next-auth'
import { redis } from '@/lib/redis/client'
import { RedisKeys } from '@/lib/redis/keys'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/db/models/User.model'
import { successResponse } from '@/types/api.types'

export const GET = withErrorHandler(async (req: NextRequest) => {
  const authError = await requireAuth(req)
  if (authError) return authError

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } }, { status: 401 })
  }
  const cacheKey = RedisKeys.userPrefs(userId)

  const cached = await redis.get(cacheKey).catch(() => null)
  if (cached) return NextResponse.json(successResponse(JSON.parse(cached)))

  await connectDB()
  const user = await User.findById(userId).select('language preferredModels').lean()
  await redis.set(cacheKey, JSON.stringify(user), 'EX', 3600).catch(() => null)
  return NextResponse.json(successResponse(user))
})

export const PUT = withErrorHandler(async (req: NextRequest) => {
  const authError = await requireAuth(req)
  if (authError) return authError

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } }, { status: 401 })
  }
  const body = await req.json()
  const allowed = ['language', 'preferredModels']
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)))

  await connectDB()
  const user = await User.findByIdAndUpdate(userId, updates, { new: true })
    .select('language preferredModels').lean()

  await redis.del(RedisKeys.userPrefs(userId)).catch(() => null)
  return NextResponse.json(successResponse(user))
})
