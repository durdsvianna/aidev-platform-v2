'use client'

export class LocalStorageService {
  isAvailable(): boolean {
    try {
      const testKey = '__test__'
      localStorage.setItem(testKey, testKey)
      localStorage.removeItem(testKey)
      return true
    } catch (e) {
      return false
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isAvailable()) return null

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      console.error(`Error getting item from localStorage: ${e}`)
      return null
    }
  }

  setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false

    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      console.error(`Error setting item in localStorage: ${e}`)
      return false
    }
  }

  removeItem(key: string): boolean {
    if (!this.isAvailable()) return false

    try {
      localStorage.removeItem(key)
      return true
    } catch (e) {
      console.error(`Error removing item from localStorage: ${e}`)
      return false
    }
  }

  clear(): boolean {
    if (!this.isAvailable()) return false

    try {
      localStorage.clear()
      return true
    } catch (e) {
      console.error(`Error clearing localStorage: ${e}`)
      return false
    }
  }
}

export const localStorageService = new LocalStorageService() 