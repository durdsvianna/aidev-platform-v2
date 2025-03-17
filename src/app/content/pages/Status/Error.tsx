'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiRefreshCw } from 'react-icons/fi'
import BaseLayout from '@/app/layouts/BaseLayout'

interface ErrorContentProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorContent({ error, reset }: ErrorContentProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    // Try to recover by trying to re-render the segment
    reset()
  }

  return (
    <BaseLayout>
      <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <img
            alt="500"
            height={260}
            src="/static/images/status/500.svg"
            className="mx-auto h-64 w-auto"
          />
          
          <h1 className="my-4 text-3xl font-bold">
            There was an error, please try again later
          </h1>
          
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            The server encountered an internal error and was not able to complete your request
          </p>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-2 h-4 w-4" />
                  Refresh view
                </>
              )}
            </button>
            
            <Link
              href="/sidelayout"
              className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
} 