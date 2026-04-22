'use client'

import { AlertTriangle, ChevronRight } from 'lucide-react'

interface Field {
  id: string
  name: string
  crop_type: string
  location: string | null
  current_stage: string
  planting_date: string
}

interface AtRiskAlertsProps {
  fields: Field[]
}

export function AtRiskAlerts({ fields }: AtRiskAlertsProps) {
  if (!fields || fields.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <h3 className="text-base font-semibold text-gray-900">At-Risk Fields</h3>
        </div>
        <p className="text-sm text-gray-500">Fields needing attention</p>
        <div className="mt-8 flex h-32 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">All clear</p>
            <p className="text-xs text-gray-400">No fields at risk</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <h3 className="text-base font-semibold text-gray-900">At-Risk Fields</h3>
        </div>
        <div className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
          {fields.length}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">Fields needing immediate attention</p>

      <div className="space-y-2">
        {fields.map((field) => (
          <div
            key={field.id}
            className="group rounded-lg border border-rose-100 bg-gradient-to-r from-rose-50/50 to-white p-3 transition-all hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-rose-100">
                  <AlertTriangle className="h-3 w-3 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{field.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {field.crop_type}
                    {field.location && ` • ${field.location}`}
                  </p>
                  <p className="text-xs text-rose-600 mt-1">
                    Planted on {new Date(field.planting_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-center text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700">
        View all at-risk fields
      </button>
    </div>
  )
}