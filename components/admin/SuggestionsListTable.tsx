'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSuggestions } from '../../contexts/SuggestionsContext'
import { RefreshCw, Maximize2, Settings, Plus, Filter } from 'lucide-react'
import { getStatusColor, SuggestionStatus } from '../../data/suggestions'
import { hasAdminAccess } from '../../utils/auth'
import SuggestionsTable from './SuggestionsTable'
import SuggestionsBulkActionsBar from './SuggestionsBulkActionsBar'
import BulkMergeSuggestionsDialog from './BulkMergeSuggestionsDialog'
import SuggestionsSettingsModal from './SuggestionsSettingsModal'
import CreateSuggestionModal from './CreateSuggestionModal'

export default function SuggestionsListTable() {
  const router = useRouter()
  const {
    suggestions,
    getFilteredSuggestions,
    deleteSuggestions,
    bulkUpdateStatus,
    setActiveStatus,
    activeStatus,
    setSearchQuery,
    searchQuery,
  } = useSuggestions()
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const canAccessSettings = hasAdminAccess()
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
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setFilterMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
          <div className="flex items-center gap-2">
            <button className="p-2 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors">
              <Maximize2 className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors flex items-center gap-1">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
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
        <div className="flex items-center gap-2 flex-wrap relative" ref={filterMenuRef}>
          {activeStatus !== 'All' && (
            <button
              onClick={() => setActiveStatus('All')}
              className="px-3 py-1.5 bg-[#2563eb] text-white text-sm rounded-md flex items-center gap-1.5"
            >
              <span>{activeStatus}</span>
            </button>
          )}
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
          
          {/* Filter Popover */}
          {filterMenuOpen && (
            <div className="absolute left-0 top-full mt-1 w-[290px] bg-white border border-gray-200 rounded-lg z-50" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
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

