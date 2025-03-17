import Prompt from '../Prompt'
import Stack from '../Stack'

describe('Prompt Model', () => {
  const mockStack = new Stack({
    name: 'Test Stack',
    code: 'TEST',
    technologies: []
  })

  const mockPromptData = {
    title: 'Test Prompt',
    description: 'This is a test prompt',
    stack: mockStack,
    copyCount: 0,
    createdBy: 'user123'
  }

  it('should create a new prompt with default values', () => {
    const prompt = new Prompt(mockPromptData)
    
    expect(prompt.id).toBeDefined()
    expect(prompt.title).toBe('Test Prompt')
    expect(prompt.description).toBe('This is a test prompt')
    expect(prompt.stack).toBe(mockStack)
    expect(prompt.copyCount).toBe(0)
    expect(prompt.createdBy).toBe('user123')
    expect(prompt.createdAt).toBeInstanceOf(Date)
    expect(prompt.updatedAt).toBeInstanceOf(Date)
  })

  it('should create a prompt with provided id and dates', () => {
    const id = 'test-id-123'
    const createdAt = new Date('2023-01-01')
    const updatedAt = new Date('2023-01-02')
    
    const prompt = new Prompt({
      ...mockPromptData,
      id,
      createdAt,
      updatedAt
    })
    
    expect(prompt.id).toBe(id)
    expect(prompt.createdAt).toBe(createdAt)
    expect(prompt.updatedAt).toBe(updatedAt)
  })

  it('should convert to JSON correctly', () => {
    const prompt = new Prompt(mockPromptData)
    const json = prompt.toJSON()
    
    expect(json.id).toBe(prompt.id)
    expect(json.title).toBe(prompt.title)
    expect(json.description).toBe(prompt.description)
    expect(json.stack).toEqual(mockStack.toJSON())
    expect(json.copyCount).toBe(prompt.copyCount)
    expect(json.createdBy).toBe(prompt.createdBy)
    expect(json.createdAt).toBe(prompt.createdAt)
    expect(json.updatedAt).toBe(prompt.updatedAt)
  })

  it('should create from JSON correctly', () => {
    const originalPrompt = new Prompt(mockPromptData)
    const json = originalPrompt.toJSON()
    const recreatedPrompt = Prompt.fromJSON(json)
    
    expect(recreatedPrompt.id).toBe(originalPrompt.id)
    expect(recreatedPrompt.title).toBe(originalPrompt.title)
    expect(recreatedPrompt.description).toBe(originalPrompt.description)
    expect(recreatedPrompt.stack?.id).toBe(originalPrompt.stack?.id)
    expect(recreatedPrompt.copyCount).toBe(originalPrompt.copyCount)
    expect(recreatedPrompt.createdBy).toBe(originalPrompt.createdBy)
  })

  it('should increment copy count', () => {
    const prompt = new Prompt(mockPromptData)
    const initialCopyCount = prompt.copyCount
    const initialUpdatedAt = prompt.updatedAt
    
    // Wait a small amount to ensure updatedAt will be different
    setTimeout(() => {
      const newCopyCount = prompt.incrementCopyCount()
      
      expect(newCopyCount).toBe(initialCopyCount + 1)
      expect(prompt.copyCount).toBe(initialCopyCount + 1)
      expect(prompt.updatedAt).not.toBe(initialUpdatedAt)
    }, 10)
  })
}) 