import { v4 as uuidv4 } from 'uuid'
import Technology, { TechnologyData } from './Technology'

export interface StackData {
  id?: string
  name: string
  code: string
  technologies: Technology[] | TechnologyData[]
  createdAt?: Date
  updatedAt?: Date
}

export default class Stack {
  id: string
  name: string
  code: string
  technologies: Technology[]
  createdAt: Date
  updatedAt: Date

  constructor(data: StackData) {
    this.id = data.id || uuidv4()
    this.name = data.name
    this.code = data.code
    this.technologies = data.technologies.map(tech => 
      tech instanceof Technology ? tech : new Technology(tech)
    )
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  static fromJSON(json: any): Stack {
    return new Stack({
      id: json.id,
      name: json.name,
      code: json.code,
      technologies: json.technologies.map((tech: any) => Technology.fromJSON(tech)),
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : new Date()
    })
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      technologies: this.technologies.map(tech => tech.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
} 