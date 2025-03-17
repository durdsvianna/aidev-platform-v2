'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaEdit, FaArrowLeft, FaTrash, FaLayerGroup } from 'react-icons/fa'
import { technologyService, stackService } from '@/lib/services'
import type Technology from '@/models/Technology'
import type Stack from '@/models/Stack'

interface TechnologyDetailPageProps {
  params: {
    id: string
  }
}

export default function TechnologyDetailPage({ params }: TechnologyDetailPageProps) {
  const router = useRouter()
  const { id } = params
  const [technology, setTechnology] = useState<Technology | null>(null)
  const [relatedStacks, setRelatedStacks] = useState<Stack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = () => {
      try {
        // Load technology
        const loadedTechnology = technologyService.getById(id)
        if (loadedTechnology) {
          setTechnology(loadedTechnology)
          
          // Find stacks that use this technology
          const stacks = stackService.getAll()
          const related = stacks.filter(stack => 
            stack.technologies.some(tech => tech.id === id)
          )
          setRelatedStacks(related)
        } else {
          setError('Technology not found')
        }
      } catch (err) {
        console.error('Error loading technology:', err)
        setError('Failed to load technology details')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this technology?')) {
      try {
        technologyService.delete(id)
        router.push('/sidelayout/technologies')
      } catch (err) {
        console.error('Error deleting technology:', err)
        setError('Failed to delete technology')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !technology) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900">
          <p className="text-red-800 dark:text-red-200">{error || 'Technology not found'}</p>
          <Link
            href="/sidelayout/technologies"
            className="mt-4 inline-flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Technologies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/sidelayout/technologies"
            className="mb-2 inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Technologies
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{technology.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/sidelayout/technologies/edit/${id}`}
            className="inline-flex items-center rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
          >
            <FaEdit className="mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Description</h2>
        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{technology.description}</p>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Related Stacks</h2>
        
        {relatedStacks.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">This technology is not used in any stacks yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {relatedStacks.map(stack => (
              <div 
                key={stack.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="mb-2 flex items-center">
                  <FaLayerGroup className="mr-2 text-blue-500" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{stack.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Code: {stack.code}</p>
                <Link
                  href={`/sidelayout/stacks/${stack.id}`}
                  className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View stack
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Technology Information</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
            <p className="text-gray-900 dark:text-white">
              {new Date(technology.createdAt).toLocaleString()}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
            <p className="text-gray-900 dark:text-white">
              {new Date(technology.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 