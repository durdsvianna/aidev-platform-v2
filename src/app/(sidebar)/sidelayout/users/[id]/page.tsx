'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaEdit, FaArrowLeft, FaTrash } from 'react-icons/fa'
import { userService } from '@/lib/services'
import type User from '@/models/User'

interface UserDetailPageProps {
  params: {
    id: string
  }
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = params
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = () => {
      try {
        const loadedUser = userService.getById(id)
        if (loadedUser) {
          setUser(loadedUser)
        } else {
          // User not found, redirect to users list
          router.push('/sidelayout/users')
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [id, router])

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const success = userService.delete(id)
        if (success) {
          router.push('/sidelayout/users')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900">
          <p className="text-red-700 dark:text-red-300">User not found.</p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.push('/sidelayout/users')}
            className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
          >
            <FaArrowLeft className="mr-2" />
            Back to Users
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.push('/sidelayout/users')}
          className="mr-4 flex items-center text-blue-600 hover:underline dark:text-blue-400"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
      </div>

      <div className="mb-6 flex justify-end space-x-2">
        <button
          onClick={() => router.push(`/sidelayout/users/edit/${user.id}`)}
          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <FaEdit className="mr-2" />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          <FaTrash className="mr-2" />
          Delete
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
        <div className="p-6">
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">User Information</h2>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white">{user.email}</p>
              </div>
              {user.description && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-gray-900 dark:text-white">{user.description}</p>
                </div>
              )}
            </div>
            {user.profile && (
              <div>
                <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-gray-900 dark:text-white">{user.profile.name}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-gray-900 dark:text-white">{user.profile.description}</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
            <p className="text-gray-900 dark:text-white">{new Date(user.createdAt).toLocaleString()}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</p>
            <p className="text-gray-900 dark:text-white">{new Date(user.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 