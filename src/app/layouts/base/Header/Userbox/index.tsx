'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Address } from 'viem'
import { ChevronDown, User, LogOut } from 'lucide-react'

interface HeaderUserboxProps {
  address?: Address
}

export default function HeaderUserbox({ address }: HeaderUserboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Function to generate a color based on address
  const stringToColor = (value: string) => {
    let hash = 0
    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    return color
  }

  // Shorten the address for display
  const shortenAddress = (addr: Address): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

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

  // Get background color based on address
  const bgColor = address ? stringToColor(address) : '#888888'
  const displayAddress = address ? shortenAddress(address) : 'Unknown'

  const handleDisconnect = () => {
    // Implement disconnect logic
    console.log('Disconnect wallet')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        onClick={toggleDropdown}
      >
        <div 
          className="mr-2 flex h-8 w-8 items-center justify-center rounded-md text-white"
          style={{ backgroundColor: bgColor }}
        >
          {address ? address.slice(2, 4).toUpperCase() : 'U'}
        </div>
        <div className="mr-2 text-left">
          <div className="font-medium">{displayAddress}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Member</div>
        </div>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
          <div className="p-3">
            <div className="flex items-center">
              <div 
                className="mr-3 flex h-10 w-10 items-center justify-center rounded-md text-white"
                style={{ backgroundColor: bgColor }}
              >
                {address ? address.slice(2, 4).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{displayAddress}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Member</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="py-1">
              <Link 
                href="/profile" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
            <button
              onClick={handleDisconnect}
              className="flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 