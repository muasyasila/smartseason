'use client'

import { useState } from 'react'
import { X, Sprout } from 'lucide-react'
import { updateFieldStage } from '@/lib/actions/field-actions'
import { useRouter } from 'next/navigation'

interface UpdateFieldModalProps {
  isOpen: boolean
  onClose: () => void
  field: {
    id: string
    name: string
    current_stage: string
    crop_type: string
  }
}

const stages = ['Planted', 'Growing', 'Ready', 'Harvested']

export function UpdateFieldModal({ isOpen, onClose, field }: UpdateFieldModalProps) {
  const [loading, setLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [selectedStage, setSelectedStage] = useState(field.current_stage)
  const router = useRouter()

  if (!isOpen) return null

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  
  // Prevent double submission
  if (loading || hasSubmitted) return
  
  // Don't submit if no change
  if (selectedStage === field.current_stage) {
    setError('No changes to update. Please select a different stage.')
    return
  }
  
  setLoading(true)
  setHasSubmitted(true)
  setError('')
  
  const formData = new FormData(e.currentTarget)
  
  try {
    const result = await updateFieldStage(field.id, formData)
    
    if (result.success) {
      onClose()
      router.refresh()
    } else {
      setError(result.message || 'Failed to update field stage')
      setHasSubmitted(false)
      setLoading(false)
    }
  } catch (err: any) {
    console.error('Update error:', err)
    setError(err.message || 'An error occurred while updating')
    setHasSubmitted(false)
    setLoading(false)
  }
}

  const getStageDescription = (stage: string) => {
    switch(stage) {
      case 'Planted': return 'Seeds have been planted in the soil'
      case 'Growing': return 'Crops are actively growing and developing'
      case 'Ready': return 'Crops are mature and ready for harvest'
      case 'Harvested': return 'Crops have been harvested'
      default: return ''
    }
  }

  const getStageIcon = (stage: string) => {
    switch(stage) {
      case 'Planted': return '🌱'
      case 'Growing': return '🌿'
      case 'Ready': return '🌾'
      case 'Harvested': return '🚜'
      default: return '🌱'
    }
  }

  const currentIndex = stages.indexOf(field.current_stage)
  const selectedIndex = stages.indexOf(selectedStage)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 p-1.5">
              <Sprout className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Update Field Progress</h2>
              <p className="text-sm text-gray-500">{field.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Crop Info Badge */}
          <div className="rounded-lg bg-green-50 p-3 border border-green-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getStageIcon(field.crop_type)}</span>
              <div>
                <p className="text-sm text-gray-600">Crop Type</p>
                <p className="font-medium text-gray-900">{field.crop_type}</p>
              </div>
            </div>
          </div>

          {/* Current Stage Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Stage
            </label>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getStageIcon(field.current_stage)}</span>
                <span className="font-medium text-gray-900">{field.current_stage}</span>
              </div>
              <div className="text-sm text-gray-500">
                {getStageDescription(field.current_stage)}
              </div>
            </div>
          </div>

          {/* Update to New Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update to Stage *
            </label>
            <select
              name="current_stage"
              required
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              {stages.map((stage) => {
                const stageIndex = stages.indexOf(stage)
                const isDisabled = stageIndex < currentIndex
                return (
                  <option 
                    key={stage} 
                    value={stage}
                    disabled={isDisabled}
                    className={isDisabled ? 'text-gray-400' : ''}
                  >
                    {stage} {isDisabled && '(already passed)'}
                    {stage === field.current_stage && ' (current)'}
                  </option>
                )
              })}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {getStageDescription(selectedStage)}
            </p>
          </div>

          {/* Progress Visualization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress Timeline
            </label>
            <div className="flex items-center justify-between">
              {stages.map((stage, idx) => {
                const isCompleted = idx <= selectedIndex
                const isCurrent = stage === selectedStage
                const isOriginalCurrent = stage === field.current_stage
                return (
                  <div key={stage} className="flex flex-col items-center flex-1">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                        isCompleted
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-2 ring-green-400 ring-offset-2' : ''} ${
                        isOriginalCurrent && !isCurrent ? 'ring-1 ring-gray-300' : ''
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <p className={`mt-1 text-xs ${isCompleted ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                      {stage}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes / Observations
            </label>
            <textarea
              name="notes"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Add notes about crop health, weather conditions, or any observations..."
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || hasSubmitted || selectedStage === field.current_stage}
              className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Stage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}