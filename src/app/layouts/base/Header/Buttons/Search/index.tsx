'use client'

import { useState, useRef } from 'react'
import { Search, ChevronRight } from 'lucide-react'

export default function HeaderSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    setShowResults(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    
    if (value) {
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  // Close search when clicking outside
  if (typeof window !== 'undefined') {
    window.addEventListener('click', (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
        setShowResults(false)
      }
    })
  }

  return (
    <div className="relative" ref={searchRef}>
      <button
        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        onClick={toggleSearch}
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>

      {isSearchOpen && (
        <div 
          className="absolute right-0 top-12 w-screen max-w-md rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 sm:w-96"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearchChange}
              autoFocus
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-400"
            />
          </div>

          {showResults && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Results for <span className="font-medium text-gray-900 dark:text-white">{searchValue}</span>
                </p>
                <a 
                  href="#"
                  className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                >
                  Advanced search
                </a>
              </div>

              <div className="space-y-2">
                <div className="group rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  <a href="#" className="flex items-center p-2">
                    <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                      <Search className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Dashboard</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Main dashboard with overview of all project metrics
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </a>
                </div>

                <div className="group rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  <a href="#" className="flex items-center p-2">
                    <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                      <Search className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Projects</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Browse and manage your Web3 projects
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 