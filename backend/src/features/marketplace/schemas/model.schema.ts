import { z } from 'zod'

export const modelFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  lab: z.string().optional(),
  type: z.string().optional(),
  badge: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  search: z.string().optional(),
  openSource: z.coerce.boolean().optional(),
  ranking: z.enum(['trending', 'newest', 'best_rated', 'budget']).optional(),
})

export const createModelSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  lab: z.string().min(1),
  org: z.string().optional(),
  icon: z.string().optional(),
  bgColor: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  types: z.array(z.string()).default([]),
  badge: z.string().default(''),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  pricePerMTokenInput: z.number().min(0).default(0),
  pricePerMTokenOutput: z.number().min(0).default(0),
  priceLabel: z.string().optional(),
  contextWindow: z.string().optional(),
  maxOutput: z.string().optional(),
  latency: z.string().optional(),
  multimodal: z.boolean().default(false),
  openSource: z.boolean().default(false),
})

export type ModelFilters = z.infer<typeof modelFiltersSchema>
export type CreateModelInput = z.infer<typeof createModelSchema>
