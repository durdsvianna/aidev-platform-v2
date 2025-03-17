import { PromptService, promptService } from '../prompt-service'
import { localStorageService } from '../local-storage-service'
import Prompt from '@/models/Prompt'
import Stack from '@/models/Stack'
import { v4 as uuidv4 } from 'uuid'

// Mock the localStorageService
jest.mock('../local-storage-service', () => ({
  localStorageService: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    isAvailable: jest.fn().mockReturnValue(true)
  }
}))

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('prompt1')
}))

describe('PromptService', () => {
  let testPromptService: PromptService

  const mockStack = new Stack({
    name: 'Test Stack',
    code: 'TEST',
    technologies: []
  })

  const mockPrompt1 = new Prompt({
    id: 'prompt1',
    title: 'Test Prompt 1',
    description: 'Description 1',
    stack: mockStack,
    copyCount: 5
  })

  const mockPrompt2 = new Prompt({
    id: 'prompt2',
    title: 'Test Prompt 2',
    description: 'Description 2',
    copyCount: 2
  })

  const mockPrompts = [mockPrompt1, mockPrompt2]

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock the localStorage to return our test data
    ;(localStorageService.getItem as jest.Mock).mockReturnValue(
      mockPrompts.map(prompt => prompt.toJSON())
    )
    
    // Create a new instance of PromptService for each test
    testPromptService = new PromptService()
  })

  it('should load prompts from storage on initialization', () => {
    expect(localStorageService.getItem).toHaveBeenCalledWith('aidev_prompts')
    expect(testPromptService.getAll().length).toBe(2)
  })

  it('should get all prompts', () => {
    const prompts = testPromptService.getAll()
    
    expect(prompts.length).toBe(2)
    expect(prompts[0].id).toBe('prompt1')
    expect(prompts[1].id).toBe('prompt2')
  })

  it('should get a prompt by id', () => {
    const prompt = testPromptService.getById('prompt1')
    
    expect(prompt).toBeDefined()
    expect(prompt?.id).toBe('prompt1')
    expect(prompt?.title).toBe('Test Prompt 1')
  })

  it('should return undefined for non-existent prompt id', () => {
    const prompt = testPromptService.getById('non-existent')
    
    expect(prompt).toBeUndefined()
  })

  it('should get prompts by stack id', () => {
    const prompts = testPromptService.getByStack(mockStack.id)
    
    expect(prompts.length).toBe(1)
    expect(prompts[0].id).toBe('prompt1')
  })

  it('should create a new prompt', () => {
    const newPromptData = {
      title: 'New Prompt',
      description: 'New Description',
      copyCount: 0
    }
    
    const newPrompt = testPromptService.create(newPromptData)
    
    expect(newPrompt.id).toBe('prompt1') // Using our mocked uuid
    expect(newPrompt.title).toBe('New Prompt')
    expect(newPrompt.description).toBe('New Description')
    expect(localStorageService.setItem).toHaveBeenCalled()
  })

  it('should update an existing prompt', () => {
    const updatedData = {
      title: 'Updated Title',
      description: 'Updated Description'
    }
    
    const updatedPrompt = testPromptService.update('prompt1', updatedData)
    
    expect(updatedPrompt).toBeDefined()
    expect(updatedPrompt?.id).toBe('prompt1')
    expect(updatedPrompt?.title).toBe('Updated Title')
    expect(updatedPrompt?.description).toBe('Updated Description')
    expect(localStorageService.setItem).toHaveBeenCalled()
  })

  it('should return undefined when updating a non-existent prompt', () => {
    const updatedData = {
      title: 'Updated Title'
    }
    
    const result = testPromptService.update('non-existent', updatedData)
    
    expect(result).toBeUndefined()
  })

  it('should delete a prompt', () => {
    const result = testPromptService.delete('prompt1')
    
    expect(result).toBe(true)
    expect(localStorageService.setItem).toHaveBeenCalled()
    
    // The prompt should no longer be in the list
    const remainingPrompts = testPromptService.getAll()
    expect(remainingPrompts.length).toBe(1)
    expect(remainingPrompts[0].id).toBe('prompt2')
  })

  it('should return false when deleting a non-existent prompt', () => {
    const result = testPromptService.delete('non-existent')
    
    expect(result).toBe(false)
  })

  it('should increment copy count', () => {
    const initialCount = 5 // Known initial count from mockPrompt1
    const newCount = testPromptService.incrementCopyCount('prompt1')
    
    expect(newCount).toBe(initialCount + 1)
    expect(localStorageService.setItem).toHaveBeenCalled()
  })

  it('should return undefined when incrementing copy count for non-existent prompt', () => {
    const result = testPromptService.incrementCopyCount('non-existent')
    
    expect(result).toBeUndefined()
  })

  it('should get most copied prompts', () => {
    const mostCopied = testPromptService.getMostCopied(1)
    
    expect(mostCopied.length).toBe(1)
    expect(mostCopied[0].id).toBe('prompt1')
    expect(mostCopied[0].copyCount).toBe(5)
  })
}) 