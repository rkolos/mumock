'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface MacroCategoryDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => void
  onDelete?: () => void
  categoryName?: string
  macroCount?: number
}

export default function MacroCategoryDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  categoryName,
  macroCount = 0,
}: MacroCategoryDialogProps) {
  const [name, setName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setName(categoryName || '')
      setShowDeleteConfirm(false)
    }
  }, [isOpen, categoryName])

  if (!isOpen) return null

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim())
      setName('')
      onClose()
    }
  }

  const handleDelete = () => {
    if (macroCount > 0) {
      setShowDeleteConfirm(true)
    } else {
      onDelete?.()
      onClose()
    }
  }

  const handleConfirmDelete = () => {
    onDelete?.()
    setShowDeleteConfirm(false)
    onClose()
  }

  const isEditMode = !!categoryName

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[400px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? 'Edit Category' : 'Create Category'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {showDeleteConfirm ? (
            <div>
              <p className="text-sm text-gray-700 mb-4">
                This category contains {macroCount} macro(s). Do you want to delete the category and move macros to Uncategorized?
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Category
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Category name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSave()
                    }
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!showDeleteConfirm && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div>
              {isEditMode && onDelete && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditMode ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

