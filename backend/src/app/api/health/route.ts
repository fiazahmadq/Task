import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { redis } from '@/lib/redis/client'

export async function GET() {
  const checks = { db: false, redis: false }
  const redisOptional = process.env.REDIS_OPTIONAL !== 'false'

  try {
    await connectDB()
    checks.db = true
  } catch {}

  try {
    await redis.connect()
    await redis.ping()
    checks.redis = true
  } catch {}

  const healthy = checks.db && (checks.redis || redisOptional)
  return NextResponse.json(
    { data: { status: healthy ? 'ok' : 'degraded', checks, redisOptional } },
    { status: healthy ? 200 : 503 }
  )
}
