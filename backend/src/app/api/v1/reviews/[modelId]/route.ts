import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { requireAuth } from '@/lib/auth/middleware'
import { auth } from '@/lib/auth/next-auth'
import { connectDB } from '@/lib/db/mongoose'
import { Review } from '@/lib/db/models/Review.model'
import { AIModel } from '@/lib/db/models/AIModel.model'
import { successResponse } from '@/types/api.types'
import { z } from 'zod'
import mongoose from 'mongoose'

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().max(2000).optional(),
  reviewerRole: z.string().max(100).optional(),
})

export const GET = withErrorHandler(async (req: NextRequest, ctx?: { params: Record<string, string> }) => {
  const modelId = ctx?.params.modelId ?? ''
  const page = parseInt(req.nextUrl.searchParams.get('page') ?? '1')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '20')

  await connectDB()
  const skip = (page - 1) * limit

  const [reviews, total] = await Promise.all([
    Review.find({ modelId }).sort({ rating: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Review.countDocuments({ modelId }),
  ])

  return NextResponse.json(successResponse(reviews, { total, page, limit }))
})

export const POST = withErrorHandler(async (req: NextRequest, ctx?: { params: Record<string, string> }) => {
  const authError = await requireAuth(req)
  if (authError) return authError

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } }, { status: 401 })
  }
  const modelId = ctx?.params.modelId ?? ''
  const body = createReviewSchema.parse(await req.json())

  await connectDB()

  const review = await Review.create({
    modelId,
    userId: new mongoose.Types.ObjectId(userId),
    ...body,
  })

  // Update model aggregate rating
  const stats = await Review.aggregate([
    { $match: { modelId } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  if (stats[0]) {
    await AIModel.findOneAndUpdate(
      { id: modelId },
      { rating: Math.round(stats[0].avgRating * 10) / 10, reviewCount: stats[0].count }
    )
  }

  return NextResponse.json(successResponse(review), { status: 201 })
})
