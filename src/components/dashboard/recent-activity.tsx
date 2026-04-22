'use client'

import { formatDistanceToNow } from 'date-fns'
import { Clock, Plus, RefreshCw, Edit2, Trash2 } from 'lucide-react'

interface Activity {
  id: string
  action: string
  user: string
  details: {
    field_name?: string
    old_stage?: string
    new_stage?: string
  }
  timestamp: string
}

interface RecentActivityProps {
  activities: Activity[]
}

const getActivityIcon = (action: string) => {
  switch (action) {
    case 'CREATE_FIELD':
      return <Plus className="h-3.5 w-3.5 text-emerald-600" />
    case 'UPDATE_FIELD_STAGE':
      return <RefreshCw className="h-3.5 w-3.5 text-blue-600" />
    case 'EDIT_FIELD':
      return <Edit2 className="h-3.5 w-3.5 text-amber-600" />
    case 'DELETE_FIELD':
      return <Trash2 className="h-3.5 w-3.5 text-rose-600" />
    default:
      return <Clock className="h-3.5 w-3.5 text-gray-400" />
  }
}

const getActivityText = (activity: Activity) => {
  switch (activity.action) {
    case 'CREATE_FIELD':
      return `created field "${activity.details.field_name}"`
    case 'UPDATE_FIELD_STAGE':
      return `updated "${activity.details.field_name}" from ${activity.details.old_stage} to ${activity.details.new_stage}`
    case 'EDIT_FIELD':
      return `edited field "${activity.details.field_name}"`
    case 'DELETE_FIELD':
      return `deleted field "${activity.details.field_name}"`
    default:
      return activity.action.toLowerCase().replace(/_/g, ' ')
  }
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-500 mt-0.5">Latest field updates</p>
        <div className="mt-8 flex h-32 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 rounded-full bg-gray-100" />
            <p className="mt-2 text-sm text-gray-500">No recent activity</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-500 mt-0.5">Latest field updates</p>
        </div>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 5).map((activity, idx) => (
          <div
            key={activity.id}
            className="group flex items-start gap-3 rounded-lg p-2 transition-all hover:bg-gray-50"
          >
            <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 group-hover:scale-105 transition-transform`}>
              {getActivityIcon(activity.action)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">{activity.user || 'System'}</span>{' '}
                {getActivityText(activity)}
              </p>
              <div className="mt-0.5 flex items-center gap-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-center text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700">
        View all activity
      </button>
    </div>
  )
}