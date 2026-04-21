'use client'

import { useState, useEffect } from 'react'
import { ActivityTimeline } from '@/components/activity-timeline'
import { ActivityFilters } from '@/components/activity-filters'
import { Download, Filter } from 'lucide-react'

export default function ActivityPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedAction, setSelectedAction] = useState('')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all')
  const [allActivities, setAllActivities] = useState<any[]>([])
  const [filteredActivities, setFilteredActivities] = useState<any[]>([])
  const [uniqueUsers, setUniqueUsers] = useState<string[]>([])
  const [uniqueActions, setUniqueActions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalActivities: 0,
    uniqueActors: 0,
    fieldUpdatesCount: 0,
    systemActionsCount: 0,
  })

  useEffect(() => {
    fetchActivities()
  }, [])

  // Apply filters whenever filter criteria or activities change
  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedUser, selectedAction, dateRange, allActivities])

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/activities')
      const data = await response.json()
      if (data.success) {
        setAllActivities(data.activities)
        setUniqueUsers(data.uniqueUsers)
        setUniqueActions(data.uniqueActions)
        setStats({
          totalActivities: data.totalActivities,
          uniqueActors: data.uniqueActors,
          fieldUpdatesCount: data.fieldUpdatesCount,
          systemActionsCount: data.systemActionsCount,
        })
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...allActivities]

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(activity => 
        activity.user?.toLowerCase().includes(searchLower) ||
        activity.action?.toLowerCase().includes(searchLower) ||
        activity.details?.field_name?.toLowerCase().includes(searchLower) ||
        activity.details?.field?.toLowerCase().includes(searchLower)
      )
    }

    // Filter by user
    if (selectedUser) {
      filtered = filtered.filter(activity => activity.user === selectedUser)
    }

    // Filter by action
    if (selectedAction) {
      filtered = filtered.filter(activity => activity.action === selectedAction)
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date()
      let startDate: Date
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0))
          break
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7))
          break
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1))
          break
        default:
          startDate = new Date(0)
      }
      
      filtered = filtered.filter(activity => new Date(activity.timestamp) >= startDate)
    }

    setFilteredActivities(filtered)
  }

  const exportToCSV = () => {
    // Define CSV headers
    const headers = ['Timestamp', 'User', 'Action', 'Details', 'Field Name', 'Notes']
    
    // Convert activities to CSV rows
    const rows = filteredActivities.map(activity => {
      let details = ''
      let fieldName = ''
      let notes = ''
      
      if (activity.action === 'CREATE_FIELD') {
        details = `Created field "${activity.details.field_name}" (${activity.details.crop_type})`
        fieldName = activity.details.field_name
      } else if (activity.action === 'EDIT_FIELD') {
        details = `Edited field "${activity.details.field_name}"`
        fieldName = activity.details.field_name
      } else if (activity.action === 'UPDATE_FIELD_STAGE') {
        details = `Updated from ${activity.details.old_stage} to ${activity.details.new_stage}`
        fieldName = activity.details.field_name
        notes = activity.details.notes || ''
      } else if (activity.action === 'DELETE_FIELD') {
        details = `Deleted field "${activity.details.field_name}"`
        fieldName = activity.details.field_name
      } else {
        details = activity.action.replace(/_/g, ' ')
      }
      
      return [
        new Date(activity.timestamp).toLocaleString(),
        activity.user,
        activity.action.replace(/_/g, ' '),
        details,
        fieldName,
        notes,
      ]
    })
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `activity-log-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent mx-auto" />
          <p className="mt-2 text-gray-500">Loading activities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600">
            Complete audit trail of all system actions and field updates
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToCSV}
            disabled={filteredActivities.length === 0}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm text-white hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Export CSV ({filteredActivities.length})
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalActivities}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-2">
              <span className="text-xl">📋</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Filtered Results</p>
              <p className="text-2xl font-bold text-gray-900">{filteredActivities.length}</p>
            </div>
            <div className="rounded-full bg-green-100 p-2">
              <span className="text-xl">🎯</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Field Updates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.fieldUpdatesCount}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-2">
              <span className="text-xl">🌾</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">System Actions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.systemActionsCount}</p>
            </div>
            <div className="rounded-full bg-orange-100 p-2">
              <span className="text-xl">⚙️</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ActivityFilters 
            users={uniqueUsers}
            actions={uniqueActions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
        
        {/* Timeline */}
        <div className="lg:col-span-3">
          <ActivityTimeline 
            activities={filteredActivities} 
            filters={{
              search: searchTerm,
              user: selectedUser,
              action: selectedAction,
              dateRange: dateRange,
            }}
          />
        </div>
      </div>
    </div>
  )
}