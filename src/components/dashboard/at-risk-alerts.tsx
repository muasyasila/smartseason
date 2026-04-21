'use client'

import { AlertCircle, MapPin, Calendar, Sprout, CheckCircle } from 'lucide-react'

interface Field {
  id: string
  name: string
  crop_type: string
  location: string | null
  current_stage: string
  planting_date: string
  status?: string
}

interface AtRiskAlertsProps {
  fields: Field[]
}

export function AtRiskAlerts({ fields }: AtRiskAlertsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const calculateDaysOverdue = (plantingDate: string) => {
    const days = Math.floor((Date.now() - new Date(plantingDate).getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, days - 60)
  }

  if (!fields || fields.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">⚠️ At-Risk Alerts</h3>
          <p className="text-sm text-gray-500">Fields requiring attention</p>
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="rounded-full bg-green-100 p-4 mx-auto w-16 h-16 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="mt-3 text-sm font-medium text-green-600">All Clear!</p>
            <p className="text-xs text-gray-500">No fields are currently at risk</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">⚠️ At-Risk Alerts</h3>
            <p className="text-sm text-gray-500">Fields requiring immediate attention</p>
          </div>
          <div className="rounded-full bg-red-100 px-3 py-1">
            <span className="text-sm font-semibold text-red-700">{fields.length}</span>
            <span className="text-xs text-red-600 ml-1">fields at risk</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {fields.map((field) => (
          <div
            key={field.id}
            className="rounded-lg border border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-red-200 p-2 flex-shrink-0">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-semibold text-gray-900">{field.name}</h4>
                  <span className="text-xs font-medium rounded-full bg-red-200 px-2 py-0.5 text-red-700">
                    {calculateDaysOverdue(field.planting_date)} days overdue
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Sprout className="h-3 w-3" />
                    {field.crop_type}
                  </span>
                  {field.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {field.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Planted: {formatDate(field.planting_date)}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-red-700">
                    ⚠️ This field should have progressed beyond "{field.current_stage}" by now.
                  </p>
                  <p className="mt-1 text-xs text-red-600">
                    Recommended action: Inspect crop health and update field stage immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}