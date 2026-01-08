'use client'

import { useState, useEffect, useRef } from 'react'
import { useSuggestions } from '../../contexts/SuggestionsContext'
import { Search, ThumbsUp, ThumbsDown, Settings, MessageSquare, Plus } from 'lucide-react'
import { formatRelativeTime, getStatusColor, SuggestionStatus } from '../../data/suggestions'
import { hasAdminAccess } from '../../utils/auth'
import SuggestionsSettingsModal from './SuggestionsSettingsModal'
import CreateSuggestionModal from './CreateSuggestionModal'

export default function SuggestionsList() {
  const {
    selectedSuggestionId,
    activeStatus,
    searchQuery,
    suggestions,
    setSelectedSuggestionId,
    setActiveStatus,
    setSearchQuery,
    getFilteredSuggestions,
    getCategories,
  } = useSuggestions()
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const canAccessSettings = hasAdminAccess()
  const prevActiveStatusRef = useRef(activeStatus)

  const filteredSuggestions = getFilteredSuggestions()

  const statusOptions: SuggestionStatus[] = ['New', 'Open', 'Duplicate', 'Planned', 'In Progress', 'Completed', 'Rejected']

  // Подсчет количества предложений по статусам
  const getStatusCount = (status: SuggestionStatus): number => {
    return suggestions.filter(s => s.lifecycle.status === status).length
  }

  // Автоматически выбираем первую карточку при смене фильтра по статусу
  useEffect(() => {
    // Проверяем, изменился ли активный статус
    if (prevActiveStatusRef.current !== activeStatus) {
      prevActiveStatusRef.current = activeStatus
      
      // При смене фильтра выбираем первую карточку из отфильтрованного списка
      const currentFiltered = getFilteredSuggestions()
      if (currentFiltered.length > 0) {
        setSelectedSuggestionId(currentFiltered[0].id)
      } else {
        // Если список пустой - сбрасываем выбор, чтобы показать empty state
        setSelectedSuggestionId(null)
      }
    }
  }, [activeStatus, getFilteredSuggestions, setSelectedSuggestionId])

  // При первой загрузке выбираем первую карточку, если ничего не выбрано
  useEffect(() => {
    if (!selectedSuggestionId && filteredSuggestions.length > 0) {
      setSelectedSuggestionId(filteredSuggestions[0].id)
    }
  }, [selectedSuggestionId, filteredSuggestions, setSelectedSuggestionId])

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок */}
      <div className="p-4 border-b border-[#e2e8f0]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Suggestions</h1>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
              v2.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-9 h-9 flex items-center justify-center border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              title="New Suggestion"
            >
              <Plus className="h-4 w-4" />
            </button>
            {canAccessSettings && (
              <button
                onClick={() => setSettingsModalOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Settings"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search suggestions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Табы-фильтры по статусам */}
      <div className="px-4 pt-4 pb-2 border-b border-[#e2e8f0]">
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((status) => {
            const statusColor = getStatusColor(status)
            const isActive = activeStatus === status
            const count = getStatusCount(status)
            return (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-full transition-colors flex items-center gap-1.5
                  ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                <span>{status}</span>
                <span className={`
                  px-1.5 py-0.5 text-xs rounded-full
                  ${
                    isActive
                      ? 'bg-blue-400/30 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Список карточек */}
      <div className="flex-1 overflow-y-auto">
        {filteredSuggestions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">No suggestions found</p>
          </div>
        ) : (
          <div className="p-2">
            {filteredSuggestions.map((suggestion) => {
              const isSelected = selectedSuggestionId === suggestion.id
              const statusColor = getStatusColor(suggestion.lifecycle.status)
              const isOfficial = suggestion.type === 'official_proposal'

              return (
                <div
                  key={suggestion.id}
                  onClick={() => setSelectedSuggestionId(suggestion.id)}
                  className={`
                    p-3 mb-2 rounded-lg cursor-pointer transition-colors border
                    ${
                      isOfficial
                        ? isSelected
                          ? 'bg-blue-100 border-2 border-blue-300'
                          : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
                        : isSelected
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-white border border-[#e2e8f0] hover:bg-gray-50'
                    }
                  `}
                >
                  {/* Верх: Статус + ID + Badge + Voting Metrics */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                      <span className="text-xs text-gray-500">{suggestion.id}</span>
                      {isOfficial && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          TEAM
                        </span>
                      )}
                    </div>
                    {suggestion.lifecycle.status !== 'New' && (
                      <div className="flex items-center gap-2 px-2 py-0.5 bg-gray-100 rounded">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{suggestion.metrics.upvotes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <ThumbsDown className="h-3 w-3" />
                          <span>{suggestion.metrics.downvotes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MessageSquare className="h-3 w-3" />
                          <span>5</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Центр: Заголовок */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                    {suggestion.content.title}
                  </h3>

                  {/* Низ: Категория + Аватар + Никнейм + Дата */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {(() => {
                      const categories = getCategories()
                      const categoryConfig = categories.find(cat => cat.label === suggestion.content.category)
                      const categoryColor = categoryConfig?.color || '#9ca3af'
                      return (
                        <span 
                          className="px-2 py-0.5 text-white text-xs rounded-full font-medium"
                          style={{ backgroundColor: categoryColor }}
                        >
                          {suggestion.content.category}
                        </span>
                      )
                    })()}
                    {suggestion.author.avatar_url && (
                      <img
                        src={suggestion.author.avatar_url}
                        alt={suggestion.author.username}
                        className="w-4 h-4 rounded-full"
                      />
                    )}
                    <span className="text-xs text-gray-600">
                      {suggestion.author.isSystem ? 'Ninja Product Team' : suggestion.author.username}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(suggestion.created_at)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <SuggestionsSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      {/* Create Suggestion Modal */}
      <CreateSuggestionModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  )
}

