'use client'

import { useRouter } from 'next/navigation'
import StackForm from '@/components/stacks/StackForm'

export default function NewStackPage() {
  const router = useRouter()

  const handleCancel = () => {
    router.push('/sidelayout/stacks')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Stack</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Add a new technology stack to the platform
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <StackForm onCancel={handleCancel} />
      </div>
    </div>
  )
} 