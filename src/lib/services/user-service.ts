'use client'

import User, { UserData } from '@/models/User'
import { localStorageService } from './local-storage-service'

const STORAGE_KEY = 'aidev_users'
const CURRENT_USER_KEY = 'aidev_current_user'

export class UserService {
  private users: User[] = []
  private currentUserId: string | null = null

  constructor() {
    this.loadFromStorage()
    this.loadCurrentUser()
  }

  private loadFromStorage() {
    const data = localStorageService.getItem<UserData[]>(STORAGE_KEY) || []
    this.users = data.map((userData: UserData) => new User(userData))
  }

  private saveToStorage() {
    localStorageService.setItem(STORAGE_KEY, this.users.map(user => user.toJSON()))
  }

  private loadCurrentUser() {
    this.currentUserId = localStorageService.getItem<string>(CURRENT_USER_KEY)
  }

  private saveCurrentUser() {
    if (this.currentUserId) {
      localStorageService.setItem(CURRENT_USER_KEY, this.currentUserId)
    } else {
      localStorageService.removeItem(CURRENT_USER_KEY)
    }
  }

  getAll(): User[] {
    return [...this.users]
  }

  getById(id: string): User | undefined {
    return this.users.find(user => user.id === id)
  }

  getCurrentUser(): User | undefined {
    if (!this.currentUserId) return undefined
    return this.getById(this.currentUserId)
  }

  setCurrentUser(id: string | null): User | undefined {
    this.currentUserId = id
    this.saveCurrentUser()
    return this.getCurrentUser()
  }

  create(data: UserData): User {
    const user = new User(data)
    this.users.push(user)
    this.saveToStorage()
    return user
  }

  update(id: string, data: Partial<UserData>): User | undefined {
    const index = this.users.findIndex(user => user.id === id)
    if (index === -1) return undefined

    const currentUser = this.users[index]
    const updatedUser = new User({
      ...currentUser.toJSON(),
      ...data,
      id // Ensure ID doesn't change
    })

    this.users[index] = updatedUser
    this.saveToStorage()
    return updatedUser
  }

  delete(id: string): boolean {
    const index = this.users.findIndex(user => user.id === id)
    if (index === -1) return false

    this.users.splice(index, 1)
    this.saveToStorage()
    
    // If the deleted user was the current user, clear current user
    if (this.currentUserId === id) {
      this.setCurrentUser(null)
    }
    
    return true
  }

  authenticate(email: string, password: string): User | undefined {
    const user = this.users.find(u => u.email === email && u.password === password)
    if (user) {
      this.setCurrentUser(user.id)
    }
    return user
  }

  logout(): void {
    this.setCurrentUser(null)
  }
}

export const userService = new UserService() 