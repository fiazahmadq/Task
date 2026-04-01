import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { requireAdmin } from '@/lib/auth/middleware'
import { ModelService } from '@/features/marketplace/services/model.service'
import { modelFiltersSchema } from '@/features/marketplace/schemas/model.schema'
import { successResponse } from '@/types/api.types'

export const GET = withErrorHandler(async (req: NextRequest) => {
  const authError = await requireAdmin(req)
  if (authError) return authError
  // Admin sees all models including inactive
  const filters = modelFiltersSchema.parse(Object.fromEntries(req.nextUrl.searchParams))
  const result = await ModelService.list({ ...filters })
  return NextResponse.json(successResponse(result.items, {
    total: result.total, page: result.page, limit: result.limit,
  }))
})
