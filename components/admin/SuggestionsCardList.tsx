'use client'

import { useState, useEffect, useRef } from 'react'
import { useSuggestions } from '../../contexts/SuggestionsContext'
import { Search, Settings, Filter, X } from 'lucide-react'
import { getStatusColor, SuggestionStatus } from '../../data/suggestions'
import SuggestionListItem from './SuggestionListItem'

interface SuggestionsCardListProps {
  onSuggestionSelect: (id: string) => void
  selectedSuggestionId?: string | null
}

export default function SuggestionsCardList({ 
  onSuggestionSelect, 
  selectedSuggestionId 
}: SuggestionsCardListProps) {
  const {
    activeStatus,
    searchQuery,
    suggestions,
    setActiveStatus,
    setSearchQuery,
    getFilteredSuggestions,
    getCategories,
  } = useSuggestions()
  
  const [searchSettingsOpen, setSearchSettingsOpen] = useState(false)
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const searchSettingsRef = useRef<HTMLDivElement>(null)
  const filterMenuRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = getFilteredSuggestions()

  const statusOptions: SuggestionStatus[] = ['New', 'Open', 'Duplicate', 'Planned', 'In Progress', 'Completed', 'Rejected']

  // Подсчет количества предложений по статусам
  const getStatusCount = (status: SuggestionStatus): number => {
    return suggestions.filter(s => s.lifecycle.status === status).length
  }

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleClickOutside = (event: MouseEvent) => {
      if (searchSettingsRef.current && !searchSettingsRef.current.contains(event.target as Node)) {
        setSearchSettingsOpen(false)
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setFilterMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок */}
      <div className="p-4 pb-2 border-b border-[#e2e8f0]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Suggestions</h1>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
              v2.0
            </span>
          </div>
        </div>

        {/* Поиск */}
        <div className="relative" ref={searchSettingsRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
          <input
            type="text"
            placeholder="Search suggestions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSearchSettingsOpen(!searchSettingsOpen)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
          >
            <Settings className="h-4 w-4 text-[#9E9E9E]" />
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <div className="px-4 py-2 border-b border-[#F0F0F0] relative" ref={filterMenuRef}>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setFilterMenuOpen(!filterMenuOpen)
            }}
            className="flex items-center gap-2 text-[11px] font-bold uppercase hover:text-[#424242] transition-colors"
            style={{ letterSpacing: '0.5px' }}
          >
            <Filter className="h-3.5 w-3.5" />
            {activeStatus !== 'All' ? (
              <span className="text-[#424242]">{activeStatus}</span>
            ) : (
              <span className="text-[#757575]">Add Filter</span>
            )}
          </button>
          {activeStatus !== 'All' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveStatus('All')
              }}
              className="p-0.5 hover:bg-gray-100 rounded transition-colors"
              title="Clear filter"
            >
              <X className="h-3.5 w-3.5 text-[#757575]" />
            </button>
          )}
        </div>
        
        {/* Filter Popover */}
        {filterMenuOpen && (
          <div className="absolute left-4 top-full mt-1 w-[290px] bg-white border border-gray-200 rounded-lg z-50" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            {/* Header with search */}
            <div className="bg-gray-100 px-3 py-2">
              <input
                type="text"
                placeholder="Filter by"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Filter options list - только статусы */}
            <div className="py-1">
              {statusOptions.map((status) => {
                const statusColor = getStatusColor(status)
                const isActive = activeStatus === status
                const count = getStatusCount(status)
                return (
                  <button
                    key={status}
                    onClick={() => {
                      setActiveStatus(status)
                      setFilterMenuOpen(false)
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors ${
                      isActive ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                      <span className={isActive ? 'font-semibold' : ''}>{status}</span>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Список карточек */}
      <div className="flex-1 overflow-y-auto">
        {filteredSuggestions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">No suggestions found</p>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => (
            <SuggestionListItem
              key={suggestion.id}
              suggestion={suggestion}
              isSelected={selectedSuggestionId === suggestion.id}
              onClick={() => onSuggestionSelect(suggestion.id)}
              getCategories={getCategories}
            />
          ))
        )}
      </div>
    </div>
  )
}

