'use client'

import Prompt, { PromptData } from '@/models/Prompt'
import { localStorageService } from './local-storage-service'

const STORAGE_KEY = 'aidev_prompts'

export class PromptService {
  private prompts: Prompt[] = []

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    const data = localStorageService.getItem<PromptData[]>(STORAGE_KEY) || []
    this.prompts = data.map((promptData: PromptData) => new Prompt(promptData))
  }

  private saveToStorage() {
    localStorageService.setItem(STORAGE_KEY, this.prompts.map(prompt => prompt.toJSON()))
  }

  getAll(): Prompt[] {
    return [...this.prompts]
  }

  getById(id: string): Prompt | undefined {
    return this.prompts.find(prompt => prompt.id === id)
  }

  getByStack(stackId: string | undefined): Prompt[] {
    if (!stackId) return this.getAll()
    return this.prompts.filter(prompt => prompt.stack?.id === stackId)
  }

  create(data: PromptData): Prompt {
    const prompt = new Prompt(data)
    this.prompts.push(prompt)
    this.saveToStorage()
    return prompt
  }

  update(id: string, data: Partial<PromptData>): Prompt | undefined {
    const index = this.prompts.findIndex(prompt => prompt.id === id)
    if (index === -1) return undefined

    const currentPrompt = this.prompts[index]
    const updatedPrompt = new Prompt({
      ...currentPrompt.toJSON(),
      ...data,
      id // Ensure ID doesn't change
    })

    this.prompts[index] = updatedPrompt
    this.saveToStorage()
    return updatedPrompt
  }

  delete(id: string): boolean {
    const index = this.prompts.findIndex(prompt => prompt.id === id)
    if (index === -1) return false

    this.prompts.splice(index, 1)
    this.saveToStorage()
    return true
  }

  incrementCopyCount(id: string): number | undefined {
    const prompt = this.getById(id)
    if (!prompt) return undefined

    const count = prompt.incrementCopyCount()
    this.saveToStorage()
    return count
  }

  getMostCopied(limit: number = 5): Prompt[] {
    return [...this.prompts]
      .sort((a, b) => b.copyCount - a.copyCount)
      .slice(0, limit)
  }
}

export const promptService = new PromptService() 