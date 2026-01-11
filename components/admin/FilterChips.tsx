'use client'

import { X } from 'lucide-react'
import { SuggestionStatus } from '../../data/suggestions'

interface FilterChipsProps {
  categoryFilters: string[]
  scoreFilter: { type: 'more' | 'less'; value: number } | null
  dateFilter: { from: string; to: string } | null
  statusFilters: SuggestionStatus[]
  onRemoveCategory: () => void
  onRemoveScore: () => void
  onRemoveDate: () => void
  onRemoveStatus: () => void
  onClearAll: () => void
}

// Функция форматирования даты в формате D MMM YYYY
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export default function FilterChips({
  categoryFilters,
  scoreFilter,
  dateFilter,
  statusFilters,
  onRemoveCategory,
  onRemoveScore,
  onRemoveDate,
  onRemoveStatus,
  onClearAll,
}: FilterChipsProps) {
  const hasActiveFilters =
    categoryFilters.length > 0 ||
    scoreFilter !== null ||
    dateFilter !== null ||
    statusFilters.length > 0

  if (!hasActiveFilters) {
    return null
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Category Filter */}
      {categoryFilters.length > 0 && (
        <div className="px-3 py-1.5 bg-[#2563eb] text-white text-sm rounded-md flex items-center gap-1.5">
          <span>Category: {categoryFilters.join(', ')}</span>
          <button
            onClick={onRemoveCategory}
            className="hover:bg-blue-600 rounded p-0.5 transition-colors"
            title="Remove category filter"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Score Filter */}
      {scoreFilter && (
        <div className="px-3 py-1.5 bg-[#2563eb] text-white text-sm rounded-md flex items-center gap-1.5">
          <span>
            Score: {scoreFilter.type === 'more' ? '>' : '<'} {scoreFilter.value}
          </span>
          <button
            onClick={onRemoveScore}
            className="hover:bg-blue-600 rounded p-0.5 transition-colors"
            title="Remove score filter"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Date Filter */}
      {dateFilter && (
        <div className="px-3 py-1.5 bg-[#2563eb] text-white text-sm rounded-md flex items-center gap-1.5">
          <span>
            Created: {formatDate(dateFilter.from)} - {formatDate(dateFilter.to)}
          </span>
          <button
            onClick={onRemoveDate}
            className="hover:bg-blue-600 rounded p-0.5 transition-colors"
            title="Remove date filter"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Status Filters */}
      {statusFilters.length > 0 && (
        <div className="px-3 py-1.5 bg-[#2563eb] text-white text-sm rounded-md flex items-center gap-1.5">
          <span>Status: {statusFilters.join(', ')}</span>
          <button
            onClick={onRemoveStatus}
            className="hover:bg-blue-600 rounded p-0.5 transition-colors"
            title="Remove status filters"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Clear All Button */}
      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  )
}

