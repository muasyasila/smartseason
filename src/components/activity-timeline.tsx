'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { ChevronDown, ChevronUp, User, Sprout, Edit, Trash2, LogIn, LogOut, RefreshCw } from 'lucide-react'

interface Activity {
  id: string
  type: 'system' | 'field'
  action: string
  user: string
  userEmail?: string
  userRole?: string
  details: any
  timestamp: string
  icon: string
}

interface ActivityTimelineProps {
  activities: Activity[]
  filters?: {
    search: string
    user: string
    action: string
    dateRange: 'today' | 'week' | 'month' | 'all'
  }
}

const actionLabels: Record<string, { label: string; color: string; icon: any }> = {
  CREATE_FIELD: {
    label: 'Created Field',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Sprout,
  },
  EDIT_FIELD: {
    label: 'Edited Field',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Edit,
  },
  DELETE_FIELD: {
    label: 'Deleted Field',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: Trash2,
  },
  UPDATE_FIELD_STAGE: {
    label: 'Updated Stage',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: RefreshCw,
  },
  LOGIN: {
    label: 'Logged In',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: LogIn,
  },
  LOGOUT: {
    label: 'Logged Out',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: LogOut,
  },
}

export function ActivityTimeline({ activities, filters }: ActivityTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filteredActivities, setFilteredActivities] = useState(activities)

  // Apply filters whenever activities or filters change
  useEffect(() => {
    if (!filters) {
      setFilteredActivities(activities)
      return
    }

    let filtered = [...activities]

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(activity => 
        activity.user.toLowerCase().includes(searchLower) ||
        getActionDetails(activity).toLowerCase().includes(searchLower) ||
        (activity.details?.field_name && activity.details.field_name.toLowerCase().includes(searchLower))
      )
    }

    // Filter by user
    if (filters.user) {
      filtered = filtered.filter(activity => activity.user === filters.user)
    }

    // Filter by action
    if (filters.action) {
      filtered = filtered.filter(activity => activity.action === filters.action)
    }

    // Filter by date range
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date()
      let startDate: Date
      
      switch (filters.dateRange) {
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
  }, [activities, filters])

  const getActionDetails = (activity: Activity) => {
    const details = activity.details
    
    switch(activity.action) {
      case 'CREATE_FIELD':
        return `created field "${details.field_name}"`
      case 'EDIT_FIELD':
        return `edited field "${details.field_name}"`
      case 'DELETE_FIELD':
        return `deleted field "${details.field_name}"`
      case 'UPDATE_FIELD_STAGE':
        return `updated "${details.field_name}" from ${details.old_stage} to ${details.new_stage}`
      case 'LOGIN':
        return `logged into the system`
      case 'LOGOUT':
        return `logged out of the system`
      default:
        return activity.action.toLowerCase().replace(/_/g, ' ')
    }
  }

  const getFormattedDetails = (activity: Activity) => {
    const details = activity.details
    
    switch(activity.action) {
      case 'UPDATE_FIELD_STAGE':
        if (details.notes) {
          return { field: details.field_name, notes: details.notes }
        }
        return { field: details.field_name }
      case 'CREATE_FIELD':
        return { field: details.field_name, crop: details.crop_type }
      default:
        return null
    }
  }

  if (filteredActivities.length === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-gray-100 p-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No matching activities</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your filters to see more results
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
            <p className="text-sm text-gray-500">
              Showing {filteredActivities.length} of {activities.length} activities
            </p>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {filteredActivities.map((activity, idx) => {
          const actionConfig = actionLabels[activity.action] || {
            label: activity.action.replace(/_/g, ' '),
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: User,
          }
          const Icon = actionConfig.icon
          const formattedDetails = getFormattedDetails(activity)
          const isExpanded = expandedId === activity.id
          
          return (
            <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`rounded-full p-2 ${actionConfig.color.split(' ')[0]} flex-shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">{activity.user}</span>
                      <span className="text-sm text-gray-600">{getActionDetails(activity)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                      {formattedDetails && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : activity.id)}
                          className="hover:text-gray-600"
                        >
                          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* User metadata */}
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                    {activity.userEmail && (
                      <span>{activity.userEmail}</span>
                    )}
                    {activity.userRole && (
                      <span className="capitalize">Role: {activity.userRole}</span>
                    )}
                    <span>{format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                  
                  {/* Expanded details */}
                  {isExpanded && formattedDetails && (
                    <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm">
                      {formattedDetails.field && (
                        <p><span className="font-medium">Field:</span> {formattedDetails.field}</p>
                      )}
                      {formattedDetails.crop && (
                        <p><span className="font-medium">Crop:</span> {formattedDetails.crop}</p>
                      )}
                      {formattedDetails.notes && (
                        <p className="mt-1"><span className="font-medium">Notes:</span> "{formattedDetails.notes}"</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <p className="text-center text-xs text-gray-500">
          Showing {filteredActivities.length} activities
        </p>
      </div>
    </div>
  )
}