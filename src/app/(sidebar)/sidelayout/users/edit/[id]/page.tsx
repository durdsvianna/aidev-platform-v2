'use client'

import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import UserForm from '@/components/users/UserForm'

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const { id } = params
  const router = useRouter()

  const handleCancel = () => {
    router.push(`/sidelayout/users/${id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.push(`/sidelayout/users/${id}`)}
          className="mr-4 flex items-center text-blue-600 hover:underline dark:text-blue-400"
        >
          <FaArrowLeft className="mr-2" />
          Back to User
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit User</h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <UserForm userId={id} onCancel={handleCancel} />
      </div>
    </div>
  )
} 