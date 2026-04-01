import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IReview extends Document {
  modelId: string
  userId: mongoose.Types.ObjectId
  rating: number
  title: string
  body: string
  reviewerRole: string
  verified: boolean
  createdAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    modelId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: String,
    body: String,
    reviewerRole: String,
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

ReviewSchema.index({ modelId: 1, rating: -1 })

export const Review: Model<IReview> =
  mongoose.models.Review ?? mongoose.model<IReview>('Review', ReviewSchema)
