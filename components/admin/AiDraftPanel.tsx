'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Check, FileText, Ticket as TicketIcon, ExternalLink } from 'lucide-react'

interface Source {
  id: string
  type: 'document' | 'ticket'
  title: string
  snippet: string
  url?: string
  ticketId?: string
}

interface AiDraftPanelProps {
  isVisible: boolean
  onClose: () => void
  onApply: (text: string) => void
  generatedText: string
  sources: Source[]
}

export default function AiDraftPanel({
  isVisible,
  onClose,
  onApply,
  generatedText,
  sources,
}: AiDraftPanelProps) {
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const sourceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Закрытие popover при клике вне его
  useEffect(() => {
    if (!selectedSourceId) return

    const handleClickOutside = (event: MouseEvent) => {
      const ref = sourceRefs.current[selectedSourceId]
      if (ref && !ref.contains(event.target as Node)) {
        setSelectedSourceId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedSourceId])

  const handleApply = () => {
    onApply(generatedText)
    onClose()
  }

  const selectedSource = sources.find((s) => s.id === selectedSourceId)

  if (!isVisible) return null

  return (
    <div className="bg-[#F5F3FF] border-t border-b border-purple-200 px-4 py-3 transition-all duration-300 ease-in-out">
      {/* Блок А: Текст ответа */}
      <div className="mb-3">
        <div
          className="text-sm text-gray-900 max-h-[200px] overflow-y-auto pr-2"
          style={{ fontFamily: 'Roboto Mono, monospace' }}
        >
          {generatedText}
        </div>
      </div>

      {/* Блок Б: Источники */}
      {sources.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-3.5 w-3.5 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">Based on:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {sources.map((source) => {
              const Icon = source.type === 'document' ? FileText : TicketIcon
              return (
                <div key={source.id} className="relative flex-shrink-0" ref={(el) => { sourceRefs.current[source.id] = el }}>
                  <button
                    onClick={() => setSelectedSourceId(selectedSourceId === source.id ? null : source.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-purple-300 rounded-full text-xs text-gray-700 hover:bg-purple-50 transition-colors whitespace-nowrap"
                  >
                    <Icon className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" />
                    <span className="max-w-[200px] truncate">{source.title}</span>
                  </button>

                  {/* Popover с превью источника */}
                  {selectedSourceId === source.id && (
                    <div className="absolute bottom-full left-0 mb-2 w-[350px] max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            {source.type === 'ticket' && source.ticketId
                              ? `Ticket #${source.ticketId}: ${source.title}`
                              : source.title}
                          </span>
                        </div>
                      </div>

                      {/* Body - Цитата */}
                      <div className="px-4 py-3">
                        <div className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded p-3">
                          {source.snippet}
                        </div>
                      </div>

                      {/* Footer - Ссылка */}
                      {source.url && (
                        <div className="px-4 py-2 border-t border-gray-200">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 hover:underline"
                          >
                            <span>Open full {source.type === 'document' ? 'document' : 'ticket'}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Блок В: Футер действий */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <X className="h-4 w-4" />
            Cancel
          </span>
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-1.5 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4" />
            Use Response
          </span>
        </button>
      </div>
    </div>
  )
}

