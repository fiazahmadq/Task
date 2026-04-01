import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IChatSession extends Document {
  userId?: mongoose.Types.ObjectId
  modelId: string
  title: string
  messageCount: number
  totalTokens: number
  createdAt: Date
  updatedAt: Date
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false, index: true },
    modelId: { type: String, required: true },
    title: { type: String, default: 'New Chat' },
    messageCount: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
  },
  { timestamps: true }
)

ChatSessionSchema.index({ userId: 1, createdAt: -1 })

export const ChatSession: Model<IChatSession> =
  mongoose.models.ChatSession ??
  mongoose.model<IChatSession>('ChatSession', ChatSessionSchema)
