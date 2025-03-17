import { profileService } from '../profile-service'
import { stackService } from '../stack-service'
import { localStorageService } from '../local-storage-service'
import Profile from '@/models/Profile'

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

// Mock the stackService
jest.mock('../stack-service', () => ({
  stackService: {
    getById: jest.fn(),
    update: jest.fn(),
    getAll: jest.fn().mockReturnValue([])
  }
}))

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('profile1')
}))

describe('ProfileService', () => {
  let testProfileService: any

  const mockProfile1 = new Profile({
    id: 'profile1',
    name: 'Test Profile 1',
    description: 'Test description 1',
    stacks: ['stack1', 'stack2']
  })

  const mockProfile2 = new Profile({
    id: 'profile2',
    name: 'Test Profile 2',
    description: 'Test description 2',
    stacks: ['stack3']
  })

  const mockProfiles = [mockProfile1, mockProfile2]

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock the localStorage to return our test data
    ;(localStorageService.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'aidev_profiles') {
        return mockProfiles.map(profile => profile.toJSON())
      }
      return null
    })
    
    // Mock stackService.getById to return mock stacks with profiles property
    ;(stackService.getById as jest.Mock).mockImplementation((id: string) => {
      if (id === 'stack1') return { id: 'stack1', name: 'Stack 1', profiles: [] }
      if (id === 'stack2') return { id: 'stack2', name: 'Stack 2', profiles: [] }
      if (id === 'stack3') return { id: 'stack3', name: 'Stack 3', profiles: [] }
      if (id === 'stack4') return { id: 'stack4', name: 'Stack 4', profiles: [] }
      return undefined
    })
    
    // Create a new instance of ProfileService for each test
    testProfileService = new (profileService.constructor as any)()
  })

  it('should load profiles from storage on initialization', () => {
    expect(localStorageService.getItem).toHaveBeenCalledWith('aidev_profiles')
    expect(testProfileService.getAll().length).toBe(2)
  })

  it('should get all profiles', () => {
    const profiles = testProfileService.getAll()
    
    expect(profiles.length).toBe(2)
    expect(profiles[0].id).toBe('profile1')
    expect(profiles[1].id).toBe('profile2')
  })

  it('should get a profile by id', () => {
    const profile = testProfileService.getById('profile1')
    
    expect(profile).toBeDefined()
    expect(profile?.id).toBe('profile1')
    expect(profile?.name).toBe('Test Profile 1')
  })

  it('should return undefined for non-existent profile id', () => {
    const profile = testProfileService.getById('non-existent')
    
    expect(profile).toBeUndefined()
  })

  it('should create a new profile', () => {
    const newProfileData = {
      name: 'New Profile',
      description: 'New profile description',
      stacks: ['stack1']
    }
    
    const newProfile = testProfileService.create(newProfileData)
    
    expect(newProfile.id).toBe('profile1') // Using our mocked uuid
    expect(newProfile.name).toBe('New Profile')
    expect(newProfile.description).toBe('New profile description')
    expect(newProfile.stacks).toEqual(['stack1'])
    expect(localStorageService.setItem).toHaveBeenCalled()
  })

  it('should update an existing profile', () => {
    const updatedData = {
      name: 'Updated Profile',
      description: 'Updated description',
      stacks: ['stack3', 'stack4']
    }
    
    const updatedProfile = testProfileService.update('profile1', updatedData)
    
    expect(updatedProfile).toBeDefined()
    expect(updatedProfile?.id).toBe('profile1')
    expect(updatedProfile?.name).toBe('Updated Profile')
    expect(updatedProfile?.description).toBe('Updated description')
    expect(updatedProfile?.stacks).toEqual(['stack3', 'stack4'])
    expect(localStorageService.setItem).toHaveBeenCalled()
  })

  it('should return undefined when updating a non-existent profile', () => {
    const updatedData = {
      name: 'Updated Profile'
    }
    
    const result = testProfileService.update('non-existent', updatedData)
    
    expect(result).toBeUndefined()
  })

  it('should delete a profile', () => {
    const result = testProfileService.delete('profile1')
    
    expect(result).toBe(true)
    expect(localStorageService.setItem).toHaveBeenCalled()
    
    // The profile should no longer be in the list
    const remainingProfiles = testProfileService.getAll()
    expect(remainingProfiles.length).toBe(1)
    expect(remainingProfiles[0].id).toBe('profile2')
  })

  it('should return false when deleting a non-existent profile', () => {
    const result = testProfileService.delete('non-existent')
    
    expect(result).toBe(false)
  })

  it('should get stacks for a profile', () => {
    // Mock stackService.getById to return mock stacks
    (stackService.getById as jest.Mock).mockImplementation((id: string) => {
      if (id === 'stack1') return { id: 'stack1', name: 'Stack 1' }
      if (id === 'stack2') return { id: 'stack2', name: 'Stack 2' }
      return undefined
    })

    const stacks = testProfileService.getStacksForProfile('profile1')
    
    expect(stacks.length).toBe(2)
    expect(stacks[0].id).toBe('stack1')
    expect(stacks[1].id).toBe('stack2')
    expect(stackService.getById).toHaveBeenCalledTimes(2)
  })

  it('should update stacks relationship when updating a profile', () => {
    // Setup initial mock profile with stacks
    const profile = testProfileService.getById('profile1')
    expect(profile.stacks).toEqual(['stack1', 'stack2'])

    // Update profile with new stacks
    const updatedData = {
      stacks: ['stack1', 'stack3'] // Removed stack2, added stack3
    }

    testProfileService.update('profile1', updatedData)

    // Verify that stackService.update was called for stack relationships
    expect(stackService.update).toHaveBeenCalledTimes(2)
  })
}) 