'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import { technologyService } from '@/lib/services'
import type Technology from '@/models/Technology'

export default function TechnologiesPage() {
  const router = useRouter()
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Load technologies
    const loadedTechnologies = technologyService.getAll()
    setTechnologies(loadedTechnologies)
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this technology?')) {
      technologyService.delete(id)
      setTechnologies(technologies.filter(tech => tech.id !== id))
    }
  }

  const filteredTechnologies = technologies.filter(tech => 
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tech.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:mb-0">Technologies</h1>
        <Link
          href="/sidelayout/technologies/new"
          className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          New Technology
        </Link>
      </div>

      <div className="mb-6">
        <label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Search Technologies
        </label>
        <input
          type="text"
          id="search"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {filteredTechnologies.length === 0 ? (
        <div className="mt-8 rounded-md bg-gray-50 p-8 text-center dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">No technologies found. Create your first technology!</p>
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
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {filteredTechnologies.map(tech => (
                <tr 
                  key={tech.id} 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => router.push(`/sidelayout/technologies/${tech.id}`)}
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{tech.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {tech.description.length > 100 
                      ? `${tech.description.substring(0, 100)}...` 
                      : tech.description}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2" onClick={e => e.stopPropagation()}>
                      <Link
                        href={`/sidelayout/technologies/${tech.id}`}
                        className="rounded p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
                        aria-label="View technology"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        href={`/sidelayout/technologies/edit/${tech.id}`}
                        className="rounded p-1 text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900"
                        aria-label="Edit technology"
                        onClick={e => e.stopPropagation()}
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(tech.id)}
                        className="rounded p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                        aria-label="Delete technology"
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