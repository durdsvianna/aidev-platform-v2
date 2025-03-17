'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaSave, FaLayerGroup } from 'react-icons/fa'
import { profileService, stackService } from '@/lib/services'
import type Stack from '@/models/Stack'

export default function NewProfilePage() {
  const router = useRouter()
  const [allStacks, setAllStacks] = useState<Stack[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stacks: [] as string[]
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStacks = () => {
      try {
        const stacks = stackService.getAll()
        setAllStacks(stacks)
      } catch (err) {
        console.error('Error loading stacks:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadStacks()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStackToggle = (stackId: string) => {
    setFormData(prev => {
      const stacks = [...prev.stacks]
      
      if (stacks.includes(stackId)) {
        // Remove stack
        const index = stacks.indexOf(stackId)
        stacks.splice(index, 1)
      } else {
        // Add stack
        stacks.push(stackId)
      }
      
      return {
        ...prev,
        stacks
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      if (!formData.name.trim()) {
        throw new Error('Name is required')
      }

      const newProfile = profileService.create(formData)
      router.push(`/sidelayout/profiles/${newProfile.id}`)
    } catch (err) {
      console.error('Error creating profile:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while creating the profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.push('/sidelayout/profiles')}
          className="mr-4 flex items-center text-blue-600 hover:underline dark:text-blue-400"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Profile</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
          
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Stacks</h2>
          
          {allStacks.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No stacks available to select.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {allStacks.map(stack => (
                <div 
                  key={stack.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                    formData.stacks.includes(stack.id)
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-700 dark:bg-blue-900'
                      : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleStackToggle(stack.id)}
                >
                  <div className="flex items-center">
                    <FaLayerGroup className={`mr-2 ${
                      formData.stacks.includes(stack.id)
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    <span className={`${
                      formData.stacks.includes(stack.id)
                        ? 'font-medium text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>{stack.name}</span>
                  </div>
                  <div className="flex h-5 w-5 items-center justify-center rounded-md border">
                    {formData.stacks.includes(stack.id) && (
                      <div className="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-400"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Create Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 