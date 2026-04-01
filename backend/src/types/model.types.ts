export interface AIModelSummary {
  id: string
  name: string
  lab: string
  org: string
  icon: string
  bgColor: string
  description: string
  tags: string[]
  types: string[]
  badge: string
  rating: number
  reviewCount: number
  pricePerMTokenInput: number
  pricePerMTokenOutput: number
  priceLabel: string
  contextWindow: string
  maxOutput: string
  latency: string
  multimodal: boolean
  openSource: boolean
  isActive: boolean
}

export interface AIModelDetail extends AIModelSummary {
  variations: Variation[]
  useCases: string[]
  benchmarks: { name: string; score: number }[]
  promptTips: string[]
  createdAt: string
  updatedAt: string
}

export interface Variation {
  variantId: string
  name: string
  tag: string
  description: string
  contextWindow: string
  speed: string
  priceLabel: string
  updatedAt: string
  badge: string
  benefits: string[]
}

export type ModelType = 'language' | 'vision' | 'code' | 'image' | 'audio' | 'open'
export type ModelBadge = 'new' | 'hot' | 'open' | 'beta' | ''
export type RankingContext = 'trending' | 'newest' | 'best_rated' | 'budget'
