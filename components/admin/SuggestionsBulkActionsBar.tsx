'use client'

import { useState, useRef, useEffect } from 'react'
import { GitMerge, Trash2, ChevronDown } from 'lucide-react'
import { SuggestionStatus } from '../../data/suggestions'
import { getStatusColor } from '../../data/suggestions'

interface SuggestionsBulkActionsBarProps {
  selectedCount: number
  onMerge: () => void
  onSetStatus: (status: SuggestionStatus) => void
  onDelete: () => void
}

const statusOptions: SuggestionStatus[] = ['New', 'Open', 'Duplicate', 'Planned', 'In Progress', 'Completed', 'Rejected']

export default function SuggestionsBulkActionsBar({
  selectedCount,
  onMerge,
  onSetStatus,
  onDelete,
}: SuggestionsBulkActionsBarProps) {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const statusDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const canMerge = selectedCount >= 2

  return (
    <div className="bg-white border-b border-[#e2e8f0] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">
          {selectedCount} selected
        </span>
        
        {/* Merge Button */}
        <button
          onClick={onMerge}
          disabled={!canMerge}
          className={`
            flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors
            ${
              canMerge
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }
          `}
        >
          <GitMerge className="h-4 w-4" />
          <span>Merge</span>
        </button>

        {/* Set Status Dropdown */}
        <div className="relative" ref={statusDropdownRef}>
          <button
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <span>Set Status</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {statusDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[160px]">
              {statusOptions.map((status) => {
                const statusColor = getStatusColor(status)
                return (
                  <button
                    key={status}
                    onClick={() => {
                      onSetStatus(status)
                      setStatusDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md transition-colors text-left"
                  >
                    <div className={`h-2 w-2 rounded-full ${statusColor}`}></div>
                    <span className="text-gray-900">{status}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}

