// Mock modules before importing
jest.mock('../local-storage-service');
jest.mock('../stack-service');
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('profile1')
}));

// Now import modules
import { profileService } from '../profile-service';
import { localStorageService } from '../local-storage-service';
import { stackService } from '../stack-service';
import Profile from '@/models/Profile';

describe('ProfileService', () => {
  // Mock data
  const mockProfile1 = new Profile({
    id: 'profile1',
    name: 'Test Profile 1',
    description: 'Test description 1',
    stacks: ['stack1', 'stack2']
  });

  const mockProfile2 = new Profile({
    id: 'profile2',
    name: 'Test Profile 2',
    description: 'Test description 2',
    stacks: ['stack3']
  });

  const mockProfiles = [mockProfile1, mockProfile2];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Configure localStorage mock
    (localStorageService.getItem as jest.Mock).mockReturnValue(
      mockProfiles.map(profile => profile.toJSON())
    );
    
    // Set up stackService mocks
    (stackService.getById as jest.Mock).mockImplementation((id) => {
      if (id === 'stack1') return { id: 'stack1', name: 'Stack 1' };
      if (id === 'stack2') return { id: 'stack2', name: 'Stack 2' };
      if (id === 'stack3') return { id: 'stack3', name: 'Stack 3' };
      if (id === 'stack4') return { id: 'stack4', name: 'Stack 4' };
      return undefined;
    });
    
    // Reset profiles in service
    profileService['profiles'] = [...mockProfiles];
  });

  it('should get all profiles', () => {
    const profiles = profileService.getAll();
    expect(profiles.length).toBe(2);
  });

  it('should get a profile by id', () => {
    const profile = profileService.getById('profile1');
    expect(profile).toBeDefined();
    expect(profile?.name).toBe('Test Profile 1');
  });

  it('should create a new profile', () => {
    const newProfile = profileService.create({
      name: 'New Profile',
      description: 'Test description',
      stacks: ['stack1']
    });
    
    expect(newProfile.id).toBe('profile1');
    expect(localStorageService.setItem).toHaveBeenCalled();
  });

  it('should update a profile', () => {
    const updated = profileService.update('profile1', {
      name: 'Updated Profile'
    });
    
    expect(updated?.name).toBe('Updated Profile');
    expect(localStorageService.setItem).toHaveBeenCalled();
  });

  it('should delete a profile', () => {
    const result = profileService.delete('profile1');
    expect(result).toBe(true);
    expect(profileService.getAll().length).toBe(1);
  });

  it('should get stacks for a profile', () => {
    const stacks = profileService.getStacksForProfile('profile1');
    expect(stacks.length).toBe(2);
    expect(stackService.getById).toHaveBeenCalledTimes(2);
  });
}); 