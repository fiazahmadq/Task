export const RedisKeys = {
  modelsList: (hash: string) => `nexusai:models:list:${hash}`,
  modelDetail: (id: string) => `nexusai:models:detail:${id}`,
  search: (hash: string) => `nexusai:search:${hash}`,
  recommendations: (userId: string) => `nexusai:recommendations:${userId}`,
  researchFeed: (page: number) => `nexusai:research:feed:${page}`,
  rateLimit: (ip: string, route: string) => `nexusai:ratelimit:${ip}:${route}`,
  chatSession: (sessionId: string) => `nexusai:session:${sessionId}`,
  userPrefs: (userId: string) => `nexusai:user:prefs:${userId}`,
  modelRanking: (context: string) => `nexusai:models:ranking:${context}`,
} as const
