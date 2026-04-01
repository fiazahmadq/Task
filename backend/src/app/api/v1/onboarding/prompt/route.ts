import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { generatePromptSchema } from '@/features/onboarding/schemas/onboarding.schema'
import { successResponse } from '@/types/api.types'

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = generatePromptSchema.parse(await req.json())

  // Import prompt builder from ai-logic-agent layer
  const { buildPrompt } = await import('@/lib/ai/prompt-builder')
  const generatedPrompt = buildPrompt(body.answers, body.userTypedQuery)

  return NextResponse.json(successResponse({
    generatedPrompt,
  }))
})
