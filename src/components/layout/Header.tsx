'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaBars, FaTimes } from 'react-icons/fa'
import ThemeToggle from '@/components/theme-toggle'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
              AI
            </div>
            <span className="font-bold text-xl">AI Development Platform</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex items-center space-x-4">
            <Link 
              href="/projects" 
              className={`px-3 py-2 text-sm font-medium ${
                pathname?.includes('/projects') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              Projects
            </Link>
            <Link 
              href="/admin/profile" 
              className={`px-3 py-2 text-sm font-medium ${
                pathname?.includes('/admin') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              Admin
            </Link>
            <Link 
              href="/sidelayout" 
              className={`px-3 py-2 text-sm font-medium ${
                pathname === '/sidelayout' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              Home
            </Link>
          </nav>
          
          <ThemeToggle />
        </div>
        
        <div className="flex md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <FaTimes className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <FaBars className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link 
              href="/projects" 
              className={`block px-3 py-2 text-base font-medium ${
                pathname?.includes('/projects') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
              onClick={toggleMenu}
            >
              Projects
            </Link>
            <Link 
              href="/admin/profile" 
              className={`block px-3 py-2 text-base font-medium ${
                pathname?.includes('/admin') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
              onClick={toggleMenu}
            >
              Admin
            </Link>
            <Link 
              href="/sidelayout" 
              className={`block px-3 py-2 text-base font-medium ${
                pathname === '/sidelayout' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <div className="px-3 py-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 