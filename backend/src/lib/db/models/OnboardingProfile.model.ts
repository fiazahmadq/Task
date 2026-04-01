import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IOnboardingAnswers {
  task?: string
  role?: string
  context?: string
  tone?: string
  format?: string
  audience?: string
  depth?: string
  experience?: string
  constraint?: string
}

export interface IModelPreferences {
  useCase: 'coding' | 'writing' | 'analysis' | 'creative' | 'business' | 'education'
  priority: 'speed' | 'quality' | 'cost' | 'features'
  experience: 'beginner' | 'intermediate' | 'advanced'
  frequency: 'occasional' | 'regular' | 'heavy'
  budget: 'free' | 'low' | 'medium' | 'high'
  features: string[]
}

export interface IOnboardingProfile extends Document {
  userId?: mongoose.Types.ObjectId
  sessionId?: string
  answers: IOnboardingAnswers
  modelPreferences?: IModelPreferences
  generatedPrompt: string
  recommendedModelIds: string[]
  completedAt: Date
}

const ModelPreferencesSchema = new Schema<IModelPreferences>({
  useCase: { type: String, enum: ['coding', 'writing', 'analysis', 'creative', 'business', 'education'] },
  priority: { type: String, enum: ['speed', 'quality', 'cost', 'features'] },
  experience: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  frequency: { type: String, enum: ['occasional', 'regular', 'heavy'] },
  budget: { type: String, enum: ['free', 'low', 'medium', 'high'] },
  features: [String],
})

const OnboardingProfileSchema = new Schema<IOnboardingProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    sessionId: { type: String, index: true },
    answers: {
      task: String,
      role: String,
      context: String,
      tone: String,
      format: String,
      audience: String,
      depth: String,
      experience: String,
      constraint: String,
    },
    modelPreferences: ModelPreferencesSchema,
    generatedPrompt: String,
    recommendedModelIds: [String],
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const OnboardingProfile: Model<IOnboardingProfile> =
  mongoose.models.OnboardingProfile ??
  mongoose.model<IOnboardingProfile>('OnboardingProfile', OnboardingProfileSchema)
