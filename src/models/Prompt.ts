import { v4 as uuidv4 } from 'uuid'
import Stack, { StackData } from './Stack'

export interface PromptData {
  id?: string
  title: string
  description: string
  stack?: Stack | StackData
  copyCount?: number
  createdBy?: string
  createdAt?: Date
  updatedAt?: Date
}

export default class Prompt {
  id: string
  title: string
  description: string
  stack?: Stack
  copyCount: number
  createdBy: string
  createdAt: Date
  updatedAt: Date

  constructor(data: PromptData) {
    this.id = data.id || uuidv4()
    this.title = data.title
    this.description = data.description
    this.stack = data.stack ? 
      (data.stack instanceof Stack ? data.stack : new Stack(data.stack))
      : undefined
    this.copyCount = data.copyCount || 0
    this.createdBy = data.createdBy || ''
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  static fromJSON(json: any): Prompt {
    return new Prompt({
      id: json.id,
      title: json.title,
      description: json.description,
      stack: json.stack ? Stack.fromJSON(json.stack) : undefined,
      copyCount: json.copyCount,
      createdBy: json.createdBy,
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : new Date()
    })
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      stack: this.stack?.toJSON(),
      copyCount: this.copyCount,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  incrementCopyCount() {
    this.copyCount += 1
    this.updatedAt = new Date()
    return this.copyCount
  }
} 