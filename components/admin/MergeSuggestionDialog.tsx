'use client'

import { useState, useRef, useEffect } from 'react'
import { useSuggestions } from '../../contexts/SuggestionsContext'
import { X, Search, Check } from 'lucide-react'
import { getStatusColor } from '../../data/suggestions'

interface MergeSuggestionDialogProps {
  suggestionId: string
  onClose: () => void
}

export default function MergeSuggestionDialog({ suggestionId, onClose }: MergeSuggestionDialogProps) {
  const {
    suggestions,
    getSuggestionById,
    mergeSuggestion,
    getSimilarSuggestions,
    dismissSimilarSuggestions,
  } = useSuggestions()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOriginalId, setSelectedOriginalId] = useState<string | null>(null)
  const [showSimilarOnly, setShowSimilarOnly] = useState(true)

  const currentSuggestion = getSuggestionById(suggestionId)
  const similarSuggestions = getSimilarSuggestions(suggestionId)
  const hasSimilar = similarSuggestions.length > 0

  // Если есть похожие и показываем только их - используем похожие, иначе все доступные
  const availableSuggestions = suggestions.filter(
    s => s.id !== suggestionId && s.lifecycle.status !== 'Duplicate'
  )

  const suggestionsToShow = showSimilarOnly && hasSimilar 
    ? similarSuggestions 
    : availableSuggestions

  // Фильтруем по поисковому запросу (только если не показываем похожие)
  const filteredSuggestions = showSimilarOnly && hasSimilar
    ? suggestionsToShow
    : suggestionsToShow.filter(s => {
        if (!searchQuery.trim()) return true
        const query = searchQuery.toLowerCase()
        return (
          s.content.title.toLowerCase().includes(query) ||
          s.id.toLowerCase().includes(query)
        )
      })

  const handleConfirm = () => {
    if (selectedOriginalId && currentSuggestion) {
      mergeSuggestion(suggestionId, selectedOriginalId)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0]">
          <h2 className="text-xl font-bold text-gray-900">
            Merge Suggestion {suggestionId}
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
              Текущее предложение будет закрыто как дубликат.
            </p>
          </div>

          {/* Похожие предложения заголовок */}
          {hasSimilar && showSimilarOnly && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Похожие предложения ({similarSuggestions.length})
              </h3>
            </div>
          )}

          {/* Search Input - показываем только если нет похожих или переключились на все */}
          {(!hasSimilar || !showSimilarOnly) && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Find original suggestion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Переключение между похожими и всеми */}
          {hasSimilar && (
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setShowSimilarOnly(true)}
                className={`
                  px-3 py-1.5 text-sm rounded-md transition-colors
                  ${showSimilarOnly 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                Похожие ({similarSuggestions.length})
              </button>
              <button
                onClick={() => setShowSimilarOnly(false)}
                className={`
                  px-3 py-1.5 text-sm rounded-md transition-colors
                  ${!showSimilarOnly 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                Все предложения
              </button>
            </div>
          )}

          {/* Results List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredSuggestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No suggestions found</p>
              </div>
            ) : (
              filteredSuggestions.map((suggestion) => {
                const isSelected = selectedOriginalId === suggestion.id
                const statusColor = getStatusColor(suggestion.lifecycle.status)

                return (
                  <button
                    key={suggestion.id}
                    onClick={() => setSelectedOriginalId(suggestion.id)}
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
                          <span className="text-xs text-gray-500">{suggestion.id}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{suggestion.lifecycle.status}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {suggestion.content.title}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {suggestion.content.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#e2e8f0]">
          <div>
            {hasSimilar && showSimilarOnly && (
              <button
                onClick={() => {
                  dismissSimilarSuggestions(suggestionId)
                  onClose()
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-[#e2e8f0] rounded-md hover:bg-gray-50 transition-colors"
              >
                Похожих нет
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-[#e2e8f0] rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedOriginalId}
              className={`
                px-4 py-2 text-sm font-medium text-white rounded-md transition-colors
                ${
                  selectedOriginalId
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
    </div>
  )
}

