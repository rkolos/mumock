'use client'

import { X, FileText, Ticket as TicketIcon, ExternalLink } from 'lucide-react'

interface Source {
  id: string
  type: 'document' | 'ticket'
  title: string
  snippet: string
  url?: string
  ticketId?: string
}

interface SourcePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  source: Source | null
}

export default function SourcePreviewModal({
  isOpen,
  onClose,
  source,
}: SourcePreviewModalProps) {
  if (!isOpen || !source) return null

  const Icon = source.type === 'document' ? FileText : TicketIcon
  const sourceTypeLabel = source.type === 'document' ? 'Knowledge Base Article' : 'Resolved Ticket'

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {source.type === 'ticket' && source.ticketId
                ? `Ticket #${source.ticketId}: ${source.title}`
                : source.title}
            </h2>
            <p className="text-sm text-gray-500">{sourceTypeLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body - RAG Snippet */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <div className="bg-[#FFF9C4] border border-yellow-300 rounded-lg p-4">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {source.snippet}
            </p>
          </div>
        </div>

        {/* Footer - Actions */}
        {source.url && (
          <div className="px-6 py-4 border-t border-gray-200">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-700 border border-purple-300 hover:bg-purple-50 rounded transition-colors"
            >
              <span>Open full {source.type === 'document' ? 'document' : 'ticket'}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

