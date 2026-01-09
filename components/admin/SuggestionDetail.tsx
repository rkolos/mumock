'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSuggestions } from '../../contexts/SuggestionsContext'
import { 
  MessageSquare, 
  Eye, 
  GitMerge,
  MoreVertical, 
  ChevronDown,
  X,
  UserX,
  Trash2,
  Sparkles,
  Loader2,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Send,
  ArrowLeft,
  Copy,
  ExternalLink,
  Globe,
  Lock
} from 'lucide-react'
import { getStatusColor, getDiscordStatusColor, SuggestionStatus } from '../../data/suggestions'
import { useWidget } from '../../contexts/WidgetContext'

// Моковые данные дубликатов
const MOCK_DUPLICATES = [
  {
    id: 402,
    title: "Dark Theme support",
    status: "in_progress",
    matchScore: 98,
    excerpt: "Request to add a dark mode toggle in the settings...",
    upvotes: 45,
    downvotes: 3
  },
  {
    id: 315,
    title: "Black background for night mode",
    status: "closed",
    matchScore: 75,
    excerpt: "Can we have a black background?",
    upvotes: 12,
    downvotes: 2
  }
]

interface SuggestionDetailProps {
  suggestionId?: string
}

export default function SuggestionDetail({ suggestionId: propSuggestionId }: SuggestionDetailProps = { suggestionId: undefined }) {
  const router = useRouter()
  const {
    selectedSuggestionId,
    getSuggestionById,
    updateSuggestionStatus,
    updateSuggestionCategory,
    mergeSuggestion,
    getCategories,
  } = useSuggestions()
  const { showToast } = useWidget()

  // Используем propSuggestionId если передан, иначе selectedSuggestionId из контекста (для обратной совместимости)
  const suggestionId = propSuggestionId || selectedSuggestionId

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false)
  
  const suggestion = suggestionId ? getSuggestionById(suggestionId) : null
  
  // Инициализация activeTab с учетом статуса предложения
  type TabType = 'team' | 'duplicates'
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const currentSuggestion = suggestionId ? getSuggestionById(suggestionId) : null
    return currentSuggestion?.lifecycle.status === 'New' ? 'duplicates' : 'team'
  })
  
  // Team Chat notifications
  const [teamChatNotifications, setTeamChatNotifications] = useState(0)
  
  // AI Analysis states
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false)
  const [aiDuplicates, setAiDuplicates] = useState<Array<{
    id: number
    title: string
    status: string
    matchScore: number
    excerpt: string
    upvotes: number
    downvotes: number
  }>>([])
  const [isMerging, setIsMerging] = useState<{ [id: number]: boolean }>({})
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([])
  const [commentText, setCommentText] = useState('')

  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const actionsMenuRef = useRef<HTMLDivElement>(null)
  const analysisStartedRef = useRef<string | null>(null)
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Проверка триггера для AI Analysis - показываем для всех предложений со статусом New
  const shouldShowAiAnalysis = suggestion !== null && suggestion !== undefined && suggestion.lifecycle.status === 'New'
  
  // Проверка, нужно ли показывать моковые данные дубликатов (только для конкретного предложения)
  // Для sug_new_bug не показываем дубликаты, чтобы показать "не найдено совпадений"
  const shouldShowMockDuplicates = shouldShowAiAnalysis && suggestion && 
    suggestion.id !== 'sug_new_bug' &&
    (suggestion.id === 'sug_new_demo' || suggestion.content.title.includes('Dark Mode') || suggestion.content.title === 'Add Dark Mode' || suggestion.content.title.includes('темную тему'))

  // Сброс состояния при смене предложения и установка правильной вкладки
  useEffect(() => {
    setIsAiAnalyzing(false)
    setAiDuplicates([])
    setIsMerging({})
    analysisStartedRef.current = null
    
    // Устанавливаем правильную вкладку в зависимости от статуса
    if (suggestion) {
      const isNew = suggestion.lifecycle.status === 'New'
      setActiveTab(isNew ? 'duplicates' : 'team')
    }
  }, [suggestionId, suggestion])

  // Имитация загрузки AI анализа
  useEffect(() => {
    // Сбрасываем состояние при смене вкладки
    if (activeTab !== 'duplicates') {
      setIsAiAnalyzing(false)
      setAiDuplicates([])
      analysisStartedRef.current = null
      return
    }

    // Проверяем, нужно ли запускать анализ
    if (!shouldShowAiAnalysis || !suggestionId) {
      return
    }

    // Проверяем, не был ли уже запущен анализ для этого предложения
    if (analysisStartedRef.current === suggestionId) {
      return
    }

    // Запускаем анализ только если нужно показывать моковые данные
    if (shouldShowMockDuplicates) {
      analysisStartedRef.current = suggestionId
      setIsAiAnalyzing(true)
      
      const timer = setTimeout(() => {
        setIsAiAnalyzing(false)
        setAiDuplicates(MOCK_DUPLICATES)
      }, 1800) // 1.8 секунды
      
      return () => clearTimeout(timer)
    } else {
      // Для других предложений со статусом New просто показываем пустое состояние
      analysisStartedRef.current = suggestionId
      setIsAiAnalyzing(false)
      setAiDuplicates([])
    }
  }, [activeTab, shouldShowAiAnalysis, shouldShowMockDuplicates, suggestionId])

  // Функция для показа toast
  const showLocalToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }

  // Обработка изменения текста комментария
  const handleCommentTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setCommentText(newValue)
    // Автоматическое увеличение высоты
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`
  }

  // Обработка отправки комментария
  const handleSendComment = () => {
    if (!commentText.trim()) return
    
    // TODO: Отправка комментария на сервер
    showLocalToast('Comment sent successfully', 'success')
    setCommentText('')
    if (commentTextareaRef.current) {
      commentTextareaRef.current.style.height = 'auto'
    }
  }

  // Обработка Merge
  const handleMerge = async (duplicateId: number) => {
    if (!suggestion) return
    
    setIsMerging(prev => ({ ...prev, [duplicateId]: true }))
    
    // Имитация задержки
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Для мокапа используем существующее предложение или создаем виртуальный ID
    // Используем ID существующего предложения sug_8821 как целевой для merge
    const targetSuggestionId = 'sug_8821' // Используем существующее предложение про темную тему
    
    mergeSuggestion(suggestion.id, targetSuggestionId)
    updateSuggestionStatus(suggestion.id, 'Duplicate')
    
    showLocalToast(`Success! Ticket merged with #${duplicateId}`, 'success')
    setIsMerging(prev => ({ ...prev, [duplicateId]: false }))
  }

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false)
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false)
      }
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setActionsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleStatusChange = (status: SuggestionStatus) => {
    if (suggestionId) {
      updateSuggestionStatus(suggestionId, status)
      showToast('Discord Embed updated', 'success')
      setStatusDropdownOpen(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    if (suggestionId) {
      updateSuggestionCategory(suggestionId, category)
      showToast('Category updated', 'success')
      setCategoryDropdownOpen(false)
    }
  }

  const handleCopySuggestionId = () => {
    if (suggestion) {
      navigator.clipboard.writeText(suggestion.id)
      showToast('Suggestion ID copied', 'success')
    }
  }

  const getSourceIcon = (source: 'discord' | 'web') => {
    switch (source) {
      case 'discord':
        return MessageSquare
      case 'web':
        return Globe
      default:
        return MessageSquare
    }
  }

  const getSourceIconColor = (source: 'discord' | 'web') => {
    switch (source) {
      case 'discord':
        return 'text-[#5865F2]'
      case 'web':
        return 'text-gray-600'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusBadgeColor = (status: SuggestionStatus) => {
    const colors: Record<SuggestionStatus, string> = {
      'New': 'bg-gray-100 text-gray-700',
      'Open': 'bg-blue-100 text-blue-700',
      'Duplicate': 'bg-amber-100 text-amber-700',
      'Planned': 'bg-purple-100 text-purple-700',
      'In Progress': 'bg-orange-100 text-orange-700',
      'Completed': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const statusOptions: SuggestionStatus[] = ['New', 'Open', 'Duplicate', 'Planned', 'In Progress', 'Completed', 'Rejected']

  // Форматирование относительной даты
  const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        return diffInMinutes <= 1 ? 'just now' : `${diffInMinutes} minutes ago`
      }
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`
    } else if (diffInDays === 1) {
      return '1 day ago'
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30)
      return months === 1 ? '1 month ago' : `${months} months ago`
    } else {
      const years = Math.floor(diffInDays / 365)
      return years === 1 ? '1 year ago' : `${years} years ago`
    }
  }

  // Empty State
  if (!suggestion) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Select a suggestion to view details</p>
        </div>
      </div>
    )
  }

  const statusColor = getStatusColor(suggestion.lifecycle.status)
  const SourceIcon = getSourceIcon(suggestion.source)
  const sourceIconColor = getSourceIconColor(suggestion.source)

  return (
    <>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Head Page - Верхняя панель управления */}
        <div className="bg-white px-6 py-4 flex items-center justify-between">
          {/* Левая часть - Навигация */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => router.push('/suggestions')}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
            <div className="flex flex-col flex-1 min-w-0">
              {/* AI Title */}
              <div className="mb-1">
                <span className="text-xl font-semibold text-gray-900 truncate block">{suggestion.content.title}</span>
              </div>
              {/* Мета-информация */}
              <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                {/* Created date */}
                {suggestion.created_at && (
                  <>
                    <span>Created: {formatRelativeDate(suggestion.created_at)}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Правая часть - Действия */}
          <div className="flex items-center gap-2">
            {/* Статус Dropdown */}
            <div className="relative" ref={statusDropdownRef}>
              <button
                onClick={() => {
                  setStatusDropdownOpen(!statusDropdownOpen)
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${getStatusBadgeColor(
                  suggestion.lifecycle.status
                )}`}
              >
                <div className={`h-2 w-2 rounded-full ${statusColor}`}></div>
                <span className="text-sm font-medium capitalize">{suggestion.lifecycle.status}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {statusDropdownOpen && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[140px]">
                  {statusOptions.map((status) => {
                    const color = getStatusColor(status)
                    const isActive = suggestion.lifecycle.status === status
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md flex items-center gap-2"
                      >
                        <div className={`h-2 w-2 rounded-full ${color}`}></div>
                        <span className={isActive ? 'font-semibold' : ''}>{status}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Кнопка Actions */}
            <div className="relative" ref={actionsMenuRef}>
              <button
                onClick={() => setActionsMenuOpen(!actionsMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
              {actionsMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[150px]">
                  <button
                    onClick={() => {
                      setActionsMenuOpen(false)
                      // TODO: Ban User
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 first:rounded-t-md transition-colors text-left"
                  >
                    <UserX className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-900">Ban User</span>
                  </button>
                  <button
                    onClick={() => {
                      setActionsMenuOpen(false)
                      // TODO: Delete
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 last:rounded-b-md transition-colors text-left text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area with Tabs */}
        <div className="flex-1 flex overflow-hidden">
          {/* Центральная панель - Контент */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Панель вкладок */}
            <div className="bg-white border-b border-[#E0E0E0] pt-3 relative">
              <div className="flex items-end px-4">
                {/* Team Chat Tab */}
                <button
                  onClick={() => {
                    setActiveTab('team')
                    setTeamChatNotifications(0)
                  }}
                  className="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: activeTab === 'team' ? '#FFFDF5' : 'transparent',
                    color: activeTab === 'team' ? '#212121' : '#757575',
                    fontWeight: activeTab === 'team' ? 'bold' : 'normal',
                  }}
                >
                  <Lock className="h-4 w-4" />
                  <span>Team Chat</span>
                  {teamChatNotifications > 0 && activeTab !== 'team' && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1.5 bg-[#1976D2] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                      {teamChatNotifications}
                    </span>
                  )}
                </button>

                {/* Duplicates Tab - показывать только для статуса New */}
                {suggestion?.lifecycle.status === 'New' && (
                  <button
                    onClick={() => setActiveTab('duplicates')}
                    className="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: activeTab === 'duplicates' ? '#FFFFFF' : 'transparent',
                      color: activeTab === 'duplicates' ? '#212121' : '#757575',
                      fontWeight: activeTab === 'duplicates' ? 'bold' : 'normal',
                    }}
                  >
                    <GitMerge className="h-4 w-4" />
                    <span>Duplicates</span>
                  </button>
                )}
              </div>
            </div>

            {/* Suggestion Original Post */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-sm">
                    {suggestion.author.isSystem 
                      ? 'NP' 
                      : suggestion.author.username
                          .split('_')
                          .map(word => word.charAt(0).toUpperCase())
                          .join('')
                          .substring(0, 2)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {suggestion.author.isSystem ? 'Ninja Product Team' : suggestion.author.username}
                    </span>
                    {suggestion.created_at && (
                      <span className="text-xs text-gray-500">
                        suggested this on {new Date(suggestion.created_at).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {suggestion.content.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Content Separator */}
            <div className="h-px bg-gray-200"></div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Tab Content */}
              {activeTab === 'team' && (
                <div className="space-y-4">
                  {/* Team Chat Messages */}
                  <div className="text-center py-12 text-gray-500">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm font-medium mb-2">Team Chat</p>
                    <p className="text-xs">Internal discussion about this suggestion</p>
                    <p className="text-xs mt-4 text-gray-400">No messages yet</p>
                  </div>
                </div>
              )}

              {activeTab === 'duplicates' && (
            <div>
              {!suggestion ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-sm">Выберите предложение для просмотра потенциальных дубликатов</p>
                </div>
              ) : !shouldShowAiAnalysis ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-sm">Поиск дубликатов доступен только для предложений со статусом "New"</p>
                </div>
              ) : isAiAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                  <p className="text-sm text-gray-600">AI is analyzing semantics...</p>
                  <p className="text-xs text-gray-500 mt-2">Searching for duplicates...</p>
                </div>
              ) : aiDuplicates.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Found Duplicates</h3>
                  {aiDuplicates.map((duplicate) => {
                    const isMergingThis = isMerging[duplicate.id] || false
                    const matchColor = duplicate.matchScore >= 90 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    const statusColor = duplicate.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    const statusLabel = duplicate.status === 'in_progress' ? 'In Progress' : 'Closed'
                    
                    return (
                      <div
                        key={duplicate.id}
                        className="bg-white border border-[#e2e8f0] rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-gray-900">#{duplicate.id}</span>
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${matchColor}`}>
                                {duplicate.matchScore}% Match
                              </span>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColor}`}>
                                {statusLabel}
                              </span>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900 mb-2">
                              {duplicate.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {duplicate.excerpt}
                            </p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{duplicate.upvotes}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <ThumbsDown className="h-3 w-3" />
                                <span>{duplicate.downvotes}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleMerge(duplicate.id)}
                            disabled={isMergingThis}
                            className={`
                              px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2
                              ${
                                isMergingThis
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-500 text-white hover:bg-blue-600'
                              }
                            `}
                          >
                            {isMergingThis ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Merging...</span>
                              </>
                            ) : (
                              <>
                                <GitMerge className="h-4 w-4" />
                                <span>Merge</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-sm">No duplicates found</p>
                </div>
              )}
            </div>
          )}
            </div>

            {/* Sticky Input Area */}
            {activeTab === 'team' && (
              <div className="border-t border-gray-200 bg-[#FFFDF5]">
                <div className="p-4">
                  <div className="flex items-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0">
                      <Plus className="h-5 w-5 text-gray-500" />
                    </button>
                    <div className="flex-1 flex flex-col">
                      <div className="relative">
                        <textarea
                          ref={commentTextareaRef}
                          placeholder="Add an internal note..."
                          className="w-full resize-none border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                          rows={2}
                          value={commentText}
                          onChange={handleCommentTextChange}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              if (commentText.trim()) {
                                handleSendComment()
                              }
                            }
                          }}
                          style={{ 
                            minHeight: '60px', 
                            maxHeight: '150px',
                            paddingRight: '50px'
                          }}
                        />
                        <div className="absolute right-2 bottom-2 flex items-center gap-1">
                          <button
                            onClick={handleSendComment}
                            disabled={!commentText.trim()}
                            className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Send comment"
                          >
                            <Send className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Правая панель - Контекст и Управление */}
          <div
            className="bg-white border-l border-gray-200 overflow-y-auto"
            style={{ width: '310px', minWidth: '300px', maxWidth: '320px' }}
          >
            <div className="p-4">
              {/* Карточка пользователя */}
              <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors mb-6">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600">
                    {suggestion.author.isSystem 
                      ? 'NP' 
                      : suggestion.author.username
                          .split('_')
                          .map(word => word.charAt(0).toUpperCase())
                          .join('')
                          .substring(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate">
                    {suggestion.author.isSystem 
                      ? 'Ninja Product Team' 
                      : suggestion.author.username
                          .split('_')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                  </div>
                  <div className="text-xs font-normal text-gray-500 truncate">
                    {suggestion.author.isSystem ? '' : `@${suggestion.author.username}`}
                  </div>
                </div>
                <button
                  onClick={handleCopySuggestionId}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-200 rounded transition-all"
                  title="Скопировать ID"
                >
                  <Copy className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {/* Секция "Свойства" */}
              <div className="mb-6">
                <div className="text-[11px] font-bold text-[#9E9E9E] uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Properties
                </div>
                <div className="space-y-1">
                  {/* Category */}
                  <div className="grid grid-cols-[40%_60%] gap-2 items-start">
                    <div className="text-[13px] font-normal text-[#757575]">Category:</div>
                    <div className="relative inline-block" ref={categoryDropdownRef}>
                      {(() => {
                        const categories = getCategories()
                        const categoryConfig = categories.find(cat => cat.label === suggestion.content.category)
                        const categoryColor = categoryConfig?.color || '#9ca3af'
                        return (
                          <>
                            <button
                              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                              className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded hover:bg-blue-200 transition-colors w-fit"
                              style={categoryColor !== '#9ca3af' ? { backgroundColor: categoryColor + '20', color: categoryColor } : undefined}
                            >
                              {suggestion.content.category}
                            </button>
                            {categoryDropdownOpen && (
                              <div className="absolute left-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-md shadow-lg z-20 min-w-[150px] max-h-[300px] overflow-y-auto">
                                {categories.map((category) => {
                                  const isActive = suggestion.content.category === category.label
                                  return (
                                    <button
                                      key={category.id}
                                      onClick={() => handleCategoryChange(category.label)}
                                      className={`
                                        w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md transition-colors text-left
                                        ${isActive ? 'bg-blue-50' : ''}
                                      `}
                                    >
                                      <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: category.color }}
                                      />
                                      <span className={`text-sm ${isActive ? 'font-semibold text-blue-600' : 'text-gray-900'}`}>
                                        {category.label}
                                      </span>
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Source */}
                  <div className="grid grid-cols-[40%_60%] gap-2 items-start">
                    <div className="text-[13px] font-normal text-[#757575]">Source:</div>
                    <div className="flex items-center gap-2">
                      {suggestion.source && (
                        <>
                          <SourceIcon className={`h-4 w-4 ${sourceIconColor}`} />
                          <span className="text-[13px] font-normal text-[#212121]" style={{ wordBreak: 'break-word', fontWeight: 400 }}>
                            {suggestion.source === 'discord' ? 'Discord' : 'Web'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Suggestion ID */}
                  <div className="grid grid-cols-[40%_60%] gap-2 items-start">
                    <div className="text-[13px] font-normal text-[#757575]">ID:</div>
                    <div className="flex items-center gap-1 group/suggestionId">
                      <span className="text-[13px] font-mono text-[#212121]" style={{ fontWeight: 400 }}>{suggestion.id}</span>
                      <button
                        onClick={handleCopySuggestionId}
                        className="opacity-0 group-hover/suggestionId:opacity-100 p-0.5 hover:bg-gray-100 rounded transition-all"
                        title="Скопировать ID предложения"
                      >
                        <Copy className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Created */}
                  {suggestion.created_at && (
                    <div className="grid grid-cols-[40%_60%] gap-2 items-start">
                      <div className="text-[13px] font-normal text-[#757575]">Created:</div>
                      <div className="text-[13px] font-normal text-[#212121]" style={{ fontWeight: 400 }}>
                        {formatRelativeDate(suggestion.created_at)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Секция "Voting" - аналог BOT INFORMATION из тикетов */}
              <div className="mb-6">
                <div className="text-[11px] font-bold text-[#9E9E9E] uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Voting
                </div>
                <div className="space-y-1">
                  <div className="grid grid-cols-[40%_60%] gap-2 items-start">
                    <div className="text-[13px] font-normal text-[#757575]">Score:</div>
                    <div className="text-lg font-semibold text-[#212121]" style={{ fontWeight: 600 }}>
                      {suggestion.metrics.score}
                    </div>
                  </div>
                  <div className="grid grid-cols-[40%_60%] gap-2 items-start">
                    <div className="text-[13px] font-normal text-[#757575]">Up:</div>
                    <div className="text-[13px] font-normal text-[#212121]" style={{ fontWeight: 400 }}>
                      {suggestion.metrics.upvotes}
                    </div>
                  </div>
                  <div className="grid grid-cols-[40%_60%] gap-2 items-start">
                    <div className="text-[13px] font-normal text-[#757575]">Down:</div>
                    <div className="text-[13px] font-normal text-[#212121]" style={{ fontWeight: 400 }}>
                      {suggestion.metrics.downvotes}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => {
            const colors = {
              success: 'bg-green-50 border-green-200 text-green-800',
              error: 'bg-red-50 border-red-200 text-red-800',
              info: 'bg-blue-50 border-blue-200 text-blue-800'
            }
            const Icon = toast.type === 'success' ? CheckCircle2 : MessageSquare

            return (
              <div
                key={toast.id}
                className={`
                  ${colors[toast.type]}
                  border rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[320px] max-w-md
                  animate-in slide-in-from-top-2 fade-in duration-300
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <p className="flex-1 text-sm font-medium">{toast.message}</p>
                <button
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

