import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { requireAdmin } from '@/lib/auth/middleware'
import { ModelService } from '@/features/marketplace/services/model.service'
import { createModelSchema } from '@/features/marketplace/schemas/model.schema'
import { successResponse } from '@/types/api.types'

export const GET = withErrorHandler(async (_req: NextRequest, ctx?: { params: Record<string, string> }) => {
  const id = ctx?.params.id ?? ''
  const model = await ModelService.getById(id)
  return NextResponse.json(successResponse(model))
})

export const PATCH = withErrorHandler(async (req: NextRequest, ctx?: { params: Record<string, string> }) => {
  const authError = await requireAdmin(req)
  if (authError) return authError
  const id = ctx?.params.id ?? ''
  const body = createModelSchema.partial().parse(await req.json())
  const model = await ModelService.update(id, body)
  return NextResponse.json(successResponse(model))
})

export const DELETE = withErrorHandler(async (req: NextRequest, ctx?: { params: Record<string, string> }) => {
  const authError = await requireAdmin(req)
  if (authError) return authError
  const id = ctx?.params.id ?? ''
  await ModelService.softDelete(id)
  return NextResponse.json(successResponse({ deleted: true }))
})
