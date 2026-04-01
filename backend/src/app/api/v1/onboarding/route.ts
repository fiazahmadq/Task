import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { auth } from '@/lib/auth/next-auth'
import { getBearerAuthUser } from '@/lib/auth/api-auth'
import { connectDB } from '@/lib/db/mongoose'
import { OnboardingProfile } from '@/lib/db/models/OnboardingProfile.model'
import { saveOnboardingSchema } from '@/features/onboarding/schemas/onboarding.schema'
import { recommendationService } from '@/features/recommendations/services/recommendations.service'
import { successResponse } from '@/types/api.types'
import mongoose from 'mongoose'

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = saveOnboardingSchema.parse(await req.json())
  const session = await auth()
  const bearer = await getBearerAuthUser(req)
  const userId = session?.user?.id ?? bearer?.id

  await connectDB()

  // Generate recommendations if model preferences provided
  let recommendations: Awaited<ReturnType<typeof recommendationService.generateRecommendations>> | null = null
  const recommendedModelIds: string[] = []

  if (body.modelPreferences && userId) {
    recommendations = await recommendationService.saveOnboardingAndRecommend(
      userId,
      body.modelPreferences
    )
    recommendedModelIds.push(...recommendations.top3.map(m => m.id))
  }

  const profile = await OnboardingProfile.create({
    userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
    sessionId: body.sessionId ?? undefined,
    answers: body.answers,
    modelPreferences: body.modelPreferences,
    recommendedModelIds,
  })

  // Mark user onboarding complete
  if (userId) {
    const { User } = await import('@/lib/db/models/User.model')
    await User.findByIdAndUpdate(userId, { onboardingCompleted: true })
  }

  return NextResponse.json(successResponse({
    profileId: profile._id.toString(),
    recommendations,
  }), { status: 201 })
})

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } }, { status: 401 })
  }

  await connectDB()
  const profile = await OnboardingProfile.findOne({
    userId: new mongoose.Types.ObjectId(session.user.id),
  }).sort({ createdAt: -1 }).lean()

  return NextResponse.json(successResponse(profile))
})
