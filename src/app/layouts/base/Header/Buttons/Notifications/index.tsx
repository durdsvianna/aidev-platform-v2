'use client'

import { useState, useRef } from 'react'
import { Bell } from 'lucide-react'
import { formatDistance, subDays } from 'date-fns'

export default function HeaderNotifications() {
  const [isOpen, setIsOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
  }

  // Close notifications when clicking outside
  if (typeof window !== 'undefined') {
    window.addEventListener('click', (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    })
  }

  return (
    <div className="relative" ref={notificationsRef}>
      <button
        className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          1
        </span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 top-12 w-80 rounded-lg bg-white shadow-lg dark:bg-gray-800"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <div className="border-b border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className="flex">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Messaging Platform</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    New messages in your inbox
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {formatDistance(subDays(new Date(), 3), new Date(), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className="flex">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">System Update</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    The system has been updated to the latest version
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {formatDistance(subDays(new Date(), 1), new Date(), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-2 dark:border-gray-700">
            <button className="block w-full rounded-md p-2 text-center text-sm font-medium text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-700">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 