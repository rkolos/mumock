'use client'

import { useState, useRef, useEffect } from 'react'
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
  Send
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

export default function SuggestionDetail() {
  const {
    selectedSuggestionId,
    getSuggestionById,
    updateSuggestionStatus,
    updateSuggestionCategory,
    mergeSuggestion,
    getCategories,
  } = useSuggestions()
  const { showToast } = useWidget()

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false)
  
  const suggestion = selectedSuggestionId ? getSuggestionById(selectedSuggestionId) : null
  
  // Инициализация activeTab с учетом статуса предложения
  const [activeTab, setActiveTab] = useState<'Discussion' | 'Потенциальные дубликаты'>(() => {
    const currentSuggestion = selectedSuggestionId ? getSuggestionById(selectedSuggestionId) : null
    return currentSuggestion?.lifecycle.status === 'New' ? 'Потенциальные дубликаты' : 'Discussion'
  })
  
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
      setActiveTab(isNew ? 'Потенциальные дубликаты' : 'Discussion')
    }
  }, [selectedSuggestionId, suggestion])

  // Имитация загрузки AI анализа
  useEffect(() => {
    // Сбрасываем состояние при смене вкладки
    if (activeTab !== 'Потенциальные дубликаты') {
      setIsAiAnalyzing(false)
      setAiDuplicates([])
      analysisStartedRef.current = null
      return
    }

    // Проверяем, нужно ли запускать анализ
    if (!shouldShowAiAnalysis || !selectedSuggestionId) {
      return
    }

    // Проверяем, не был ли уже запущен анализ для этого предложения
    if (analysisStartedRef.current === selectedSuggestionId) {
      return
    }

    // Запускаем анализ только если нужно показывать моковые данные
    if (shouldShowMockDuplicates) {
      analysisStartedRef.current = selectedSuggestionId
      setIsAiAnalyzing(true)
      
      const timer = setTimeout(() => {
        setIsAiAnalyzing(false)
        setAiDuplicates(MOCK_DUPLICATES)
      }, 1800) // 1.8 секунды
      
      return () => clearTimeout(timer)
    } else {
      // Для других предложений со статусом New просто показываем пустое состояние
      analysisStartedRef.current = selectedSuggestionId
      setIsAiAnalyzing(false)
      setAiDuplicates([])
    }
  }, [activeTab, shouldShowAiAnalysis, shouldShowMockDuplicates, selectedSuggestionId])

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
    if (selectedSuggestionId) {
      updateSuggestionStatus(selectedSuggestionId, status)
      showToast('Discord Embed updated', 'success')
      setStatusDropdownOpen(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    if (selectedSuggestionId) {
      updateSuggestionCategory(selectedSuggestionId, category)
      showToast('Category updated', 'success')
      setCategoryDropdownOpen(false)
    }
  }

  const statusOptions: SuggestionStatus[] = ['New', 'Open', 'Duplicate', 'Planned', 'In Progress', 'Completed', 'Rejected']

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

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-[#e2e8f0] z-10">
          <div className="p-4">
            {/* Meta: Источник + ID */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {suggestion.source === 'discord' && (
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                )}
                <span className="text-sm text-gray-600">{suggestion.id}</span>
              </div>
            </div>

            {/* Status Dropdown + Actions Toolbar */}
            <div className="flex items-center justify-between gap-2">
              {/* Status Dropdown */}
              <div className="relative flex-1" ref={statusDropdownRef}>
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 border border-[#e2e8f0] rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                    <span className="text-sm font-medium text-gray-900">
                      {suggestion.lifecycle.status}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e2e8f0] rounded-md shadow-lg z-20">
                    {statusOptions.map((status) => {
                      const color = getStatusColor(status)
                      const isActive = suggestion.lifecycle.status === status
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={`
                            w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md transition-colors
                            ${isActive ? 'bg-blue-50' : ''}
                          `}
                        >
                          <div className={`w-2 h-2 rounded-full ${color}`} />
                          <span className={`text-sm ${isActive ? 'font-semibold text-blue-600' : 'text-gray-900'}`}>
                            {status}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Actions Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const sourceName = suggestion.source === 'discord' ? 'Discord' : 'website'
                    showToast(`Clicking will open the suggestion page on ${sourceName} in a new tab`, 'info')
                  }}
                  className="p-2 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors"
                  title="Preview"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
                <div className="relative" ref={actionsMenuRef}>
                  <button
                    onClick={() => setActionsMenuOpen(!actionsMenuOpen)}
                    className="p-2 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors"
                    title="More actions"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </button>
                  {actionsMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-md shadow-lg z-20 min-w-[150px]">
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
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Title & Meta */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{suggestion.content.title}</h1>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {suggestion.author.username}
              </span>
              {(() => {
                const categories = getCategories()
                const categoryConfig = categories.find(cat => cat.label === suggestion.content.category)
                const categoryColor = categoryConfig?.color || '#9ca3af'
                return (
                  <div className="relative" ref={categoryDropdownRef}>
                    <button
                      onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                      className="px-3 py-1 text-white text-sm rounded-full font-medium hover:opacity-80 transition-opacity cursor-pointer"
                      style={{ backgroundColor: categoryColor }}
                    >
                      {suggestion.content.category}
                    </button>
                    {categoryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-[#e2e8f0] rounded-md shadow-lg z-20 min-w-[150px] max-h-[300px] overflow-y-auto">
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
                  </div>
                )
              })()}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">Score</div>
                <div className="text-lg font-semibold text-gray-900">{suggestion.metrics.score}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">Upvotes</div>
                <div className="text-lg font-semibold text-gray-900">{suggestion.metrics.upvotes}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">Downvotes</div>
                <div className="text-lg font-semibold text-gray-900">{suggestion.metrics.downvotes}</div>
              </div>
            </div>
          </div>

          {/* Description Box */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {suggestion.content.description}
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-[#e2e8f0] mb-6">
            <div className="flex gap-4">
              {(['Discussion', 'Потенциальные дубликаты'] as const)
                .filter(tab => {
                  const isNewStatus = suggestion?.lifecycle.status === 'New'
                  // Скрываем вкладку Discussion для статуса New
                  if (tab === 'Discussion' && isNewStatus) {
                    return false
                  }
                  // Скрываем вкладку Потенциальные дубликаты для всех статусов кроме New
                  if (tab === 'Потенциальные дубликаты' && !isNewStatus) {
                    return false
                  }
                  return true
                })
                .map((tab) => {
                  const discussionMessagesCount = 5 // Единое количество сообщений для всех предложений
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        px-4 py-2 text-sm font-medium border-b-2 transition-colors
                        ${
                          activeTab === tab
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }
                      `}
                    >
                      {tab}
                      {tab === 'Discussion' && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {discussionMessagesCount}
                        </span>
                      )}
                    </button>
                  )
                })}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'Discussion' && (
            <div className="space-y-4">
              {/* Mock Discussion Messages */}
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                    JD
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">john_doe</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Отличная идея! Полностью поддерживаю это предложение. Это действительно улучшит пользовательский опыт.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-sm">
                    AS
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">admin_support</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Admin</span>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Спасибо за предложение! Мы рассмотрели его и добавили в наш roadmap. Ожидайте обновления в следующем релизе.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    MS
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">mary_smith</span>
                    <span className="text-xs text-gray-500">45 minutes ago</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Было бы здорово, если бы можно было также добавить возможность кастомизации. Что думаете?
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                    AT
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">admin_tech</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Admin</span>
                    <span className="text-xs text-gray-500">30 minutes ago</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Хорошая мысль! Мы можем рассмотреть это как отдельное предложение. Создайте новый тикет с деталями.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                    RB
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">robert_brown</span>
                    <span className="text-xs text-gray-500">15 minutes ago</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Согласен с предыдущими комментариями. Это действительно важное улучшение для платформы.
                  </p>
                </div>
              </div>

              {/* Интерфейс добавления комментария */}
              <div className="border-t border-[#e2e8f0] mt-6 pt-4">
                <div className="flex items-end gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0">
                    <Plus className="h-5 w-5 text-gray-500" />
                  </button>
                  <div className="flex-1 flex flex-col">
                    <div className="relative">
                      <textarea
                        ref={commentTextareaRef}
                        placeholder="Add a comment..."
                        className="w-full resize-none border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                          className={`
                            p-2 rounded transition-colors flex-shrink-0
                            ${
                              commentText.trim()
                                ? 'hover:bg-blue-100 bg-blue-50'
                                : 'bg-gray-100 cursor-not-allowed opacity-50'
                            }
                          `}
                          title="Send comment"
                        >
                          <Send className={`h-4 w-4 ${commentText.trim() ? 'text-blue-600' : 'text-gray-400'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Потенциальные дубликаты' && (
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

