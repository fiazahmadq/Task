import type { Server as SocketServer, Socket } from 'socket.io'
import { chatService } from '@/features/chat/services/chat.service'
import { logger } from '@/lib/logger/pino'

interface ChatMessagePayload {
  modelId: string
  content: string
  sessionId?: string
  attachments?: { type: 'file' | 'image'; name: string; url: string }[]
  systemPrompt?: string
  userId?: string
}

export function registerChatHandlers(io: SocketServer, socket: Socket): void {
  socket.on('chat:join', async ({ sessionId }: { sessionId: string }) => {
    await socket.join(`session-${sessionId}`)
    logger.info({ socketId: socket.id, sessionId }, 'Joined chat session')
  })

  socket.on('chat:message', async (payload: ChatMessagePayload) => {
    const { modelId, content, sessionId, attachments = [], systemPrompt, userId } = payload

    try {
      // Send acknowledgment
      socket.emit('chat:ack', { sessionId })

      // Stream AI response
      await chatService.streamChat(
        {
          userId: userId ?? null,
          modelId,
          content,
          sessionId,
          attachments,
          systemPrompt,
        },
        (event, data) => {
          socket.emit(`chat:${event}`, data)
          // Broadcast to other users in the session
          if (sessionId) {
            socket.to(`session-${sessionId}`).emit(`chat:${event}`, data)
          }
        }
      )
    } catch (error) {
      logger.error({ error: String(error), socketId: socket.id }, 'Socket chat error')
      socket.emit('chat:error', { message: 'Failed to process message', code: 'CHAT_ERROR' })
    }
  })

  socket.on('chat:typing', ({ sessionId }: { sessionId: string }) => {
    socket.to(`session-${sessionId}`).emit('chat:typing', { socketId: socket.id })
  })

  socket.on('chat:stop', ({ sessionId }: { sessionId: string }) => {
    // Note: Stopping streams would require tracking active streams
    // This is a placeholder for future implementation
    logger.info({ socketId: socket.id, sessionId }, 'Chat stop requested')
  })
}
