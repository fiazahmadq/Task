import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { checkRateLimit } from '@/lib/rate-limit/limiter'
import { requireAdmin } from '@/lib/auth/middleware'
import { ModelService } from '@/features/marketplace/services/model.service'
import { modelFiltersSchema, createModelSchema } from '@/features/marketplace/schemas/model.schema'
import { successResponse } from '@/types/api.types'

export const GET = withErrorHandler(async (req: NextRequest) => {
  await checkRateLimit(req, 'search')
  const filters = modelFiltersSchema.parse(Object.fromEntries(req.nextUrl.searchParams))
  const result = await ModelService.list(filters)
  return NextResponse.json(successResponse(result.items, {
    total: result.total,
    page: result.page,
    limit: result.limit,
    hasNextPage: result.hasNextPage,
  }))
})

export const POST = withErrorHandler(async (req: NextRequest) => {
  const authError = await requireAdmin(req)
  if (authError) return authError
  const body = createModelSchema.parse(await req.json())
  const model = await ModelService.create(body)
  return NextResponse.json(successResponse(model), { status: 201 })
})
