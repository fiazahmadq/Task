import { z } from 'zod'

export const sendMessageSchema = z.object({
  modelId: z.string().min(1),
  message: z.string().min(1).max(10000),
  sessionId: z.string().optional(),
  attachments: z.array(z.object({
    type: z.enum(['file', 'image']),
    name: z.string(),
    url: z.string().url(),
  })).default([]),
  systemPrompt: z.string().optional(),
})

export const chatHistorySchema = z.object({
  sessionId: z.string(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

export type SendMessageInput = z.infer<typeof sendMessageSchema>
export type ChatHistoryInput = z.infer<typeof chatHistorySchema>
