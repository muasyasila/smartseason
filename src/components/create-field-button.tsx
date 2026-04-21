'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Sprout } from 'lucide-react'
import { createField, getAgents } from '@/lib/actions/field-actions'
import { useRouter } from 'next/navigation'

export function CreateFieldButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agents, setAgents] = useState<{ id: string; name: string; email: string }[]>([])
  const router = useRouter()

  const loadAgents = async () => {
    try {
      const agentsList = await getAgents()
      setAgents(agentsList)
    } catch (err) {
      console.error('Failed to load agents:', err)
    }
  }

  const handleOpen = () => {
    loadAgents()
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    try {
      const result = await createField(formData)
      
      if (result.success) {
        setIsOpen(false)
        router.refresh()
      } else {
        setError('Failed to create field')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create field')
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:from-green-700 hover:to-emerald-700"
      >
        <Plus className="h-4 w-4" />
        Create Field
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 p-1.5">
                  <Sprout className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Create New Field</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
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
                  name="name"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="e.g., North Field A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="crop_type"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Select crop</option>
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
                  name="location"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                  name="size_hectares"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="e.g., 2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Planting Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="planting_date"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Agent <span className="text-red-500">*</span>
                </label>
                <select
                  name="agent_id"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Select agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.email})
                    </option>
                  ))}
                </select>
                {agents.length === 0 && (
                  <p className="mt-1 text-xs text-amber-600">
                    No agents found. Create an agent user in Supabase first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Any additional information about this field..."
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
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Field'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}