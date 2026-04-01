import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { connectDB } from '@/lib/db/mongoose'
import { Research } from '@/lib/db/models/Research.model'
import { NotFoundError } from '@/lib/errors'
import { successResponse } from '@/types/api.types'
import mongoose from 'mongoose'

export const GET = withErrorHandler(async (_req: NextRequest, ctx?: { params: Record<string, string> }) => {
  const id = ctx?.params.id ?? ''
  await connectDB()
  const item = await Research.findById(new mongoose.Types.ObjectId(id)).lean()
  if (!item) throw new NotFoundError('Research article not found')
  return NextResponse.json(successResponse(item))
})
