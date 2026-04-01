import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/errors/handler'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/db/models/User.model'
import { successResponse } from '@/types/api.types'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { signAuthToken } from '@/lib/auth/token'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = loginSchema.parse(await req.json())
  await connectDB()

  const user = await User.findOne({ email: body.email.toLowerCase().trim() }).select('+passwordHash').lean()
  if (!user) {
    return NextResponse.json({ error: { message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' } }, { status: 401 })
  }

  const valid = await bcrypt.compare(body.password, (user as any).passwordHash)
  if (!valid) {
    return NextResponse.json({ error: { message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' } }, { status: 401 })
  }

  const token = await signAuthToken({
    sub: user._id.toString(),
    role: user.role ?? 'user',
    email: user.email,
    name: user.name,
  })

  return NextResponse.json(successResponse({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role ?? 'user',
      language: user.language ?? 'EN',
      onboardingCompleted: user.onboardingCompleted ?? false,
      subscriptionTier: user.subscriptionTier ?? 'free',
    },
  }))
})

