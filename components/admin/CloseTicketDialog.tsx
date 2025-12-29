'use client'

import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'

interface CloseTicketDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (addToKnowledgeBase: boolean) => void
  ticketId?: string
}

export default function CloseTicketDialog({
  isOpen,
  onClose,
  onConfirm,
  ticketId,
}: CloseTicketDialogProps) {
  const [addToKnowledgeBase, setAddToKnowledgeBase] = useState(false)

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm(addToKnowledgeBase)
    setAddToKnowledgeBase(false) // Сброс состояния после закрытия
  }

  const handleCancel = () => {
    setAddToKnowledgeBase(false) // Сброс состояния при отмене
    onClose()
  }

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
          <h2 className="text-lg font-semibold text-gray-900">Close Ticket</h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-700 mb-4">
            Are you sure you want to close this ticket? The user will be notified.
          </p>

          {/* Knowledge Base Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={addToKnowledgeBase}
                onChange={(e) => setAddToKnowledgeBase(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    Add to Knowledge Base
                  </span>
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  AI will summarize the solution and save it to the Solved Articles list.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Close Ticket
          </button>
        </div>
      </div>
    </div>
  )
}

