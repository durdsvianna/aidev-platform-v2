import { stackService } from '../stack-service'
import { localStorageService } from '../local-storage-service'
import Stack from '@/models/Stack'
import Technology from '@/models/Technology'

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
  v4: jest.fn().mockReturnValue('stack1')
}))

describe('StackService', () => {
  let testStackService: any

  const mockTech1 = new Technology({
    id: 'tech1',
    name: 'React',
    description: 'A JavaScript library for building user interfaces'
  })

  const mockTech2 = new Technology({
    id: 'tech2',
    name: 'Node.js',
    description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine'
  })

  const mockTech3 = new Technology({
    id: 'tech3',
    name: 'Express',
    description: 'Fast, unopinionated, minimalist web framework for Node.js'
  })

  // Create mock stacks
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks()
    
    // Reset localStorage mock
    (localStorageService.getItem as jest.Mock).mockReturnValue([
      {
        id: 'stack1',
        name: 'MERN Stack',
        code: 'mern',
        technologies: [
          {
            id: 'tech1',
            name: 'React',
            description: 'A JavaScript library for building user interfaces',
            createdAt: new Date('2023-01-01').toISOString(),
            updatedAt: new Date('2023-01-01').toISOString()
          },
          {
            id: 'tech2',
            name: 'Node.js',
            description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
            createdAt: new Date('2023-01-01').toISOString(),
            updatedAt: new Date('2023-01-01').toISOString()
          }
        ],
        createdAt: new Date('2023-01-01').toISOString(),
        updatedAt: new Date('2023-01-01').toISOString()
      },
      {
        id: 'stack2',
        name: 'LAMP Stack',
        code: 'lamp',
        technologies: [],
        createdAt: new Date('2023-01-01').toISOString(),
        updatedAt: new Date('2023-01-01').toISOString()
      }
    ])
    
    // Create a new instance for testing
    testStackService = new stackService.constructor()
  })

  it('should get all stacks', () => {
    const stacks = testStackService.getAll()
    
    expect(stacks).toHaveLength(2)
    expect(stacks[0].id).toBe('stack1')
    expect(stacks[1].id).toBe('stack2')
  })

  it('should get stack by id', () => {
    const stack = testStackService.getById('stack1')
    
    expect(stack).toBeDefined()
    expect(stack.id).toBe('stack1')
    expect(stack.name).toBe('MERN Stack')
    expect(stack.technologies).toHaveLength(2)
  })

  it('should return undefined when getting a non-existent stack', () => {
    const stack = testStackService.getById('nonexistent')
    
    expect(stack).toBeUndefined()
  })

  it('should get stack by code', () => {
    const stack = testStackService.getByCode('mern')
    
    expect(stack).toBeDefined()
    expect(stack.id).toBe('stack1')
    expect(stack.code).toBe('mern')
  })

  it('should return undefined when getting a non-existent stack code', () => {
    const stack = testStackService.getByCode('nonexistent')
    
    expect(stack).toBeUndefined()
  })

  it('should create a new stack', () => {
    const newStackData = {
      name: 'New Stack',
      code: 'new-stack',
      technologies: [mockTech3]
    }
    
    const newStack = testStackService.create(newStackData)
    
    expect(newStack.id).toBe('stack1') // Using our mocked uuid
    expect(newStack.name).toBe('New Stack')
    expect(newStack.code).toBe('new-stack')
    expect(newStack.technologies.length).toBe(1)
    expect(newStack.technologies[0].id).toBe('tech3')
    expect(localStorageService.setItem).toHaveBeenCalled()
  })

  it('should update an existing stack', () => {
    const updatedData = {
      name: 'Updated Stack',
      code: 'updated-stack'
    }
    
    const updatedStack = testStackService.update('stack1', updatedData)
    
    expect(updatedStack).toBeDefined()
    expect(updatedStack?.id).toBe('stack1')
    expect(updatedStack?.name).toBe('Updated Stack')
    expect(updatedStack?.code).toBe('updated-stack')
    expect(localStorageService.setItem).toHaveBeenCalled()
  })

  it('should return undefined when updating a non-existent stack', () => {
    const updatedData = {
      name: 'Updated Stack'
    }
    
    const result = testStackService.update('nonexistent', updatedData)
    
    expect(result).toBeUndefined()
    expect(localStorageService.setItem).not.toHaveBeenCalled()
  })

  it('should delete a stack', () => {
    const result = testStackService.delete('stack1')
    
    expect(result).toBe(true)
    expect(localStorageService.setItem).toHaveBeenCalled()
    
    // Should now have one less stack
    expect(testStackService.getAll()).toHaveLength(1)
    // The stack with ID 'stack1' should be gone
    expect(testStackService.getById('stack1')).toBeUndefined()
  })

  it('should return false when deleting a non-existent stack', () => {
    const result = testStackService.delete('nonexistent')
    
    expect(result).toBe(false)
    // Make sure we didn't save anything
    expect(localStorageService.setItem).not.toHaveBeenCalled()
  })

  it('should add a technology to a stack', () => {
    const stack = testStackService.getById('stack2') // Has no technologies initially
    expect(stack.technologies).toHaveLength(0)
    
    testStackService.addTechnology('stack2', mockTech1)
    
    const updatedStack = testStackService.getById('stack2')
    expect(updatedStack.technologies).toHaveLength(1)
    expect(updatedStack.technologies[0].id).toBe('tech1')
    expect(localStorageService.setItem).toHaveBeenCalled()
  })

  it('should not add a technology if it already exists in the stack', () => {
    const stack = testStackService.getById('stack1') // Already has tech1 and tech2
    expect(stack.technologies).toHaveLength(2)
    
    testStackService.addTechnology('stack1', mockTech1) // Try to add tech1 again
    
    const updatedStack = testStackService.getById('stack1')
    expect(updatedStack.technologies).toHaveLength(2) // Still should have 2
  })

  it('should remove a technology from a stack', () => {
    const stack = testStackService.getById('stack1') // Has tech1 and tech2
    expect(stack.technologies).toHaveLength(2)
    
    testStackService.removeTechnology('stack1', 'tech1')
    
    const updatedStack = testStackService.getById('stack1')
    expect(updatedStack.technologies).toHaveLength(1)
    expect(updatedStack.technologies[0].id).toBe('tech2')
    expect(localStorageService.setItem).toHaveBeenCalled()
  })

  it('should not modify the stack if the technology is not found', () => {
    const stack = testStackService.getById('stack1')
    expect(stack.technologies).toHaveLength(2)
    
    testStackService.removeTechnology('stack1', 'nonexistent')
    
    const updatedStack = testStackService.getById('stack1')
    expect(updatedStack.technologies).toHaveLength(2) // Still should have 2
    expect(localStorageService.setItem).not.toHaveBeenCalled()
  })
}) 