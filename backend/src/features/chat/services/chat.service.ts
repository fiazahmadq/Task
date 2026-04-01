import { connectDB } from '@/lib/db/mongoose'
import { Message } from '@/lib/db/models/Message.model'
import { ChatSession } from '@/lib/db/models/ChatSession.model'
import { AIModel } from '@/lib/db/models/AIModel.model'
import { logger } from '@/lib/logger/pino'
import { getAnthropicClient } from '@/lib/ai/anthropic'
import { getOpenAIClient } from '@/lib/ai/openai'
import { classifyIntent, intentMatchesModelTypes } from '@/lib/ai/intent-classifier'
import mongoose from 'mongoose'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

export interface ChatOrchestrationInput {
  userId: string | null
  modelId: string
  content: string
  sessionId?: string
  attachments?: Array<{ type: 'file' | 'image'; name: string; url: string }>
  systemPrompt?: string
}

export interface StreamCallback {
  (event: string, data: unknown): void
}

export interface ChatResult {
  sessionId: string
  messageId: string
  assistantContent: string
  tokenCount: number
  latencyMs: number
}

/**
 * Maps model IDs to their provider and model name
 */
const MODEL_REGISTRY: Record<string, { provider: 'anthropic' | 'openai'; modelName: string }> = {
  // Anthropic Claude models
  'claude-3-7-sonnet': { provider: 'anthropic', modelName: 'claude-3-7-sonnet-20250219' },
  'claude-3-5-sonnet': { provider: 'anthropic', modelName: 'claude-3-5-sonnet-20241022' },
  'claude-3-5-haiku': { provider: 'anthropic', modelName: 'claude-3-5-haiku-20241022' },
  'claude-3-opus': { provider: 'anthropic', modelName: 'claude-3-opus-20240229' },
  // OpenAI models
  'gpt-4o': { provider: 'openai', modelName: 'gpt-4o' },
  'gpt-4o-mini': { provider: 'openai', modelName: 'gpt-4o-mini' },
  'gpt-4-turbo': { provider: 'openai', modelName: 'gpt-4-turbo' },
  'gpt-3.5-turbo': { provider: 'openai', modelName: 'gpt-3.5-turbo' },
}

/**
 * Orchestrates chat with AI providers, supporting streaming responses
 */
export class ChatOrchestrationService {
  /**
   * Send a chat message and stream the AI response
   */
  async streamChat(
    input: ChatOrchestrationInput,
    onEvent: StreamCallback
  ): Promise<ChatResult> {
    const startTime = Date.now()
    await connectDB()

    // Get or create session
    const { sessionId, userId, modelId } = input
    const activeSessionId = await this.getOrCreateSession(sessionId, userId, modelId, input.content)

    // Save user message
    await Message.create({
      sessionId: new mongoose.Types.ObjectId(activeSessionId),
      role: 'user',
      content: input.content,
      attachments: input.attachments ?? [],
    })

    // Get conversation history
    const history = await this.getConversationHistory(activeSessionId, 10)

    // Get model config
    const modelConfig = MODEL_REGISTRY[modelId] ?? MODEL_REGISTRY['gpt-4o-mini']
    const modelInfo = await this.getModelInfo(modelId)

    // Stream response
    let assistantContent = ''
    let tokenCount = 0

    try {
      if (modelConfig.provider === 'anthropic') {
        await this.streamAnthropic(
          modelConfig.modelName,
          history,
          input.content,
          input.systemPrompt,
          (content, tokens) => {
            assistantContent += content
            tokenCount = tokens
            onEvent('token', { content })
          }
        )
      } else {
        await this.streamOpenAI(
          modelConfig.modelName,
          history,
          input.content,
          input.systemPrompt,
          (content, tokens) => {
            assistantContent += content
            tokenCount = tokens
            onEvent('token', { content })
          }
        )
      }

      // Save assistant message
      const assistantMessage = await Message.create({
        sessionId: new mongoose.Types.ObjectId(activeSessionId),
        role: 'assistant',
        content: assistantContent,
        tokenCount,
        latencyMs: Date.now() - startTime,
      })

      // Update session stats
      await ChatSession.findByIdAndUpdate(activeSessionId, {
        $inc: {
          messageCount: 1,
          totalTokens: tokenCount,
        },
        updatedAt: new Date(),
      })

      onEvent('done', {
        sessionId: activeSessionId,
        messageId: assistantMessage._id.toString(),
        tokenCount,
        latencyMs: Date.now() - startTime,
      })

      return {
        sessionId: activeSessionId,
        messageId: assistantMessage._id.toString(),
        assistantContent,
        tokenCount,
        latencyMs: Date.now() - startTime,
      }
    } catch (error) {
      logger.error({ error: String(error), modelId }, 'Chat streaming failed')

      const fallbackMessage = `I am running in offline mode right now (AI provider key missing or unavailable). I received your request: "${input.content}". Please add OPENAI_API_KEY or ANTHROPIC_API_KEY to enable real model responses.`

      const assistantMessage = await Message.create({
        sessionId: new mongoose.Types.ObjectId(activeSessionId),
        role: 'assistant',
        content: fallbackMessage,
        tokenCount: 0,
        latencyMs: Date.now() - startTime,
      })

      onEvent('token', { content: fallbackMessage })
      onEvent('done', {
        sessionId: activeSessionId,
        messageId: assistantMessage._id.toString(),
        tokenCount: 0,
        latencyMs: Date.now() - startTime,
        fallback: true,
      })

      return {
        sessionId: activeSessionId,
        messageId: assistantMessage._id.toString(),
        assistantContent: fallbackMessage,
        tokenCount: 0,
        latencyMs: Date.now() - startTime,
      }
    }
  }

