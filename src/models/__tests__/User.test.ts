import User from '../User'
import Profile from '../Profile'

describe('User Model', () => {
  const mockUserData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  }

  it('should create a new user with default values', () => {
    const user = new User(mockUserData)
    
    expect(user.id).toBeDefined()
    expect(user.name).toBe('Test User')
    expect(user.email).toBe('test@example.com')
    expect(user.password).toBe('password123')
    expect(user.description).toBe('')
    expect(user.profileImage).toBe('')
    expect(user.profile).toBeUndefined()
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.updatedAt).toBeInstanceOf(Date)
  })

  it('should create a user with provided id, profile, and dates', () => {
    const id = 'user-id-123'
    const createdAt = new Date('2023-01-01')
    const updatedAt = new Date('2023-01-02')
    const profile = new Profile({
      name: 'Test Profile',
      description: 'Test profile description'
    })
    
    const user = new User({
      ...mockUserData,
      id,
      description: 'Test description',
      profileImage: 'test-image.jpg',
      profile,
      createdAt,
      updatedAt
    })
    
    expect(user.id).toBe(id)
    expect(user.description).toBe('Test description')
    expect(user.profileImage).toBe('test-image.jpg')
    expect(user.profile).toBe(profile)
    expect(user.createdAt).toBe(createdAt)
    expect(user.updatedAt).toBe(updatedAt)
  })

  it('should convert to JSON correctly', () => {
    const profile = new Profile({
      name: 'Test Profile',
      description: 'Test profile description'
    })
    
    const user = new User({
      ...mockUserData,
      profile
    })
    
    const json = user.toJSON()
    
    expect(json.id).toBe(user.id)
    expect(json.name).toBe(user.name)
    expect(json.email).toBe(user.email)
    expect(json.password).toBe(user.password)
    expect(json.description).toBe(user.description)
    expect(json.profileImage).toBe(user.profileImage)
    expect(json.profile).toEqual(profile.toJSON())
    expect(json.createdAt).toBe(user.createdAt)
    expect(json.updatedAt).toBe(user.updatedAt)
  })

  it('should create from JSON correctly', () => {
    const profile = new Profile({
      name: 'Test Profile',
      description: 'Test profile description'
    })
    
    const originalUser = new User({
      ...mockUserData,
      profile
    })
    
    const json = originalUser.toJSON()
    const recreatedUser = User.fromJSON(json)
    
    expect(recreatedUser.id).toBe(originalUser.id)
    expect(recreatedUser.name).toBe(originalUser.name)
    expect(recreatedUser.email).toBe(originalUser.email)
    expect(recreatedUser.password).toBe(originalUser.password)
    expect(recreatedUser.description).toBe(originalUser.description)
    expect(recreatedUser.profileImage).toBe(originalUser.profileImage)
    expect(recreatedUser.profile?.id).toBe(originalUser.profile?.id)
    expect(recreatedUser.profile?.name).toBe(originalUser.profile?.name)
    expect(recreatedUser.profile?.description).toBe(originalUser.profile?.description)
    expect(recreatedUser.createdAt).toEqual(originalUser.createdAt)
    expect(recreatedUser.updatedAt).toEqual(originalUser.updatedAt)
  })
}) 