import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAttachment {
  type: 'file' | 'image'
  name: string
  url: string
}

export interface IMessage extends Document {
  sessionId: mongoose.Types.ObjectId
  role: 'user' | 'assistant' | 'system'
  content: string
  attachments: IAttachment[]
  tokenCount: number
  latencyMs: number
  createdAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'ChatSession', required: true, index: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    attachments: [
      {
        type: { type: String, enum: ['file', 'image'] },
        name: String,
        url: String,
      },
    ],
    tokenCount: { type: Number, default: 0 },
    latencyMs: { type: Number, default: 0 },
  },
  { timestamps: true }
)

MessageSchema.index({ sessionId: 1, createdAt: 1 })

export const Message: Model<IMessage> =
  mongoose.models.Message ?? mongoose.model<IMessage>('Message', MessageSchema)
