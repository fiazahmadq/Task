import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  email: string
  passwordHash: string
  name: string
  role: 'user' | 'admin'
  language: string
  preferredModels: string[]
  onboardingCompleted: boolean
  subscriptionTier: 'free' | 'pro' | 'enterprise'
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    language: { type: String, default: 'EN' },
    preferredModels: [String],
    onboardingCompleted: { type: Boolean, default: false },
    subscriptionTier: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema)
