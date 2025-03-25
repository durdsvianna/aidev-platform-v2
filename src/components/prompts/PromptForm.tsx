'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaSave, FaTimes } from 'react-icons/fa'
import { promptService, stackService, userService } from '@/lib/services'
import type { PromptData } from '@/models/Prompt'
import type Stack from '@/models/Stack'

interface PromptFormProps {
  promptId?: string
  onCancel: () => void
}

export default function PromptForm({ promptId, onCancel }: PromptFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const descriptionParam = searchParams?.get('description')
  const [stacks, setStacks] = useState<Stack[]>([])
  const [formData, setFormData] = useState<PromptData>({
    title: '',
    description: descriptionParam || '',
    stack: undefined,
    copyCount: 0
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const isEditMode = !!promptId

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load stacks
        const loadedStacks = stackService.getAll()
        setStacks(loadedStacks)

        // If in edit mode, load the prompt data
        if (isEditMode) {
          const prompt = promptService.getById(promptId)
          if (prompt) {
            setFormData({
              title: prompt.title,
              description: prompt.description,
              stack: prompt.stack,
              copyCount: prompt.copyCount,
              createdBy: prompt.createdBy
            })
          } else {
            // Prompt not found, redirect to prompts list
            router.push('/sidelayout/prompts')
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isEditMode, promptId, router])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === 'stackId') {
      // Handle stack selection
      if (value === '') {
        setFormData(prev => ({ ...prev, stack: undefined }))
      } else {
        const selectedStack = stacks.find(stack => stack.id === value)
        if (selectedStack) {
          setFormData(prev => ({ ...prev, stack: selectedStack }))
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Get current user
      const currentUser = userService.getCurrentUser()
      
      if (isEditMode) {
        // Update existing prompt
        promptService.update(promptId, {
          ...formData,
          updatedAt: new Date()
        })
      } else {
        // Create new prompt
        promptService.create({
          ...formData,
          createdBy: currentUser?.id || '',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }

      // Redirect to prompts list
      router.push('/sidelayout/prompts')
    } catch (error) {
      console.error('Error saving prompt:', error)
      setErrors(prev => ({ ...prev, form: 'Failed to save prompt. Please try again.' }))
    } finally {
      setIsSubmitting(false)
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900">
          <p className="text-red-800 dark:text-red-200">{errors.form}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full rounded-md border ${
            errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
          placeholder="Enter prompt title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="stackId" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Stack
        </label>
        <select
          id="stackId"
          name="stackId"
          value={formData.stack?.id || ''}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">No Stack</option>
          {stacks.map(stack => (
            <option key={stack.id} value={stack.id}>
              {stack.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={10}
          className={`w-full rounded-md border ${
            errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
          placeholder="Enter prompt description"
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          <FaTimes className="mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <FaSave className="mr-2" />
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Prompt' : 'Create Prompt'}
        </button>
      </div>
    </form>
  )
} 