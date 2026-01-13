'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, ChevronRight, ChevronDown } from 'lucide-react'
import { Suggestion, SuggestionStatus, SuggestionCluster, getStatusColor } from '../../../data/suggestions'
import { useSuggestions } from '../../../contexts/SuggestionsContext'

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

// Type guard для проверки, является ли элемент кластером
function isCluster(item: SuggestionCluster | Suggestion): item is SuggestionCluster {
  return 'master' in item && 'children' in item
}

export default function SuggestionsTable({ 
  suggestions, 
  onRowClick, 
  selectedIds = new Set(),
  onSelectionChange 
}: SuggestionsTableProps) {
  const { 
    getCategories, 
    isAIGroupingEnabled, 
    setIsAIGroupingEnabled,
    getGroupedSuggestions,
    bulkMergeSuggestions
  } = useSuggestions()
  const [sortColumn, setSortColumn] = useState<SortColumn>('score')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const categories = getCategories()

  // Получаем данные в зависимости от режима группировки
  const groupedData = isAIGroupingEnabled ? getGroupedSuggestions() : null

  // Функция сортировки для обычного режима
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

  // Обработчик Select All (для обычного режима)
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
    // Если клик на чекбоксе, кнопке или внутри checkbox ячейки, не обрабатываем
    if (target.closest('input[type="checkbox"]') || target.closest('label') || target.closest('button') || target.tagName === 'INPUT' || target.tagName === 'BUTTON') {
      return
    }
    onRowClick(suggestionId)
  }

  // Toggle expand/collapse группы
  const toggleGroup = (masterId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(masterId)) {
        next.delete(masterId)
      } else {
        next.add(masterId)
      }
      return next
    })
  }

  // Обработчик слияния группы
  const handleMergeGroup = (cluster: SuggestionCluster) => {
    const childIds = cluster.children.map(c => c.id)
    bulkMergeSuggestions(childIds, cluster.master.id)
  }

  // Рендер одной строки предложения
  const renderSuggestionRow = (suggestion: Suggestion, index: number, isChild: boolean = false) => {
    const categoryColor = getCategoryColor(suggestion.content.category)
    const statusColor = getStatusColor(suggestion.lifecycle.status)
    const scoreColor = getScoreColor(suggestion.metrics.score)
    
    return (
      <tr
        key={suggestion.id}
        onClick={(e) => handleRowClick(e, suggestion.id)}
        className={`
          cursor-pointer transition-colors
          ${isChild ? 'bg-gray-50' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}
          hover:bg-blue-50
        `}
      >
        {/* Checkbox column */}
        <td 
          className={`px-4 py-2.5 w-[40px] ${isChild ? 'pl-12' : ''}`}
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
  }

  // Рендер строки мастер-тикета (группы)
  const renderMasterRow = (cluster: SuggestionCluster, index: number) => {
    const isExpanded = expandedGroups.has(cluster.master.id)
    const categoryColor = getCategoryColor(cluster.master.content.category)
    const statusColor = getStatusColor(cluster.master.lifecycle.status)
    const scoreColor = getScoreColor(cluster.master.metrics.score)
    
    return (
      <>
        <tr
          key={cluster.master.id}
          onClick={(e) => handleRowClick(e, cluster.master.id)}
          className={`
            cursor-pointer transition-colors
            ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            hover:bg-blue-50
          `}
        >
          {/* Checkbox column with expand icon */}
          <td 
            className="px-4 py-2.5 w-[40px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleGroup(cluster.master.id)
                }}
                className="p-0.5 hover:bg-gray-200 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                )}
              </button>
              <input
                type="checkbox"
                checked={selectedIds.has(cluster.master.id)}
                onChange={(e) => handleCheckboxChange(cluster.master.id, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </td>
          
          {/* ID */}
          <td className="px-4 py-2.5 text-sm text-gray-500 font-mono">
            #{cluster.master.id}
          </td>
          
          {/* Subject with badge */}
          <td className="px-4 py-2.5 text-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span 
                  className="font-semibold text-gray-900 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRowClick(cluster.master.id)
                  }}
                >
                  {cluster.master.content.title}
                </span>
                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded">
                  +{cluster.totalDuplicates} duplicates
                </span>
              </div>
              {cluster.master.content.description && (
                <span className="text-xs text-gray-500 truncate max-w-md mt-0.5">
                  {cluster.master.content.description.split('\n')[0]}
                </span>
              )}
            </div>
          </td>
          
          {/* Author */}
          <td className="px-4 py-2.5 text-sm">
            <div className="flex items-center gap-2">
              {cluster.master.author.avatar_url ? (
                <img
                  src={cluster.master.author.avatar_url}
                  alt={cluster.master.author.username}
                  className="h-5 w-5 rounded-full"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-gray-600">
                    {cluster.master.author.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-gray-900 truncate">
                {cluster.master.author.isSystem ? 'Ninja Product Team' : cluster.master.author.username}
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
              {cluster.master.content.category}
            </span>
          </td>
          
          {/* Score */}
          <td className="px-4 py-2.5 text-sm text-right">
            <span className={`font-medium ${scoreColor}`}>
              {cluster.master.metrics.score}
            </span>
          </td>
          
          {/* Status with Merge button */}
          <td className="px-4 py-2.5 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${statusColor}`}></div>
                <span className="text-xs font-medium text-gray-700">
                  {cluster.master.lifecycle.status}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleMergeGroup(cluster)
                }}
                className="px-2 py-1 text-xs font-medium text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                title="Merge Group"
              >
                Merge Group
              </button>
            </div>
          </td>
          
          {/* Created */}
          <td className="px-4 py-2.5 text-sm text-gray-600">
            {formatSuggestionDate(cluster.master.created_at)}
          </td>
        </tr>
        {/* Дочерние строки */}
        {isExpanded && cluster.children.map((child, childIndex) => 
          renderSuggestionRow(child, index, true)
        )}
      </>
    )
  }

  if (suggestions.length === 0 && (!groupedData || groupedData.length === 0)) {
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
                {!isAIGroupingEnabled && (
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
                )}
              </th>
              <th className="w-[80px] px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  {!isAIGroupingEnabled && (
                    <button
                      onClick={() => setIsAIGroupingEnabled(true)}
                      className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      title="Enable AI Grouping"
                    >
                      ✨ AI Grouping
                    </button>
                  )}
                  {isAIGroupingEnabled && (
                    <button
                      onClick={() => setIsAIGroupingEnabled(false)}
                      className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                      title="Disable AI Grouping"
                    >
                      ✨ AI Grouping
                    </button>
                  )}
                  {!isAIGroupingEnabled && (
                    <span 
                      className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-1">
                        ID
                        {getSortIcon('id')}
                      </div>
                    </span>
                  )}
                  {isAIGroupingEnabled && <span>ID</span>}
                </div>
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Subject
              </th>
              <th className="w-[150px] px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Author
              </th>
              <th 
                className={`w-[120px] px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${!isAIGroupingEnabled ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                onClick={!isAIGroupingEnabled ? () => handleSort('category') : undefined}
              >
                {!isAIGroupingEnabled ? (
                  <div className="flex items-center gap-1">
                    Category
                    {getSortIcon('category')}
                  </div>
                ) : (
                  'Category'
                )}
              </th>
              <th 
                className={`w-[100px] px-4 py-2.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider ${!isAIGroupingEnabled ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                onClick={!isAIGroupingEnabled ? () => handleSort('score') : undefined}
              >
                {!isAIGroupingEnabled ? (
                  <div className="flex items-center justify-end gap-1">
                    Score
                    {getSortIcon('score')}
                  </div>
                ) : (
                  'Score'
                )}
              </th>
              <th 
                className={`w-[180px] px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${!isAIGroupingEnabled ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                onClick={!isAIGroupingEnabled ? () => handleSort('status') : undefined}
              >
                {!isAIGroupingEnabled ? (
                  <div className="flex items-center gap-1">
                    Status
                    {getSortIcon('status')}
                  </div>
                ) : (
                  'Status'
                )}
              </th>
              <th 
                className={`w-[120px] px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${!isAIGroupingEnabled ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                onClick={!isAIGroupingEnabled ? () => handleSort('created') : undefined}
              >
                {!isAIGroupingEnabled ? (
                  <div className="flex items-center gap-1">
                    Created
                    {getSortIcon('created')}
                  </div>
                ) : (
                  'Created'
                )}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e2e8f0]">
            {isAIGroupingEnabled && groupedData ? (
              // Режим группировки
              groupedData.map((item, index) => {
                if (isCluster(item)) {
                  return renderMasterRow(item, index)
                } else {
                  return renderSuggestionRow(item, index)
                }
              })
            ) : (
              // Обычный режим
              sortedSuggestions.map((suggestion, index) => 
                renderSuggestionRow(suggestion, index)
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
