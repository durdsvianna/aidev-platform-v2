import Technology from '../Technology'

describe('Technology Model', () => {
  const mockTechnologyData = {
    name: 'React',
    description: 'A JavaScript library for building user interfaces'
  }

  it('should create a new technology with default values', () => {
    const technology = new Technology(mockTechnologyData)
    
    expect(technology.id).toBeDefined()
    expect(technology.name).toBe('React')
    expect(technology.description).toBe('A JavaScript library for building user interfaces')
    expect(technology.createdAt).toBeInstanceOf(Date)
    expect(technology.updatedAt).toBeInstanceOf(Date)
  })

  it('should create a technology with provided id and dates', () => {
    const id = 'tech-id-123'
    const createdAt = new Date('2023-01-01')
    const updatedAt = new Date('2023-01-02')
    
    const technology = new Technology({
      ...mockTechnologyData,
      id,
      createdAt,
      updatedAt
    })
    
    expect(technology.id).toBe(id)
    expect(technology.createdAt).toBe(createdAt)
    expect(technology.updatedAt).toBe(updatedAt)
  })

  it('should convert to JSON correctly', () => {
    const technology = new Technology(mockTechnologyData)
    const json = technology.toJSON()
    
    expect(json.id).toBe(technology.id)
    expect(json.name).toBe(technology.name)
    expect(json.description).toBe(technology.description)
    expect(json.createdAt).toBe(technology.createdAt)
    expect(json.updatedAt).toBe(technology.updatedAt)
  })

  it('should create from JSON correctly', () => {
    const originalTechnology = new Technology(mockTechnologyData)
    const json = originalTechnology.toJSON()
    const recreatedTechnology = Technology.fromJSON(json)
    
    expect(recreatedTechnology.id).toBe(originalTechnology.id)
    expect(recreatedTechnology.name).toBe(originalTechnology.name)
    expect(recreatedTechnology.description).toBe(originalTechnology.description)
    expect(recreatedTechnology.createdAt).toEqual(originalTechnology.createdAt)
    expect(recreatedTechnology.updatedAt).toEqual(originalTechnology.updatedAt)
  })
}) 