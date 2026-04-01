import { connectDB } from '@/lib/db/mongoose'
import { AIModel } from '@/lib/db/models/AIModel.model'
import { redis } from '@/lib/redis/client'
import { RedisKeys } from '@/lib/redis/keys'
import { NotFoundError, ConflictError } from '@/lib/errors'
import type { ModelFilters, CreateModelInput } from '../schemas/model.schema'
import type { AIModelSummary, AIModelDetail } from '@/types/model.types'
import crypto from 'crypto'
import type { SortOrder } from 'mongoose'

const MODEL_SUMMARY_PROJECTION = {
  id: 1, name: 1, lab: 1, org: 1, icon: 1, bgColor: 1, description: 1,
  tags: 1, types: 1, badge: 1, rating: 1, reviewCount: 1,
  pricePerMTokenInput: 1, pricePerMTokenOutput: 1, priceLabel: 1,
  contextWindow: 1, maxOutput: 1, latency: 1, multimodal: 1, openSource: 1, isActive: 1,
}

function buildFilter(filters: ModelFilters) {
  const query: Record<string, unknown> = { isActive: true }
  if (filters.lab) query.lab = filters.lab
  if (filters.type) query.types = filters.type
  if (filters.badge) query.badge = filters.badge
  if (filters.minRating != null) query.rating = { $gte: filters.minRating }
  if (filters.maxPrice != null) query.pricePerMTokenInput = { $lte: filters.maxPrice }
  if (filters.openSource != null) query.openSource = filters.openSource
  if (filters.search) query.$text = { $search: filters.search }
  return query
}

export const ModelService = {
  async list(filters: ModelFilters) {
    const cacheKey = RedisKeys.modelsList(
      crypto.createHash('md5').update(JSON.stringify(filters)).digest('hex')
    )
    const cached = await redis.get(cacheKey).catch(() => null)
    if (cached) return JSON.parse(cached)

    await connectDB()
    const query = buildFilter(filters)
    const skip = (filters.page - 1) * filters.limit

    let sort: Record<string, SortOrder> = {}
    switch (filters.ranking) {
      case 'newest': sort = { updatedAt: -1 }; break
      case 'best_rated': sort = { rating: -1, reviewCount: -1 }; break
      case 'budget': sort = { pricePerMTokenInput: 1 }; break
      default: sort = { rating: -1, reviewCount: -1 }
    }

    const [items, total] = await Promise.all([
      AIModel.find(query).select(MODEL_SUMMARY_PROJECTION).sort(sort).skip(skip).limit(filters.limit).lean(),
      AIModel.countDocuments(query),
    ])

    const result = {
      items,
      total,
      page: filters.page,
      limit: filters.limit,
      hasNextPage: skip + items.length < total,
    }

    await redis.set(cacheKey, JSON.stringify(result), 'EX', 300).catch(() => null)
    return result
  },

  async getById(id: string): Promise<AIModelDetail> {
    const cacheKey = RedisKeys.modelDetail(id)
    const cached = await redis.get(cacheKey).catch(() => null)
    if (cached) return JSON.parse(cached)

    await connectDB()
    const model = await AIModel.findOne({ id, isActive: true }).lean()
    if (!model) throw new NotFoundError(`Model '${id}' not found`)

    await redis.set(cacheKey, JSON.stringify(model), 'EX', 600).catch(() => null)
    return model as unknown as AIModelDetail
  },

  async create(input: CreateModelInput) {
    await connectDB()
    const existing = await AIModel.findOne({ id: input.id })
    if (existing) throw new ConflictError(`Model with id '${input.id}' already exists`)
    const model = await AIModel.create(input)
    await redis.keys('nexusai:models:list:*').then(keys => keys.length ? redis.del(...keys) : null).catch(() => null)
    return model.toObject()
  },

  async update(id: string, updates: Partial<CreateModelInput>) {
    await connectDB()
    const model = await AIModel.findOneAndUpdate({ id }, updates, { new: true }).lean()
    if (!model) throw new NotFoundError(`Model '${id}' not found`)
    await redis.del(RedisKeys.modelDetail(id)).catch(() => null)
    await redis.keys('nexusai:models:list:*').then(keys => keys.length ? redis.del(...keys) : null).catch(() => null)
    return model
  },

  async softDelete(id: string) {
    await connectDB()
    const model = await AIModel.findOneAndUpdate({ id }, { isActive: false }, { new: true }).lean()
    if (!model) throw new NotFoundError(`Model '${id}' not found`)
    await redis.del(RedisKeys.modelDetail(id)).catch(() => null)
    return model
  },

  async getLabs(): Promise<string[]> {
    await connectDB()
    const labs = await AIModel.distinct('lab', { isActive: true })
    return labs.sort()
  },
}
