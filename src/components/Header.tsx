'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import ThemeToggle from '@/components/theme-toggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
              AI
            </div>
            <span className="font-bold text-xl hidden md:inline">AI Development Platform</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              href="/projects" 
              className={`px-3 py-2 text-sm font-medium ${
                pathname?.includes('/projects') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              Organization
            </Link>
          </nav>
          
          <ThemeToggle />
          
          {/* User profile button */}
          <Link 
            href="/sidelayout/users/profile" 
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <FaUser className="h-4 w-4" />
          </Link>
          
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <FaTimes className="block h-5 w-5" aria-hidden="true" />
            ) : (
              <FaBars className="block h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 z-50 bg-white shadow-lg dark:bg-gray-800 md:hidden">
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
              Organization
            </Link>            
            <Link 
              href="/sidelayout/users/profile" 
              className={`block px-3 py-2 text-base font-medium ${
                pathname?.includes('/users/profile') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
              onClick={toggleMenu}
            >
              My Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 