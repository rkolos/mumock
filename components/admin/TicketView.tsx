'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ExternalLink,
  ChevronsUp,
  Search,
  Settings,
  Filter,
  GripVertical,
  Edit,
  Reply,
  MoreVertical,
  Plus,
  ChevronDown,
  Copy,
  X,
  Send,
  User,
  Tag,
  RefreshCw,
  LayoutGrid,
  Check,
  Forward,
  MessageSquare,
  Pin,
  Mail,
  Link as LinkIcon,
  Trash2,
  Clock,
  MessageCircle,
  Globe,
  Sparkles,
} from 'lucide-react'
import { mockTickets, Ticket } from '../../data/tickets'
import { mockTags } from '../../data/tags'
import AiContextBar from './AiContextBar'
import SourcePreviewModal from './SourcePreviewModal'

interface Message {
  id: string
  author: string
  authorId: string
  content: string
  timestamp: string
  isSystem: boolean
  isBot?: boolean
  edited?: boolean
  replyTo?: {
    author: string
    content: string
  }
  attachments?: string[]
}

interface TicketViewProps {
  ticketId: string
}

export default function TicketView({ ticketId }: TicketViewProps) {
  const router = useRouter()
  const ticket = mockTickets.find((t) => t.id === ticketId)
  const [selectedTicketId, setSelectedTicketId] = useState(ticketId)
  const [messageText, setMessageText] = useState('')
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(ticket?.status || 'open')
  const [currentPriority, setCurrentPriority] = useState(ticket?.priority || 'medium')
  const [selectedTags, setSelectedTags] = useState<string[]>(ticket?.tags || [])
  const [assignedUsers, setAssignedUsers] = useState<string[]>(ticket?.assignedUsers || [])
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)
  const filterMenuRef = useRef<HTMLDivElement>(null)
  const searchSettingsRef = useRef<HTMLDivElement>(null)
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const [searchSettingsOpen, setSearchSettingsOpen] = useState(false)
  const [messageContextMenuOpen, setMessageContextMenuOpen] = useState<string | null>(null)
  const messageContextMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  
  // Состояния для настроек поиска
  const [searchSettings, setSearchSettings] = useState({
    showAvatar: true,
    showName: true,
    showDate: true,
    showChannel: true,
    showStatus: true,
    showCategory: true,
  })

  // Состояния для AI Smart Draft
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isContextBarVisible, setIsContextBarVisible] = useState(false)
  const [aiSources, setAiSources] = useState<Array<{
    id: string
    type: 'document' | 'ticket'
    title: string
    snippet: string
    url?: string
    ticketId?: string
  }>>([])
  const [selectedSource, setSelectedSource] = useState<{
    id: string
    type: 'document' | 'ticket'
    title: string
    snippet: string
    url?: string
    ticketId?: string
  } | null>(null)
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false)

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setStatusDropdownOpen(false)
      }
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target as Node)
      ) {
        setPriorityDropdownOpen(false)
      }
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setFilterMenuOpen(false)
      }
      if (
        searchSettingsRef.current &&
        !searchSettingsRef.current.contains(event.target as Node)
      ) {
        setSearchSettingsOpen(false)
      }
      // Закрытие контекстного меню сообщения
      if (messageContextMenuOpen) {
        const ref = messageContextMenuRefs.current[messageContextMenuOpen]
        if (ref && !ref.contains(event.target as Node)) {
          setMessageContextMenuOpen(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [messageContextMenuOpen])

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value)
    // Автоматическое увеличение высоты
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Тикет не найден</p>
      </div>
    )
  }

  // Мокап сообщений
  const messages: Message[] = [
    {
      id: '1',
      author: 'ticket-system-dev',
      authorId: 'system',
      content: 'Тикет создан',
      timestamp: '2025-12-15T10:00:00Z',
      isSystem: true,
      isBot: true,
    },
    {
      id: '2',
      author: ticket.username,
      authorId: 'user',
      content: 'Здравствуйте! У меня проблема с оплатой.',
      timestamp: '2025-12-15T10:05:00Z',
      isSystem: false,
    },
    {
      id: '3',
      author: 'ticket-system-dev',
      authorId: 'system',
      content: 'Тикет назначен на admin@example.com',
      timestamp: '2025-12-15T10:10:00Z',
      isSystem: true,
      isBot: true,
    },
    {
      id: '4',
      author: ticket.username,
      authorId: 'user',
      content: 'Можете помочь?',
      timestamp: '2025-12-15T10:15:00Z',
      isSystem: false,
      replyTo: {
        author: ticket.username,
        content: 'Здравствуйте! У меня проблема с оплатой.',
      },
    },
    {
      id: '5',
      author: 'admin@example.com',
      authorId: 'admin',
      content: 'Конечно! Расскажите подробнее о проблеме.',
      timestamp: '2025-12-15T10:20:00Z',
      isSystem: false,
      edited: true,
    },
    {
      id: '6',
      author: ticket.username,
      authorId: 'user',
      content: 'Спасибо за помощь!',
      timestamp: '2025-12-15T10:25:00Z',
      isSystem: false,
      attachments: ['image1.jpg', 'image2.jpg'],
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatSystemDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPriorityLabel = (priority: Ticket['priority']) => {
    const labels: Record<Ticket['priority'], string> = {
      low: 'LOW',
      medium: 'MID',
      high: 'HIGH',
      critical: 'CRITICAL',
    }
    return labels[priority] || 'MID'
  }

  const getStatusColor = (status: Ticket['status']) => {
    const colors: Record<string, string> = {
      open: 'bg-blue-500',
      'in-progress': 'bg-orange-500',
      resolved: 'bg-green-500',
      closed: 'bg-gray-500',
    }
    return colors[status] || 'bg-gray-500'
  }

  const getStatusLabel = (status: Ticket['status']) => {
    const labels: Record<string, string> = {
      open: 'New',
      'in-progress': 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
    }
    return labels[status] || status
  }

  const getStatusBadgeColor = (status: Ticket['status']) => {
    const colors: Record<string, string> = {
      open: 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-orange-100 text-orange-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  // Получение иконки источника
  const getSourceIcon = (source?: Ticket['source']) => {
    switch (source) {
      case 'discord':
        return MessageCircle
      case 'telegram':
        return MessageCircle
      case 'whatsapp':
        return MessageCircle
      case 'web':
        return Globe
      default:
        return MessageCircle
    }
  }

  // Получение цвета иконки источника
  const getSourceIconColor = (source?: Ticket['source']) => {
    switch (source) {
      case 'discord':
        return 'text-[#5865F2]'
      case 'telegram':
        return 'text-[#0088cc]'
      case 'whatsapp':
        return 'text-[#25D366]'
      case 'web':
        return 'text-gray-600'
      default:
        return 'text-gray-400'
    }
  }

  // Получение названия источника
  const getSourceName = (source?: Ticket['source'], channel?: string) => {
    switch (source) {
      case 'discord':
        return `Discord Channel: ${channel || 'N/A'}`
      case 'telegram':
        return `Telegram: ${channel || 'N/A'}`
      case 'whatsapp':
        return `WhatsApp: ${channel || 'N/A'}`
      case 'web':
        return 'Web Widget'
      default:
        return 'Unknown'
    }
  }

  // Форматирование времени ожидания
  const formatWaitTime = (hours?: number) => {
    if (!hours) return null
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    if (h > 0) {
      return `${h}h ${m}m`
    }
    return `${m}m`
  }

  // Получение цвета времени ожидания
  const getWaitTimeColor = (hours?: number) => {
    if (!hours) return 'text-gray-500'
    if (hours < 1) return 'text-gray-500'
    if (hours >= 4) return 'text-red-600'
    return 'text-orange-600'
  }

  // Получение AI Title или fallback
  const getAiTitle = (ticket: Ticket) => {
    if (ticket.aiTitle) return ticket.aiTitle
    // Fallback: используем первое сообщение или "No subject"
    return 'No subject'
  }


  const handleCopyTicketId = () => {
    const ticketId = `ticket-${ticket?.username.replace('_', '')}-${ticket?.id}`
    navigator.clipboard.writeText(ticketId)
  }

  const handleStatusChange = (newStatus: Ticket['status']) => {
    setCurrentStatus(newStatus)
    setStatusDropdownOpen(false)
    // Здесь можно добавить автосохранение
  }

  const handlePriorityChange = (newPriority: Ticket['priority']) => {
    setCurrentPriority(newPriority)
    setPriorityDropdownOpen(false)
    // Здесь можно добавить автосохранение
  }

  // Функция генерации AI ответа (мок)
  const handleGenerateAiResponse = async () => {
    if (isAiLoading) return

    setIsAiLoading(true)

    // Имитация загрузки
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Моковые данные согласно новому ТЗ
    const mockGeneratedText = `Здравствуйте! Судя по симптомам, ваша транзакция блокируется анти-фрод системой. Обычно это происходит при использовании VPN. Пожалуйста, попробуйте отключить его и повторить попытку через 10 минут.`

    const mockSources = [
      {
        id: '1',
        type: 'document' as const,
        title: 'Stripe Error Codes',
        snippet: 'In cases where Stripe returns error 402, verify if the user is utilizing a VPN. Disabling VPN usually resolves the transaction block.',
        url: '/docs/stripe-error-codes',
      },
      {
        id: '2',
        type: 'document' as const,
        title: 'VPN Usage Policy',
        snippet: 'Transactions from VPN connections are automatically flagged by our anti-fraud system. Users should disable VPN before making payments.',
        url: '/docs/vpn-policy',
      },
      {
        id: '3',
        type: 'document' as const,
        title: 'Refund Rules',
        snippet: 'Refunds for blocked transactions are processed automatically within 24 hours if the transaction was declined due to VPN usage.',
        url: '/docs/refund-rules',
      },
      {
        id: '4',
        type: 'ticket' as const,
        title: '#4455: Payment Error',
        snippet: 'User reported payment failure. Issue resolved by disabling VPN. Transaction completed successfully after VPN was turned off.',
        ticketId: '4455',
        url: '/tickets/4455',
      },
      {
        id: '5',
        type: 'ticket' as const,
        title: '#4459: Stripe Block',
        snippet: 'Similar case: Stripe error 402 due to VPN. Solution: user disabled VPN and retried after 10 minutes. Payment went through.',
        ticketId: '4459',
        url: '/tickets/4459',
      },
    ]

    // Прямая вставка текста в поле ввода
    setMessageText(mockGeneratedText)
    setAiSources(mockSources)
    setIsContextBarVisible(true)
    setIsAiLoading(false)
  }

  // Обработчик клика по источнику
  const handleSourceClick = (source: typeof aiSources[0]) => {
    setSelectedSource(source)
    setIsSourceModalOpen(true)
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Тикет не найден</p>
      </div>
    )
  }

  const ticketTitle = `ticket-${ticket.username.replace('_', '')}-${ticket.id}`
  const aiTitle = getAiTitle(ticket)
  const SourceIcon = getSourceIcon(ticket.source)
  const waitTime = formatWaitTime(ticket.waitTimeHours)

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Head Page - Верхняя панель управления */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        {/* Левая часть - Навигация */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => router.push('/')}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
          <div className="flex flex-col flex-1 min-w-0">
            {/* AI Title */}
            <div className="mb-1">
              <span className="text-xl font-semibold text-gray-900 truncate block">{aiTitle}</span>
            </div>
            {/* Мета-информация */}
            <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
              {/* Source Icon */}
              {ticket.source && (
                <>
                  <SourceIcon className={`h-4 w-4 ${getSourceIconColor(ticket.source)} flex-shrink-0`} />
                </>
              )}
              {/* Ticket ID */}
              <div className="flex items-center gap-1 group/ticketId">
                <span className="font-mono">{ticketTitle}</span>
                <button
                  onClick={handleCopyTicketId}
                  className="opacity-0 group-hover/ticketId:opacity-100 p-0.5 hover:bg-gray-100 rounded transition-all"
                  title="Скопировать ID тикета"
                >
                  <Copy className="h-3 w-3 text-gray-400" />
                </button>
                <button
                  className="opacity-0 group-hover/ticketId:opacity-100 p-0.5 hover:bg-gray-100 rounded transition-all"
                  title="Открыть в источнике"
                >
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </button>
              </div>
              {/* Wait Time */}
              {waitTime && (
                <>
                  <span>•</span>
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                      ticket.waitTimeHours && ticket.waitTimeHours >= 4
                        ? 'bg-red-50 text-red-700'
                        : ticket.waitTimeHours && ticket.waitTimeHours >= 1
                        ? 'bg-orange-50 text-orange-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Wait: {waitTime}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Правая часть - Действия */}
        <div className="flex items-center gap-2">
          {/* Приоритет Dropdown */}
          <div className="relative" ref={priorityDropdownRef}>
            <button
              onClick={() => {
                setPriorityDropdownOpen(!priorityDropdownOpen)
                setStatusDropdownOpen(false)
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <ChevronsUp className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {getPriorityLabel(currentPriority)}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
            </button>
            {priorityDropdownOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                {(['low', 'medium', 'high', 'critical'] as Ticket['priority'][]).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => handlePriorityChange(priority)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                  >
                    {getPriorityLabel(priority)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Статус Dropdown */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen)
                setPriorityDropdownOpen(false)
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${getStatusBadgeColor(
                currentStatus
              )}`}
            >
              <div className={`h-2 w-2 rounded-full ${getStatusColor(currentStatus)}`}></div>
              <span className="text-sm font-medium">{getStatusLabel(currentStatus)}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {statusDropdownOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[140px]">
                {(['open', 'in-progress', 'resolved', 'closed'] as Ticket['status'][]).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md flex items-center gap-2"
                    >
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(status)}`}></div>
                      {getStatusLabel(status)}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Кнопка Actions */}
          <button className="p-2 hover:bg-gray-100 rounded transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Трехпанельная структура */}
      <div className="flex-1 flex overflow-hidden">
        {/* Левая панель - Список тикетов и фильтры */}
        <div
          className="bg-white border-r border-gray-200 flex flex-col overflow-hidden"
          style={{ width: '275px', minWidth: '250px', maxWidth: '300px' }}
        >
          {/* Поиск */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative" ref={searchSettingsRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSearchSettingsOpen(!searchSettingsOpen)
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              >
                <Settings className="h-4 w-4 text-gray-400" />
              </button>
              
              {/* Search Settings Popover */}
              {searchSettingsOpen && (
                <div className="absolute right-0 top-full mt-1 w-[220px] bg-white border border-gray-200 rounded-lg z-50" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  <div className="py-1">
                    {[
                      { key: 'showAvatar', label: 'Show avatar' },
                      { key: 'showName', label: 'Show name' },
                      { key: 'showDate', label: 'Show date' },
                      { key: 'showChannel', label: 'Show channel' },
                      { key: 'showStatus', label: 'Show status' },
                      { key: 'showCategory', label: 'Show category' },
                    ].map((item, index) => (
                      <div key={item.key}>
                        {index === 5 && <div className="border-t border-gray-200 my-1"></div>}
                        <label className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer">
                          <span className="text-sm text-gray-900">{item.label}</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={searchSettings[item.key as keyof typeof searchSettings]}
                              onChange={(e) => {
                                setSearchSettings({
                                  ...searchSettings,
                                  [item.key]: e.target.checked,
                                })
                              }}
                              className="sr-only"
                            />
                            <div
                              className={`w-4 h-4 border-2 rounded ${
                                searchSettings[item.key as keyof typeof searchSettings]
                                  ? 'bg-black border-black'
                                  : 'border-gray-300'
                              } flex items-center justify-center`}
                            >
                              {searchSettings[item.key as keyof typeof searchSettings] && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        setSearchSettings({
                          showAvatar: true,
                          showName: true,
                          showDate: true,
                          showChannel: true,
                          showStatus: true,
                          showCategory: true,
                        })
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-gray-50"
                    >
                      Clear Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Фильтры */}
          <div className="px-4 py-3 border-b border-gray-200 relative" ref={filterMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setFilterMenuOpen(!filterMenuOpen)
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Add Filter</span>
            </button>
            
            {/* Filter Popover */}
            {filterMenuOpen && (
              <div className="absolute left-4 top-full mt-1 w-[290px] bg-white border border-gray-200 rounded-lg z-50" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                {/* Header with search */}
                <div className="bg-gray-100 px-3 py-2">
                  <input
                    type="text"
                    placeholder="Filter by"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Filter options list */}
                <div className="py-1">
                  {[
                    { icon: User, label: 'Assigned users of tickets' },
                    { icon: Tag, label: 'Tags of tickets' },
                    { icon: RefreshCw, label: 'Statuses of tickets' },
                    { icon: LayoutGrid, label: 'Categories of tickets' },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.label}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setFilterMenuOpen(false)
                        }}
                      >
                        <Icon className="h-4 w-4 text-gray-600" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Список тикетов */}
          <div className="flex-1 overflow-y-auto">
            {mockTickets.map((t) => {
              const isActive = t.id === selectedTicketId
              const ticketAiTitle = getAiTitle(t)
              const ticketSourceIcon = getSourceIcon(t.source)
              const ticketWaitTime = formatWaitTime(t.waitTimeHours)
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTicketId(t.id)
                    router.push(`/tickets/${t.id}`)
                  }}
                  className={`
                    flex items-start gap-3 py-2 px-3 border-b border-gray-100 cursor-pointer
                    hover:bg-gray-50 transition-colors relative
                    ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
                  `}
                >
                  {/* Аватар с badge источника */}
                  <div className="relative flex-shrink-0">
                    <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {t.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* Badge источника с белой обводкой */}
                    {t.source && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-white flex items-center justify-center border-2 border-white">
                        <ticketSourceIcon className={`h-2.5 w-2.5 ${getSourceIconColor(t.source)}`} />
                      </div>
                    )}
                  </div>
                  
                  {/* Контентная часть */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    {/* Ряд 1: AI Title (с переносом) */}
                    <div className="text-sm font-semibold text-gray-900 leading-tight mb-1">
                      {ticketAiTitle}
                    </div>
                    
                    {/* Ряд 2: User Name + Wait Time */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
                      <span>@{t.username}</span>
                      {ticketWaitTime && (
                        <>
                          <span>•</span>
                          <span
                            className={`${getWaitTimeColor(t.waitTimeHours)} ${
                              t.waitTimeHours && t.waitTimeHours >= 4
                                ? 'px-1.5 py-0.5 rounded bg-red-50'
                                : ''
                            }`}
                          >
                            ⏳ {ticketWaitTime}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {/* Ряд 3: Footer - Category (слева) + Status (справа) */}
                    <div className="flex items-center justify-between mt-auto">
                      {/* Категория */}
                      <span className="text-[11px] text-gray-600 px-2 py-0.5 border border-gray-300 rounded bg-gray-50">
                        {t.category}
                      </span>
                      
                      {/* Статус */}
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(t.status)}`}></div>
                        <span className="text-[11px] text-gray-600">{getStatusLabel(t.status)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Разделитель */}
        <div className="w-1 bg-gray-200 flex items-center justify-center transition-colors relative">
          <GripVertical className="h-5 w-5 absolute transition-colors text-gray-400" />
        </div>

        {/* Центральная панель - Чат */}
        <div className="flex-1 flex flex-col bg-[#F8F9FA] overflow-hidden">
          {/* История сообщений */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Разделитель даты */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs font-medium text-gray-500 px-2">
                {formatDate(messages[0].timestamp)}
              </span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Сообщения */}
            {messages.map((message, index) => {
              const showDateDivider =
                index > 0 &&
                formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)

              // Определяем, нужно ли показывать аватар (группировка сообщений)
              const prevMessage = index > 0 ? messages[index - 1] : null
              const showAvatar =
                !message.isSystem &&
                (!prevMessage ||
                  prevMessage.authorId !== message.authorId ||
                  prevMessage.isSystem ||
                  formatDate(prevMessage.timestamp) !== formatDate(message.timestamp))

              // Системные сообщения отображаем как центрированный серый текст
              if (message.isSystem) {
                return (
                  <div key={message.id}>
                    {showDateDivider && (
                      <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-xs font-medium text-gray-500 px-2">
                          {formatDate(message.timestamp)}
                        </span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>
                    )}
                    <div className="flex justify-center my-2">
                      <span className="text-xs text-gray-500">
                        — {message.content} {formatSystemDate(message.timestamp)} в {formatTime(message.timestamp)} —
                      </span>
                    </div>
                  </div>
                )
              }

              return (
                <div key={message.id}>
                  {showDateDivider && (
                    <div className="flex items-center gap-4 my-6">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-xs font-medium text-gray-500 px-2">
                        {formatDate(message.timestamp)}
                      </span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                  )}

                  <div
                    className={`group flex items-start gap-3 py-1 hover:bg-gray-50/50 rounded transition-colors ${
                      message.authorId === 'admin' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {/* Аватар (показываем только для первого сообщения в группе) */}
                    <div className="w-10 flex-shrink-0">
                      {showAvatar && (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {message.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Контент сообщения */}
                    <div className={`flex-1 min-w-0 ${message.authorId === 'admin' ? 'flex flex-col items-end' : ''}`}>
                      {/* Заголовок сообщения (только для пользователей, не для агента) */}
                      {showAvatar && message.authorId !== 'admin' && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-700">
                            {message.author}
                          </span>
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                          {message.edited && (
                            <span className="text-xs text-gray-400 italic">(edited)</span>
                          )}
                        </div>
                      )}

                      {/* Reply Preview */}
                      {message.replyTo && (
                        <div className={`mb-2 pl-4 border-l-4 border-blue-500 text-sm text-gray-600 ${message.authorId === 'admin' ? 'pr-4 border-l-0 border-r-4' : ''}`}>
                          <span className="font-medium">{message.replyTo.author}</span>
                          <span className="ml-2">{message.replyTo.content}</span>
                        </div>
                      )}

                      {/* Текст сообщения */}
                      <div
                        className={`text-sm px-3 py-2 rounded-lg relative inline-block ${
                          message.authorId === 'user'
                            ? 'bg-white text-gray-700'
                            : message.authorId === 'admin'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700'
                        }`}
                      >
                        {message.content}
                        {/* Время и edited для агента внутри пузыря */}
                        {message.authorId === 'admin' && (
                          <div className="flex items-center gap-1.5 mt-1 justify-end">
                            {message.edited && (
                              <span className="text-xs opacity-70 italic">(edited)</span>
                            )}
                            <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                          </div>
                        )}
                        {/* Время и edited для пользователя (если не в заголовке) */}
                        {message.authorId === 'user' && !showAvatar && (
                          <div className="flex items-center gap-1.5 mt-1">
                            {message.edited && (
                              <span className="text-xs text-gray-400 italic">(edited)</span>
                            )}
                            <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                          </div>
                        )}
                      </div>

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className={`grid grid-cols-2 gap-2 mt-2 ${message.authorId === 'admin' ? 'ml-auto' : ''} max-w-md`}>
                          {message.attachments.map((att, idx) => (
                            <div
                              key={idx}
                              className="aspect-video bg-gray-200 rounded border border-gray-300 flex items-center justify-center overflow-hidden"
                            >
                              <span className="text-xs text-gray-500 truncate px-2">
                                {att}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Hover Menu */}
                      <div className={`opacity-0 group-hover:opacity-100 flex items-center gap-1 mt-1 transition-opacity ${message.authorId === 'admin' ? 'flex-row-reverse' : ''}`}>
                        <button
                          className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                          title="Reply"
                        >
                          <Reply className="h-4 w-4" />
                        </button>
                        <div
                          className="relative"
                          ref={(el) => {
                            messageContextMenuRefs.current[message.id] = el
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setMessageContextMenuOpen(
                                messageContextMenuOpen === message.id ? null : message.id
                              )
                            }}
                            className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                            title="More options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          
                          {/* Message Context Menu */}
                          {messageContextMenuOpen === message.id && (
                            <div className={`absolute ${message.authorId === 'admin' ? 'left-0' : 'right-0'} top-full mt-1 w-[220px] bg-white border border-gray-200 rounded-lg z-50`} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                              <div className="py-1">
                                <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors">
                                  <span>Edit message</span>
                                  <Edit className="h-4 w-4 text-gray-500" />
                                </button>
                                <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors">
                                  <span>Reply</span>
                                  <Reply className="h-4 w-4 text-gray-500" />
                                </button>
                                <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 transition-colors">
                                  <span>Forward</span>
                                  <Forward className="h-4 w-4 text-gray-400" />
                                </button>
                                <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 transition-colors">
                                  <span>Create thread</span>
                                  <MessageSquare className="h-4 w-4 text-gray-400" />
                                </button>
                                
                                <div className="border-t border-gray-200 my-1"></div>
                                
                                <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 transition-colors">
                                  <span>Copy text</span>
                                  <Copy className="h-4 w-4 text-gray-400" />
                                </button>
                                <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 transition-colors">
                                  <span>Pin message</span>
                                  <Pin className="h-4 w-4 text-gray-400" />
                                </button>
                                <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 transition-colors">
                                  <span>Mark Unread</span>
                                  <Mail className="h-4 w-4 text-gray-400" />
                                </button>
                                <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 transition-colors">
                                  <span>Copy message link</span>
                                  <LinkIcon className="h-4 w-4 text-gray-400" />
                                </button>
                                
                                <div className="border-t border-gray-200 my-1"></div>
                                
                                <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                  <span>Delete message</span>
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* AI Context Bar */}
          <AiContextBar
            isVisible={isContextBarVisible}
            onClose={() => setIsContextBarVisible(false)}
            sources={aiSources}
            onSourceClick={handleSourceClick}
          />

          {/* Ввод сообщения */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end gap-2">
              <button className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0">
                <Plus className="h-5 w-5 text-gray-500" />
              </button>
              <div className="flex-1 relative">
                <textarea
                  placeholder={`Message ${ticket.channel}`}
                  className="w-full resize-none border border-gray-300 rounded-lg px-4 py-2.5 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  value={messageText}
                  onChange={handleTextareaChange}
                  readOnly={isAiLoading}
                  style={{ minHeight: '60px', maxHeight: '150px' }}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  {/* Кнопка AI генерации */}
                  <button
                    onClick={handleGenerateAiResponse}
                    disabled={isAiLoading}
                    className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Generate AI Reply"
                  >
                    {isAiLoading ? (
                      <div className="h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Sparkles className="h-4 w-4 text-[#673AB7]" />
                    )}
                  </button>
                  {/* Кнопка отправки */}
                  <button
                    className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                    title="Отправить"
                  >
                    <Send className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Правая панель - Контекст и Управление */}
        <div
          className="bg-white border-l border-gray-200 overflow-y-auto"
          style={{ width: '310px', minWidth: '300px', maxWidth: '320px' }}
        >
          <div className="p-4 space-y-4">
            {/* Карточка пользователя */}
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">
                  {ticket.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900 truncate">
                  {ticket.username
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </div>
                <div className="text-xs text-gray-500 truncate">@{ticket.username}</div>
              </div>
              <button
                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="Скопировать ID"
              >
                <Copy className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Секция "Свойства" */}
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Source</div>
                <div className="flex items-center gap-2">
                  {ticket.source && (
                    <>
                      <SourceIcon className={`h-4 w-4 ${getSourceIconColor(ticket.source)}`} />
                      <span className="text-sm text-gray-900 font-medium">
                        {getSourceName(ticket.source, ticket.channel)}
                      </span>
                    </>
                  )}
                  {!ticket.source && (
                    <span className="text-sm text-gray-900 font-medium">Unknown</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Created</div>
                <div className="text-sm text-gray-900 font-medium">{formatDate(ticket.createdAt)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Channel</div>
                <button className="text-sm text-gray-900 font-medium hover:text-blue-600 hover:underline transition-colors">
                  {ticket.channel}
                </button>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Category</div>
                <button className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded hover:bg-blue-200 transition-colors">
                  {ticket.category === 'Financial' ? 'IMPORTANT' : ticket.category.toUpperCase()}
                </button>
              </div>
            </div>

            {/* Секция "Source Data" */}
            {ticket.custom_fields && ticket.custom_fields.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 mb-2">Source Data</div>
                <div className="space-y-3">
                  {ticket.custom_fields.map((field, index) => {
                    const handleCopy = () => {
                      navigator.clipboard.writeText(field.value)
                    }

                    const isUrl = field.type === 'link' || field.value.startsWith('http://') || field.value.startsWith('https://')
                    const isEmail = field.type === 'email' || (field.value.includes('@') && field.value.includes('.'))

                    return (
                      <div key={index} className="grid grid-cols-[35%_65%] gap-2">
                        <div className="text-xs text-gray-500 break-words">{field.label}:</div>
                        <div className="text-sm text-gray-900 break-words">
                          {isUrl ? (
                            <a
                              href={field.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1 max-w-full"
                            >
                              <span className="truncate">
                                {field.displayText || field.value}
                              </span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          ) : isEmail ? (
                            <a
                              href={`mailto:${field.value}`}
                              className="text-blue-600 hover:text-blue-700 underline break-all"
                            >
                              {field.value}
                            </a>
                          ) : (
                            <div className="flex items-center gap-1.5 group/copy">
                              <span className="break-all">{field.value}</span>
                              {(field.copyable || field.type === 'text') && (
                                <button
                                  onClick={handleCopy}
                                  className="opacity-0 group-hover/copy:opacity-100 p-0.5 hover:bg-gray-100 rounded transition-all flex-shrink-0"
                                  title="Скопировать"
                                >
                                  <Copy className="h-3 w-3 text-gray-400" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Секция "Bot Information" */}
            {(ticket.transactionId || ticket.environment || ticket.errorLogs) && (
              <div>
                <div className="text-xs text-gray-500 mb-2">Bot Information</div>
                <div className="space-y-2.5">
                  {ticket.transactionId && (
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">transaction_id:</div>
                      <div className="text-xs text-gray-900 font-mono break-all">
                        {ticket.transactionId}
                      </div>
                    </div>
                  )}
                  {ticket.environment && (
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">environment:</div>
                      <div className="text-xs text-gray-900 font-mono">
                        {ticket.environment}
                      </div>
                    </div>
                  )}
                  {ticket.errorLogs && (
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">error_logs:</div>
                      <div className="text-xs text-gray-900 font-mono break-all">
                        {ticket.errorLogs}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Секция "Управление" - Теги */}
            <div>
              <div className="text-xs text-gray-500 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.length > 0 &&
                  selectedTags.map((tag) => {
                    const tagData = mockTags.find((t) => t.name === tag)
                    const tagColor = tagData?.color || '#6B7280'
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        style={
                          tagColor !== '#6B7280' && tagColor !== '#000000'
                            ? { backgroundColor: tagColor + '20', color: tagColor }
                            : undefined
                        }
                      >
                        {tag}
                        <button
                          onClick={() => {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          }}
                          className="hover:bg-gray-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )
                  })}
                <button className="inline-flex items-center gap-1 px-2.5 py-1 border border-dashed border-gray-300 text-gray-500 text-xs font-medium rounded-full hover:bg-gray-50 transition-colors">
                  <Plus className="h-3 w-3" />
                  Add Tag
                </button>
              </div>
            </div>

            {/* Секция "Управление" - Assigned To */}
            <div>
              <div className="text-xs text-gray-500 mb-2">Assigned To</div>
              <div className="space-y-2">
                {assignedUsers.length > 0 ? (
                  assignedUsers.map((user, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-600">
                          {user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900 flex-1 truncate">{user}</span>
                      <button
                        onClick={() => {
                          setAssignedUsers(assignedUsers.filter((u) => u !== user))
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X className="h-3.5 w-3.5 text-gray-400" />
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">Не назначен</span>
                )}
                <button className="inline-flex items-center gap-1.5 w-full px-2.5 py-1.5 border border-dashed border-gray-300 text-gray-500 text-xs font-medium rounded hover:bg-gray-50 transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Source Preview Modal */}
      <SourcePreviewModal
        isOpen={isSourceModalOpen}
        onClose={() => {
          setIsSourceModalOpen(false)
          setSelectedSource(null)
        }}
        source={selectedSource}
      />
    </div>
  )
}

