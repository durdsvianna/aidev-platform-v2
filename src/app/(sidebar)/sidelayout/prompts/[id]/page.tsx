'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaCopy, FaEdit } from 'react-icons/fa'
import { promptService } from '@/lib/services'
import type Prompt from '@/models/Prompt'

export default function PromptDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadPrompt = () => {
      try {
        const foundPrompt = promptService.getById(params.id)
        if (foundPrompt) {
          setPrompt(foundPrompt)
        } else {
          // Prompt not found, redirect to prompts list
          router.push('/sidelayout/prompts')
        }
      } catch (error) {
        console.error('Error loading prompt:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPrompt()
  }, [params.id, router])

  const handleCopy = () => {
    if (!prompt) return

    navigator.clipboard.writeText(prompt.description)
    promptService.incrementCopyCount(prompt.id)
    setCopied(true)
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900">
          <p className="text-red-800 dark:text-red-200">Prompt not found</p>
        </div>
        <div className="mt-4">
          <Link
            href="/sidelayout/prompts"
            className="flex w-fit items-center text-blue-600 hover:underline dark:text-blue-400"
          >
            <FaArrowLeft className="mr-2" />
            Back to prompts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/sidelayout/prompts"
          className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
        >
          <FaArrowLeft className="mr-2" />
          Back to prompts
        </Link>
        
        <Link
          href={`/sidelayout/prompts/edit/${prompt.id}`}
          className="flex items-center rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
        >
          <FaEdit className="mr-2" />
          Edit Prompt
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{prompt.title}</h1>
          {prompt.stack && (
            <div className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {prompt.stack.name}
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Description</h2>
            <div className="relative rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                {prompt.description}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                aria-label="Copy description"
              >
                {copied ? 'Copied!' : (
                  <span className="flex items-center">
                    <FaCopy className="mr-1" />
                    Copy
                  </span>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 text-sm dark:border-gray-700">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Created</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(prompt.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Copied</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {prompt.copyCount} times
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 