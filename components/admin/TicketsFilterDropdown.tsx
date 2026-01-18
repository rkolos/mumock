'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Globe, Mail, MessageCircle, Send, Code } from 'lucide-react'
import { mockTickets } from '../../data/tickets'

// Компонент для иконки Discord DM (комбинация Discord + Mail)
const DiscordDMSourceIcon = ({ className }: { className?: string }) => (
  <div className="relative inline-flex items-center justify-center">
    <MessageCircle className={className} />
    <Mail className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 text-[#5865F2] bg-white rounded-full p-0.5" style={{ fontSize: '8px' }} />
  </div>
)

interface TicketsFilterDropdownProps {
  isOpen: boolean
  onClose: () => void
  sourceFilter: string | null
  statusFilters: string[]
  priorityFilters: string[]
  assignedUsersFilters: string[]
  tagsFilters: string[]
  categoriesFilters: string[]
  dateFilter: { from: string; to: string } | null
  onSourceChange: (source: string | null) => void
  onStatusChange: (statuses: string[]) => void
  onPriorityChange: (priorities: string[]) => void
  onAssignedUsersChange: (users: string[]) => void
  onTagsChange: (tags: string[]) => void
  onCategoriesChange: (categories: string[]) => void
  onDateChange: (filter: { from: string; to: string } | null) => void
}

type FilterType = 'source' | 'status' | 'priority' | 'assignedUsers' | 'tags' | 'categories' | 'date' | null

export default function TicketsFilterDropdown({
  isOpen,
  onClose,
  sourceFilter,
  statusFilters,
  priorityFilters,
  assignedUsersFilters,
  tagsFilters,
  categoriesFilters,
  dateFilter,
  onSourceChange,
  onStatusChange,
  onPriorityChange,
  onAssignedUsersChange,
  onTagsChange,
  onCategoriesChange,
  onDateChange,
}: TicketsFilterDropdownProps) {
  const [activeFilterType, setActiveFilterType] = useState<FilterType>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Локальное состояние для форм
  const [localSource, setLocalSource] = useState<string | null>(sourceFilter)
  const [localStatuses, setLocalStatuses] = useState<string[]>(statusFilters)
  const [localPriorities, setLocalPriorities] = useState<string[]>(priorityFilters)
  const [localAssignedUsers, setLocalAssignedUsers] = useState<string[]>(assignedUsersFilters)
  const [localTags, setLocalTags] = useState<string[]>(tagsFilters)
  const [localCategories, setLocalCategories] = useState<string[]>(categoriesFilters)
  const [localDateFrom, setLocalDateFrom] = useState<string>(dateFilter?.from || '')
  const [localDateTo, setLocalDateTo] = useState<string>(dateFilter?.to || '')

  // Получаем уникальные значения из тикетов
  const allAssignedUsers = Array.from(new Set(mockTickets.flatMap(t => t.assignedUsers))).sort()
  const allTags = Array.from(new Set(mockTickets.flatMap(t => t.tags))).sort()
  const allCategories = Array.from(new Set(mockTickets.map(t => t.category))).sort()

  const statusOptions: string[] = ['open', 'in-progress', 'resolved', 'closed']
  const priorityOptions: string[] = ['low', 'medium', 'high', 'critical']
  
  const sourceOptions: { source: string; label: string; icon: React.ComponentType<{ className?: string }>; iconColor: string }[] = [
    { source: 'web', label: 'Web', icon: Globe, iconColor: 'text-blue-500' },
    { source: 'email', label: 'Email', icon: Mail, iconColor: 'text-orange-400' },
    { source: 'discord', label: 'Discord', icon: MessageCircle, iconColor: 'text-[#5865F2]' },
    { source: 'discord_dm', label: 'Discord DM Bot', icon: DiscordDMSourceIcon, iconColor: 'text-[#5865F2]' },
    { source: 'telegram', label: 'Telegram', icon: Send, iconColor: 'text-sky-400' },
    { source: 'api', label: 'API', icon: Code, iconColor: 'text-gray-500' },
  ]

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
    setLocalSource(sourceFilter)
  }, [sourceFilter])

  useEffect(() => {
    setLocalStatuses(statusFilters)
  }, [statusFilters])

  useEffect(() => {
    setLocalPriorities(priorityFilters)
  }, [priorityFilters])

  useEffect(() => {
    setLocalAssignedUsers(assignedUsersFilters)
  }, [assignedUsersFilters])

  useEffect(() => {
    setLocalTags(tagsFilters)
  }, [tagsFilters])

  useEffect(() => {
    setLocalCategories(categoriesFilters)
  }, [categoriesFilters])

  useEffect(() => {
    if (dateFilter) {
      setLocalDateFrom(dateFilter.from)
      setLocalDateTo(dateFilter.to)
    } else {
      setLocalDateFrom('')
      setLocalDateTo('')
    }
  }, [dateFilter])

  const handleSourceToggle = (source: string) => {
    const newSource = localSource === source ? null : source
    setLocalSource(newSource)
    onSourceChange(newSource)
  }

  const handleStatusToggle = (status: string) => {
    const newStatuses = localStatuses.includes(status)
      ? localStatuses.filter(s => s !== status)
      : [...localStatuses, status]
    setLocalStatuses(newStatuses)
    onStatusChange(newStatuses)
  }

  const handlePriorityToggle = (priority: string) => {
    const newPriorities = localPriorities.includes(priority)
      ? localPriorities.filter(p => p !== priority)
      : [...localPriorities, priority]
    setLocalPriorities(newPriorities)
    onPriorityChange(newPriorities)
  }

  const handleAssignedUserToggle = (user: string) => {
    const newUsers = localAssignedUsers.includes(user)
      ? localAssignedUsers.filter(u => u !== user)
      : [...localAssignedUsers, user]
    setLocalAssignedUsers(newUsers)
    onAssignedUsersChange(newUsers)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = localTags.includes(tag)
      ? localTags.filter(t => t !== tag)
      : [...localTags, tag]
    setLocalTags(newTags)
    onTagsChange(newTags)
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = localCategories.includes(category)
      ? localCategories.filter(c => c !== category)
      : [...localCategories, category]
    setLocalCategories(newCategories)
    onCategoriesChange(newCategories)
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

  // Форматирование статуса
  const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'open': 'Open',
      'in-progress': 'In Progress',
      'resolved': 'Resolved',
      'closed': 'Closed',
    }
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
  }

  // Форматирование приоритета
  const formatPriority = (priority: string): string => {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
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
            onClick={() => setActiveFilterType('source')}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <span>Source</span>
            {sourceFilter && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                1
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
            onClick={() => setActiveFilterType('priority')}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <span>Priority</span>
            {priorityFilters.length > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                {priorityFilters.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilterType('assignedUsers')}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <span>Assigned Users</span>
            {assignedUsersFilters.length > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                {assignedUsersFilters.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilterType('tags')}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <span>Tags</span>
            {tagsFilters.length > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                {tagsFilters.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilterType('categories')}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <span>Categories</span>
            {categoriesFilters.length > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                {categoriesFilters.length}
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
              {activeFilterType === 'source' && 'Select Source'}
              {activeFilterType === 'status' && 'Select Status'}
              {activeFilterType === 'priority' && 'Select Priority'}
              {activeFilterType === 'assignedUsers' && 'Select Assigned Users'}
              {activeFilterType === 'tags' && 'Select Tags'}
              {activeFilterType === 'categories' && 'Select Categories'}
              {activeFilterType === 'date' && 'Filter by Date'}
            </h3>
            <button
              onClick={() => setActiveFilterType(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Source Filter Form */}
          {activeFilterType === 'source' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {sourceOptions.map((sourceOption) => {
                const isSelected = localSource === sourceOption.source
                const IconComponent = sourceOption.icon
                return (
                  <label
                    key={sourceOption.source}
                    className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="source"
                      checked={isSelected}
                      onChange={() => handleSourceToggle(sourceOption.source)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      {sourceOption.source === 'discord_dm' ? (
                        <DiscordDMSourceIcon className={`h-4 w-4 flex-shrink-0 ${sourceOption.iconColor}`} />
                      ) : (
                        <IconComponent className={`h-4 w-4 flex-shrink-0 ${sourceOption.iconColor}`} />
                      )}
                      <span className={`text-sm text-gray-900 ${isSelected ? 'font-semibold' : ''}`}>
                        {sourceOption.label}
                      </span>
                    </div>
                  </label>
                )
              })}
            </div>
          )}

          {/* Status Filter Form */}
          {activeFilterType === 'status' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {statusOptions.map((status) => {
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
                    <span className={`text-sm text-gray-900 ${isSelected ? 'font-semibold' : ''}`}>
                      {formatStatus(status)}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          {/* Priority Filter Form */}
          {activeFilterType === 'priority' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {priorityOptions.map((priority) => {
                const isSelected = localPriorities.includes(priority)
                return (
                  <label
                    key={priority}
                    className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handlePriorityToggle(priority)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`text-sm text-gray-900 ${isSelected ? 'font-semibold' : ''}`}>
                      {formatPriority(priority)}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          {/* Assigned Users Filter Form */}
          {activeFilterType === 'assignedUsers' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {allAssignedUsers.map((user) => {
                const isSelected = localAssignedUsers.includes(user)
                return (
                  <label
                    key={user}
                    className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleAssignedUserToggle(user)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`text-sm text-gray-900 ${isSelected ? 'font-semibold' : ''}`}>
                      {user}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          {/* Tags Filter Form */}
          {activeFilterType === 'tags' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {allTags.map((tag) => {
                const isSelected = localTags.includes(tag)
                return (
                  <label
                    key={tag}
                    className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleTagToggle(tag)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`text-sm text-gray-900 ${isSelected ? 'font-semibold' : ''}`}>
                      {tag}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          {/* Categories Filter Form */}
          {activeFilterType === 'categories' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {allCategories.map((category) => {
                const isSelected = localCategories.includes(category)
                return (
                  <label
                    key={category}
                    className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`text-sm text-gray-900 ${isSelected ? 'font-semibold' : ''}`}>
                      {category}
                    </span>
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

