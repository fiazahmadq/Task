import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { requireAdmin } from '@/lib/auth/middleware'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/db/models/User.model'
import { NotFoundError } from '@/lib/errors'
import { successResponse } from '@/types/api.types'
import mongoose from 'mongoose'
import { z } from 'zod'

const updateUserSchema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  subscriptionTier: z.enum(['free', 'pro', 'enterprise']).optional(),
  name: z.string().optional(),
})

export const PATCH = withErrorHandler(async (req: NextRequest, ctx?: { params: Record<string, string> }) => {
  const authError = await requireAdmin(req)
  if (authError) return authError

  const id = ctx?.params.id ?? ''
  const body = updateUserSchema.parse(await req.json())

  await connectDB()
  const user = await User.findByIdAndUpdate(
    new mongoose.Types.ObjectId(id), body, { new: true }
  ).select('-passwordHash').lean()

  if (!user) throw new NotFoundError('User not found')
  return NextResponse.json(successResponse(user))
})
