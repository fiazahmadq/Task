import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { connectDB } from '@/lib/db/mongoose'
import { Research } from '@/lib/db/models/Research.model'
import { redis } from '@/lib/redis/client'
import { RedisKeys } from '@/lib/redis/keys'
import { successResponse } from '@/types/api.types'
import { z } from 'zod'

const researchQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  tag: z.string().optional(),
})

export const GET = withErrorHandler(async (req: NextRequest) => {
  const params = researchQuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams))

  const cacheKey = RedisKeys.researchFeed(params.page)
  const cached = await redis.get(cacheKey).catch(() => null)
  if (cached && !params.tag) return NextResponse.json(JSON.parse(cached))

  await connectDB()
  const query: Record<string, unknown> = {}
  if (params.tag) query.tags = params.tag

  const skip = (params.page - 1) * params.limit
  const [items, total] = await Promise.all([
    Research.find(query).sort({ date: -1 }).skip(skip).limit(params.limit).lean(),
    Research.countDocuments(query),
  ])

  const result = successResponse(items, { total, page: params.page, limit: params.limit })
  if (!params.tag) {
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 1800).catch(() => null)
  }
  return NextResponse.json(result)
})
