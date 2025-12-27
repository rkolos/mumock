'use client'

import { useState } from 'react'
import { X, FileText, Ticket as TicketIcon, UserCheck } from 'lucide-react'

interface Source {
  id: string
  type: 'document' | 'ticket'
  title: string
  snippet: string
  url?: string
  ticketId?: string
}

interface AiContextBarProps {
  isVisible: boolean
  onClose: () => void
  sources: Source[]
  onSourceClick: (source: Source) => void
}

export default function AiContextBar({
  isVisible,
  onClose,
  sources,
  onSourceClick,
}: AiContextBarProps) {
  if (!isVisible || sources.length === 0) return null

  return (
    <div className="bg-[#F3E5F5] px-4 py-2 border-t border-purple-200 transition-all duration-300 ease-in-out">
      {/* Ряд 1: Заголовок и Закрытие */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-gray-600" />
          <span className="text-xs text-gray-700">
            Generated based on {sources.length} source{sources.length !== 1 ? 's' : ''}:
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-purple-100 rounded transition-colors"
          title="Close"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Ряд 2: Список источников */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {sources.map((source) => {
          const Icon = source.type === 'document' ? FileText : TicketIcon
          return (
            <button
              key={source.id}
              onClick={() => onSourceClick(source)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-purple-300 rounded-full text-xs text-gray-700 hover:bg-purple-50 transition-colors whitespace-nowrap flex-shrink-0"
            >
              <Icon className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" />
              <span className="max-w-[200px] truncate">{source.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

