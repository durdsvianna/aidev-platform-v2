'use client'

import Link from 'next/link'

export default function Logo() {
  return (
    <div className="relative" title="AIDev Dashboard">
      <Link href="/" className="flex items-center text-center font-bold no-underline">
        <div className="relative w-14 h-12">
          {/* Robot head */}
          <div className="absolute w-8 h-8 bg-blue-600 rounded-lg top-0 left-3"></div>
          
          {/* Robot antennas */}
          <div className="absolute w-1.5 h-3 bg-purple-600 top-[-2px] left-4"></div>
          <div className="absolute w-1.5 h-3 bg-purple-600 top-[-2px] left-9"></div>
          
          {/* Robot eyes */}
          <div className="absolute w-2 h-2 bg-white rounded-full top-2 left-5"></div>
          <div className="absolute w-2 h-2 bg-white rounded-full top-2 left-8"></div>
          
          {/* Robot mouth/code */}
          <div className="absolute w-6 h-1 bg-green-500 top-5 left-4"></div>
          <div className="absolute w-4 h-1 bg-green-500 top-6.5 left-5"></div>
          
          {/* Code elements */}
          <div className="absolute w-10 h-3 bg-gray-800 dark:bg-gray-200 rounded-sm bottom-0 left-2 flex items-center justify-center">
            <div className="text-[8px] font-mono text-white dark:text-gray-900 tracking-tight">{"{AI}"}</div>
          </div>
          
          <div className="absolute -right-1 top-0 z-20">
            <span className="px-1.5 py-0.5 text-xs font-bold text-white bg-green-600 rounded-full">
              AI
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
