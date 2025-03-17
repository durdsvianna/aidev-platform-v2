'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaSave, FaTimes, FaPlus, FaTimes as FaRemove } from 'react-icons/fa'
import { stackService, technologyService } from '@/lib/services'
import type { StackData } from '@/models/Stack'
import type Technology from '@/models/Technology'

interface StackFormProps {
  stackId?: string
  onCancel: () => void
}

export default function StackForm({ stackId, onCancel }: StackFormProps) {
  const router = useRouter()
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [formData, setFormData] = useState<StackData>({
    name: '',
    code: '',
    technologies: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTechId, setSelectedTechId] = useState<string>('')

  // Load existing stack data if editing
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all technologies
        const allTechs = technologyService.getAll()
        setTechnologies(allTechs)

        // If editing, load stack data
        if (stackId) {
          const stack = stackService.getById(stackId)
          if (stack) {
            setFormData({
              name: stack.name,
              code: stack.code,
              technologies: stack.technologies
            })
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [stackId])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.code)) {
      newErrors.code = 'Code must contain only lowercase letters, numbers, and hyphens'
    }

    // Check for duplicate code if creating new stack
    if (!stackId) {
      const existingStack = stackService.getByCode(formData.code)
      if (existingStack) {
        newErrors.code = 'This code is already in use'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTechChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTechId(e.target.value)
  }

  const handleAddTech = () => {
    if (!selectedTechId) return

    const tech = technologyService.getById(selectedTechId)
    if (!tech) return

    // Check if technology is already added
    const alreadyAdded = formData.technologies.some(t => 
      typeof t === 'object' && 'id' in t && t.id === selectedTechId
    )

    if (!alreadyAdded) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }))
    }

    setSelectedTechId('')
  }

  const handleRemoveTech = (techId: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => 
        typeof tech === 'object' && 'id' in tech && tech.id !== techId
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      if (stackId) {
        // Update existing stack
        const updated = stackService.update(stackId, formData)
        if (updated) {
          router.push(`/sidelayout/stacks/${stackId}`)
        } else {
          throw new Error('Failed to update stack')
        }
      } else {
        // Create new stack
        const created = stackService.create(formData)
        router.push(`/sidelayout/stacks/${created.id}`)
      }
    } catch (error) {
      console.error('Error saving stack:', error)
      setErrors(prev => ({ ...prev, form: 'Failed to save stack' }))
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
          <p className="text-sm text-red-700 dark:text-red-200">{errors.form}</p>
        </div>
      )}
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
        
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
              errors.name
                ? 'border-red-500 focus:ring-red-500 dark:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="code" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
              errors.code
                ? 'border-red-500 focus:ring-red-500 dark:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
            }`}
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-500">{errors.code}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Unique identifier, lowercase letters, numbers, and hyphens only.
          </p>
        </div>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Technologies</h2>
        
        <div className="mb-4 flex">
          <select
            value={selectedTechId}
            onChange={handleTechChange}
            className="flex-grow rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a technology...</option>
            {technologies
              .filter(tech => !formData.technologies.some(t => 
                typeof t === 'object' && 'id' in t && t.id === tech.id
              ))
              .map(tech => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))
            }
          </select>
          <button
            type="button"
            onClick={handleAddTech}
            disabled={!selectedTechId}
            className="flex items-center rounded-r-md bg-blue-600 px-4 py-2 text-white disabled:bg-blue-400 dark:bg-blue-700 dark:disabled:bg-blue-900"
          >
            <FaPlus className="mr-2" />
            Add
          </button>
        </div>
        
        {formData.technologies.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No technologies added yet.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {formData.technologies.map(tech => {
              // Extract ID and name with type safety
              let techId = '';
              let techName = '';
              
              if (typeof tech === 'object' && tech !== null && 'id' in tech && typeof tech.id === 'string') {
                techId = tech.id;
                techName = 'name' in tech && typeof tech.name === 'string' ? tech.name : '';
              }
              
              // Skip items without ID
              if (!techId) return null;
              
              return (
                <div 
                  key={techId}
                  className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                >
                  <span className="text-gray-900 dark:text-white">{techName}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(techId)}
                    className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <FaRemove />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          <FaTimes className="mr-2 inline" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-blue-900"
        >
          <FaSave className="mr-2 inline" />
          {isSubmitting ? 'Saving...' : 'Save Stack'}
        </button>
      </div>
    </form>
  )
} 