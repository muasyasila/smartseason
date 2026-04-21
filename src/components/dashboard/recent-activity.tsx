'use client'

import { formatDistanceToNow } from 'date-fns'
import { Sprout, TrendingUp, User, Clock, Plus, RefreshCw } from 'lucide-react'

interface Activity {
  id: string
  action: string
  user: string
  details: {
    field_name?: string
    old_stage?: string
    new_stage?: string
    notes?: string
    field_id?: string
  }
  timestamp: string
}

interface RecentActivityProps {
  activities: Activity[]
}

const getActivityIcon = (action: string) => {
  switch (action) {
    case 'CREATE_FIELD':
      return <Plus className="h-4 w-4 text-green-600" />
    case 'UPDATE_FIELD_STAGE':
      return <RefreshCw className="h-4 w-4 text-blue-600" />
    default:
      return <User className="h-4 w-4 text-gray-600" />
  }
}

const getActivityMessage = (activity: Activity) => {
  switch (activity.action) {
    case 'CREATE_FIELD':
      return `created field "${activity.details.field_name || 'Unknown'}"`
    case 'UPDATE_FIELD_STAGE':
      return `updated "${activity.details.field_name || 'Unknown field'}" from ${activity.details.old_stage || '?'} to ${activity.details.new_stage || '?'}`
    default:
      return activity.action.toLowerCase().replace('_', ' ')
  }
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-500">Latest field updates</p>
        </div>
        <div className="flex h-32 items-center justify-center">
          <div className="text-center">
            <Clock className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No recent activity</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-500">Latest field updates and changes</p>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.slice(0, 5).map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="rounded-full bg-gray-100 p-2">
              {getActivityIcon(activity.action)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 break-words">
                <span className="font-medium">{activity.user || 'System'}</span>{' '}
                {getActivityMessage(activity)}
              </p>
              {activity.details.notes && (
                <p className="mt-1 text-xs text-gray-500 italic line-clamp-2">
                  "{activity.details.notes}"
                </p>
              )}
              <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}