'use client'

import { useEffect, useRef } from 'react'
import { X, ChevronLeft, Folder } from 'lucide-react'
import { KnowledgeArticle } from '../../../data/knowledgeBase'

interface ArticleViewerProps {
  isOpen: boolean
  article: KnowledgeArticle | null
  searchQuery: string
  onClose: () => void
  onShowInFolder?: (article: KnowledgeArticle) => void
}

export default function ArticleViewer({
  isOpen,
  article,
  searchQuery,
  onClose,
  onShowInFolder,
}: ArticleViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  // Получение первой строки из body (заголовок)
  const getFirstLine = (body: string): string => {
    const firstLine = body.split('\n')[0].trim()
    if (!firstLine) return 'Untitled'
    return firstLine.replace(/^#+\s*/, '') // Убираем markdown заголовки
  }

  // Получение заголовка статьи
  const title = article ? getFirstLine(article.body) : ''

  // Обработка Esc для закрытия
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Скролл в начало при открытии
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [isOpen, article])

  if (!isOpen || !article) return null

  return (
    <>
      {/* Backdrop - затемнение фона */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[70%] max-w-[900px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Back Button */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              title="Back to Results"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-600 flex-1 min-w-0">
              <span className="flex-shrink-0">🔍 Search Results</span>
              {searchQuery && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-500 truncate">{searchQuery}</span>
                </>
              )}
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium truncate">{title}</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0 ml-2"
            title="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-6 py-6"
        >
          {/* Article Content */}
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-900 leading-relaxed">
              {article.body}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0 bg-gray-50">
          <div className="text-xs text-gray-500">
            {article.type === 'manual' && article.created_by && (
              <span>Created by {article.created_by}</span>
            )}
          </div>
          
          {/* Show in Folder Button */}
          {onShowInFolder && (
            <button
              onClick={() => onShowInFolder(article)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Folder className="h-4 w-4" />
              <span>Show in Folder</span>
            </button>
          )}
        </div>
      </div>
    </>
  )
}

