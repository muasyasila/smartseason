'use client'

import { X, Sprout, MapPin, Calendar, User, Ruler, FileText, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface Field {
  id: string
  name: string
  crop_type: string
  location: string | null
  size_hectares: number | null
  planting_date: string
  current_stage: string
  status: string
  notes: string | null
  created_at?: string
  updated_at?: string
  agent?: { name: string; email: string }
}

interface ViewFieldModalProps {
  isOpen: boolean
  onClose: () => void
  field: Field
}

export function ViewFieldModal({ isOpen, onClose, field }: ViewFieldModalProps) {
  if (!isOpen) return null

  const getStageIcon = (stage: string) => {
    switch(stage) {
      case 'Planted': return '🌱'
      case 'Growing': return '🌿'
      case 'Ready': return '🌾'
      case 'Harvested': return '🚜'
      default: return '🌱'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200'
      case 'At Risk': return 'bg-red-100 text-red-800 border-red-200'
      case 'Completed': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Active': return <TrendingUp className="h-4 w-4" />
      case 'At Risk': return <AlertCircle className="h-4 w-4" />
      case 'Completed': return <CheckCircle className="h-4 w-4" />
      default: return null
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy')
    } catch {
      return dateString
    }
  }

  const stages = ['Planted', 'Growing', 'Ready', 'Harvested']
  const currentStageIndex = stages.indexOf(field.current_stage)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl animate-in fade-in zoom-in duration-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 p-2">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{field.name}</h2>
              <p className="text-sm text-gray-500">Field Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(field.status)}`}>
            {getStatusIcon(field.status)}
            {field.status}
          </div>

          {/* Basic Information Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <Sprout className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Crop Type</p>
                <p className="font-medium text-gray-900">{field.crop_type}</p>
              </div>
            </div>

            {field.location && (
              <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{field.location}</p>
                </div>
              </div>
            )}

            {field.size_hectares && (
              <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <Ruler className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Size</p>
                  <p className="font-medium text-gray-900">{field.size_hectares} hectares</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Planting Date</p>
                <p className="font-medium text-gray-900">{formatDate(field.planting_date)}</p>
              </div>
            </div>

            {field.agent && (
              <div className="sm:col-span-2 flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <User className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Assigned Agent</p>
                  <p className="font-medium text-gray-900">{field.agent.name}</p>
                  <p className="text-xs text-gray-500">{field.agent.email}</p>
                </div>
              </div>
            )}

            {field.notes && (
              <div className="sm:col-span-2 flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Notes</p>
                  <p className="text-sm text-gray-700">{field.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Timeline */}
          <div className="rounded-lg border border-gray-100 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Growth Progress</h3>
            <div className="flex items-center justify-between">
              {stages.map((stage, idx) => {
                const isCompleted = idx <= currentStageIndex
                const isCurrent = stage === field.current_stage
                return (
                  <div key={stage} className="flex flex-col items-center flex-1">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-medium transition-all ${
                        isCompleted
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}
                    >
                      {getStageIcon(stage)}
                    </div>
                    <p className={`mt-2 text-xs font-medium ${isCompleted ? 'text-green-700' : 'text-gray-400'}`}>
                      {stage}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-green-600 mt-1">Current</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
            {field.created_at && (
              <span>Created {formatDistanceToNow(new Date(field.created_at), { addSuffix: true })}</span>
            )}
            {field.updated_at && (
              <span>Last updated {formatDistanceToNow(new Date(field.updated_at), { addSuffix: true })}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}