'use client'

import { useState, useMemo } from 'react'
import { File, Ticket, BookOpen, Search, Trash2, Download, FileText } from 'lucide-react'
import {
  KnowledgeFile,
  KnowledgeTicket,
  KnowledgeArticle,
} from '../../../data/knowledgeBase'
import ContentViewer from './ContentViewer'

interface AllContentViewProps {
  files: KnowledgeFile[]
  tickets: KnowledgeTicket[]
  articles: KnowledgeArticle[]
  onDeleteFile: (id: string) => void
  onDeleteTicket: (id: string) => void
  onDeleteArticle: (id: string) => void
  onUpdateTicket?: (ticket: KnowledgeTicket) => void
  onUpdateArticle?: (article: KnowledgeArticle) => void
}

interface AggregatedItem {
  id: string
  type: 'file' | 'ticket' | 'article'
  icon: JSX.Element
  content: string
  source: string
  date: string
  status: string
  original: KnowledgeFile | KnowledgeTicket | KnowledgeArticle
}

export default function AllContentView({
  files,
  tickets,
  articles,
  onDeleteFile,
  onDeleteTicket,
  onDeleteArticle,
  onUpdateTicket,
  onUpdateArticle,
}: AllContentViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewingItem, setViewingItem] = useState<{
    item: KnowledgeFile | KnowledgeTicket | KnowledgeArticle
    type: 'file' | 'ticket' | 'article'
  } | null>(null)

  // Форматирование даты
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Получение сниппета текста
  const getSnippet = (text: string, maxLength: number = 120): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Получение первой строки из body
  const getFirstLine = (body: string): string => {
    const firstLine = body.split('\n')[0].trim()
    if (!firstLine) return 'Untitled Draft'
    if (firstLine.length > 70) return firstLine.substring(0, 70) + '...'
    return firstLine
  }

  // Агрегация данных
  const aggregatedItems: AggregatedItem[] = [
    ...files.map((file) => ({
      id: file.id,
      type: 'file' as const,
      icon: <File className="h-5 w-5 text-black" />,
      content: file.name,
      source: 'File',
      date: formatDate(file.uploadDate),
      status: file.status === 'active' ? 'Indexed' : file.status === 'indexing' ? 'Indexing...' : 'Error',
      original: file,
    })),
    ...tickets.map((ticket) => ({
      id: ticket.id,
      type: 'ticket' as const,
      icon: <Ticket className="h-5 w-5 text-black" />,
      content: getSnippet(ticket.content),
      source: 'Ticket',
      date: formatDate(ticket.created_at),
      status: 'Indexed',
      original: ticket,
    })),
    ...articles.map((article) => ({
      id: article.id,
      type: 'article' as const,
      icon: <BookOpen className="h-5 w-5 text-black" />,
      content: getFirstLine(article.body),
      source: article.type === 'manual' ? 'Internal Article' : 'Ticket',
      date: formatDate(article.created_at),
      status: 'Indexed',
      original: article,
    })),
  ]

  // Фильтрация по поисковому запросу
  const filteredItems = aggregatedItems.filter((item) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      item.content.toLowerCase().includes(query) ||
      item.source.toLowerCase().includes(query)
    )
  })

  // Сортировка по дате (новые сначала)
  const sortedItems = useMemo(() => {
    // Сортируем по дате (новые сначала)
    return [...filteredItems].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [filteredItems])

  const handleDelete = (item: AggregatedItem) => {
    if (item.type === 'file') {
      onDeleteFile(item.id)
    } else if (item.type === 'ticket') {
      onDeleteTicket(item.id)
    } else {
      onDeleteArticle(item.id)
    }
  }

  const handleContentClick = (item: AggregatedItem) => {
    setViewingItem({
      item: item.original,
      type: item.type,
    })
    setViewerOpen(true)
  }

  const handleViewerSave = (updatedItem: KnowledgeFile | KnowledgeTicket | KnowledgeArticle) => {
    if (viewingItem) {
      if (viewingItem.type === 'ticket' && onUpdateTicket) {
        onUpdateTicket(updatedItem as KnowledgeTicket)
      } else if (viewingItem.type === 'article' && onUpdateArticle) {
        onUpdateArticle(updatedItem as KnowledgeArticle)
      }
    }
  }

  const handleViewerDelete = (id: string) => {
    if (viewingItem) {
      if (viewingItem.type === 'file') {
        onDeleteFile(id)
      } else if (viewingItem.type === 'ticket') {
        onDeleteTicket(id)
      } else if (viewingItem.type === 'article') {
        onDeleteArticle(id)
      }
    }
    setViewerOpen(false)
    setViewingItem(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="p-4 border-b border-[#e2e8f0] bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">All Content</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Content Table */}
      <div className="flex-1 overflow-y-auto bg-white">
        {sortedItems.length > 0 ? (
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-4">
              {sortedItems.length} items
            </div>
            <div className="border border-[#e2e8f0] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-[#e2e8f0]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#e2e8f0]">
                  {sortedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <button
                          onClick={() => handleContentClick(item)}
                          className="text-left w-full transition-colors cursor-pointer"
                        >
                          {(item.type === 'ticket' || item.type === 'article') && (
                            <span className="text-blue-600 hover:text-blue-700 hover:underline">
                              {item.content}
                            </span>
                          )}
                          {item.type === 'file' && (
                            <span className="hover:underline">{item.content}</span>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span>{item.source}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                            item.status === 'Indexed'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'Indexing...'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {item.type === 'file' && (
                            <button
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = '#'
                                link.download = (item.original as KnowledgeFile).name
                                link.click()
                              }}
                              className="text-gray-600 hover:text-gray-900 transition-colors"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm('Вы уверены, что хотите удалить этот элемент?')) {
                                handleDelete(item)
                              }
                            }}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No results found' : 'No content available'}
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Add files, articles, or tickets to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Content Viewer */}
      <ContentViewer
        isOpen={viewerOpen}
        item={viewingItem?.item || null}
        itemType={viewingItem?.type || null}
        onClose={() => {
          setViewerOpen(false)
          setViewingItem(null)
        }}
        onSave={handleViewerSave}
        onDelete={handleViewerDelete}
      />
    </div>
  )
}

