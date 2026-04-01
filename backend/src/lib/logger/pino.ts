import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  // Keep logger worker-free for stability in local dev/runtime bundling.
  transport: undefined,
  redact: {
    paths: ['password', 'passwordHash', 'token', 'authorization', 'cookie'],
    censor: '[REDACTED]',
  },
})

export function createRequestLogger(requestId: string, route: string) {
  return logger.child({ requestId, route })
}
