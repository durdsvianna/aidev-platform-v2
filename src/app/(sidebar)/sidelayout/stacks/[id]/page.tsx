'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaEdit, FaTrash, FaLayerGroup, FaCode } from 'react-icons/fa'
import { stackService } from '@/lib/services'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal'
import TechnologyCard from '@/components/TechnologyCard'
import type Stack from '@/models/Stack'

interface StackDetailPageProps {
  params: {
    id: string
  }
}

export default function StackDetailPage({ params }: StackDetailPageProps) {
  const { id } = params
  const router = useRouter()
  const [stack, setStack] = useState<Stack | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const loadStack = () => {
      try {
        const loadedStack = stackService.getById(id)
        if (loadedStack) {
          setStack(loadedStack)
        } else {
          setError('Stack not found')
        }
      } catch (err) {
        console.error('Error loading stack:', err)
        setError('Failed to load stack details')
      } finally {
        setIsLoading(false)
      }
    }

    loadStack()
  }, [id])

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    try {
      const deleted = stackService.delete(id)
      if (deleted) {
        router.push('/sidelayout/stacks')
      } else {
        setError('Failed to delete stack')
      }
    } catch (err) {
      console.error('Error deleting stack:', err)
      setError('An error occurred while deleting the stack')
    } finally {
      setShowDeleteModal(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  if (!stack) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900">
          <p className="text-sm text-red-700 dark:text-red-200">
            {error || 'Stack not found'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/sidelayout/stacks"
            className="mr-4 flex items-center text-blue-600 hover:underline dark:text-blue-400"
          >
            <FaArrowLeft className="mr-2" />
            Back to Stacks
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{stack.name}</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/sidelayout/stacks/edit/${id}`)}
            className="flex items-center rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <FaLayerGroup className="mr-2" />
            Stack Details
          </h2>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
              <p className="text-gray-900 dark:text-white">{stack.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Code</p>
              <p className="text-gray-900 dark:text-white">{stack.code}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <FaCode className="mr-2" />
            Technologies
          </h2>
          <div className="mt-4">
            {stack.technologies.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No technologies associated with this stack.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {stack.technologies.map(tech => (
                  <TechnologyCard key={tech.id} technology={tech} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Stack"
        message={`Are you sure you want to delete the stack "${stack.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  )
} 