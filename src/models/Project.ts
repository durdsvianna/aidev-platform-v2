import mongoose, { Schema, models } from 'mongoose'

export interface IAIProject {
  _id?: string
  name: string
  description: string
  modelType: 'Classification' | 'Regression' | 'NLP' | 'Computer Vision' | 'Other'
  framework: string
  metrics: {
    accuracy?: number
    precision?: number
    recall?: number
    f1Score?: number
    customMetrics?: Record<string, number>
  }
  status: 'Planning' | 'Development' | 'Testing' | 'Deployed'
  createdAt?: Date
  updatedAt?: Date
}

const projectSchema = new Schema<IAIProject>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    modelType: {
      type: String,
      required: [true, 'Model type is required'],
      enum: {
        values: ['Classification', 'Regression', 'NLP', 'Computer Vision', 'Other'],
        message: '{VALUE} is not a valid model type'
      }
    },
    framework: {
      type: String,
      required: [true, 'Framework is required'],
      trim: true
    },
    metrics: {
      accuracy: {
        type: Number,
        min: [0, 'Accuracy cannot be negative'],
        max: [1, 'Accuracy cannot be greater than 1']
      },
      precision: {
        type: Number,
        min: [0, 'Precision cannot be negative'],
        max: [1, 'Precision cannot be greater than 1']
      },
      recall: {
        type: Number,
        min: [0, 'Recall cannot be negative'],
        max: [1, 'Recall cannot be greater than 1']
      },
      f1Score: {
        type: Number,
        min: [0, 'F1 score cannot be negative'],
        max: [1, 'F1 score cannot be greater than 1']
      },
      customMetrics: {
        type: Map,
        of: Number
      }
    },
    status: {
      type: String,
      enum: {
        values: ['Planning', 'Development', 'Testing', 'Deployed'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Planning'
    }
  },
  {
    timestamps: true
  }
)

// Create or retrieve the model
const Project = models.Project || mongoose.model<IAIProject>('Project', projectSchema)

export default Project 