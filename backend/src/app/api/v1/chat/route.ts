import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/next-auth'
import { getBearerAuthUser } from '@/lib/auth/api-auth'
import { checkRateLimit } from '@/lib/rate-limit/limiter'
import { sendMessageSchema } from '@/features/chat/schemas/chat.schema'
import { chatService } from '@/features/chat/services/chat.service'
import { logger } from '@/lib/logger/pino'

export async function POST(req: NextRequest) {
  await checkRateLimit(req, 'chat')

  const session = await auth()
  const bearer = await getBearerAuthUser(req)
  const body = sendMessageSchema.parse(await req.json())
  const startTime = Date.now()

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
      }

      try {
        await chatService.streamChat(
          {
            userId: session?.user?.id ?? bearer?.id ?? null,
            modelId: body.modelId,
            content: body.message,
            sessionId: body.sessionId,
            attachments: body.attachments,
            systemPrompt: body.systemPrompt,
          },
          sendEvent
        )
      } catch (error) {
        logger.error({ error: String(error), userId: session?.user?.id ?? bearer?.id ?? 'guest' }, 'Chat API error')
        sendEvent('error', { message: 'Failed to process request', code: 'CHAT_ERROR' })
      } finally {
        controller.close()
      }
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
