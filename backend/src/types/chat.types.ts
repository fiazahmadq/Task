export interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  attachments: Attachment[]
  tokenCount: number
  latencyMs: number
  createdAt: string
}

export interface Attachment {
  type: 'file' | 'image'
  name: string
  url: string
}

export interface ChatSession {
  id: string
  userId: string
  modelId: string
  title: string
  messageCount: number
  totalTokens: number
  createdAt: string
  updatedAt: string
}

export interface ChatStreamEvent {
  type: 'token' | 'done' | 'error'
  content?: string
  sessionId?: string
  tokenCount?: number
  latencyMs?: number
  message?: string
  code?: string
}
