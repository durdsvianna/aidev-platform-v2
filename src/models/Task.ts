import mongoose, { Schema, models } from 'mongoose'

export interface ITask {
  _id?: string
  title: string
  company: string
  description: string
  reward: number
  dueDate: Date
  tags: string[]
  status: 'Open' | 'In Progress' | 'Completed'
  createdAt?: Date
  updatedAt?: Date
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    reward: {
      type: Number,
      required: [true, 'Reward is required'],
      min: [0, 'Reward cannot be negative']
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    tags: [{
      type: String,
      trim: true
    }],
    status: {
      type: String,
      enum: {
        values: ['Open', 'In Progress', 'Completed'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Open'
    }
  },
  {
    timestamps: true
  }
)

// Create or retrieve the model
const Task = models.Task || mongoose.model<ITask>('Task', taskSchema)

export default Task 