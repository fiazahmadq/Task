import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AppError, ValidationError } from './index'
import { logger } from '@/lib/logger/pino'
import { v4 as uuidv4 } from 'uuid'

type RouteHandler = (req: NextRequest, ctx?: { params: Record<string, string> }) => Promise<NextResponse>

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    const requestId = uuidv4()
    try {
      return await handler(req, ctx)
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string[]> = {}
        error.errors.forEach((e) => {
          const key = e.path.join('.')
          fields[key] = fields[key] ?? []
          fields[key].push(e.message)
        })
        return NextResponse.json(
          { error: { message: 'Validation failed', code: 'VALIDATION_ERROR', fields } },
          { status: 400 }
        )
      }

      if (error instanceof ValidationError) {
        return NextResponse.json(
          { error: { message: error.message, code: error.code, fields: error.fields } },
          { status: error.statusCode }
        )
      }

      if (error instanceof AppError) {
        logger.warn({ requestId, code: error.code, message: error.message })
        return NextResponse.json(
          { error: { message: error.message, code: error.code } },
          { status: error.statusCode }
        )
      }

      logger.error({ requestId, error: String(error) }, 'Unhandled error')
      return NextResponse.json(
        { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
        { status: 500 }
      )
    }
  }
}
