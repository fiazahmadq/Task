import { connectDB } from '@/lib/db/mongoose'
import { AIModel } from '@/lib/db/models/AIModel.model'
import { OnboardingProfile } from '@/lib/db/models/OnboardingProfile.model'
import { logger } from '@/lib/logger/pino'
import type { AIModelSummary } from '@/types/model.types'

export interface OnboardingAnswers {
  useCase: string // coding, writing, analysis, creative, business, education
  priority: string // speed, quality, cost, features
  experience: string // beginner, intermediate, advanced
  frequency: string // occasional, regular, heavy
  budget: string // free, low, medium, high
  features: string[] // code, images, audio, video, multi-language, reasoning
}

export interface ModelRecommendation extends AIModelSummary {
  score: number
  reasons: string[]
}

export interface RecommendationResult {
  top3: ModelRecommendation[]
  totalScored: number
}

type RecommendationModel = Partial<AIModelSummary> & {
  types?: string[]
  tags?: string[]
  latency?: string
  benchmarks?: Array<{ name: string; score: number }>
  useCases?: string[]
}

/**
 * Weights for different factors in the scoring algorithm
 */
const SCORING_WEIGHTS = {
  useCase: 0.35,
  priority: 0.25,
  experience: 0.15,
  budget: 0.15,
  features: 0.10,
}

/**
 * Maps use cases to preferred model types
 */
const USE_CASE_PREFERENCES: Record<string, string[]> = {
  coding: ['code', 'language'],
  writing: ['language'],
  analysis: ['language', 'vision'],
  creative: ['language', 'vision', 'image'],
  business: ['language'],
  education: ['language', 'vision'],
}

/**
 * Maps priority to model attributes
 */
const PREFERENCE_PRIORITY: Record<OnboardingAnswers['priority'], string> = {
  speed: 'latency',
  quality: 'rating',
  cost: 'openSource',
  features: 'types',
}

/**
 * Calculates match score for a single model based on onboarding answers
 */
export class RecommendationService {
  /**
   * Generate top 3 model recommendations based on onboarding answers
   */
  async generateRecommendations(answers: OnboardingAnswers): Promise<RecommendationResult> {
    await connectDB()

    // Get all active models
    const models = await AIModel.find({ isActive: true }).lean()

    if (models.length === 0) {
      logger.warn('No active models found for recommendations')
      return { top3: [], totalScored: 0 }
    }

    // Score each model
    const scoredModels = models
      .map(model => ({
        ...this.toModelSummary(model),
        score: this.calculateScore(model, answers),
        reasons: this.generateReasons(model, answers),
      }))
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)

    logger.info(
      { userId: answers, scored: scoredModels.length },
      'Generated model recommendations'
    )

