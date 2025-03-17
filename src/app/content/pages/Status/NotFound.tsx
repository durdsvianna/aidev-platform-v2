'use client'

import Link from 'next/link'
import { FiSearch } from 'react-icons/fi'
import BaseLayout from '@/app/layouts/BaseLayout'

export default function NotFoundContent() {
  return (
    <BaseLayout>
      <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <img 
            alt="404" 
            height={180} 
            src="/static/images/status/404.svg" 
            className="mx-auto h-44 w-auto"
          />
          
          <h1 className="my-4 text-3xl font-bold">
            The page you were looking for doesn't exist.
          </h1>
          
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            It's on us, we moved the content to a different page. The search below should help!
          </p>
          
          <div className="mx-auto max-w-md">
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                
                <input
                  type="text"
                  placeholder="Search terms here..."
                  className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-24 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
                
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <button className="rounded-md bg-blue-600 px-4 py-1 text-sm font-medium text-white hover:bg-blue-700">
                    Search
                  </button>
                </div>
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">OR</span>
                </div>
              </div>
              
              <Link 
                href="/sidelayout"
                className="inline-block rounded-md border border-gray-300 px-4 py-2 text-center font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                Go to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
} 