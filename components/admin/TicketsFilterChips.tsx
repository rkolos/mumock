'use client'

import { X } from 'lucide-react'

interface TicketsFilterChipsProps {
  activeView: string | null
  sourceFilter: string | null
  statusFilters: string[]
  priorityFilters: string[]
  assignedUsersFilters: string[]
  tagsFilters: string[]
  categoriesFilters: string[]
  dateFilter: { from: string; to: string } | null
  onRemoveView: () => void
  onRemoveSource: () => void
  onRemoveStatus: () => void
  onRemovePriority: () => void
  onRemoveAssignedUsers: () => void
  onRemoveTags: () => void
  onRemoveCategories: () => void
  onRemoveDate: () => void
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

// Функция форматирования названия источника
function formatSourceName(source: string): string {
  const sourceMap: Record<string, string> = {
    'web': 'Web',
    'email': 'Email',
    'discord': 'Discord',
    'telegram': 'Telegram',
    'api': 'API',
  }
  return sourceMap[source] || source.charAt(0).toUpperCase() + source.slice(1)
}

// Функция форматирования статуса
function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'resolved': 'Resolved',
    'closed': 'Closed',
  }
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
}

// Функция форматирования приоритета
function formatPriority(priority: string): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

// Функция форматирования названия Smart View
function formatViewLabel(view: string): string {
  const viewMap: Record<string, string> = {
    'your_inbox': 'Your Inbox',
    'mentions': 'Mentions',
    'awaiting_reply': 'Awaiting Reply',
    'unassigned': 'Unassigned',
    'all_tickets': 'All Tickets',
  }
  return viewMap[view] || view.charAt(0).toUpperCase() + view.slice(1).replace(/_/g, ' ')
}

export default function TicketsFilterChips({
  activeView,
  sourceFilter,
  statusFilters,
  priorityFilters,
  assignedUsersFilters,
  tagsFilters,
  categoriesFilters,
  dateFilter,
  onRemoveView,
  onRemoveSource,
  onRemoveStatus,
  onRemovePriority,
  onRemoveAssignedUsers,
  onRemoveTags,
  onRemoveCategories,
  onRemoveDate,
  onClearAll,
}: TicketsFilterChipsProps) {
  const hasActiveFilters =
    activeView !== null ||
    sourceFilter !== null ||
    statusFilters.length > 0 ||
    priorityFilters.length > 0 ||
    assignedUsersFilters.length > 0 ||
    tagsFilters.length > 0 ||
    categoriesFilters.length > 0 ||
    dateFilter !== null

  if (!hasActiveFilters) {
    return null
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* View Chip (отображается первым) */}
      {activeView && (
        <div className="px-3 py-1.5 bg-purple-100 text-purple-800 text-sm rounded-md flex items-center gap-1.5">
          <span>View: {formatViewLabel(activeView)}</span>
          <button
            onClick={onRemoveView}
            className="hover:bg-purple-200 rounded p-0.5 transition-colors"
            title="Remove view filter"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Source Filter */}
      {sourceFilter && (
        <div className="px-3 py-1.5 bg-[#2563eb] text-white text-sm rounded-md flex items-center gap-1.5">
          <span>Source: {formatSourceName(sourceFilter)}</span>
          <button
            onClick={onRemoveSource}
            className="hover:bg-blue-600 rounded p-0.5 transition-colors"
            title="Remove source filter"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Status Filters */}
      {statusFilters.length > 0 && (
        <div className="px-3 py-1.5 bg-[#2563eb] text-white text-sm rounded-md flex items-center gap-1.5">
          <span>Status: {statusFilters.map(s => formatStatus(s)).join(', ')}</span>
          <button
            onClick={onRemoveStatus}
            className="hover:bg-blue-600 rounded p-0.5 transition-colors"
            title="Remove status filters"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Priority Filters */}
      {priorityFilters.length > 0 && (
        <div className="px-3 py-1.5 bg-[#2563eb] text-white text-sm rounded-md flex items-center gap-1.5">
          <span>Priority: {priorityFilters.map(p => formatPriority(p)).join(', ')}</span>
          <button
            onClick={onRemovePriority}
            className="hover:bg-blue-600 rounded p-0.5 transition-colors"
            title="Remove priority filters"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Assigned Users Filters */}
      {assignedUsersFilters.length > 0 && (
        <div className="px-3 py-1.5 bg-[#2563eb] text-white text-sm rounded-md flex items-center gap-1.5">
          <span>Assigned: {assignedUsersFilters.join(', ')}</span>
          <button
            onClick={onRemoveAssignedUsers}
            className="hover:bg-blue-600 rounded p-0.5 transition-colors"
            title="Remove assigned users filters"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Tags Filters */}
      {tagsFilters.length > 0 && (
        <div className="px-3 py-1.5 bg-[#2563eb] text-white text-sm rounded-md flex items-center gap-1.5">
          <span>Tags: {tagsFilters.join(', ')}</span>
          <button
            onClick={onRemoveTags}
            className="hover:bg-blue-600 rounded p-0.5 transition-colors"
            title="Remove tags filters"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Categories Filters */}
      {categoriesFilters.length > 0 && (
        <div className="px-3 py-1.5 bg-[#2563eb] text-white text-sm rounded-md flex items-center gap-1.5">
          <span>Category: {categoriesFilters.join(', ')}</span>
          <button
            onClick={onRemoveCategories}
            className="hover:bg-blue-600 rounded p-0.5 transition-colors"
            title="Remove categories filters"
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

