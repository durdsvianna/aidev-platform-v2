import Stack from '../Stack'
import Technology from '../Technology'

describe('Stack Model', () => {
  const mockTechnologies = [
    new Technology({
      name: 'React',
      description: 'A JavaScript library for building user interfaces'
    }),
    new Technology({
      name: 'TypeScript',
      description: 'A typed superset of JavaScript'
    }),
    new Technology({
      name: 'Next.js',
      description: 'A React framework for production'
    })
  ]

  const mockStackData = {
    name: 'Test Stack',
    code: 'TEST',
    technologies: mockTechnologies
  }

  it('should create a new stack with default values', () => {
    const stack = new Stack(mockStackData)
    
    expect(stack.id).toBeDefined()
    expect(stack.name).toBe('Test Stack')
    expect(stack.code).toBe('TEST')
    expect(stack.technologies.length).toBe(3)
    expect(stack.technologies[0].name).toBe('React')
    expect(stack.technologies[1].name).toBe('TypeScript')
    expect(stack.technologies[2].name).toBe('Next.js')
    expect(stack.createdAt).toBeInstanceOf(Date)
    expect(stack.updatedAt).toBeInstanceOf(Date)
  })

  it('should create a stack with provided id and dates', () => {
    const id = 'test-id-123'
    const createdAt = new Date('2023-01-01')
    const updatedAt = new Date('2023-01-02')
    
    const stack = new Stack({
      ...mockStackData,
      id,
      createdAt,
      updatedAt
    })
    
    expect(stack.id).toBe(id)
    expect(stack.createdAt).toBe(createdAt)
    expect(stack.updatedAt).toBe(updatedAt)
  })

  it('should convert to JSON correctly', () => {
    const stack = new Stack(mockStackData)
    const json = stack.toJSON()
    
    expect(json.id).toBe(stack.id)
    expect(json.name).toBe(stack.name)
    expect(json.code).toBe(stack.code)
    expect(json.technologies.length).toBe(3)
    expect(json.technologies[0].name).toBe('React')
    expect(json.technologies[1].name).toBe('TypeScript')
    expect(json.technologies[2].name).toBe('Next.js')
    expect(json.createdAt).toBe(stack.createdAt)
    expect(json.updatedAt).toBe(stack.updatedAt)
  })

  it('should create from JSON correctly', () => {
    const originalStack = new Stack(mockStackData)
    const json = originalStack.toJSON()
    const recreatedStack = Stack.fromJSON(json)
    
    expect(recreatedStack.id).toBe(originalStack.id)
    expect(recreatedStack.name).toBe(originalStack.name)
    expect(recreatedStack.code).toBe(originalStack.code)
    expect(recreatedStack.technologies.length).toBe(originalStack.technologies.length)
    expect(recreatedStack.technologies[0].name).toBe(originalStack.technologies[0].name)
    expect(recreatedStack.technologies[1].name).toBe(originalStack.technologies[1].name)
    expect(recreatedStack.technologies[2].name).toBe(originalStack.technologies[2].name)
    expect(recreatedStack.createdAt).toEqual(originalStack.createdAt)
    expect(recreatedStack.updatedAt).toEqual(originalStack.updatedAt)
  })
}) 