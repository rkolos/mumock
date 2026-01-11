'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSuggestions } from '../../contexts/SuggestionsContext'
import { SuggestionStatus } from '../../data/suggestions'
import { RefreshCw, Settings, Plus, Filter } from 'lucide-react'
import { hasAdminAccess } from '../../utils/auth'
import SuggestionsTable from './SuggestionsTable'
import SuggestionsBulkActionsBar from './SuggestionsBulkActionsBar'
import BulkMergeSuggestionsDialog from './BulkMergeSuggestionsDialog'
import SuggestionsSettingsModal from './SuggestionsSettingsModal'
import CreateSuggestionModal from './CreateSuggestionModal'
import FilterChips from './FilterChips'
import FilterDropdown from './FilterDropdown'

export default function SuggestionsListTable() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    suggestions,
    getFilteredSuggestions,
    deleteSuggestions,
    bulkUpdateStatus,
    setStatusFilters,
    statusFilters,
    setSearchQuery,
    searchQuery,
    categoryFilters,
    scoreFilter,
    dateFilter,
    setCategoryFilters,
    setScoreFilter,
    setDateFilter,
    clearAllFilters,
    removeFilter,
  } = useSuggestions()
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const canAccessSettings = hasAdminAccess()
  const filterMenuRef = useRef<HTMLDivElement>(null)
  
  // Флаг для предотвращения зацикливания между URL и фильтрами
  const isSyncingFromUrl = useRef(false)

  const filteredSuggestions = getFilteredSuggestions()

  // Маппинг URL параметров в статусы
  const statusUrlMap: Record<string, SuggestionStatus> = {
    'new': 'New',
    'open': 'Open',
    'planned': 'Planned',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'rejected': 'Rejected',
  }

  // Обратный маппинг статусов в URL параметры
  const statusToUrlMap: Record<SuggestionStatus, string> = {
    'New': 'new',
    'Open': 'open',
    'Duplicate': 'duplicate',
    'Planned': 'planned',
    'In Progress': 'in-progress',
    'Completed': 'completed',
    'Rejected': 'rejected',
  }

  // Синхронизация URL параметра status с фильтрами при изменении URL
  useEffect(() => {
    const statusParam = searchParams.get('status')
    isSyncingFromUrl.current = true
    
    if (statusParam) {
      const status = statusUrlMap[statusParam]
      if (status) {
        // Устанавливаем фильтр из URL
        if (statusFilters.length !== 1 || statusFilters[0] !== status) {
          setStatusFilters([status])
        }
      }
    } else {
      // Если параметра нет в URL, очищаем фильтр статуса
      if (statusFilters.length > 0) {
        setStatusFilters([])
      }
    }
    
    // Сбрасываем флаг после небольшой задержки
    setTimeout(() => {
      isSyncingFromUrl.current = false
    }, 100)
  }, [searchParams]) // Зависимость только от searchParams

  // Синхронизация фильтров статуса с URL (когда фильтр меняется не через URL)
  useEffect(() => {
    // Пропускаем, если синхронизация идет из URL
    if (isSyncingFromUrl.current) {
      return
    }
    
    const statusParam = searchParams.get('status')
    const newUrl = new URL(window.location.href)
    
    if (statusFilters.length === 1) {
      const status = statusFilters[0]
      const expectedUrlParam = statusToUrlMap[status]
      
      // Если URL параметр не соответствует текущему фильтру, обновляем URL
      if (statusParam !== expectedUrlParam) {
        newUrl.searchParams.set('status', expectedUrlParam)
        router.replace(newUrl.pathname + newUrl.search, { scroll: false })
      }
    } else if (statusFilters.length === 0 && statusParam) {
      // Если фильтр очищен, но URL параметр остался - очищаем URL
      newUrl.searchParams.delete('status')
      router.replace(newUrl.pathname + newUrl.search, { scroll: false })
    }
  }, [statusFilters]) // Срабатывает при изменении фильтров

  // Обработчик удаления фильтра статуса с очисткой URL
  const handleRemoveStatus = () => {
    removeFilter('status')
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('status')
    router.replace(newUrl.pathname + newUrl.search, { scroll: false })
  }

  const handleRowClick = (suggestionId: string) => {
    router.push(`/suggestions/${suggestionId}`)
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Suggestions: <span className="text-gray-500 font-normal">total {suggestions.length}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="w-9 h-9 flex items-center justify-center border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            title="New Suggestion"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          {canAccessSettings && (
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="p-2 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors"
              title="Settings"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Suggestions</h2>
            <p className="text-sm text-gray-500">
              Here you can view and manage suggestions
            </p>
          </div>
        </div>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search suggestions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-[#e2e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap relative" ref={filterMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setFilterMenuOpen(!filterMenuOpen)
              }}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1.5"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Add Filter</span>
            </button>
            
            {/* Filter Dropdown */}
            <FilterDropdown
              isOpen={filterMenuOpen}
              onClose={() => setFilterMenuOpen(false)}
              statusFilters={statusFilters}
              categoryFilters={categoryFilters}
              scoreFilter={scoreFilter}
              dateFilter={dateFilter}
              onStatusChange={setStatusFilters}
              onCategoryChange={setCategoryFilters}
              onScoreChange={setScoreFilter}
              onDateChange={setDateFilter}
            />
          </div>

          {/* Active Filters Chips */}
          <FilterChips
            categoryFilters={categoryFilters}
            scoreFilter={scoreFilter}
            dateFilter={dateFilter}
            statusFilters={statusFilters}
            onRemoveCategory={() => removeFilter('category')}
            onRemoveScore={() => removeFilter('score')}
            onRemoveDate={() => removeFilter('date')}
            onRemoveStatus={handleRemoveStatus}
            onClearAll={() => {
              clearAllFilters()
              const newUrl = new URL(window.location.href)
              newUrl.searchParams.delete('status')
              router.replace(newUrl.pathname + newUrl.search, { scroll: false })
            }}
          />
        </div>
      </div>

      {/* Bulk Actions Bar (показывается при выборе строк) */}
      {selectedIds.size > 0 && (
        <SuggestionsBulkActionsBar
          selectedCount={selectedIds.size}
          onMerge={() => setMergeDialogOpen(true)}
          onSetStatus={(status) => {
            bulkUpdateStatus(Array.from(selectedIds), status)
            setSelectedIds(new Set())
          }}
          onDelete={() => setDeleteConfirmOpen(true)}
        />
      )}

      {/* Table */}
      <SuggestionsTable
        suggestions={filteredSuggestions}
        onRowClick={handleRowClick}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

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

      {/* Bulk Merge Dialog */}
      {mergeDialogOpen && (
        <BulkMergeSuggestionsDialog
          selectedIds={Array.from(selectedIds)}
          onClose={() => {
            setMergeDialogOpen(false)
            setSelectedIds(new Set())
          }}
          onConfirm={() => {
            setSelectedIds(new Set())
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Delete Suggestions
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete {selectedIds.size} suggestion{selectedIds.size !== 1 ? 's' : ''}? 
                This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteSuggestions(Array.from(selectedIds))
                    setSelectedIds(new Set())
                    setDeleteConfirmOpen(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

