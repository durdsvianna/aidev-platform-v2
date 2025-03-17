import Profile from '../Profile'

describe('Profile Model', () => {
  const mockProfileData = {
    name: 'Test Profile',
    description: 'Test profile description'
  }

  it('should create a new profile with default values', () => {
    const profile = new Profile(mockProfileData)
    
    expect(profile.id).toBeDefined()
    expect(profile.name).toBe('Test Profile')
    expect(profile.description).toBe('Test profile description')
    expect(profile.createdAt).toBeInstanceOf(Date)
    expect(profile.updatedAt).toBeInstanceOf(Date)
  })

  it('should create a profile with provided id and dates', () => {
    const id = 'profile-id-123'
    const createdAt = new Date('2023-01-01')
    const updatedAt = new Date('2023-01-02')
    
    const profile = new Profile({
      ...mockProfileData,
      id,
      createdAt,
      updatedAt
    })
    
    expect(profile.id).toBe(id)
    expect(profile.createdAt).toBe(createdAt)
    expect(profile.updatedAt).toBe(updatedAt)
  })

  it('should convert to JSON correctly', () => {
    const profile = new Profile(mockProfileData)
    const json = profile.toJSON()
    
    expect(json.id).toBe(profile.id)
    expect(json.name).toBe(profile.name)
    expect(json.description).toBe(profile.description)
    expect(json.createdAt).toBe(profile.createdAt)
    expect(json.updatedAt).toBe(profile.updatedAt)
  })

  it('should create from JSON correctly', () => {
    const originalProfile = new Profile(mockProfileData)
    const json = originalProfile.toJSON()
    const recreatedProfile = Profile.fromJSON(json)
    
    expect(recreatedProfile.id).toBe(originalProfile.id)
    expect(recreatedProfile.name).toBe(originalProfile.name)
    expect(recreatedProfile.description).toBe(originalProfile.description)
    expect(recreatedProfile.createdAt).toEqual(originalProfile.createdAt)
    expect(recreatedProfile.updatedAt).toEqual(originalProfile.updatedAt)
  })
}) 