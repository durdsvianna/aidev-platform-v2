import { localStorageService } from '../local-storage-service'

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    })
  }
})()

// Set up global localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('LocalStorageService', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    jest.clearAllMocks()
  })

  it('should check if localStorage is available', () => {
    expect(localStorageService.isAvailable()).toBe(true)
  })

  it('should set and get an item', () => {
    const testData = { name: 'Test', value: 123 }
    
    localStorageService.setItem('test-key', testData)
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify(testData)
    )
    
    const retrievedData = localStorageService.getItem<typeof testData>('test-key')
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key')
    expect(retrievedData).toEqual(testData)
  })

  it('should return null for non-existent keys', () => {
    const result = localStorageService.getItem('non-existent')
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('non-existent')
    expect(result).toBeNull()
  })

  it('should remove an item', () => {
    // First set an item
    localStorageService.setItem('test-key', { data: 'test' })
    
    // Then remove it
    localStorageService.removeItem('test-key')
    
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key')
    
    // Verify it's gone
    const result = localStorageService.getItem('test-key')
    expect(result).toBeNull()
  })

  it('should clear all items', () => {
    // Set multiple items
    localStorageService.setItem('key1', 'value1')
    localStorageService.setItem('key2', 'value2')
    
    // Clear all
    localStorageService.clear()
    
    expect(mockLocalStorage.clear).toHaveBeenCalled()
    
    // Verify all are gone
    expect(localStorageService.getItem('key1')).toBeNull()
    expect(localStorageService.getItem('key2')).toBeNull()
  })

  it('should handle JSON parse errors gracefully', () => {
    // Manually set invalid JSON in localStorage
    mockLocalStorage.getItem.mockReturnValueOnce('invalid json')
    
    const result = localStorageService.getItem('test-key')
    
    expect(result).toBeNull()
  })
}) 