import { Server as SocketServer } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import { auth } from '@/lib/auth/next-auth'
import { logger } from '@/lib/logger/pino'
import { registerChatHandlers } from './handlers/chat.handler'
import type { Server as HTTPServer } from 'http'

let io: SocketServer | null = null

export async function initSocketServer(httpServer: HTTPServer): Promise<SocketServer> {
  if (io) return io

  io = new SocketServer(httpServer, {
    cors: {
      origin: (process.env.NEXT_PUBLIC_ALLOWED_ORIGINS ?? 'http://localhost:3000').split(','),
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  })

  const pubClient = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' })
  const subClient = pubClient.duplicate()
  try {
    await Promise.all([pubClient.connect(), subClient.connect()])
    io.adapter(createAdapter(pubClient, subClient))
  } catch (error) {
    logger.warn({ error: String(error) }, 'Redis unavailable for Socket.IO adapter, using in-memory adapter')
  }

  // Auth middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token
      if (!token) {
        return next(new Error('Authentication required'))
      }
      // JWT verification happens via NextAuth's auth() in handlers
      // Store token for handler use
      socket.data.token = token
      next()
    } catch {
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, 'Socket connected')
    registerChatHandlers(io!, socket)

    socket.on('disconnect', () => {
      logger.info({ socketId: socket.id }, 'Socket disconnected')
    })
  })

  return io
}

export function getIO(): SocketServer | null {
  return io
}
