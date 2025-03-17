'use client'

import { useState, useRef } from 'react'
import { ChevronDown, MessageSquare } from 'lucide-react'

export default function HeaderUserConnect() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Close dropdown when clicking outside
  if (typeof window !== 'undefined') {
    window.addEventListener('click', (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        onClick={toggleDropdown}
      >
        <div className="mr-2 text-left">
          <div className="font-medium">Connect</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Dapp</div>
        </div>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
          <div className="py-1">
            <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <button
                className="flex w-full items-center rounded-md px-2 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact us to add new network
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 