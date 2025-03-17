'use client'

import Profile, { ProfileData } from '@/models/Profile'
import { localStorageService } from './local-storage-service'
import { stackService } from './stack-service'

const STORAGE_KEY = 'aidev_profiles'

export class ProfileService {
  private profiles: Profile[] = []

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    const data = localStorageService.getItem<ProfileData[]>(STORAGE_KEY) || []
    this.profiles = data.map((profileData: ProfileData) => new Profile(profileData))
  }

  private saveToStorage() {
    localStorageService.setItem(STORAGE_KEY, this.profiles.map(profile => profile.toJSON()))
  }

  getAll(): Profile[] {
    return [...this.profiles]
  }

  getById(id: string): Profile | undefined {
    return this.profiles.find(profile => profile.id === id)
  }

  create(data: ProfileData): Profile {
    const profile = new Profile(data)
    this.profiles.push(profile)
    this.saveToStorage()
    return profile
  }

  update(id: string, data: Partial<ProfileData>): Profile | undefined {
    const index = this.profiles.findIndex(profile => profile.id === id)
    if (index === -1) return undefined

    const currentProfile = this.profiles[index]
    
    // Update basic properties
    if (data.name !== undefined) currentProfile.name = data.name
    if (data.description !== undefined) currentProfile.description = data.description
    if (data.stacks !== undefined) {
      currentProfile.stacks = data.stacks.map(stack => 
        typeof stack === 'string' ? stack : stack.id || ''
      ).filter(id => id !== '')
    }
    
    currentProfile.updatedAt = new Date()
    
    this.profiles[index] = currentProfile
    this.saveToStorage()
    
    return currentProfile
  }

  delete(id: string): boolean {
    const initialLength = this.profiles.length
    this.profiles = this.profiles.filter(profile => profile.id !== id)
    
    if (this.profiles.length !== initialLength) {
      this.saveToStorage()
      return true
    }
    
    return false
  }

  // Get stack objects for a profile
  getStacksForProfile(profileId: string): any[] {
    const profile = this.getById(profileId)
    if (!profile) return []
    
    return profile.stacks
      .map(stackId => stackService.getById(stackId))
      .filter(Boolean) // Remove any null/undefined entries
  }

  // Add a stack to a profile
  addStackToProfile(profileId: string, stackId: string): Profile | undefined {
    const profile = this.getById(profileId)
    if (!profile) return undefined
    
    // Check if stack is already in the profile
    if (!profile.stacks.includes(stackId)) {
      profile.stacks.push(stackId)
      profile.updatedAt = new Date()
      this.saveToStorage()
    }
    
    return profile
  }

  // Remove a stack from a profile
  removeStackFromProfile(profileId: string, stackId: string): Profile | undefined {
    const profile = this.getById(profileId)
    if (!profile) return undefined
    
    const initialLength = profile.stacks.length
    profile.stacks = profile.stacks.filter(id => id !== stackId)
    
    if (profile.stacks.length !== initialLength) {
      profile.updatedAt = new Date()
      this.saveToStorage()
    }
    
    return profile
  }
}

export const profileService = new ProfileService() 