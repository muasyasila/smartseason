'use client'

import { useEffect, useRef, useState } from 'react'
import { MoreVertical, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react'
import { createPortal } from 'react-dom'

interface ActionDropdownProps {
  field: {
    id: string
    name: string
    crop_type: string
    current_stage: string
    status: string
    planting_date: string
    location: string | null
  }
  isAdmin: boolean
  onUpdate: (field: any) => void
  onView: (field: any) => void
  onEdit: (field: any) => void
  onDelete: (field: any) => void
}

export function ActionDropdown({ field, isAdmin, onUpdate, onView, onEdit, onDelete }: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClick = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 200 + window.scrollX
      })
    }
    setIsOpen(!isOpen)
  }

  const handleAction = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  // Debug log to verify field.id exists
  console.log('ActionDropdown field:', { id: field.id, name: field.name })

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleClick}
        className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[100] w-48 rounded-lg bg-white shadow-lg border border-gray-100 py-1"
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          <button
            onClick={() => handleAction(() => onUpdate(field))}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            Update Progress
          </button>
          <button
            onClick={() => handleAction(() => onView(field))}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-4 w-4" />
            View Details
          </button>
          <button
            onClick={() => handleAction(() => onEdit(field))}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit Field
          </button>
          {isAdmin && (
            <>
              <div className="my-1 h-px bg-gray-100" />
              <button
                onClick={() => handleAction(() => onDelete(field))}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Field
              </button>
            </>
          )}
        </div>,
        document.body
      )}
    </>
  )
}