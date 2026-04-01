import type { AIModelSummary, RankingContext } from '@/types/model.types'

function normalise(value: number, max: number): number {
  if (max === 0) return 0
  return value / max
}

function recencyScore(updatedAt: Date | string): number {
  const date = new Date(updatedAt)
  const now = Date.now()
  const daysSince = (now - date.getTime()) / (1000 * 60 * 60 * 24)
  return Math.max(0, 1 - daysSince / 365)
}

export function rankModels(
  models: (AIModelSummary & { updatedAt?: string | Date })[],
  context: RankingContext
): AIModelSummary[] {
  const maxReviewCount = Math.max(...models.map(m => m.reviewCount), 1)

  switch (context) {
    case 'trending': {
      return [...models].sort((a, b) => {
        const scoreA =
          0.4 * normalise(a.reviewCount, maxReviewCount) +
          0.4 * normalise(a.rating, 5) +
          0.2 * recencyScore(a.updatedAt ?? new Date())
        const scoreB =
          0.4 * normalise(b.reviewCount, maxReviewCount) +
          0.4 * normalise(b.rating, 5) +
          0.2 * recencyScore(b.updatedAt ?? new Date())
        return scoreB - scoreA || a.name.localeCompare(b.name)
      })
    }
    case 'newest': {
      return [...models].sort((a, b) => {
        const aIsNew = a.badge === 'new' ? 1 : 0
        const bIsNew = b.badge === 'new' ? 1 : 0
        if (bIsNew !== aIsNew) return bIsNew - aIsNew
        const aDate = new Date(a.updatedAt ?? 0).getTime()
        const bDate = new Date(b.updatedAt ?? 0).getTime()
        return bDate - aDate || a.name.localeCompare(b.name)
      })
    }
    case 'best_rated': {
      return [...models].sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating
        if (b.reviewCount !== a.reviewCount) return b.reviewCount - a.reviewCount
        return a.name.localeCompare(b.name)
      })
    }
    case 'budget': {
      return [...models].sort((a, b) => {
        const aOpen = a.openSource ? 0 : 1
        const bOpen = b.openSource ? 0 : 1
        if (aOpen !== bOpen) return aOpen - bOpen
        if (a.pricePerMTokenInput !== b.pricePerMTokenInput) {
          return a.pricePerMTokenInput - b.pricePerMTokenInput
        }
        return a.name.localeCompare(b.name)
      })
    }
    default:
      return models
  }
}
