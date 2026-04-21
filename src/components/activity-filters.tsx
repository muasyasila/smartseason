'use client'

import { Search, X } from 'lucide-react'

interface ActivityFiltersProps {
  users: string[]
  actions: string[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedUser: string
  setSelectedUser: (value: string) => void
  selectedAction: string
  setSelectedAction: (value: string) => void
  dateRange: 'today' | 'week' | 'month' | 'all'
  setDateRange: (value: 'today' | 'week' | 'month' | 'all') => void
}

export function ActivityFilters({ 
  users, 
  actions,
  searchTerm,
  setSearchTerm,
  selectedUser,
  setSelectedUser,
  selectedAction,
  setSelectedAction,
  dateRange,
  setDateRange,
}: ActivityFiltersProps) {
  const hasActiveFilters = searchTerm || selectedUser || selectedAction || dateRange !== 'all'

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedUser('')
    setSelectedAction('')
    setDateRange('all')
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 sticky top-4">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <p className="text-xs text-gray-500">Narrow down activities</p>
      </div>
      
      {/* Search */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-700">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user, action, or field..."
            className="w-full rounded-lg border border-gray-200 py-1.5 pl-8 pr-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>
      
      {/* Date Range */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-700">Date Range</label>
        <div className="flex gap-1">
          {[
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'all', label: 'All' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setDateRange(option.value as any)}
              className={`flex-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                dateRange === option.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* User Filter */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-700">User</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option value="">All Users ({users.length})</option>
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>
      
      {/* Action Filter */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-700">Action</label>
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option value="">All Actions ({actions.length})</option>
          {actions.map((action) => (
            <option key={action} value={action}>
              {action.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>
      
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                Search: {searchTerm.length > 20 ? searchTerm.substring(0, 20) + '...' : searchTerm}
                <button onClick={() => setSearchTerm('')} className="hover:text-green-900">
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            )}
            {selectedUser && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                User: {selectedUser}
                <button onClick={() => setSelectedUser('')} className="hover:text-blue-900">
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            )}
            {selectedAction && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                Action: {selectedAction.replace(/_/g, ' ')}
                <button onClick={() => setSelectedAction('')} className="hover:text-purple-900">
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            )}
            {dateRange !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">
                Date: {dateRange}
                <button onClick={() => setDateRange('all')} className="hover:text-orange-900">
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}