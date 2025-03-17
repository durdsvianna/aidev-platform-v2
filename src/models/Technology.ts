import { v4 as uuidv4 } from 'uuid'

export interface TechnologyData {
  id?: string
  name: string
  description: string
  createdAt?: Date
  updatedAt?: Date
}

export default class Technology {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date

  constructor(data: TechnologyData) {
    this.id = data.id || uuidv4()
    this.name = data.name
    this.description = data.description
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  static fromJSON(json: any): Technology {
    return new Technology({
      id: json.id,
      name: json.name,
      description: json.description,
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : new Date()
    })
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
} 