    return {
      top3: scoredModels.slice(0, 3) as ModelRecommendation[],
      totalScored: scoredModels.length,
    }
  }

  /**
   * Save onboarding profile and generate recommendations
   */
  async saveOnboardingAndRecommend(
    userId: string,
    answers: OnboardingAnswers
  ): Promise<RecommendationResult> {
    await connectDB()

    // Check if profile already exists
    const existing = await OnboardingProfile.findOne({ userId })

    if (existing) {
      await OnboardingProfile.updateOne(
        { userId },
        { $set: { ...answers, updatedAt: new Date() } }
      )
    } else {
      await OnboardingProfile.create({
        userId,
        ...answers,
        completed: true,
      })
    }

    return this.generateRecommendations(answers)
  }

  /**
   * Calculate overall score for a model (0-100)
   */
  private calculateScore(model: RecommendationModel, answers: OnboardingAnswers): number {
    const scores = {
      useCase: this.scoreUseCase(model, answers),
      priority: this.scorePriority(model, answers),
      experience: this.scoreExperience(model, answers),
      budget: this.scoreBudget(model, answers),
      features: this.scoreFeatures(model, answers),
    }

    const total =
      scores.useCase * SCORING_WEIGHTS.useCase +
      scores.priority * SCORING_WEIGHTS.priority +
      scores.experience * SCORING_WEIGHTS.experience +
      scores.budget * SCORING_WEIGHTS.budget +
      scores.features * SCORING_WEIGHTS.features

    return Math.min(100, Math.round(total))
  }

  /**
   * Score based on use case (0-100)
   */
  private scoreUseCase(model: RecommendationModel, answers: OnboardingAnswers): number {
    const preferredTypes = USE_CASE_PREFERENCES[answers.useCase] ?? ['language']
    const modelTypes = model.types ?? []

    const typeMatch = preferredTypes.some(t => modelTypes.includes(t)) ? 100 : 50

    // Bonus for specific use case tags
    const useCaseTags = model.tags ?? []
    const tagBonus = useCaseTags.some((t: string) =>
      t.toLowerCase().includes(answers.useCase)
    ) ? 10 : 0

    return typeMatch + tagBonus
  }

  /**
   * Score based on priority (0-100)
   */
  private scorePriority(model: RecommendationModel, answers: OnboardingAnswers): number {
    switch (answers.priority) {
      case 'speed': {
        // Lower latency is better
        const latencyMap: Record<string, number> = { 'instant': 100, 'fast': 80, 'medium': 50, 'slow': 20 }
        return latencyMap[(model.latency ?? '').toLowerCase()] ?? 50
      }
      case 'quality': {
        // Higher rating is better
        return ((model.rating ?? 0) / 5) * 100
      }
      case 'cost': {
        // Open source is preferred, low prices
        const baseScore = model.openSource ? 100 : 70
        const inputPrice = model.pricePerMTokenInput ?? 0
        const priceScore = Math.max(0, 100 - (inputPrice * 2))
        return (baseScore + priceScore) / 2
      }
      case 'features': {
        // More features (types) is better
        const typeCount = model.types?.length ?? 0
        return Math.min(100, typeCount * 25)
      }
      default:
        return 50
    }
  }

  /**
   * Score based on user experience (0-100)
   */
  private scoreExperience(model: RecommendationModel, answers: OnboardingAnswers): number {
    // Beginner: prefer simple, fast models with good defaults
    // Advanced: prefer powerful models with more control
    switch (answers.experience) {
      case 'beginner': {
        const isSimple = model.badge === 'new' || model.latency === 'fast' || model.latency === 'instant'
        return isSimple ? 80 : 50
      }
      case 'intermediate': {
        return 70
      }
      case 'advanced': {
        // Prefer models with more features and power
        const hasAdvancedFeatures = model.contextWindow?.includes('200k') ||
          (model.benchmarks?.length ?? 0) > 2 ||
          model.types?.includes('code')
        return hasAdvancedFeatures ? 90 : 60
      }
      default:
        return 50
    }
  }

  /**
   * Score based on budget (0-100)
   */
  private scoreBudget(model: RecommendationModel, answers: OnboardingAnswers): number {
    switch (answers.budget) {
      case 'free': {
        return model.openSource || model.priceLabel === 'Free' ? 100 : 0
      }
      case 'low': {
        const price = model.pricePerMTokenInput ?? 0
        return price <= 2 ? 100 : price <= 5 ? 70 : 30
      }
      case 'medium': {
        const price = model.pricePerMTokenInput ?? 0
        return price <= 10 ? 100 : 60
      }
      case 'high': {
        return 100 // Any model is acceptable
      }
      default:
        return 50
    }
  }

  /**
   * Score based on requested features (0-100)
   */
  private scoreFeatures(model: RecommendationModel, answers: OnboardingAnswers): number {
    if (!answers.features || answers.features.length === 0) return 100

    const modelTypes = model.types ?? []
    const modelTags = (model.tags ?? []).map((t: string) => t.toLowerCase())

    let matchCount = 0
    for (const feature of answers.features) {
      const lowerFeature = feature.toLowerCase()

      // Direct type match
      if (modelTypes.some(t => t.toLowerCase().includes(lowerFeature))) {
        matchCount++
        continue
      }

      // Tag match
      if (modelTags.some(t => t.includes(lowerFeature))) {
        matchCount++
        continue
      }

      // Multimodal check
      if (lowerFeature === 'multimodal' && model.multimodal) {
        matchCount++
      }

      // Code check
      if (lowerFeature === 'code' && (model.useCases?.some((u: string) => u.toLowerCase().includes('code')))) {
        matchCount++
      }
    }

    return (matchCount / answers.features.length) * 100
  }

  /**
   * Generate human-readable reasons for recommendation
   */
  private generateReasons(model: RecommendationModel, answers: OnboardingAnswers): string[] {
    const reasons: string[] = []

    // Use case reason
    const useCaseReasons: Record<string, string> = {
      coding: 'Excellent for coding tasks',
      writing: 'Great at writing and content creation',
      analysis: 'Strong analytical capabilities',
      creative: 'Well-suited for creative work',
      business: 'Reliable for business applications',
      education: 'Good educational tool',
    }
    if (useCaseReasons[answers.useCase]) {
      reasons.push(useCaseReasons[answers.useCase])
    }

    // Priority reason
    switch (answers.priority) {
      case 'speed':
        if (model.latency === 'instant' || model.latency === 'fast') {
          reasons.push('Fast response times')
        }
        break
      case 'quality':
        if ((model.rating ?? 0) >= 4.5) {
          reasons.push(`Highly rated (${model.rating}/5)`)
        }
        break
      case 'cost':
        if (model.openSource) {
          reasons.push('Open source')
        }
        if (model.priceLabel === 'Free') {
          reasons.push('Free to use')
        }
        break
      case 'features':
        if ((model.types?.length ?? 0) > 2) {
          reasons.push(`Supports ${(model.types?.length ?? 0)} model types`)
        }
        break
    }

    // Budget reason
    if (answers.budget === 'free' && (model.openSource || model.priceLabel === 'Free')) {
      reasons.push('Fits your free budget')
    }

    // Features reason
    const matchedFeatures = answers.features.filter((f: string) =>
      model.types?.some((t: string) => t.toLowerCase().includes(f.toLowerCase()))
    )
    if (matchedFeatures.length > 0) {
      reasons.push(`Supports: ${matchedFeatures.join(', ')}`)
    }

    // Popularity reason
    if ((model.reviewCount ?? 0) > 100) {
      reasons.push('Popular with many users')
    }

    return reasons.length > 0 ? reasons : ['Well-rounded model']
  }

  /**
   * Convert Mongoose model to AIModelSummary
   */
  private toModelSummary(model: RecommendationModel): Omit<AIModelSummary, 'score' | 'reasons'> {
    return {
      id: model.id ?? '',
      name: model.name ?? '',
      lab: model.lab ?? '',
      org: model.org ?? '',
      icon: model.icon ?? '',
      bgColor: model.bgColor ?? '',
      description: model.description ?? '',
      tags: model.tags ?? [],
      types: model.types ?? [],
      badge: model.badge ?? '',
      rating: model.rating ?? 0,
      reviewCount: model.reviewCount ?? 0,
      pricePerMTokenInput: model.pricePerMTokenInput ?? 0,
      pricePerMTokenOutput: model.pricePerMTokenOutput ?? 0,
      priceLabel: model.priceLabel ?? '',
      contextWindow: model.contextWindow ?? '',
      maxOutput: model.maxOutput ?? '',
      latency: model.latency ?? '',
      multimodal: model.multimodal ?? false,
      openSource: model.openSource ?? false,
      isActive: model.isActive ?? true,
    }
  }
}

export const recommendationService = new RecommendationService()