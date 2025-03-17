import mongoose, { Document, Schema } from 'mongoose';

// Interface representing an AI Model document
export interface IAIModel extends Document {
  name: string;
  provider: string;
  apiKey: string;
  baseUrl: string;
  active: boolean;
  defaultParameters: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for AI Model
const AIModelSchema = new Schema<IAIModel>(
  {
    name: { type: String, required: true, unique: true },
    provider: { type: String, required: true },
    apiKey: { 
      type: String, 
      required: true
    },
    baseUrl: { type: String, required: true },
    active: { type: Boolean, default: true },
    defaultParameters: { 
      type: Map, 
      of: Schema.Types.Mixed, 
      default: () => new Map() 
    }
  },
  { timestamps: true }
);

// Create a model using the schema
const AIModel = mongoose.models.AIModel || mongoose.model<IAIModel>('AIModel', AIModelSchema);

export default AIModel; 