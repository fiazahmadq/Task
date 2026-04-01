export interface UserProfile {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  language: string
  preferredModels: string[]
  onboardingCompleted: boolean
  subscriptionTier: 'free' | 'pro' | 'enterprise'
  createdAt: string
}

export interface UserPreferences {
  language: string
  preferredModels: string[]
  defaultModelId?: string
  theme?: 'dark' | 'light' | 'system'
}
