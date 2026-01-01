'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { FileEdit, Plus, Search, Trash2, MoreVertical, FolderTree, Folder, ChevronDown, FolderOpen, Edit, CornerUpLeft, X } from 'lucide-react'
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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center">
          <ArticlesBreadcrumbs
            folderId={selectedFolderId}
            folders={allFolders}
            onFolderClick={onFolderSelect}
          />
        </div>

        {/* Right: Search + New Dropdown */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              placeholder={searchPlaceholder}
              className="pl-9 pr-4 py-2 w-64 text-sm bg-gray-50 border-none rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
          
          {/* New Dropdown */}
          {!isSearchActive && (
            <div className="relative" ref={newDropdownRef}>
              <button
                onClick={() => setNewDropdownOpen(!newDropdownOpen)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            {newDropdownOpen && (
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
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-white relative">
        {isSearchActive ? (
          /* Search Overlay */
          <div className="space-y-4">
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
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Search Results */}
            {!isSearchLoading && searchResults.length > 0 && (
              <div className="space-y-1">
                {searchResults.map((result) => {
                  const pathString = result.path.map(p => p.name).join(' / ')
                  return (
                    <div
                      key={result.id}
                      className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 transition-all"
                      onClick={() => handleViewArticle(result.article)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Article Icon */}
                        <div className="p-2 bg-gray-50 text-gray-500 rounded-md flex-shrink-0">
                          <FileEdit className="h-5 w-5" />
                        </div>
                        {/* Title and Path */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">
                            {result.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 truncate">
                            {pathString}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Empty State */}
            {!isSearchLoading && searchResults.length === 0 && searchQueryDebounced.trim() && (
              <div className="bg-white rounded-lg border border-[#e2e8f0] p-12 text-center">
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
          <div className="space-y-1">
            {/* Parent Row - Go Up */}
            {selectedFolderId !== null && (
              <div
                className="group flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 transition-all"
                onClick={() => onFolderSelect(parentFolder?.id || null)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Go Up Icon */}
                  <div className="p-2 bg-gray-50 text-gray-500 rounded-md flex-shrink-0">
                    <CornerUpLeft className="h-5 w-5" />
                  </div>
                  {/* Go Up Text */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-600">
                      {parentFolder 
                        ? `.. (Go up to "${parentFolder.name}")`
                        : '.. (Go up)'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Folders - Pinned Top */}
            {sortedFolders.map((folder) => {
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
              
              const metaText = metaParts.join(' • ')
              const updatedAt = folder.updated_at ? formatRelativeDate(folder.updated_at) : null

              return (
                <div
                  key={folder.id}
                  className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 transition-all"
                  onClick={() => onFolderSelect(folder.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Folder Icon - Larger */}
                    <div className="p-2.5 bg-amber-50 text-amber-500 rounded-md flex-shrink-0">
                      <Folder className="h-6 w-6" />
                    </div>
                    {/* Folder Name and Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 mb-0.5">
                        {folder.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {metaText}
                        {folder.description && (
                          <>
                            {metaText && ' • '}
                            {folder.description}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Updated Date and Actions */}
                  <div className="flex items-center gap-3 ml-2">
                    {updatedAt && (
                      <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {updatedAt}
                      </span>
                    )}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleContextMenu(e, folder, 'folder')
                        }}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Articles - Bottom */}
            {sortedArticles.map((article) => {
              const title = getFirstLine(article.body)

              return (
                <div
                  key={article.id}
                  className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 transition-all"
                  onClick={() => onEditArticle(article)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Article Icon */}
                    <div className="p-2 bg-gray-50 text-gray-500 rounded-md flex-shrink-0">
                      <FileEdit className="h-5 w-5" />
                    </div>
                    {/* Title and Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">
                        {title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {article.type === 'manual'
                          ? `Updated ${formatRelativeDate(article.created_at)} by ${article.created_by}`
                          : `Ticket Source • ${formatRelativeDate(article.created_at)}`}
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleContextMenu(e, article, 'article')
                      }}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('Вы уверены, что хотите удалить эту статью?')) {
                          onDeleteArticle(article.id)
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-12 text-center">
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

