import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379'
const REDIS_OPTIONAL = process.env.REDIS_OPTIONAL !== 'false'

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined
}

export const redis: Redis = global.redis ?? new Redis(REDIS_URL, {
  maxRetriesPerRequest: 1,
  enableReadyCheck: true,
  lazyConnect: true,
  enableOfflineQueue: false,
  retryStrategy: () => null,
})

if (process.env.NODE_ENV !== 'production') {
  global.redis = redis
}

redis.on('error', (err) => {
  if (!REDIS_OPTIONAL) {
    console.error('[Redis] Connection error:', err.message)
  }
})
