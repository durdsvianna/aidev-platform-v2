'use client'

import Technology, { TechnologyData } from '@/models/Technology'
import { localStorageService } from './local-storage-service'

const STORAGE_KEY = 'aidev_technologies'

export class TechnologyService {
  private technologies: Technology[] = []

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    const data = localStorageService.getItem<TechnologyData[]>(STORAGE_KEY) || []
    this.technologies = data.map((techData: TechnologyData) => new Technology(techData))
  }

  private saveToStorage() {
    localStorageService.setItem(STORAGE_KEY, this.technologies.map(tech => tech.toJSON()))
  }

  getAll(): Technology[] {
    return [...this.technologies]
  }

  getById(id: string): Technology | undefined {
    return this.technologies.find(tech => tech.id === id)
  }

  create(data: TechnologyData): Technology {
    const technology = new Technology(data)
    this.technologies.push(technology)
    this.saveToStorage()
    return technology
  }

  update(id: string, data: Partial<TechnologyData>): Technology | undefined {
    const index = this.technologies.findIndex(tech => tech.id === id)
    if (index === -1) return undefined

    const currentTech = this.technologies[index]
    const updatedTech = new Technology({
      ...currentTech.toJSON(),
      ...data,
      id // Ensure ID doesn't change
    })

    this.technologies[index] = updatedTech
    this.saveToStorage()
    return updatedTech
  }

  delete(id: string): boolean {
    const index = this.technologies.findIndex(tech => tech.id === id)
    if (index === -1) return false

    this.technologies.splice(index, 1)
    this.saveToStorage()
    return true
  }
}

export const technologyService = new TechnologyService() 