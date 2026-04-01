import { z } from 'zod'

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
})

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID')

export function parseQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  const params = Object.fromEntries(searchParams.entries())
  return schema.parse(params)
}
