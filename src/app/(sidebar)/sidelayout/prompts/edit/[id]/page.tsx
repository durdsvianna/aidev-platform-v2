'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
import PromptForm from '@/components/prompts/PromptForm'

export default function EditPromptPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const handleCancel = () => {
    router.push(`/sidelayout/prompts/${params.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/sidelayout/prompts/${params.id}`}
          className="flex w-fit items-center text-blue-600 hover:underline dark:text-blue-400"
        >
          <FaArrowLeft className="mr-2" />
          Back to prompt
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Prompt</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Update the prompt details.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <PromptForm promptId={params.id} onCancel={handleCancel} />
      </div>
    </div>
  )
} 