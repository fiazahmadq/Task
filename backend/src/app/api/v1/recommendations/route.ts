import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { getRecommendationsSchema } from '@/features/onboarding/schemas/onboarding.schema'
import { recommendationService } from '@/features/recommendations/services/recommendations.service'
import { successResponse } from '@/types/api.types'
import { auth } from '@/lib/auth/next-auth'

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } }, { status: 401 })
  }

  const body = getRecommendationsSchema.parse(await req.json())
  const result = await recommendationService.generateRecommendations(body)

  return NextResponse.json(successResponse({
    top3: result.top3,
    totalScored: result.totalScored,
  }, { total: result.totalScored }))
})
