'use client'

import { Bell, Search, Menu } from 'lucide-react'
import { useState } from 'react'

export function DashboardHeader({ userName }: { userName: string }) {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Welcome back, <span className="text-gray-600">{userName}</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-64 rounded-lg border border-gray-200 pl-9 pr-3 text-sm focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  )
}