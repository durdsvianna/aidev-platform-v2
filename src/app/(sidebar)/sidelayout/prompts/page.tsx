'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaPlus, FaEdit, FaTrash, FaCopy } from 'react-icons/fa'
import { promptService, stackService } from '@/lib/services'
import type Prompt from '@/models/Prompt'
import type Stack from '@/models/Stack'

export default function PromptsPage() {
  const router = useRouter()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [stacks, setStacks] = useState<Stack[]>([])
  const [selectedStackId, setSelectedStackId] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    // Load stacks
    const loadedStacks = stackService.getAll()
    setStacks(loadedStacks)
    
    // Load prompts based on selected stack
    const loadedPrompts = promptService.getByStack(selectedStackId)
    setPrompts(loadedPrompts)
  }, [selectedStackId])

  const handleStackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedStackId(value === 'all' ? undefined : value)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCopy = (id: string, description: string) => {
    navigator.clipboard.writeText(description)
    promptService.incrementCopyCount(id)
    setCopied(id)
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(null)
    }, 2000)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      promptService.delete(id)
      setPrompts(prompts.filter(prompt => prompt.id !== id))
    }
  }

  const filteredPrompts = prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:mb-0">Prompts</h1>
        <Link
          href="/sidelayout/prompts/new"
          className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          New Prompt
        </Link>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="stack-filter" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Stack
          </label>
          <select
            id="stack-filter"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={selectedStackId || 'all'}
            onChange={handleStackChange}
          >
            <option value="all">All Stacks</option>
            {stacks.map(stack => (
              <option key={stack.id} value={stack.id}>
                {stack.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search Prompts
          </label>
          <input
            type="text"
            id="search"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {filteredPrompts.length === 0 ? (
        <div className="mt-8 rounded-md bg-gray-50 p-8 text-center dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">No prompts found. Create your first prompt!</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 shadow dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Stack
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Copies
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {filteredPrompts.map(prompt => (
                <tr 
                  key={prompt.id} 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => router.push(`/sidelayout/prompts/${prompt.id}`)}
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{prompt.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {prompt.description.length > 50 
                        ? `${prompt.description.substring(0, 50)}...` 
                        : prompt.description}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {prompt.stack?.name || 'No Stack'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {prompt.copyCount}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleCopy(prompt.id, prompt.description)}
                        className="rounded p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
                        aria-label="Copy prompt"
                      >
                        {copied === prompt.id ? 'Copied!' : <FaCopy />}
                      </button>
                      <Link
                        href={`/sidelayout/prompts/edit/${prompt.id}`}
                        className="rounded p-1 text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900"
                        aria-label="Edit prompt"
                        onClick={e => e.stopPropagation()}
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(prompt.id)}
                        className="rounded p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                        aria-label="Delete prompt"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 