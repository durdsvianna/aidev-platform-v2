'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import { stackService, technologyService } from '@/lib/services'
import type Stack from '@/models/Stack'
import type Technology from '@/models/Technology'

export default function StacksPage() {
  const router = useRouter()
  const [stacks, setStacks] = useState<Stack[]>([])
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [selectedTechnologyId, setSelectedTechnologyId] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Load technologies
    const loadedTechnologies = technologyService.getAll()
    setTechnologies(loadedTechnologies)
    
    // Load all stacks
    const loadedStacks = stackService.getAll()
    setStacks(loadedStacks)
  }, [])

  useEffect(() => {
    // Filter stacks when technology selection changes
    if (selectedTechnologyId) {
      const filteredStacks = stackService.getAll().filter(stack => 
        stack.technologies.some(tech => tech.id === selectedTechnologyId)
      )
      setStacks(filteredStacks)
    } else {
      // If no technology is selected, show all stacks
      setStacks(stackService.getAll())
    }
  }, [selectedTechnologyId])

  const handleTechnologyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedTechnologyId(value === 'all' ? undefined : value)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this stack?')) {
      stackService.delete(id)
      setStacks(stacks.filter(stack => stack.id !== id))
    }
  }

  const filteredStacks = stacks.filter(stack => 
    stack.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stack.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:mb-0">Stacks</h1>
        <Link
          href="/sidelayout/stacks/new"
          className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          New Stack
        </Link>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="technology-filter" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Technology
          </label>
          <select
            id="technology-filter"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={selectedTechnologyId || 'all'}
            onChange={handleTechnologyChange}
          >
            <option value="all">All Technologies</option>
            {technologies.map(tech => (
              <option key={tech.id} value={tech.id}>
                {tech.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search Stacks
          </label>
          <input
            type="text"
            id="search"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {filteredStacks.length === 0 ? (
        <div className="mt-8 rounded-md bg-gray-50 p-8 text-center dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">No stacks found. Create your first stack!</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 shadow dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Technologies
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {filteredStacks.map(stack => (
                <tr 
                  key={stack.id} 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => router.push(`/sidelayout/stacks/${stack.id}`)}
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{stack.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {stack.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {stack.technologies.slice(0, 3).map(tech => (
                        <span 
                          key={tech.id}
                          className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tech.name}
                        </span>
                      ))}
                      {stack.technologies.length > 3 && (
                        <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          +{stack.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2" onClick={e => e.stopPropagation()}>
                      <Link
                        href={`/sidelayout/stacks/${stack.id}`}
                        className="rounded p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
                        aria-label="View stack"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        href={`/sidelayout/stacks/edit/${stack.id}`}
                        className="rounded p-1 text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900"
                        aria-label="Edit stack"
                        onClick={e => e.stopPropagation()}
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(stack.id)}
                        className="rounded p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                        aria-label="Delete stack"
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