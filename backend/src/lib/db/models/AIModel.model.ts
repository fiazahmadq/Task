import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IVariation {
  variantId: string
  name: string
  tag: string
  description: string
  contextWindow: string
  speed: string
  priceLabel: string
  updatedAt: Date
  badge: string
  benefits: string[]
}

export interface IAIModel extends Document {
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
  variations: IVariation[]
  useCases: string[]
  benchmarks: { name: string; score: number }[]
  promptTips: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const VariationSchema = new Schema<IVariation>({
  variantId: { type: String, required: true },
  name: { type: String, required: true },
  tag: String,
  description: String,
  contextWindow: String,
  speed: String,
  priceLabel: String,
  updatedAt: Date,
  badge: String,
  benefits: [String],
})

const AIModelSchema = new Schema<IAIModel>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lab: { type: String, required: true, index: true },
    org: String,
    icon: String,
    bgColor: String,
    description: String,
    tags: [String],
    types: { type: [String], index: true },
    badge: { type: String, default: '', index: true },
    rating: { type: Number, default: 0, index: true },
    reviewCount: { type: Number, default: 0 },
    pricePerMTokenInput: { type: Number, default: 0, index: true },
    pricePerMTokenOutput: { type: Number, default: 0 },
    priceLabel: String,
    contextWindow: String,
    maxOutput: String,
    latency: String,
    multimodal: { type: Boolean, default: false },
    openSource: { type: Boolean, default: false },
    variations: [VariationSchema],
    useCases: [String],
    benchmarks: [{ name: String, score: Number }],
    promptTips: [String],
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
)

AIModelSchema.index({ name: 'text', description: 'text', tags: 'text' })

export const AIModel: Model<IAIModel> =
  mongoose.models.AIModel ?? mongoose.model<IAIModel>('AIModel', AIModelSchema)
