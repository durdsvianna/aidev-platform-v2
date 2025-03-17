'use client'

import Stack, { StackData } from '@/models/Stack'
import Technology from '@/models/Technology'
import { localStorageService } from './local-storage-service'

const STORAGE_KEY = 'aidev_stacks'

export class StackService {
  private stacks: Stack[] = []

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    const data = localStorageService.getItem<StackData[]>(STORAGE_KEY) || []
    this.stacks = data.map((stackData: StackData) => new Stack(stackData))
  }

  private saveToStorage() {
    localStorageService.setItem(STORAGE_KEY, this.stacks.map(stack => stack.toJSON()))
  }

  getAll(): Stack[] {
    return [...this.stacks]
  }

  getById(id: string): Stack | undefined {
    return this.stacks.find(stack => stack.id === id)
  }

  getByCode(code: string): Stack | undefined {
    return this.stacks.find(stack => stack.code === code)
  }

  create(data: StackData): Stack {
    const stack = new Stack(data)
    this.stacks.push(stack)
    this.saveToStorage()
    return stack
  }

  update(id: string, data: Partial<StackData>): Stack | undefined {
    const index = this.stacks.findIndex(stack => stack.id === id)
    if (index === -1) return undefined

    const currentStack = this.stacks[index]
    
    // Update basic properties
    if (data.name !== undefined) currentStack.name = data.name
    if (data.code !== undefined) currentStack.code = data.code
    if (data.technologies !== undefined) {
      currentStack.technologies = data.technologies.map(tech => 
        tech instanceof Technology ? tech : new Technology(tech)
      )
    }
    
    currentStack.updatedAt = new Date()
    
    this.stacks[index] = currentStack
    this.saveToStorage()
    
    return currentStack
  }

  delete(id: string): boolean {
    const initialLength = this.stacks.length
    this.stacks = this.stacks.filter(stack => stack.id !== id)
    
    if (this.stacks.length !== initialLength) {
      this.saveToStorage()
      return true
    }
    
    return false
  }

  // Add a technology to a stack
  addTechnology(stackId: string, technology: Technology): Stack | undefined {
    const stack = this.getById(stackId)
    if (!stack) return undefined
    
    // Check if technology is already in the stack
    const exists = stack.technologies.some(tech => tech.id === technology.id)
    if (!exists) {
      stack.technologies.push(technology)
      stack.updatedAt = new Date()
      this.saveToStorage()
    }
    
    return stack
  }

  // Remove a technology from a stack
  removeTechnology(stackId: string, technologyId: string): Stack | undefined {
    const stack = this.getById(stackId)
    if (!stack) return undefined
    
    const initialLength = stack.technologies.length
    stack.technologies = stack.technologies.filter(tech => tech.id !== technologyId)
    
    if (stack.technologies.length !== initialLength) {
      stack.updatedAt = new Date()
      this.saveToStorage()
    }
    
    return stack
  }
}

export const stackService = new StackService() 