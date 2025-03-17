'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaEdit, FaArrowLeft, FaTrash, FaLayerGroup } from 'react-icons/fa'
import { profileService, stackService } from '@/lib/services'
import type Profile from '@/models/Profile'
import type Stack from '@/models/Stack'

interface ProfileDetailPageProps {
  params: {
    id: string
  }
}

export default function ProfileDetailPage({ params }: ProfileDetailPageProps) {
  const { id } = params
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stacks, setStacks] = useState<Stack[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProfile = () => {
      try {
        // Get profile directly from the profile service
        const foundProfile = profileService.getById(id)
        
        if (foundProfile) {
          setProfile(foundProfile)
          
          // Load associated stacks
          const profileStacks = profileService.getStacksForProfile(id)
          setStacks(profileStacks)
        } else {
          // Profile not found, redirect to profiles list
          router.push('/sidelayout/profiles')
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [id, router])

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        const deleted = profileService.delete(id)
        if (deleted) {
          router.push('/sidelayout/profiles')
        }
      } catch (error) {
        console.error('Error deleting profile:', error)
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

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900">
          <p className="text-red-700 dark:text-red-300">Profile not found.</p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.push('/sidelayout/profiles')}
            className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
          >
            <FaArrowLeft className="mr-2" />
            Back to Profiles
          </button>
        </div>
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
      </div>

      <div className="mb-6 flex justify-end space-x-2">
        <button
          onClick={() => router.push(`/sidelayout/profiles/edit/${profile.id}`)}
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

      <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
        <div className="p-6">
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-gray-900 dark:text-white">{profile.name}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                <p className="text-gray-900 dark:text-white">{profile.description}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
            <p className="text-gray-900 dark:text-white">{new Date(profile.createdAt).toLocaleString()}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</p>
            <p className="text-gray-900 dark:text-white">{new Date(profile.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Associated Stacks</h2>
          <button
            onClick={() => router.push(`/sidelayout/profiles/edit/${profile.id}`)}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Manage stacks
          </button>
        </div>
        
        {stacks.length === 0 ? (
          <p className="mt-4 text-gray-600 dark:text-gray-400">No stacks associated with this profile.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {stacks.map(stack => (
              <Link
                key={stack.id}
                href={`/sidelayout/stacks/${stack.id}`}
                className="flex flex-col rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="mb-2 flex items-center text-gray-900 dark:text-white">
                  <FaLayerGroup className="mr-2" />
                  <h3 className="text-lg font-medium">{stack.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stack.code}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {stack.technologies.slice(0, 3).map(tech => (
                    <span 
                      key={tech.id}
                      className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tech.name}
                    </span>
                  ))}
                  {stack.technologies.length > 3 && (
                    <span className="inline-block rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      +{stack.technologies.length - 3} more
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 