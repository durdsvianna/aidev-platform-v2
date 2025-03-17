import { v4 as uuidv4 } from 'uuid'
import type Stack from './Stack'
import type { StackData } from './Stack'

export interface ProfileData {
  id?: string
  name: string
  description: string
  stacks?: Stack[] | StackData[] | string[] // Array of Stack IDs or Stack objects
  createdAt?: Date
  updatedAt?: Date
}

export default class Profile {
  id: string
  name: string
  description: string
  stacks: string[] // Array of Stack IDs
  createdAt: Date
  updatedAt: Date

  constructor(data: ProfileData) {
    this.id = data.id || uuidv4()
    this.name = data.name
    this.description = data.description
    this.stacks = this.processStacks(data.stacks || [])
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  private processStacks(stacks: Array<Stack | StackData | string>): string[] {
    return stacks.map(stack => {
      if (typeof stack === 'string') {
        return stack // Already a stack ID
      } else {
        return stack.id || uuidv4() // Extract ID from Stack or StackData
      }
    })
  }

  static fromJSON(json: any): Profile {
    return new Profile({
      id: json.id,
      name: json.name,
      description: json.description,
      stacks: json.stacks || [],
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : new Date()
    })
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      stacks: this.stacks,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
} 