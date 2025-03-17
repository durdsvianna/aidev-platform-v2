import { userService } from '../user-service'
import { localStorageService } from '../local-storage-service'
import User from '@/models/User'

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
  v4: jest.fn().mockReturnValue('user1')
}))

describe('UserService', () => {
  let testUserService: any

  const mockUser1 = new User({
    id: 'user1',
    name: 'Test User 1',
    email: 'user1@example.com',
    password: 'password123'
  })

  const mockUser2 = new User({
    id: 'user2',
    name: 'Test User 2',
    email: 'user2@example.com',
    password: 'password456'
  })

  const mockUsers = [mockUser1, mockUser2]

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock the localStorage to return our test data
    ;(localStorageService.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'aidev_users') {
        return mockUsers.map(user => user.toJSON())
      }
      if (key === 'aidev_current_user') {
        return 'user1'
      }
      return null
    })
    
    // Create a new instance of UserService for each test
    testUserService = new (userService.constructor as any)()
  })

  it('should load users from storage on initialization', () => {
    expect(localStorageService.getItem).toHaveBeenCalledWith('aidev_users')
    expect(testUserService.getAll().length).toBe(2)
  })

  it('should get all users', () => {
    const users = testUserService.getAll()
    
    expect(users.length).toBe(2)
    expect(users[0].id).toBe('user1')
    expect(users[1].id).toBe('user2')
  })

  it('should get a user by id', () => {
    const user = testUserService.getById('user1')
    
    expect(user).toBeDefined()
    expect(user?.id).toBe('user1')
    expect(user?.name).toBe('Test User 1')
  })

  it('should return undefined for non-existent user id', () => {
    const user = testUserService.getById('non-existent')
    
    expect(user).toBeUndefined()
  })

  it('should create a new user', () => {
    const newUserData = {
      name: 'New User',
      email: 'new@example.com',
      password: 'newpassword'
    }
    
    const newUser = testUserService.create(newUserData)
    
    expect(newUser.id).toBe('user1') // Using our mocked uuid
    expect(newUser.name).toBe('New User')
    expect(newUser.email).toBe('new@example.com')
    expect(localStorageService.setItem).toHaveBeenCalled()
  })

  it('should update an existing user', () => {
    const updatedData = {
      name: 'Updated User',
      email: 'updated@example.com'
    }
    
    const updatedUser = testUserService.update('user1', updatedData)
    
    expect(updatedUser).toBeDefined()
    expect(updatedUser?.id).toBe('user1')
    expect(updatedUser?.name).toBe('Updated User')
    expect(updatedUser?.email).toBe('updated@example.com')
    expect(localStorageService.setItem).toHaveBeenCalled()
  })

  it('should return undefined when updating a non-existent user', () => {
    const updatedData = {
      name: 'Updated User'
    }
    
    const result = testUserService.update('non-existent', updatedData)
    
    expect(result).toBeUndefined()
  })

  it('should delete a user', () => {
    const result = testUserService.delete('user1')
    
    expect(result).toBe(true)
    expect(localStorageService.setItem).toHaveBeenCalled()
    
    // The user should no longer be in the list
    const remainingUsers = testUserService.getAll()
    expect(remainingUsers.length).toBe(1)
    expect(remainingUsers[0].id).toBe('user2')
  })

  it('should return false when deleting a non-existent user', () => {
    const result = testUserService.delete('non-existent')
    
    expect(result).toBe(false)
  })

  it('should get the current user', () => {
    const currentUser = testUserService.getCurrentUser()
    
    expect(currentUser).toBeDefined()
    expect(currentUser?.id).toBe('user1')
    expect(currentUser?.name).toBe('Test User 1')
  })

  it('should set the current user', () => {
    testUserService.setCurrentUser('user2')
    
    expect(localStorageService.setItem).toHaveBeenCalledWith(
      'aidev_current_user',
      'user2'
    )
  })

  it('should authenticate a user with correct credentials', () => {
    const user = testUserService.authenticate('user1@example.com', 'password123')
    
    expect(user).toBeDefined()
    expect(user?.id).toBe('user1')
    expect(localStorageService.setItem).toHaveBeenCalledWith(
      'aidev_current_user',
      'user1'
    )
  })

  it('should return undefined when authenticating with incorrect credentials', () => {
    const user = testUserService.authenticate('user1@example.com', 'wrongpassword')
    
    expect(user).toBeUndefined()
  })

  it('should logout the current user', () => {
    testUserService.logout()
    
    expect(localStorageService.removeItem).toHaveBeenCalledWith('aidev_current_user')
  })
}) 