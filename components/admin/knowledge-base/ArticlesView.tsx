'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { FileEdit, Plus, Search, Trash2, MoreVertical, FolderTree, Folder, ChevronDown, FolderOpen, Edit, CornerUpLeft, X, FileText } from 'lucide-react'
import { KnowledgeArticle, KBFolder } from '../../../data/knowledgeBase'
import ArticlesBreadcrumbs from './ArticlesBreadcrumbs'
import MoveArticleDialog from './MoveArticleDialog'
import MoveFolderDialog from './MoveFolderDialog'
import ArticleViewer from './ArticleViewer'
import { getParentFolder, getDirectSubfoldersCount, getDirectArticlesCount, getFolderPath } from '../../../utils/kbFolders'

interface SearchResult {
  id: string
  title: string
  type: 'article'
  path: Array<{ id: string; name: string }>
  article: KnowledgeArticle
}

interface ArticlesViewProps {
  articles: KnowledgeArticle[]
  allArticles: KnowledgeArticle[] // Все статьи для поиска
  folders: KBFolder[] // Прямые подпапки текущей папки
  allFolders: KBFolder[] // Все папки для хлебных крошек и диалогов перемещения
  selectedFolderId: string | null
  onNewArticle: () => void
  onEditArticle: (article: KnowledgeArticle) => void
  onDeleteArticle: (id: string) => void
  onFolderSelect: (folderId: string | null) => void
  onNewFolder: (parentId: string | null) => void
  onEditFolder: (folder: KBFolder) => void
  onDeleteFolder: (folder: KBFolder) => void
  onMoveArticle: (articleId: string, folderId: string | null) => void
  onMoveFolder?: (folderId: string, targetFolderId: string | null) => void
}

