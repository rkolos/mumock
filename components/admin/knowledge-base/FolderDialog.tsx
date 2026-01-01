'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { KBFolder } from '../../../data/knowledgeBase'

interface FolderDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (folder: { id?: string; name: string; parent_id: string | null }) => void
  folder?: KBFolder | null
  parentId?: string | null
}

export default function FolderDialog({
  isOpen,
  onClose,
  onSave,
  folder,
  parentId,
}: FolderDialogProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (isOpen) {
      setName(folder?.name || '')
    }
  }, [isOpen, folder])

  if (!isOpen) return null

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        id: folder?.id,
        name: name.trim(),
        parent_id: folder ? folder.parent_id : parentId ?? null,
      })
      setName('')
      onClose()
    }
  }

  const handleCancel = () => {
    setName('')
    onClose()
  }

  const isEditMode = !!folder

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[400px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? 'Edit Folder' : 'New Folder'}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave()
                } else if (e.key === 'Escape') {
                  handleCancel()
                }
              }}
              placeholder="Enter folder name"
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditMode ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

