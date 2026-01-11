'use client'

import { useState, useRef, useEffect } from 'react'
import { Filter, X } from 'lucide-react'
import { SuggestionStatus, getStatusColor } from '../../data/suggestions'
import { useSuggestions } from '../../contexts/SuggestionsContext'

interface FilterDropdownProps {
  isOpen: boolean
  onClose: () => void
  statusFilters: SuggestionStatus[]
  categoryFilters: string[]
  scoreFilter: { type: 'more' | 'less'; value: number } | null
  dateFilter: { from: string; to: string } | null
  onStatusChange: (statuses: SuggestionStatus[]) => void
  onCategoryChange: (categories: string[]) => void
  onScoreChange: (filter: { type: 'more' | 'less'; value: number } | null) => void
  onDateChange: (filter: { from: string; to: string } | null) => void
}

type FilterType = 'category' | 'score' | 'status' | 'date' | null

export default function FilterDropdown({
  isOpen,
  onClose,
  statusFilters,
  categoryFilters,
  scoreFilter,
  dateFilter,
  onStatusChange,
  onCategoryChange,
  onScoreChange,
  onDateChange,
}: FilterDropdownProps) {
  const { getCategories } = useSuggestions()
  const categories = getCategories()
  const [activeFilterType, setActiveFilterType] = useState<FilterType>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Локальное состояние для форм
  const [localCategories, setLocalCategories] = useState<string[]>(categoryFilters)
  const [localStatuses, setLocalStatuses] = useState<SuggestionStatus[]>(statusFilters)
  const [localScoreType, setLocalScoreType] = useState<'more' | 'less'>('more')
  const [localScoreValue, setLocalScoreValue] = useState<string>(scoreFilter?.value.toString() || '')
  const [localDateFrom, setLocalDateFrom] = useState<string>(dateFilter?.from || '')
  const [localDateTo, setLocalDateTo] = useState<string>(dateFilter?.to || '')

  const statusOptions: SuggestionStatus[] = ['New', 'Open', 'Duplicate', 'Planned', 'In Progress', 'Completed', 'Rejected']

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Синхронизация локального состояния с пропсами
  useEffect(() => {
    setLocalCategories(categoryFilters)
  }, [categoryFilters])

  useEffect(() => {
    setLocalStatuses(statusFilters)
  }, [statusFilters])

  useEffect(() => {
    if (scoreFilter) {
      setLocalScoreType(scoreFilter.type)
      setLocalScoreValue(scoreFilter.value.toString())
    } else {
      setLocalScoreValue('')
    }
  }, [scoreFilter])

  useEffect(() => {
    if (dateFilter) {
      setLocalDateFrom(dateFilter.from)
      setLocalDateTo(dateFilter.to)
    } else {
      setLocalDateFrom('')
      setLocalDateTo('')
    }
  }, [dateFilter])

  const handleCategoryToggle = (category: string) => {
    const newCategories = localCategories.includes(category)
      ? localCategories.filter(c => c !== category)
      : [...localCategories, category]
    setLocalCategories(newCategories)
    onCategoryChange(newCategories)
  }

  const handleStatusToggle = (status: SuggestionStatus) => {
    const newStatuses = localStatuses.includes(status)
      ? localStatuses.filter(s => s !== status)
      : [...localStatuses, status]
    setLocalStatuses(newStatuses)
    onStatusChange(newStatuses)
  }

  const handleScoreApply = () => {
    const value = parseInt(localScoreValue)
    if (!isNaN(value)) {
      onScoreChange({ type: localScoreType, value })
    }
  }

  const handleScoreClear = () => {
    setLocalScoreValue('')
    onScoreChange(null)
  }

  const handleDateApply = () => {
    if (localDateFrom && localDateTo) {
      // Валидация: to не может быть раньше from
      const fromDate = new Date(localDateFrom)
      const toDate = new Date(localDateTo)
      if (toDate >= fromDate) {
        onDateChange({ from: localDateFrom, to: localDateTo })
      }
    }
  }

  const handleDateClear = () => {
    setLocalDateFrom('')
    setLocalDateTo('')
    onDateChange(null)
  }

  // Форматирование даты для input[type="date"]
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 top-full mt-1 w-[320px] bg-white border border-gray-200 rounded-lg z-50 shadow-lg"
    >
      {activeFilterType === null ? (
        // Главное меню выбора типа фильтра
        <div className="py-1">
          <button
            onClick={() => setActiveFilterType('category')}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <span>Category</span>
            {categoryFilters.length > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                {categoryFilters.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilterType('score')}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <span>Score</span>
            {scoreFilter && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                {scoreFilter.type === 'more' ? '>' : '<'} {scoreFilter.value}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilterType('status')}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <span>Status</span>
            {statusFilters.length > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                {statusFilters.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilterType('date')}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <span>Created Date</span>
            {dateFilter && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                Set
              </span>
            )}
          </button>
        </div>
      ) : (
        // Формы для каждого типа фильтра
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              {activeFilterType === 'category' && 'Select Categories'}
              {activeFilterType === 'score' && 'Filter by Score'}
              {activeFilterType === 'status' && 'Select Status'}
              {activeFilterType === 'date' && 'Filter by Date'}
            </h3>
            <button
              onClick={() => setActiveFilterType(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Category Filter Form */}
          {activeFilterType === 'category' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {categories.map((category) => {
                const isSelected = localCategories.includes(category.label)
                return (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCategoryToggle(category.label)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-900">{category.label}</span>
                    </div>
                  </label>
                )
              })}
            </div>
          )}

          {/* Score Filter Form */}
          {activeFilterType === 'score' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="scoreType"
                    value="more"
                    checked={localScoreType === 'more'}
                    onChange={() => setLocalScoreType('more')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">More than</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="scoreType"
                    value="less"
                    checked={localScoreType === 'less'}
                    onChange={() => setLocalScoreType('less')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">Less than</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={localScoreValue}
                  onChange={(e) => setLocalScoreValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleScoreApply}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
                {scoreFilter && (
                  <button
                    onClick={handleScoreClear}
                    className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Status Filter Form */}
          {activeFilterType === 'status' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {statusOptions.map((status) => {
                const statusColor = getStatusColor(status)
                const isSelected = localStatuses.includes(status)
                return (
                  <label
                    key={status}
                    className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleStatusToggle(status)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                      <span className={`text-sm text-gray-900 ${isSelected ? 'font-semibold' : ''}`}>
                        {status}
                      </span>
                    </div>
                  </label>
                )
              })}
            </div>
          )}

          {/* Date Filter Form */}
          {activeFilterType === 'date' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                <input
                  type="date"
                  value={formatDateForInput(localDateFrom)}
                  onChange={(e) => setLocalDateFrom(e.target.value)}
                  max={formatDateForInput(localDateTo) || undefined}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                <input
                  type="date"
                  value={formatDateForInput(localDateTo)}
                  onChange={(e) => setLocalDateTo(e.target.value)}
                  min={formatDateForInput(localDateFrom) || undefined}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDateApply}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
                {dateFilter && (
                  <button
                    onClick={handleDateClear}
                    className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

