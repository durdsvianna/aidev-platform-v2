'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaSave, FaTimes } from 'react-icons/fa'
import { technologyService, userService } from '@/lib/services'
import type { TechnologyData } from '@/models/Technology'

interface TechnologyFormProps {
  technologyId?: string
  onCancel: () => void
}

export default function TechnologyForm({ technologyId, onCancel }: TechnologyFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<TechnologyData>({
    name: '',
    description: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const isEditMode = !!technologyId

  useEffect(() => {
    const loadData = async () => {
      try {
        // If in edit mode, load the technology data
        if (isEditMode && technologyId) {
          const technology = technologyService.getById(technologyId)
          if (technology) {
            setFormData({
              name: technology.name,
              description: technology.description
            })
          } else {
            // Technology not found, redirect to technologies list
            router.push('/sidelayout/technologies')
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [technologyId, isEditMode, router])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

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
      
      if (isEditMode && technologyId) {
        // Update existing technology
        technologyService.update(technologyId, {
          ...formData,
          updatedAt: new Date()
        })
      } else {
        // Create new technology
        technologyService.create({
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }

      // Redirect to technologies list
      router.push('/sidelayout/technologies')
    } catch (error) {
      console.error('Error saving technology:', error)
      setErrors(prev => ({ ...prev, form: 'Failed to save technology. Please try again.' }))
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
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full rounded-md border ${
            errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
          placeholder="Enter technology name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
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
          rows={5}
          className={`w-full rounded-md border ${
            errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
          placeholder="Enter technology description"
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
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Technology' : 'Create Technology'}
        </button>
      </div>
    </form>
  )
} 