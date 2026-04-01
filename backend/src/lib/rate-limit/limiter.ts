import { redis } from '@/lib/redis/client'
import { RedisKeys } from '@/lib/redis/keys'
import { RateLimitError } from '@/lib/errors'
import { NextRequest } from 'next/server'

interface RateLimitConfig {
  limit: number
  windowSeconds: number
}

const memoryRateStore = new Map<string, number[]>()

const ROUTE_LIMITS: Record<string, RateLimitConfig> = {
  auth: { limit: 10, windowSeconds: 60 },
  chat: { limit: 60, windowSeconds: 60 },
  search: { limit: 100, windowSeconds: 60 },
  default: { limit: 200, windowSeconds: 60 },
}

export async function checkRateLimit(
  req: NextRequest,
  route: 'auth' | 'chat' | 'search' | 'default' = 'default'
): Promise<void> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1'
  const key = RedisKeys.rateLimit(ip, route)
  const config = ROUTE_LIMITS[route]
  const now = Date.now()
  const windowStart = now - config.windowSeconds * 1000

  try {
    const pipeline = redis.pipeline()
    pipeline.zremrangebyscore(key, 0, windowStart)
    pipeline.zadd(key, now, `${now}-${Math.random()}`)
    pipeline.zcard(key)
    pipeline.expire(key, config.windowSeconds + 1)
    const results = await pipeline.exec()

    const count = (results?.[2]?.[1] as number) ?? 0
    if (count > config.limit) {
      throw new RateLimitError(config.windowSeconds)
    }
  } catch (error) {
    if (error instanceof RateLimitError) throw error
    // Fallback to in-memory limiter when Redis is unavailable
    const now = Date.now()
    const list = memoryRateStore.get(key) ?? []
    const next = list.filter((ts) => ts > windowStart)
    next.push(now)
    memoryRateStore.set(key, next)

    if (next.length > config.limit) {
      throw new RateLimitError(config.windowSeconds)
    }
  }
}
