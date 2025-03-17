'use client'

import { FiRefreshCw } from 'react-icons/fi'

interface GlobalErrorContentProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalErrorContent({ error, reset }: GlobalErrorContentProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <img
          alt="500"
          height={260}
          src="/static/images/status/500.svg"
          className="mx-auto h-64 w-auto"
        />
        
        <h1 className="my-4 text-3xl font-bold dark:text-white">
          Something went seriously wrong
        </h1>
        
        <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
          We're sorry, but we're having trouble loading the application. Please try refreshing.
        </p>
        
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FiRefreshCw className="mr-2 h-5 w-5" />
          Try again
        </button>
      </div>
    </div>
  )
} 