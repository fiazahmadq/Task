import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IResearch extends Document {
  date: Date
  org: string
  title: string
  summary: string
  tags: string[]
  sourceUrl: string
  createdAt: Date
}

const ResearchSchema = new Schema<IResearch>(
  {
    date: { type: Date, required: true, index: true },
    org: String,
    title: { type: String, required: true },
    summary: String,
    tags: [String],
    sourceUrl: String,
  },
  { timestamps: true }
)

ResearchSchema.index({ date: -1 })

export const Research: Model<IResearch> =
  mongoose.models.Research ?? mongoose.model<IResearch>('Research', ResearchSchema)
