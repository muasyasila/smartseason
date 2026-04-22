'use client'

import { useState } from 'react'
import { StatusBadge } from './status-badge'
import { StageProgress } from './stage-progress'
import { UpdateFieldModal } from './update-field-modal'
import { ViewFieldModal } from './view-field-modal'
import { ActionDropdown } from './action-dropdown'
import { Sprout, Plus } from 'lucide-react'
import { CreateFieldButton } from './create-field-button'

interface Field {
  id: string
  name: string
  crop_type: string
  location: string | null
  current_stage: string
  status: string
  planting_date: string
  size_hectares: number | null
  notes: string | null
  created_at: string
  updated_at: string
  agent?: { name: string; email: string; id: string }
}

interface FieldsTableProps {
  fields: Field[]
  isAdmin: boolean
}

export function FieldsTable({ fields, isAdmin }: FieldsTableProps) {
  const [selectedField, setSelectedField] = useState<Field | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleUpdate = (field: Field) => {
    setSelectedField(field)
    setShowUpdateModal(true)
  }

  const handleViewDetails = (field: Field) => {
    setSelectedField(field)
    setShowViewModal(true)
  }

  const handleEdit = (field: Field) => {
    setSelectedField(field)
    setShowEditModal(true)
  }

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 px-4 text-center border border-gray-100">
        <div className="rounded-full bg-gray-50 p-3 mb-4">
          <Sprout className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-base font-medium text-gray-900">No fields yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isAdmin 
            ? "Get started by creating your first field." 
            : "Fields assigned to you will appear here."}
        </p>
        {isAdmin && (
          <div className="mt-4">
            <CreateFieldButton />
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Planted
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                )}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fields.map((field) => (
                <tr key={field.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{field.name}</div>
                    {field.location && (
                      <div className="text-xs text-gray-400 mt-0.5">{field.location}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {field.crop_type}
                  </td>
                  <td className="px-6 py-4">
                    <StageProgress currentStage={field.current_stage} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={field.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(field.planting_date)}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {field.agent?.name || '—'}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <ActionDropdown
                      field={field}
                      isAdmin={isAdmin}
                      onUpdate={handleUpdate}
                      onView={handleViewDetails}
                      onEdit={handleEdit}
                      onDelete={() => {}}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showUpdateModal && selectedField && (
        <UpdateFieldModal
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false)
            setSelectedField(null)
          }}
          field={selectedField}
        />
      )}

      {showViewModal && selectedField && (
        <ViewFieldModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false)
            setSelectedField(null)
          }}
          field={selectedField}
        />
      )}
    </>
  )
}