export default function ArticlesView({
  articles,
  allArticles,
  folders,
  allFolders,
  selectedFolderId,
  onNewArticle,
  onEditArticle,
  onDeleteArticle,
  onFolderSelect,
  onNewFolder,
  onEditFolder,
  onDeleteFolder,
  onMoveArticle,
  onMoveFolder,
}: ArticlesViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [searchQueryDebounced, setSearchQueryDebounced] = useState('')
  const [viewingArticle, setViewingArticle] = useState<KnowledgeArticle | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    type: 'article' | 'folder'
    item: KnowledgeArticle | KBFolder
  } | null>(null)
  const [moveArticleDialogOpen, setMoveArticleDialogOpen] = useState(false)
  const [moveFolderDialogOpen, setMoveFolderDialogOpen] = useState(false)
  const [movingArticle, setMovingArticle] = useState<KnowledgeArticle | null>(null)
  const [movingFolder, setMovingFolder] = useState<KBFolder | null>(null)
  const [newDropdownOpen, setNewDropdownOpen] = useState(false)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const newDropdownRef = useRef<HTMLDivElement>(null)

  // Получение выбранной папки и родительской папки
  const selectedFolder = selectedFolderId ? allFolders.find((f) => f.id === selectedFolderId) : null
  const parentFolder = selectedFolderId ? getParentFolder(selectedFolderId, allFolders) : null

  // Получение первой строки из body (заголовок)
  const getFirstLine = (body: string): string => {
    const firstLine = body.split('\n')[0].trim()
    if (!firstLine) return 'Untitled Draft'
    if (firstLine.length > 70) return firstLine.substring(0, 70) + '...'
    return firstLine
  }

  // Функция для получения всех статей
  const fetchAllArticles = useCallback(async (): Promise<SearchResult[]> => {
    // Симуляция задержки API
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const sortedArticles = [...allArticles].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA // Новые сначала
    })

    return sortedArticles.map(article => {
      const title = getFirstLine(article.body)
      const folderPath = getFolderPath(article.folder_id, allFolders)
      const path = [
        { id: 'root', name: 'Internal Articles' },
        ...folderPath.map(f => ({ id: f.id, name: f.name }))
      ]

      return {
        id: article.id,
        title,
        type: 'article' as const,
        path,
        article
      }
    })
  }, [allArticles, allFolders])

  // Функция для поиска статей
  const searchArticles = useCallback(async (query: string): Promise<SearchResult[]> => {
    // Симуляция задержки API
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (!query.trim()) {
      const sortedArticles = [...allArticles].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return dateB - dateA
      })

      return sortedArticles.map(article => {
        const title = getFirstLine(article.body)
        const folderPath = getFolderPath(article.folder_id, allFolders)
        const path = [
          { id: 'root', name: 'Internal Articles' },
          ...folderPath.map(f => ({ id: f.id, name: f.name }))
        ]

        return {
          id: article.id,
          title,
          type: 'article' as const,
          path,
          article
        }
      })
    }

    const queryLower = query.toLowerCase()
    const filtered = allArticles.filter(article => {
      const bodyLower = article.body.toLowerCase()
      const title = getFirstLine(article.body).toLowerCase()
      return bodyLower.includes(queryLower) || title.includes(queryLower)
    })

    return filtered.map(article => {
      const title = getFirstLine(article.body)
      const folderPath = getFolderPath(article.folder_id, allFolders)
      const path = [
        { id: 'root', name: 'Internal Articles' },
        ...folderPath.map(f => ({ id: f.id, name: f.name }))
      ]

      return {
        id: article.id,
        title,
        type: 'article' as const,
        path,
        article
      }
    })
  }, [allArticles, allFolders])

  // Debounce для поискового запроса
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchQueryDebounced(searchQuery)
    }, 400)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Выполнение поиска при изменении debounced запроса
  useEffect(() => {
    if (!isSearchActive) return

    const performSearch = async () => {
      setIsSearchLoading(true)
      try {
        if (searchQueryDebounced.trim()) {
          const results = await searchArticles(searchQueryDebounced)
          setSearchResults(results)
        } else {
          const results = await fetchAllArticles()
          setSearchResults(results)
        }
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearchLoading(false)
      }
    }

    performSearch()
  }, [searchQueryDebounced, isSearchActive, searchArticles, fetchAllArticles])

  // Обработчик открытия статьи из результатов поиска
  const handleViewArticle = (article: KnowledgeArticle) => {
    setViewingArticle(article)
    setIsViewerOpen(true)
  }

  // Обработчик закрытия viewer'а (возврат к результатам)
  const handleCloseViewer = () => {
    setIsViewerOpen(false)
    setViewingArticle(null)
  }

  // Обработчик "Show in Folder"
  const handleShowInFolder = (article: KnowledgeArticle) => {
    // Закрываем поиск и viewer
    setIsSearchActive(false)
    setSearchQuery('')
    setSearchQueryDebounced('')
    setSearchResults([])
    setIsViewerOpen(false)
    setViewingArticle(null)
    
    // Переходим в папку статьи
    onFolderSelect(article.folder_id)
    
    // Опционально: можно добавить задержку и подсветку статьи
    // Но для этого нужна дополнительная логика в родительском компоненте
  }

  // Обработка Esc для закрытия поиска или viewer'а
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isViewerOpen) {
          // Если открыт viewer, закрываем его (возврат к результатам)
          handleCloseViewer()
        } else if (isSearchActive) {
          // Если активен поиск, закрываем его полностью
          handleCloseSearch()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchActive, isViewerOpen])

  // Закрытие контекстного меню и dropdown при клике вне их
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null)
      }
      if (newDropdownRef.current && !newDropdownRef.current.contains(event.target as Node)) {
        setNewDropdownOpen(false)
      }
    }

    if (contextMenu || newDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [contextMenu, newDropdownOpen])

  const handleContextMenu = (e: React.MouseEvent, item: KnowledgeArticle | KBFolder, type: 'article' | 'folder') => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      item,
    })
  }

  const handleMoveClick = (item: KnowledgeArticle | KBFolder, type: 'article' | 'folder') => {
    if (type === 'article') {
      setMovingArticle(item as KnowledgeArticle)
      setMoveArticleDialogOpen(true)
    } else if (type === 'folder') {
      setMovingFolder(item as KBFolder)
      setMoveFolderDialogOpen(true)
    }
    setContextMenu(null)
  }

  const handleMoveArticleConfirm = (folderId: string | null) => {
    if (movingArticle) {
      onMoveArticle(movingArticle.id, folderId)
      setMovingArticle(null)
      setMoveArticleDialogOpen(false)
    }
  }

  const handleMoveFolderConfirm = (folderId: string | null) => {
    if (movingFolder && onMoveFolder) {
      onMoveFolder(movingFolder.id, folderId)
      setMovingFolder(null)
      setMoveFolderDialogOpen(false)
    }
  }

  // Получение второй строки из body (preview)
  const getSecondLine = (body: string): string => {
    const lines = body.split('\n').filter((line) => line.trim())
    if (lines.length < 2) return ''
    return lines[1].trim()
  }

  // Форматирование относительной даты
  const formatRelativeDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins} min ago`
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    } catch {
      return dateString
    }
  }

  // Фильтрация и сортировка папок (используется только когда поиск не активен)
  const filteredFolders = !isSearchActive ? folders.filter((folder) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return folder.name.toLowerCase().includes(query)
  }) : []
  const sortedFolders = [...filteredFolders].sort((a, b) => a.name.localeCompare(b.name))

  // Фильтрация и сортировка статей (используется только когда поиск не активен)
  const filteredArticles = !isSearchActive ? articles.filter((article) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return article.body.toLowerCase().includes(query)
  }) : []
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const titleA = getFirstLine(a.body)
    const titleB = getFirstLine(b.body)
    return titleA.localeCompare(titleB)
  })

  // Обработчик фокуса на поле поиска
  const handleSearchFocus = () => {
    if (!isSearchActive) {
      setIsSearchActive(true)
      // Устанавливаем пустую строку для debounce, чтобы сразу загрузить все статьи
      setSearchQueryDebounced('')
    }
  }

  // Обработчик закрытия поиска
  const handleCloseSearch = () => {
    setIsSearchActive(false)
    setSearchQuery('')
    setSearchQueryDebounced('')
    setSearchResults([])
    setIsViewerOpen(false)
    setViewingArticle(null)
    if (searchInputRef.current) {
      searchInputRef.current.blur()
    }
  }

  // Получение placeholder для поиска
  const searchPlaceholder = 'Search internal articles...'

  const hasItems = sortedFolders.length > 0 || sortedArticles.length > 0
  const showParentRow = selectedFolderId !== null && parentFolder !== null

  return (
    <div className="flex flex-col h-full w-full p-6 bg-white">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Internal Articles</h1>
          {selectedFolderId && (
            <div className="mt-1">
              <ArticlesBreadcrumbs
                folderId={selectedFolderId}
                folders={allFolders}
                onFolderClick={onFolderSelect}
              />
            </div>
          )}
        </div>
        <div className="relative" ref={newDropdownRef}>
          <button
            onClick={() => setNewDropdownOpen(!newDropdownOpen)}
            disabled={isSearchActive}
            className={`bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
              isSearchActive ? 'invisible pointer-events-none' : ''
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>New</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {newDropdownOpen && !isSearchActive && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  onNewArticle()
                  setNewDropdownOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FileEdit className="h-4 w-4" />
                New Article
              </button>
              <button
                onClick={() => {
                  onNewFolder(selectedFolderId)
                  setNewDropdownOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Folder className="h-4 w-4" />
                New Folder
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 mt-6 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white relative">
        {isSearchActive ? (
          /* Search Overlay */
          <div>
            {/* Search Header */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={handleCloseSearch}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title="Close search"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results
              </h2>
            </div>

            {/* Skeleton Loaders */}
            {isSearchLoading && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mt-4">
                <div className="divide-y divide-gray-200">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-14 bg-white animate-pulse">
                      <div className="px-6 py-3 flex items-center gap-3">
                        <div className="h-5 w-5 bg-gray-200 rounded flex-shrink-0"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results Table */}
            {!isSearchLoading && searchResults.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mt-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TITLE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PATH
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {searchResults.map((result, index) => {
                        const pathString = result.path.map(p => p.name).join(' / ')
                        return (
                          <tr
                            key={result.id}
                            className={`bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors h-14 cursor-pointer ${
                              index === searchResults.length - 1 ? 'border-b-0' : ''
                            }`}
                            onClick={() => handleViewArticle(result.article)}
                          >
                            <td className="px-6 py-3 text-sm">
                              <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <span className="font-medium text-gray-900">{result.title}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-500">
                              {pathString}
                            </td>
                            <td className="px-6 py-3 text-sm text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onEditArticle(result.article)
                                  }}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                  title="Edit Article"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleContextMenu(e, result.article, 'article')
                                  }}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                  title="More options"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isSearchLoading && searchResults.length === 0 && searchQueryDebounced.trim() && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <FileEdit className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your search query
                </p>
              </div>
            )}
          </div>
        ) : hasItems || showParentRow ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TITLE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      UPDATED
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Parent Row - Go Up */}
                  {selectedFolderId !== null && (
                    <tr
                      className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors h-14 cursor-pointer"
                      onClick={() => onFolderSelect(parentFolder?.id || null)}
                    >
                      <td className="px-6 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <CornerUpLeft className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {parentFolder 
                              ? `.. (Go up to "${parentFolder.name}")`
                              : '.. (Go up)'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500"></td>
                      <td className="px-6 py-3 text-sm text-right"></td>
                    </tr>
                  )}

                  {/* Folders */}
                  {sortedFolders.map((folder, folderIndex) => {
                    // Подсчет элементов в папке
                    const foldersCount = folder.items_count?.folders ?? getDirectSubfoldersCount(folder.id, allFolders)
                    const articlesCount = folder.items_count?.articles ?? getDirectArticlesCount(folder.id, articles)
                    const totalCount = foldersCount + articlesCount
                    
                    // Форматирование метаданных
                    const metaParts: string[] = []
                    if (foldersCount > 0) {
                      metaParts.push(`${foldersCount} folder${foldersCount !== 1 ? 's' : ''}`)
                    }
                    if (articlesCount > 0) {
                      metaParts.push(`${articlesCount} article${articlesCount !== 1 ? 's' : ''}`)
                    }
                    if (totalCount === 0) {
                      metaParts.push('Empty folder')
                    }
                    
                    const metaText = metaParts.join(', ')
                    const updatedAt = folder.updated_at ? formatRelativeDate(folder.updated_at) : null
                    const isLastFolder = folderIndex === sortedFolders.length - 1 && sortedArticles.length === 0 && !selectedFolderId

                    return (
                      <tr
                        key={folder.id}
                        className={`bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors h-14 cursor-pointer ${
                          isLastFolder ? 'border-b-0' : ''
                        }`}
                        onClick={() => onFolderSelect(folder.id)}
                      >
                        <td className="px-6 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            {totalCount === 0 ? (
                              <FolderOpen className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Folder className="w-5 h-5 text-blue-600" />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">{folder.name}</span>
                              <span className="text-xs text-gray-500 mt-0.5">
                                {metaText}
                                {folder.description && (
                                  <>
                                    {metaText && ' • '}
                                    {folder.description}
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {updatedAt || ''}
                        </td>
                        <td className="px-6 py-3 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleContextMenu(e, folder, 'folder')
                              }}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="More options"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}

                  {/* Articles */}
                  {sortedArticles.map((article, articleIndex) => {
                    const title = getFirstLine(article.body)
                    const isLastArticle = articleIndex === sortedArticles.length - 1

                    return (
                      <tr
                        key={article.id}
                        className={`bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors h-14 cursor-pointer ${
                          isLastArticle ? 'border-b-0' : ''
                        }`}
                        onClick={() => onEditArticle(article)}
                      >
                        <td className="px-6 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">{title}</span>
                              <span className="text-xs text-gray-500 mt-0.5">
                                {article.type === 'manual'
                                  ? `Updated ${formatRelativeDate(article.created_at)} by ${article.created_by}`
                                  : `Ticket Source • ${formatRelativeDate(article.created_at)}`}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {formatRelativeDate(article.created_at)}
                        </td>
                        <td className="px-6 py-3 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onEditArticle(article)
                              }}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="Edit Article"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleContextMenu(e, article, 'article')
                              }}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="More options"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            {searchQuery ? (
              <>
                <FileEdit className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your search query
                </p>
              </>
            ) : (
              <>
                <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  This folder is empty
                </h3>
                <button
                  onClick={onNewArticle}
                  className="px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors flex items-center gap-2 mx-auto mt-4"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Article</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            ref={contextMenuRef}
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            {contextMenu.type === 'article' ? (
              <>
                <button
                  onClick={() => {
                    onEditArticle(contextMenu.item as KnowledgeArticle)
                    setContextMenu(null)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleMoveClick(contextMenu.item, 'article')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FolderTree className="h-4 w-4" />
                  Move to...
                </button>
                <div className="border-t border-gray-200 my-1" />
                <button
                  onClick={() => {
                    if (confirm('Вы уверены, что хотите удалить эту статью?')) {
                      onDeleteArticle((contextMenu.item as KnowledgeArticle).id)
                    }
                    setContextMenu(null)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onEditFolder(contextMenu.item as KBFolder)
                    setContextMenu(null)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Rename
                </button>
                {onMoveFolder && (
                  <button
                    onClick={() => handleMoveClick(contextMenu.item, 'folder')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FolderTree className="h-4 w-4" />
                    Move to...
                  </button>
                )}
                <div className="border-t border-gray-200 my-1" />
                <button
                  onClick={() => {
                    onDeleteFolder(contextMenu.item as KBFolder)
                    setContextMenu(null)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Move Article Dialog */}
      <MoveArticleDialog
        isOpen={moveArticleDialogOpen}
        onClose={() => {
          setMoveArticleDialogOpen(false)
          setMovingArticle(null)
        }}
        onConfirm={handleMoveArticleConfirm}
        folders={allFolders}
        currentFolderId={movingArticle?.folder_id || null}
      />

      {/* Move Folder Dialog */}
      {onMoveFolder && (
        <MoveFolderDialog
          isOpen={moveFolderDialogOpen}
          onClose={() => {
            setMoveFolderDialogOpen(false)
            setMovingFolder(null)
          }}
          onConfirm={handleMoveFolderConfirm}
          folders={allFolders}
          movingFolderId={movingFolder?.id || ''}
        />
      )}

      {/* Article Viewer Drawer (для просмотра из результатов поиска) */}
      <ArticleViewer
        isOpen={isViewerOpen}
        article={viewingArticle}
        searchQuery={searchQueryDebounced}
        onClose={handleCloseViewer}
        onShowInFolder={handleShowInFolder}
      />
    </div>
  )
}

