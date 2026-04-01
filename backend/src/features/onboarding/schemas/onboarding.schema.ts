import { z } from 'zod'

/**
 * Onboarding answers for prompt generation (9 questions)
 */
export const onboardingAnswersSchema = z.object({
  task: z.string().optional(),
  role: z.string().optional(),
  context: z.string().optional(),
  tone: z.string().optional(),
  format: z.string().optional(),
  audience: z.string().optional(),
  depth: z.string().optional(),
  experience: z.string().optional(),
  constraint: z.string().optional(),
})

/**
 * Model preference answers for recommendation engine
 */
export const modelPreferenceSchema = z.object({
  useCase: z.enum(['coding', 'writing', 'analysis', 'creative', 'business', 'education']),
  priority: z.enum(['speed', 'quality', 'cost', 'features']),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  frequency: z.enum(['occasional', 'regular', 'heavy']),
  budget: z.enum(['free', 'low', 'medium', 'high']),
  features: z.array(z.enum(['code', 'images', 'audio', 'video', 'multi-language', 'reasoning'])).default([]),
})

export const saveOnboardingSchema = z.object({
  answers: onboardingAnswersSchema,
  modelPreferences: modelPreferenceSchema.optional(),
  sessionId: z.string().optional(),
})

export const generatePromptSchema = z.object({
  answers: onboardingAnswersSchema,
  userTypedQuery: z.string().optional(),
})

export const getRecommendationsSchema = modelPreferenceSchema

export type OnboardingAnswers = z.infer<typeof onboardingAnswersSchema>
export type ModelPreferences = z.infer<typeof modelPreferenceSchema>
export type SaveOnboardingInput = z.infer<typeof saveOnboardingSchema>
export type GeneratePromptInput = z.infer<typeof generatePromptSchema>
export type GetRecommendationsInput = z.infer<typeof getRecommendationsSchema>
