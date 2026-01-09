'use client'

import { useState } from 'react'
import { useSuggestions } from '../../contexts/SuggestionsContext'
import { X, Check } from 'lucide-react'
import { getStatusColor } from '../../data/suggestions'

interface BulkMergeSuggestionsDialogProps {
  selectedIds: string[]
  onClose: () => void
  onConfirm: () => void
}

export default function BulkMergeSuggestionsDialog({
  selectedIds,
  onClose,
  onConfirm,
}: BulkMergeSuggestionsDialogProps) {
  const {
    suggestions,
    getSuggestionById,
    bulkMergeSuggestions,
  } = useSuggestions()

  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(
    selectedIds.length > 0 ? selectedIds[0] : null
  )

  // Получаем выбранные предложения
  const selectedSuggestions = selectedIds
    .map(id => getSuggestionById(id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined)

  // Доступные предложения для выбора в качестве цели (все выбранные)
  const availableTargets = selectedSuggestions

  const handleConfirm = () => {
    if (selectedTargetId && selectedIds.length > 1) {
      // Исключаем целевое предложение из списка для слияния
      const sourceIds = selectedIds.filter(id => id !== selectedTargetId)
      bulkMergeSuggestions(sourceIds, selectedTargetId)
      onConfirm()
      onClose()
    }
  }

  if (selectedSuggestions.length === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0]">
          <h2 className="text-xl font-bold text-gray-900">
            Merge {selectedIds.length} Suggestions
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              Все выбранные предложения, кроме целевого, будут помечены как дубликаты.
              Выберите целевое предложение, в которое будут объединены остальные.
            </p>
          </div>

          {/* Instructions */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Select Target Suggestion ({selectedIds.length} suggestions)
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Выберите предложение, которое станет основным. Все остальные будут объединены в него.
            </p>
          </div>

          {/* Suggestions List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {availableTargets.map((suggestion) => {
              const isSelected = selectedTargetId === suggestion.id
              const statusColor = getStatusColor(suggestion.lifecycle.status)

              return (
                <button
                  key={suggestion.id}
                  onClick={() => setSelectedTargetId(suggestion.id)}
                  className={`
                    w-full text-left p-4 rounded-lg border transition-colors
                    ${
                      isSelected
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-[#e2e8f0] hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
                      ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}
                    `}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                        <span className="text-xs text-gray-500 font-mono">{suggestion.id}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{suggestion.lifecycle.status}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {suggestion.content.title}
                      </h3>
                      {suggestion.content.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {suggestion.content.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Score: <span className="font-medium">{suggestion.metrics.score}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          Upvotes: <span className="font-medium">{suggestion.metrics.upvotes}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#e2e8f0]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-[#e2e8f0] rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedTargetId || selectedIds.length < 2}
            className={`
              px-4 py-2 text-sm font-medium text-white rounded-md transition-colors
              ${
                selectedTargetId && selectedIds.length >= 2
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            Confirm Merge
          </button>
        </div>
      </div>
    </div>
  )
}