  /**
   * Stream response from Anthropic
   */
  private async streamAnthropic(
    modelName: string,
    history: Array<{ role: string; content: string }>,
    currentContent: string,
    systemPrompt: string | undefined,
    onChunk: (content: string, tokens: number) => void
  ): Promise<void> {
    const client = getAnthropicClient()
    let tokenCount = 0

    // Convert history to Anthropic format
    const messages = [
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
        content: m.content,
      })),
      { role: 'user' as const, content: currentContent },
    ]

    const stream = await client.messages.create({
      model: modelName,
      max_tokens: 4096,
      system: systemPrompt,
      messages,
      stream: true,
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        onChunk(event.delta.text, tokenCount)
      } else if (event.type === 'message_delta' && event.usage) {
        tokenCount = (event.usage.output_tokens ?? 0)
      }
    }
  }

  /**
   * Stream response from OpenAI
   */
  private async streamOpenAI(
    modelName: string,
    history: Array<{ role: string; content: string }>,
    currentContent: string,
    systemPrompt: string | undefined,
    onChunk: (content: string, tokens: number) => void
  ): Promise<void> {
    const client = getOpenAIClient()
    let tokenCount = 0

    const messages: OpenAI.ChatCompletionMessageParam[] = []

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }

    messages.push(
      ...history.map(m => ({
        role: (m.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: currentContent }
    )

    const stream = await client.chat.completions.create({
      model: modelName,
      messages,
      stream: true,
      max_tokens: 4096,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content ?? ''
      if (content) {
        tokenCount += 1
        onChunk(content, tokenCount)
      }
    }
  }

  /**
   * Get or create a chat session
   */
  private async getOrCreateSession(
    sessionId: string | undefined,
    userId: string | null,
    modelId: string,
    title: string
  ): Promise<string> {
    if (sessionId) {
      const session = await ChatSession.findById(sessionId)
      if (session) return session._id.toString()
    }

    const session = await ChatSession.create({
      userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      modelId,
      title: title.slice(0, 100),
      messageCount: 0,
      totalTokens: 0,
    })
    return session._id.toString()
  }

  /**
   * Get conversation history for context
   */
  private async getConversationHistory(
    sessionId: string,
    limit: number
  ): Promise<Array<{ role: string; content: string }>> {
    const messages = await Message.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return messages
      .reverse()
      .map(m => ({ role: m.role, content: m.content }))
  }

  /**
   * Get model information from database
   */
  private async getModelInfo(modelId: string) {
    const model = await AIModel.findOne({ id: modelId, isActive: true })
    return model?.toObject() ?? null
  }

  /**
   * Suggest model switch based on message intent
   */
  async suggestModelSwitch(message: string, currentModelId: string): Promise<{ suggested: boolean; modelId?: string; reason?: string }> {
    const classification = classifyIntent(message)
    const currentModel = await AIModel.findOne({ id: currentModelId, isActive: true })

    if (!currentModel) {
      return { suggested: false }
    }

    // Check if current model supports the intent
    if (intentMatchesModelTypes(classification.intent, currentModel.types)) {
      return { suggested: false }
    }

    // Find a better model
    const betterModel = await AIModel.findOne({
      isActive: true,
      types: { $in: this.getModelTypesForIntent(classification.intent) },
    }).sort({ rating: -1, reviewCount: -1 })

    if (betterModel) {
      return {
        suggested: true,
        modelId: betterModel.id,
        reason: `${classification.intent} intent detected - this model is better suited for your request`,
      }
    }

    return { suggested: false }
  }

  /**
   * Map intent to required model types
   */
  private getModelTypesForIntent(intent: string): string[] {
    const map: Record<string, string[]> = {
      image: ['image'],
      code: ['code', 'language'],
      audio: ['audio'],
      video: ['video'],
      analysis: ['language', 'vision'],
      writing: ['language'],
      translation: ['language'],
      agents: ['language', 'code'],
    }
    return map[intent] ?? ['language']
  }
}

export const chatService = new ChatOrchestrationService()