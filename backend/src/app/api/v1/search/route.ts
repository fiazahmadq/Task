import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { checkRateLimit } from '@/lib/rate-limit/limiter'
import { connectDB } from '@/lib/db/mongoose'
import { AIModel } from '@/lib/db/models/AIModel.model'
import { redis } from '@/lib/redis/client'
import { RedisKeys } from '@/lib/redis/keys'
import { successResponse } from '@/types/api.types'
import { z } from 'zod'
import crypto from 'crypto'

const searchSchema = z.object({
  q: z.string().min(1).max(200),
  type: z.string().optional(),
  lab: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

export const GET = withErrorHandler(async (req: NextRequest) => {
  await checkRateLimit(req, 'search')
  const params = searchSchema.parse(Object.fromEntries(req.nextUrl.searchParams))

  const cacheKey = RedisKeys.search(
    crypto.createHash('md5').update(JSON.stringify(params)).digest('hex')
  )
  const cached = await redis.get(cacheKey).catch(() => null)
  if (cached) return NextResponse.json(JSON.parse(cached))

  await connectDB()
  const query: Record<string, unknown> = {
    isActive: true,
    $text: { $search: params.q },
  }
  if (params.type) query.types = params.type
  if (params.lab) query.lab = params.lab

  const skip = (params.page - 1) * params.limit
  const [items, total] = await Promise.all([
    AIModel.find(query, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(params.limit)
      .lean(),
    AIModel.countDocuments(query),
  ])

  const result = NextResponse.json(successResponse(items, {
    total,
    page: params.page,
    limit: params.limit,
    hasNextPage: skip + items.length < total,
  }))

  await redis.set(cacheKey, JSON.stringify(successResponse(items, { total, page: params.page, limit: params.limit })), 'EX', 120).catch(() => null)
  return result
})
