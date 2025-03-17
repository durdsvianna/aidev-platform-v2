'use client'

import { useRouter } from 'next/navigation'
import StackForm from '@/components/stacks/StackForm'

interface EditStackPageProps {
  params: {
    id: string
  }
}

export default function EditStackPage({ params }: EditStackPageProps) {
  const router = useRouter()
  const { id } = params

  const handleCancel = () => {
    router.push('/sidelayout/stacks')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Stack</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Update the stack details
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <StackForm stackId={id} onCancel={handleCancel} />
      </div>
    </div>
  )
} 