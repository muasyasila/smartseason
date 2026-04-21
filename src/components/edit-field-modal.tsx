'use client'

import { useState, useEffect } from 'react'
import { X, Sprout, Save, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { editField } from '@/lib/actions/field-actions'

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
  agent?: { name: string; email: string; id: string }
}

interface EditFieldModalProps {
  isOpen: boolean
  onClose: () => void
  field: Field
  onSuccess: () => void
}

export function EditFieldModal({ isOpen, onClose, field, onSuccess }: EditFieldModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agents, setAgents] = useState<{ id: string; name: string; email: string }[]>([])
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    name: field.name,
    crop_type: field.crop_type,
    location: field.location || '',
    size_hectares: field.size_hectares?.toString() || '',
    planting_date: field.planting_date,
    agent_id: field.agent?.id || '',
    notes: field.notes || '',
  })

  useEffect(() => {
    if (isOpen) {
      loadAgents()
      // Reset form data when field changes
      setFormData({
        name: field.name,
        crop_type: field.crop_type,
        location: field.location || '',
        size_hectares: field.size_hectares?.toString() || '',
        planting_date: field.planting_date,
        agent_id: field.agent?.id || '',
        notes: field.notes || '',
      })
    }
  }, [isOpen, field])

  const loadAgents = async () => {
    try {
      const response = await fetch('/api/agents')
      const data = await response.json()
      if (data.success) {
        setAgents(data.data)
      }
    } catch (err) {
      console.error('Failed to load agents:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Create FormData object for the server action
      const submitFormData = new FormData()
      submitFormData.append('name', formData.name)
      submitFormData.append('crop_type', formData.crop_type)
      submitFormData.append('location', formData.location)
      submitFormData.append('size_hectares', formData.size_hectares)
      submitFormData.append('planting_date', formData.planting_date)
      submitFormData.append('agent_id', formData.agent_id)
      submitFormData.append('notes', formData.notes)

      const result = await editField(field.id, submitFormData)
      
      if (result.success) {
        onSuccess()
        onClose()
        router.refresh()
      } else {
        setError(result.error || 'Failed to update field')
      }
    } catch (err: any) {
      console.error('Edit error:', err)
      setError(err.message || 'An error occurred while updating the field')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5">
              <Sprout className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Field</h2>
              <p className="text-sm text-gray-500">Update field information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., North Field A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crop Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.crop_type}
              onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Maize">🌽 Maize</option>
              <option value="Beans">🫘 Beans</option>
              <option value="Wheat">🌾 Wheat</option>
              <option value="Rice">🍚 Rice</option>
              <option value="Soybeans">🫛 Soybeans</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., Kiambu, Kenya"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size (hectares)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.size_hectares}
              onChange={(e) => setFormData({ ...formData, size_hectares: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., 2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Planting Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.planting_date}
              onChange={(e) => setFormData({ ...formData, planting_date: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign to Agent <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.agent_id}
              onChange={(e) => setFormData({ ...formData, agent_id: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Any additional information about this field..."
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
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
              disabled={loading}
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}