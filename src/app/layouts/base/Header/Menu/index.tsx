'use client'

import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export default function HeaderMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('common')

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  // Close dropdown when clicking outside
  if (typeof window !== 'undefined') {
    window.addEventListener('click', (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    })
  }

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link 
        href="/admin/profile"
        className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
      >
        Admin
      </Link>
      
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          onClick={toggleDropdown}
        >
          AI Projects
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 mt-2 w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
            <Link
              href="/projects"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              View Projects
            </Link>
            <Link
              href="/projects/create"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Create Project
            </Link>
          </div>
        )}
      </div>
      
      <Link 
        href="/sidelayout"
        className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
      >
        Home
      </Link>
    </nav>
  )
} 