'use client'

import { useState } from 'react'
import { StatusBadge } from './status-badge'
import { StageProgress } from './stage-progress'
import { UpdateFieldModal } from './update-field-modal'
import { ViewFieldModal } from './view-field-modal'
import { EditFieldModal } from './edit-field-modal'
import { ActionDropdown } from './action-dropdown'
import { Sprout } from 'lucide-react'

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

  const handleDelete = (field: Field) => {
    setSelectedField(field)
    setShowDeleteConfirm(true)
  }

  if (fields.length === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-green-100 p-4">
            <Sprout className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No fields yet</h3>
          <p className="mt-2 text-gray-500">
            {isAdmin 
              ? "Get started by creating your first field." 
              : "Fields assigned to you will appear here."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Field Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Crop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Planting Date
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Agent
                  </th>
                )}
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {fields.map((field) => (
                <tr key={field.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-gray-900">{field.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-sm text-gray-700">
                      {field.crop_type === 'Maize' && '🌽'}
                      {field.crop_type === 'Beans' && '🫘'}
                      {field.crop_type === 'Wheat' && '🌾'}
                      {field.crop_type === 'Rice' && '🍚'}
                      {field.crop_type === 'Soybeans' && '🫛'}
                      {field.crop_type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {field.location || '—'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StageProgress currentStage={field.current_stage} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={field.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {formatDate(field.planting_date)}
                  </td>
                  {isAdmin && (
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {field.agent?.name || 'Unassigned'}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <ActionDropdown
                      field={field}
                      isAdmin={isAdmin}
                      onUpdate={handleUpdate}
                      onView={handleViewDetails}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
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

      {/* View Details Modal */}
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

      {/* Edit Modal */}
      {showEditModal && selectedField && (
        <EditFieldModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedField(null)
          }}
          field={selectedField}
          onSuccess={() => {
            setShowEditModal(false)
            setSelectedField(null)
          }}
        />
      )}
    </>
  )
}