'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Suggestion, SuggestionStatus, getStatusColor } from '../../data/suggestions'
import { useSuggestions } from '../../contexts/SuggestionsContext'

interface SuggestionsTableProps {
  suggestions: Suggestion[]
  onRowClick: (id: string) => void
  selectedIds?: Set<string>
  onSelectionChange?: (selectedIds: Set<string>) => void
}

type SortColumn = 'id' | 'category' | 'score' | 'status' | 'created'
type SortDirection = 'asc' | 'desc'

// Функция форматирования даты в формате D MMM YYYY
function formatSuggestionDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

// Порядок статусов для сортировки
const STATUS_ORDER: Record<SuggestionStatus, number> = {
  'New': 1,
  'Open': 2,
  'Planned': 3,
  'In Progress': 4,
  'Completed': 5,
  'Rejected': 6,
  'Duplicate': 7,
}

export default function SuggestionsTable({ 
  suggestions, 
  onRowClick, 
  selectedIds = new Set(),
  onSelectionChange 
}: SuggestionsTableProps) {
  const { getCategories } = useSuggestions()
  const [sortColumn, setSortColumn] = useState<SortColumn>('score')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const categories = getCategories()

  // Функция сортировки
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    let compareValue = 0

    switch (sortColumn) {
      case 'id':
        compareValue = a.id.localeCompare(b.id)
        break
      case 'category':
        compareValue = a.content.category.localeCompare(b.content.category)
        break
      case 'score':
        compareValue = a.metrics.score - b.metrics.score
        break
      case 'status':
        compareValue = STATUS_ORDER[a.lifecycle.status] - STATUS_ORDER[b.lifecycle.status]
        break
      case 'created':
        compareValue = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        break
    }

    return sortDirection === 'asc' ? compareValue : -compareValue
  })

  // Обработчик изменения выбора одной строки
  const handleCheckboxChange = (suggestionId: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(suggestionId)
    } else {
      newSelected.delete(suggestionId)
    }
    onSelectionChange?.(newSelected)
  }

  // Обработчик Select All
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(sortedSuggestions.map(s => s.id))
      onSelectionChange?.(allIds)
    } else {
      onSelectionChange?.(new Set())
    }
  }

  const allSelected = sortedSuggestions.length > 0 && sortedSuggestions.every(s => selectedIds.has(s.id))
  const someSelected = sortedSuggestions.some(s => selectedIds.has(s.id))

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return null
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    )
  }

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.label === categoryName)
    return category?.color || '#9ca3af'
  }

  const getScoreColor = (score: number) => {
    if (score > 0) return 'text-green-600'
    if (score < 0) return 'text-red-600'
    return 'text-gray-500'
  }

  // Обработчик клика по строке (но не по чекбоксу)
  const handleRowClick = (e: React.MouseEvent, suggestionId: string) => {
    const target = e.target as HTMLElement
    // Если клик на чекбоксе или внутри checkbox ячейки, не обрабатываем
    if (target.closest('input[type="checkbox"]') || target.closest('label') || target.tagName === 'INPUT') {
      return
    }
    onRowClick(suggestionId)
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-8 text-center">
        <p className="text-sm text-gray-500">No suggestions found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-[#e2e8f0]">
            <tr>
              <th className="w-[40px] px-4 py-2.5 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected && !allSelected
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th 
                className="w-[80px] px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  ID
                  {getSortIcon('id')}
                </div>
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Subject
              </th>
              <th className="w-[150px] px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Author
              </th>
              <th 
                className="w-[120px] px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1">
                  Category
                  {getSortIcon('category')}
                </div>
              </th>
              <th 
                className="w-[100px] px-4 py-2.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center justify-end gap-1">
                  Score
                  {getSortIcon('score')}
                </div>
              </th>
              <th 
                className="w-[120px] px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                className="w-[120px] px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('created')}
              >
                <div className="flex items-center gap-1">
                  Created
                  {getSortIcon('created')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e2e8f0]">
            {sortedSuggestions.map((suggestion, index) => {
              const categoryColor = getCategoryColor(suggestion.content.category)
              const statusColor = getStatusColor(suggestion.lifecycle.status)
              const scoreColor = getScoreColor(suggestion.metrics.score)
              
              return (
                <tr
                  key={suggestion.id}
                  onClick={(e) => handleRowClick(e, suggestion.id)}
                  className={`
                    cursor-pointer transition-colors
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    hover:bg-blue-50
                  `}
                >
                  {/* Checkbox column */}
                  <td 
                    className="px-4 py-2.5 w-[40px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(suggestion.id)}
                      onChange={(e) => handleCheckboxChange(suggestion.id, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  
                  {/* ID */}
                  <td className="px-4 py-2.5 text-sm text-gray-500 font-mono">
                    #{suggestion.id}
                  </td>
                  
                  {/* Subject */}
                  <td className="px-4 py-2.5 text-sm">
                    <div className="flex flex-col">
                      <span 
                        className="font-semibold text-gray-900 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRowClick(suggestion.id)
                        }}
                      >
                        {suggestion.content.title}
                      </span>
                      {suggestion.content.description && (
                        <span className="text-xs text-gray-500 truncate max-w-md mt-0.5">
                          {suggestion.content.description.split('\n')[0]}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {/* Author */}
                  <td className="px-4 py-2.5 text-sm">
                    <div className="flex items-center gap-2">
                      {suggestion.author.avatar_url ? (
                        <img
                          src={suggestion.author.avatar_url}
                          alt={suggestion.author.username}
                          className="h-5 w-5 rounded-full"
                        />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-gray-600">
                            {suggestion.author.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-gray-900 truncate">
                        {suggestion.author.isSystem ? 'Ninja Product Team' : suggestion.author.username}
                      </span>
                    </div>
                  </td>
                  
                  {/* Category */}
                  <td className="px-4 py-2.5 text-sm">
                    <span
                      className="px-2 py-0.5 text-xs font-semibold rounded"
                      style={{
                        backgroundColor: categoryColor + '20',
                        color: categoryColor,
                      }}
                    >
                      {suggestion.content.category}
                    </span>
                  </td>
                  
                  {/* Score */}
                  <td className="px-4 py-2.5 text-sm text-right">
                    <span className={`font-medium ${scoreColor}`}>
                      {suggestion.metrics.score}
                    </span>
                  </td>
                  
                  {/* Status */}
                  <td className="px-4 py-2.5 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${statusColor}`}></div>
                      <span className="text-xs font-medium text-gray-700">
                        {suggestion.lifecycle.status}
                      </span>
                    </div>
                  </td>
                  
                  {/* Created */}
                  <td className="px-4 py-2.5 text-sm text-gray-600">
                    {formatSuggestionDate(suggestion.created_at)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

