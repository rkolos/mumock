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
  FileText,
  Video,
  Download,
  Play,
  Image as ImageIcon,
  Lock,
  AlertCircle,
  Bold,
  Italic,
  Heading,
  Quote,
  List,
  Folder,
  Save,
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
  images?: string[]
  files?: Array<{
    name: string
    size: string
    type: 'pdf' | 'zip' | 'log' | 'doc' | 'other'
    url?: string
  }>
  video?: {
    url: string
    thumbnail?: string
  }
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

  // Состояния для вкладок
  type TabType = 'public' | 'team' | 'dossier'
  const [activeTab, setActiveTab] = useState<TabType>('public')
  const [publicReplyNotifications, setPublicReplyNotifications] = useState(1) // Красная точка
  const [teamChatNotifications, setTeamChatNotifications] = useState(2) // Счетчик непрочитанных
  const [publicReplyPulse, setPublicReplyPulse] = useState(false)
  const [teamChatPulse, setTeamChatPulse] = useState(false)
  
  // Состояния для Team Chat
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [teamMessageText, setTeamMessageText] = useState('')
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<string | null>(null) // ID сообщения, для которого открыт пикер
  const [hoveredReaction, setHoveredReaction] = useState<{ messageId: string; emoji: string } | null>(null)
  const emojiPickerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Состояния для User Dossier
  const [isDossierEditMode, setIsDossierEditMode] = useState(false)
  const [dossierContent, setDossierContent] = useState(ticket?.dossier_content || '')
  const [dossierAttachments, setDossierAttachments] = useState<Array<{
    name: string
    url: string
    type: 'image' | 'pdf' | 'other'
  }>>(ticket?.dossier_attachments || [])
  const dossierEditorRef = useRef<HTMLTextAreaElement>(null)
  const dossierFileInputRef = useRef<HTMLInputElement>(null)

  // Синхронизация состояния досье при изменении тикета
  useEffect(() => {
    if (ticket) {
      setDossierContent(ticket.dossier_content || '')
      setDossierAttachments(ticket.dossier_attachments || [])
      setIsDossierEditMode(false)
    }
  }, [ticket?.id])

  // Эффект для триггера анимации pulse при изменении счетчика уведомлений
  useEffect(() => {
    if (publicReplyNotifications > 0 && activeTab !== 'public') {
      setPublicReplyPulse(true)
    }
  }, [publicReplyNotifications, activeTab])

  useEffect(() => {
    if (teamChatNotifications > 0 && activeTab !== 'team') {
      setTeamChatPulse(true)
    }
  }, [teamChatNotifications, activeTab])

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
      // Закрытие пикера эмодзи
      if (emojiPickerOpen) {
        const ref = emojiPickerRefs.current[emojiPickerOpen]
        if (ref && !ref.contains(event.target as Node)) {
          // Проверяем, что клик не был по кнопке добавления реакции
          const target = event.target as HTMLElement
          if (!target.closest('[title="Add reaction"]')) {
            setEmojiPickerOpen(null)
          }
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [messageContextMenuOpen, emojiPickerOpen])

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
      content: 'Вот скриншоты ошибки, как вы и просили. Она появляется сразу после логина.',
      timestamp: '2025-12-15T10:15:00Z',
      isSystem: false,
      images: [
        'https://placehold.co/400x300/E0E0E0/9E9E9E?text=Error+Screen',
        'https://placehold.co/400x300/E0E0E0/9E9E9E?text=Error+Log',
      ],
    },
    {
      id: '5',
      author: 'admin@example.com',
      authorId: 'admin',
      content: 'Я проанализировал логи. Похоже на конфликт драйверов.\nПосмотрите это видео-руководство, а затем установите патч ниже.',
      timestamp: '2025-12-15T10:20:00Z',
      isSystem: false,
      edited: true,
      video: {
        url: 'https://example.com/video.mp4',
        thumbnail: 'https://placehold.co/600x400/2C3E50/FFFFFF?text=Video+Preview',
      },
      files: [
        {
          name: 'patch_v2.4_fix.zip',
          size: '4.2 MB',
          type: 'zip',
        },
      ],
    },
    {
      id: '6',
      author: ticket.username,
      authorId: 'user',
      content: 'Спасибо за помощь!',
      timestamp: '2025-12-15T10:25:00Z',
      isSystem: false,
    },
  ]

  // Mock данные для Team Chat
  interface Reaction {
    emoji: string
    count: number
    me: boolean // Я поставил эту реакцию
    users: string[] // Список пользователей для tooltip
  }

  const teamChatMessages: (Message & { reactions?: Reaction[] })[] = [
    {
      id: 'team-1',
      author: 'Alex Admin',
      authorId: 'admin',
      content: 'Ребята, у этого клиента проблемы с API. @Maria Dev посмотри логи пожалуйста.',
      timestamp: '2025-12-15T14:30:00Z',
      isSystem: false,
      reactions: [
        {
          emoji: '👍',
          count: 1,
          me: true, // Я поставил эту реакцию
          users: ['You'],
        },
        {
          emoji: '👀',
          count: 2,
          me: false, // Я не ставил
          users: ['Maria Dev', 'Bob Manager'],
        },
      ],
    },
    {
      id: 'team-2',
      author: 'Maria Dev',
      authorId: 'admin',
      content: 'Смотрю. Кажется, он превысил лимиты.',
      timestamp: '2025-12-15T14:32:00Z',
      isSystem: false,
    },
  ]

  // Топ-6 реакций для пикера
  const quickReactions = ['👍', '👀', '✅', '🔥', '🤔', '❌']

  // Функция форматирования списка пользователей для tooltip
  const formatReactionUsers = (users: string[], count: number) => {
    if (users.length === 1) {
      return users[0]
    }
    if (users.length <= 3) {
      return users.join(', ')
    }
    return `${users.slice(0, 2).join(', ')} and ${count - 2} others`
  }

  // Функция toggle реакции
  const toggleReaction = (messageId: string, emoji: string) => {
    // Здесь будет логика обновления реакций
    // Пока просто закрываем пикер
    setEmojiPickerOpen(null)
  }

  // Функция парсинга @mentions
  const parseMentions = (text: string) => {
    const parts: Array<{ type: 'text' | 'mention'; content: string }> = []
    const mentionRegex = /@(\w+)/g
    let lastIndex = 0
    let match

    while ((match = mentionRegex.exec(text)) !== null) {
      // Добавляем текст до упоминания
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.substring(lastIndex, match.index),
        })
      }
      // Добавляем упоминание
      parts.push({
        type: 'mention',
        content: match[0], // @username
      })
      lastIndex = mentionRegex.lastIndex
    }
    // Добавляем оставшийся текст
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex),
      })
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }]
  }

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
      <div className="bg-white px-6 py-4 flex items-center justify-between">
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
          <div className="p-4 pb-2">
            <div className="relative" ref={searchSettingsRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
              <input
                type="text"
                placeholder="Search tickets"
                className="w-full pl-10 pr-10 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSearchSettingsOpen(!searchSettingsOpen)
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              >
                <Settings className="h-4 w-4 text-[#9E9E9E]" />
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
          <div className="px-4 py-2 border-b border-[#F0F0F0] relative" ref={filterMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setFilterMenuOpen(!filterMenuOpen)
              }}
              className="flex items-center gap-2 text-[11px] font-bold text-[#757575] uppercase hover:text-[#424242] transition-colors"
              style={{ letterSpacing: '0.5px' }}
            >
              <Filter className="h-3.5 w-3.5" />
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
              const TicketSourceIcon = getSourceIcon(t.source)
              const ticketWaitTime = formatWaitTime(t.waitTimeHours)
              const waitTimeColor = t.waitTimeHours && t.waitTimeHours >= 4 ? '#D32F2F' : '#757575'
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTicketId(t.id)
                    router.push(`/tickets/${t.id}`)
                  }}
                  className={`
                    flex items-start gap-3 py-3 px-4 border-b border-[#F0F0F0] cursor-pointer
                    hover:bg-[#F5F7FB] transition-colors relative
                    ${isActive ? 'bg-[#F0F4FF] border-l-[3px] border-l-[#1976D2]' : ''}
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
                      <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-white flex items-center justify-center" style={{ border: '2px solid white' }}>
                        <TicketSourceIcon className={`h-2.5 w-2.5 ${getSourceIconColor(t.source)}`} />
                      </div>
                    )}
                    {/* Индикатор непрочитанного сообщения (красная точка) */}
                    {(t.unread_messages_count ?? 0) > 0 && (
                      <div 
                        className="absolute rounded-full"
                        style={{ 
                          width: '8px', 
                          height: '8px', 
                          backgroundColor: '#D32F2F',
                          border: '2px solid white',
                          top: '-2px',
                          right: '-2px',
                          zIndex: 10
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Контентная часть */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    {/* Ряд 1: AI Title (с переносом) + Mention Badge */}
                    <div className="flex items-start gap-1 mb-1" style={{ lineHeight: '1.3' }}>
                      <div className="text-[13px] font-semibold text-[#212121] flex-1 min-w-0 line-clamp-2">
                        {ticketAiTitle}
                      </div>
                      {t.has_private_mention && (
                        <div 
                          className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                          style={{ 
                            width: '18px', 
                            height: '18px',
                            backgroundColor: '#E3F2FD',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#1976D2',
                            lineHeight: '1'
                          }}
                        >
                          @
                        </div>
                      )}
                    </div>
                    
                    {/* Ряд 2: User Name + Wait Time */}
                    <div className="flex items-center gap-1 text-[12px] font-normal text-[#757575] mb-1.5">
                      <span className="font-medium">@{t.username}</span>
                      {ticketWaitTime && (
                        <>
                          <span>•</span>
                          <span style={{ color: waitTimeColor }}>
                            Wait: {ticketWaitTime}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {/* Ряд 3: Footer - Category (слева) + Status (справа) */}
                    <div className="flex items-center justify-between mt-1.5">
                      {/* Категория */}
                      <span className="text-[11px] font-bold text-[#9E9E9E] uppercase" style={{ letterSpacing: '0.5px' }}>
                        {t.category === 'Financial' ? 'BILLING' : t.category.toUpperCase()}
                      </span>
                      
                      {/* Статус */}
                      <div className="flex items-center gap-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${getStatusColor(t.status)}`}></div>
                        <span className="text-[12px] font-medium text-[#424242]">{getStatusLabel(t.status)}</span>
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
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            backgroundColor:
              activeTab === 'public'
                ? '#F5F7FB'
                : activeTab === 'team'
                ? '#FFFDF5'
                : '#FFFFFF',
          }}
        >
          {/* Панель вкладок */}
          <div className="bg-white border-b border-[#E0E0E0] pt-3">
            <div className="flex items-end px-4">
              {/* Public Reply Tab */}
              <button
                onClick={() => {
                  setActiveTab('public')
                  setPublicReplyNotifications(0)
                  setPublicReplyPulse(false)
                }}
                className="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: activeTab === 'public' ? '#F5F7FB' : 'transparent',
                  color: activeTab === 'public' ? '#212121' : '#757575',
                  fontWeight: activeTab === 'public' ? 'bold' : 'normal',
                }}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Public Reply</span>
                {publicReplyNotifications > 0 && activeTab !== 'public' && (
                  <span
                    className={`absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full ${
                      publicReplyPulse ? 'badge-pulse-red' : ''
                    }`}
                    onAnimationEnd={() => setPublicReplyPulse(false)}
                  />
                )}
              </button>

              {/* Team Chat Tab */}
              <button
                onClick={() => {
                  setActiveTab('team')
                  setTeamChatNotifications(0)
                  setTeamChatPulse(false)
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
                  <span
                    className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1.5 bg-[#1976D2] text-white text-[10px] font-semibold rounded-full flex items-center justify-center ${
                      teamChatPulse ? 'badge-pulse-blue' : ''
                    }`}
                    onAnimationEnd={() => setTeamChatPulse(false)}
                  >
                    {teamChatNotifications}
                  </span>
                )}
              </button>

              {/* User Dossier Tab */}
              <button
                onClick={() => setActiveTab('dossier')}
                className="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: activeTab === 'dossier' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'dossier' ? '#212121' : '#757575',
                  fontWeight: activeTab === 'dossier' ? 'bold' : 'normal',
                }}
              >
                {(() => {
                  const hasContent = ticket?.dossier_content && ticket.dossier_content.trim().length > 0
                  const hasAttachments = ticket?.dossier_attachments && ticket.dossier_attachments.length > 0
                  const isFilled = hasContent || hasAttachments
                  return (
                    <FileText 
                      className={`h-4 w-4 ${isFilled ? 'text-[#1976D2]' : 'text-[#757575]'}`}
                      fill={isFilled ? 'currentColor' : 'none'}
                      strokeWidth={isFilled ? 0 : 1.5}
                    />
                  )
                })()}
                <span>User Dossier</span>
              </button>
            </div>
          </div>

          {/* Режим: Public Reply */}
          {activeTab === 'public' && (
            <>
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
              const isSameAuthor = prevMessage && 
                !prevMessage.isSystem && 
                !message.isSystem && 
                prevMessage.authorId === message.authorId &&
                formatDate(prevMessage.timestamp) === formatDate(message.timestamp)
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
                    <div className="flex justify-center my-6">
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
                    className={`group flex items-end gap-2 ${
                      message.authorId === 'admin' ? 'flex-row-reverse' : ''
                    } ${isSameAuthor ? 'mt-1' : 'mt-4'}`}
                  >
                    {/* Аватар (показываем только для первого сообщения в группе) */}
                    <div className="w-8 flex-shrink-0">
                      {showAvatar && (
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {message.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Контент сообщения */}
                    <div className={`flex-1 min-w-0 ${message.authorId === 'admin' ? 'flex flex-col items-end' : ''}`} style={{ maxWidth: '65%' }}>
                      {/* Reply Preview */}
                      {message.replyTo && (
                        <div className={`mb-2 pl-4 border-l-4 border-blue-500 text-sm text-gray-600 ${message.authorId === 'admin' ? 'pr-4 border-l-0 border-r-4' : ''}`}>
                          <span className="font-medium">{message.replyTo.author}</span>
                          <span className="ml-2">{message.replyTo.content}</span>
                        </div>
                      )}

                      {/* Пузырь сообщения */}
                      <div
                        className={`px-3 py-2 relative inline-block ${
                          message.authorId === 'user'
                            ? 'bg-white text-[#212121] shadow-sm'
                            : message.authorId === 'admin'
                            ? 'bg-blue-50 text-[#212121]'
                            : 'bg-white text-[#212121] shadow-sm'
                        }`}
                        style={{
                          borderRadius: message.authorId === 'user' 
                            ? '12px 12px 12px 0' 
                            : message.authorId === 'admin'
                            ? '12px 12px 0 12px'
                            : '12px',
                        }}
                      >
                        {/* Текст сообщения */}
                        {message.content && (
                          <div 
                            className="text-[14px] mb-2 whitespace-pre-wrap"
                            style={{ lineHeight: '1.45' }}
                          >
                            {message.content}
                          </div>
                        )}

                        {/* Изображения / Галерея */}
                        {message.images && message.images.length > 0 && (() => {
                          const images = message.images!
                          return (
                            <div className={`mb-2 ${images.length > 1 ? 'grid grid-cols-2 gap-1' : ''}`} style={{ maxWidth: images.length === 1 ? '400px' : '100%' }}>
                              {images.map((img, idx) => (
                                <div
                                  key={idx}
                                  className="relative rounded-lg overflow-hidden cursor-zoom-in bg-gray-100 group"
                                  style={{ 
                                    width: images.length === 1 ? '100%' : '100%',
                                    height: images.length === 1 ? 'auto' : '150px',
                                    aspectRatio: images.length === 1 ? '4/3' : '1',
                                  }}
                                >
                                  <img
                                    src={img}
                                    alt={`Image ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                    style={{ 
                                      borderRadius: '8px',
                                      display: 'block',
                                      minHeight: images.length === 1 ? '250px' : '150px',
                                    }}
                                    loading="lazy"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.src = `https://via.placeholder.com/400x300/E0E0E0/9E9E9E?text=Image+${idx + 1}`
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg pointer-events-none"></div>
                                </div>
                              ))}
                            </div>
                          )
                        })()}

                        {/* Видео */}
                        {message.video && (
                          <div className="mb-2 relative rounded-lg overflow-hidden bg-black" style={{ aspectRatio: '16/9', maxWidth: '100%' }}>
                            <img
                              src={message.video.thumbnail || message.video.url}
                              alt="Video thumbnail"
                              className="w-full h-full object-cover opacity-70"
                              style={{ borderRadius: '8px' }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
                                <Play className="h-12 w-12 text-white" fill="white" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Файлы */}
                        {message.files && message.files.length > 0 && (
                          <div className="mb-2 space-y-1">
                            {message.files.map((file, idx) => {
                              const getFileIcon = () => {
                                switch (file.type) {
                                  case 'pdf':
                                    return <FileText className="h-6 w-6 text-white" />
                                  case 'zip':
                                    return <FileText className="h-6 w-6 text-white" />
                                  case 'log':
                                    return <FileText className="h-6 w-6 text-white" />
                                  default:
                                    return <FileText className="h-6 w-6 text-white" />
                                }
                              }
                              const getFileColor = () => {
                                switch (file.type) {
                                  case 'pdf':
                                    return 'bg-red-500'
                                  case 'zip':
                                    return 'bg-blue-500'
                                  case 'log':
                                    return 'bg-gray-600'
                                  default:
                                    return 'bg-gray-500'
                                }
                              }
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg p-2"
                                >
                                  <div className={`${getFileColor()} rounded p-1.5 flex-shrink-0`}>
                                    {getFileIcon()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[13px] font-medium text-[#212121] truncate">
                                      {file.name}
                                    </div>
                                    <div className="text-[10px] text-[#9E9E9E]">
                                      {file.size}
                                    </div>
                                  </div>
                                  <button className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0">
                                    <Download className="h-4 w-4 text-[#757575]" />
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* Старые attachments (для обратной совместимости) */}
                        {message.attachments && message.attachments.length > 0 && !message.images && (
                          <div className={`grid grid-cols-2 gap-2 mb-2`}>
                            {message.attachments.map((att, idx) => (
                              <div
                                key={idx}
                                className="aspect-video bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden"
                              >
                                <span className="text-xs text-gray-500 truncate px-2">
                                  {att}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Мета-данные (Timestamp) */}
                        <div className={`flex items-center gap-1.5 ${message.authorId === 'admin' ? 'justify-end' : ''}`}>
                          {message.edited && (
                            <span className="text-[11px] italic" style={{ color: 'rgba(0,0,0,0.45)' }}>(edited)</span>
                          )}
                          <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.45)' }}>
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>

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
            </>
          )}

          {/* Режим: Team Chat */}
          {activeTab === 'team' && (
            <>
              {/* История сообщений Team Chat */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Разделитель даты */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-xs font-medium text-gray-500 px-2">
                    {formatDate(teamChatMessages[0].timestamp)}
                  </span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Сообщения Team Chat */}
                {teamChatMessages.map((message, index) => {
                  const showDateDivider =
                    index > 0 &&
                    formatDate(message.timestamp) !== formatDate(teamChatMessages[index - 1].timestamp)

                  const prevMessage = index > 0 ? teamChatMessages[index - 1] : null
                  const isSameAuthor =
                    prevMessage &&
                    !prevMessage.isSystem &&
                    !message.isSystem &&
                    prevMessage.authorId === message.authorId &&
                    formatDate(prevMessage.timestamp) === formatDate(message.timestamp)
                  const showAvatar =
                    !message.isSystem &&
                    (!prevMessage ||
                      prevMessage.authorId !== message.authorId ||
                      prevMessage.isSystem ||
                      formatDate(prevMessage.timestamp) !== formatDate(message.timestamp))

                  const parsedContent = parseMentions(message.content)

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
                        className={`group flex items-start gap-3 ${
                          isSameAuthor ? 'mt-1' : 'mt-4'
                        }`}
                      >
                        {/* Аватар - всегда показываем в Team Chat */}
                        <div className="w-8 flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {message.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Контент сообщения - всегда слева */}
                        <div className="flex-1 min-w-0">
                          {/* Заголовок с именем и временем - всегда показываем в Team Chat */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] font-bold text-[#212121]">{message.author}</span>
                            <span className="text-[11px] text-gray-500">{formatTime(message.timestamp)}</span>
                          </div>

                          {/* Пузырь сообщения */}
                          <div
                            className="px-3 py-2 relative inline-block bg-white text-[#212121] shadow-sm rounded-lg"
                            style={{ borderRadius: '8px' }}
                          >
                            {/* Текст сообщения с парсингом @mentions */}
                            <div className="text-[14px] whitespace-pre-wrap" style={{ lineHeight: '1.45' }}>
                              {parsedContent.map((part, partIndex) => {
                                if (part.type === 'mention') {
                                  return (
                                    <span
                                      key={partIndex}
                                      className="text-[#1976D2] font-medium px-1 py-0.5 rounded"
                                      style={{
                                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                        fontWeight: 500,
                                      }}
                                    >
                                      {part.content}
                                    </span>
                                  )
                                }
                                return <span key={partIndex}>{part.content}</span>
                              })}
                            </div>

                            {/* Кнопка добавления реакции (появляется при hover) */}
                            <button
                              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 p-1.5 bg-white hover:bg-gray-50 rounded-full shadow-sm border border-gray-200 transition-all z-10"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEmojiPickerOpen(emojiPickerOpen === message.id ? null : message.id)
                              }}
                              title="Add reaction"
                            >
                              <span className="text-xs text-gray-500 hover:text-gray-700">😊</span>
                            </button>

                            {/* Пикер эмодзи */}
                            {emojiPickerOpen === message.id && (
                              <div
                                ref={(el) => {
                                  emojiPickerRefs.current[message.id] = el
                                }}
                                className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20"
                                style={{ minWidth: '200px' }}
                              >
                                <div className="flex items-center gap-2 flex-wrap">
                                  {quickReactions.map((emoji) => (
                                    <button
                                      key={emoji}
                                      onClick={() => toggleReaction(message.id, emoji)}
                                      className="p-2 hover:bg-gray-100 rounded transition-colors text-lg"
                                      title={emoji}
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Реакции */}
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex items-center gap-2 mt-1 ml-1 flex-wrap">
                              {message.reactions.map((reaction, reactionIndex) => {
                                const isHovered =
                                  hoveredReaction?.messageId === message.id &&
                                  hoveredReaction?.emoji === reaction.emoji
                                const tooltipText = formatReactionUsers(reaction.users, reaction.count)

                                return (
                                  <div key={reactionIndex} className="relative">
                                    <button
                                      onClick={() => toggleReaction(message.id, reaction.emoji)}
                                      onMouseEnter={() =>
                                        setHoveredReaction({ messageId: message.id, emoji: reaction.emoji })
                                      }
                                      onMouseLeave={() => setHoveredReaction(null)}
                                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
                                        reaction.me
                                          ? 'bg-blue-50 border border-[#1976D2] text-[#1976D2] hover:bg-blue-100'
                                          : 'bg-gray-100 border border-[#E0E0E0] text-gray-600 hover:bg-gray-200'
                                      }`}
                                    >
                                      <span>{reaction.emoji}</span>
                                      <span>{reaction.count}</span>
                                    </button>

                                    {/* Tooltip с информацией о пользователях */}
                                    {isHovered && (
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-30">
                                        {tooltipText}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                          {(!message.reactions || message.reactions.length === 0) && (
                            <div className="opacity-0 group-hover:opacity-100 mt-1 ml-1 transition-opacity">
                              <button
                                onClick={() => setEmojiPickerOpen(emojiPickerOpen === message.id ? null : message.id)}
                                className="p-1 hover:bg-gray-100 rounded transition-all"
                                title="Add reaction"
                              >
                                <span className="text-xs text-gray-500">😊</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Индикатор печати */}
                {typingUsers.length > 0 && (
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-8"></div>
                    <div className="text-xs text-gray-500 italic">
                      {typingUsers.length === 1
                        ? `${typingUsers[0]} is typing`
                        : typingUsers.length === 2
                        ? `${typingUsers[0]} and ${typingUsers[1]} are typing`
                        : `${typingUsers[0]} and ${typingUsers.length - 1} others are typing`}
                      <span className="inline-flex gap-0.5 ml-1">
                        <span className="typing-dot">.</span>
                        <span className="typing-dot">.</span>
                        <span className="typing-dot">.</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ввод сообщения Team Chat */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-end gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0">
                    <Plus className="h-5 w-5 text-gray-500" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      placeholder="Message to team..."
                      className="w-full resize-none border border-gray-300 rounded-lg px-4 py-2.5 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      rows={2}
                      value={teamMessageText}
                      onChange={(e) => {
                        setTeamMessageText(e.target.value)
                        // Автоматическое увеличение высоты
                        e.target.style.height = 'auto'
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`
                      }}
                      style={{
                        minHeight: '60px',
                        maxHeight: '150px',
                        backgroundColor: 'rgba(255, 249, 196, 0.3)',
                      }}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                      {/* Кнопка отправки с иконкой замка */}
                      <button
                        className="p-2 hover:bg-yellow-100 rounded transition-colors flex-shrink-0"
                        style={{ backgroundColor: '#FFC107', color: '#212121' }}
                        title="Отправить внутреннее сообщение"
                      >
                        <Lock className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Режим: User Dossier */}
          {activeTab === 'dossier' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {!isDossierEditMode ? (
                /* Режим просмотра (Read Mode) */
                <>
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h6 className="text-base font-bold text-[#212121]">
                Dossier: {ticket.username
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
                    </h6>
                    <button
                      onClick={() => {
                        setIsDossierEditMode(true)
                        setDossierContent(ticket?.dossier_content || '')
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium text-[#212121]"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {(() => {
                      const hasContent = ticket?.dossier_content && ticket.dossier_content.trim().length > 0
                      const hasAttachments = ticket?.dossier_attachments && ticket.dossier_attachments.length > 0

                      if (!hasContent && !hasAttachments) {
                        // Empty State
                        return (
                          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                            <Folder className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-gray-600 text-base mb-4">No notes for this user yet.</p>
                            <button
                              onClick={() => {
                                setIsDossierEditMode(true)
                                setDossierContent('')
                              }}
                              className="px-4 py-2 bg-[#1976D2] text-white rounded-md hover:bg-[#1565C0] transition-colors text-sm font-medium"
                            >
                              Create Dossier
                            </button>
                          </div>
                        )
                      }

                      // Render Markdown Content
                      const renderMarkdown = (content: string) => {
                        // Простой парсер markdown для базовых элементов
                        let html = content
                        
                        // Headers
                        html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-6 text-[#212121]">$1</h1>')
                        html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3 mt-5 text-[#212121]">$1</h2>')
                        html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2 mt-4 text-[#212121]">$1</h3>')
                        
                        // Bold
                        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                        
                        // Italic
                        html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                        
                        // Blockquote
                        html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-700">$1</blockquote>')
                        
                        // Lists
                        html = html.replace(/^- (.*$)/gim, '<li class="ml-6 mb-1">$1</li>')
                        html = html.replace(/^\* (.*$)/gim, '<li class="ml-6 mb-1">$1</li>')
                        
                        // Wrap consecutive list items in ul
                        html = html.replace(/(<li.*?<\/li>\n?)+/g, (match) => {
                          return '<ul class="list-disc space-y-2 my-4">' + match + '</ul>'
                        })
                        
                        // Links
                        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#1976D2] hover:underline">$1</a>')
                        
                        // Images
                        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4" style="border-radius: 8px;" />')
                        
                        // Paragraphs
                        const lines = html.split('\n')
                        const processed: string[] = []
                        let inList = false
                        
                        for (let i = 0; i < lines.length; i++) {
                          const line = lines[i].trim()
                          if (!line) {
                            if (inList) {
                              inList = false
                            }
                            continue
                          }
                          
                          if (line.startsWith('<h') || line.startsWith('<blockquote') || line.startsWith('<ul') || line.startsWith('<li') || line.startsWith('<img')) {
                            processed.push(line)
                            if (line.startsWith('<ul')) inList = true
                            if (line.startsWith('</ul>')) inList = false
                          } else if (!inList && !line.startsWith('</')) {
                            processed.push(`<p class="mb-4 text-[#212121]" style="line-height: 1.6;">${line}</p>`)
                          } else {
                            processed.push(line)
                          }
                        }
                        
                        return processed.join('\n')
                      }

                      return (
                        <div className="prose max-w-none">
                          <div 
                            className="prose prose-sm max-w-none"
                  style={{
                              fontSize: '14px',
                              lineHeight: '1.6',
                            }}
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(ticket?.dossier_content || '') }}
                          />
                          
                          {/* Attachments */}
                          {ticket?.dossier_attachments && ticket.dossier_attachments.length > 0 && (
                            <div className="mt-6 space-y-2">
                              {ticket.dossier_attachments.map((attachment, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  {attachment.type === 'image' ? (
                                    <ImageIcon className="h-5 w-5 text-blue-600" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-red-600" />
                                  )}
                                  <span className="text-sm text-[#212121] font-medium flex-1">{attachment.name}</span>
                                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                    <Download className="h-4 w-4 text-gray-500" />
                                  </button>
                      </div>
                              ))}
                    </div>
                          )}
                  </div>
                      )
                    })()}
                  </div>
                </>
              ) : (
                /* Режим редактирования (Edit Mode) */
                <>
                  {/* Toolbar */}
                  <div className="bg-[#F5F5F5] border-b border-gray-200 px-4 py-2 flex items-center gap-2 sticky top-0 z-10">
                    <button
                      onClick={() => {
                        const editor = dossierEditorRef.current
                        if (editor) {
                          const start = editor.selectionStart
                          const end = editor.selectionEnd
                          const selectedText = editor.value.substring(start, end)
                          const newText = `**${selectedText}**`
                          editor.value = editor.value.substring(0, start) + newText + editor.value.substring(end)
                          editor.focus()
                          editor.setSelectionRange(start + 2, start + 2 + selectedText.length)
                        }
                      }}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Bold"
                    >
                      <Bold className="h-5 w-5 text-black" />
                    </button>
                    <button
                      onClick={() => {
                        const editor = dossierEditorRef.current
                        if (editor) {
                          const start = editor.selectionStart
                          const end = editor.selectionEnd
                          const selectedText = editor.value.substring(start, end)
                          const newText = `*${selectedText}*`
                          editor.value = editor.value.substring(0, start) + newText + editor.value.substring(end)
                          editor.focus()
                          editor.setSelectionRange(start + 1, start + 1 + selectedText.length)
                        }
                      }}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Italic"
                    >
                      <Italic className="h-5 w-5 text-black" />
                    </button>
                    <button
                      onClick={() => {
                        const editor = dossierEditorRef.current
                        if (editor) {
                          const start = editor.selectionStart
                          const end = editor.selectionEnd
                          const newText = `## ${editor.value.substring(start, end)}\n`
                          editor.value = editor.value.substring(0, start) + newText + editor.value.substring(end)
                          editor.focus()
                          editor.setSelectionRange(start + 3, start + 3 + (end - start))
                        }
                      }}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Heading"
                    >
                      <Heading className="h-5 w-5 text-black" />
                    </button>
                    <button
                      onClick={() => {
                        const editor = dossierEditorRef.current
                        if (editor) {
                          const start = editor.selectionStart
                          const end = editor.selectionEnd
                          const newText = `> ${editor.value.substring(start, end)}\n`
                          editor.value = editor.value.substring(0, start) + newText + editor.value.substring(end)
                          editor.focus()
                          editor.setSelectionRange(start + 2, start + 2 + (end - start))
                        }
                      }}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Quote"
                    >
                      <Quote className="h-5 w-5 text-black" />
                    </button>
                    <button
                      onClick={() => {
                        const editor = dossierEditorRef.current
                        if (editor) {
                          const start = editor.selectionStart
                          const newText = `- ${editor.value.substring(start)}\n`
                          editor.value = editor.value.substring(0, start) + newText
                          editor.focus()
                          editor.setSelectionRange(start + 2, start + 2)
                        }
                      }}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Bullet List"
                    >
                      <List className="h-5 w-5 text-black" />
                    </button>
                    <button
                      onClick={() => {
                        const editor = dossierEditorRef.current
                        if (editor) {
                          const start = editor.selectionStart
                          const end = editor.selectionEnd
                          const selectedText = editor.value.substring(start, end) || 'link text'
                          const newText = `[${selectedText}](url)`
                          editor.value = editor.value.substring(0, start) + newText + editor.value.substring(end)
                          editor.focus()
                          editor.setSelectionRange(start + newText.length - 5, start + newText.length - 2)
                        }
                      }}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Link"
                    >
                      <LinkIcon className="h-5 w-5 text-black" />
                    </button>
                    <button
                      onClick={() => {
                        const editor = dossierEditorRef.current
                        if (editor) {
                          const start = editor.selectionStart
                          const newText = `![alt text](image-url)\n`
                          editor.value = editor.value.substring(0, start) + newText + editor.value.substring(start)
                          editor.focus()
                          editor.setSelectionRange(start + 2, start + 9)
                        }
                      }}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Image"
                    >
                      <ImageIcon className="h-5 w-5 text-black" />
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button
                      onClick={() => dossierFileInputRef.current?.click()}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Add File"
                    >
                      <Plus className="h-5 w-5 text-black" />
                    </button>
                  </div>

                  {/* Скрытый input для загрузки файлов */}
                  <input
                    ref={dossierFileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files
                      if (files) {
                        const newAttachments = Array.from(files).map((file) => {
                          const fileName = file.name
                          const fileExtension = fileName.split('.').pop()?.toLowerCase() || ''
                          let fileType: 'image' | 'pdf' | 'other' = 'other'
                          
                          if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension)) {
                            fileType = 'image'
                          } else if (fileExtension === 'pdf') {
                            fileType = 'pdf'
                          }
                          
                          // Создаем временный URL для предпросмотра
                          const url = URL.createObjectURL(file)
                          
                          return {
                            name: fileName,
                            url: url,
                            type: fileType,
                          }
                        })
                        
                        setDossierAttachments([...dossierAttachments, ...newAttachments])
                      }
                      // Сброс input для возможности повторной загрузки того же файла
                      if (e.target) {
                        e.target.value = ''
                      }
                    }}
                  />

                  {/* Editor */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <textarea
                      ref={dossierEditorRef}
                      value={dossierContent}
                      onChange={(e) => setDossierContent(e.target.value)}
                      className="w-full h-full min-h-[400px] p-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontSize: '14px',
                        lineHeight: '1.6',
                      }}
                      placeholder="Начните вводить заметки о пользователе..."
                    />
                    
                    {/* Список загруженных файлов */}
                    {dossierAttachments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-[#212121]">Прикрепленные файлы</h4>
                          <button
                            onClick={() => dossierFileInputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#1976D2] hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Добавить файл</span>
                          </button>
                        </div>
                        <div className="space-y-2">
                          {dossierAttachments.map((attachment, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors group"
                            >
                              {attachment.type === 'image' ? (
                                <ImageIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                              ) : attachment.type === 'pdf' ? (
                                <FileText className="h-5 w-5 text-red-600 flex-shrink-0" />
                              ) : (
                                <FileText className="h-5 w-5 text-gray-600 flex-shrink-0" />
                              )}
                              <span className="text-sm text-[#212121] font-medium flex-1 truncate">
                                {attachment.name}
                              </span>
                              <button
                                onClick={() => {
                                  // Освобождаем URL объекта, если это временный URL
                                  if (attachment.url.startsWith('blob:')) {
                                    URL.revokeObjectURL(attachment.url)
                                  }
                                  setDossierAttachments(dossierAttachments.filter((_, i) => i !== idx))
                                }}
                                className="p-1.5 hover:bg-red-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                                title="Удалить файл"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Кнопка добавления файлов, если список пуст */}
                    {dossierAttachments.length === 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => dossierFileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#1976D2] hover:bg-blue-50 rounded-md transition-colors border border-dashed border-gray-300 hover:border-[#1976D2]"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Добавить файл</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action Bar (Sticky Bottom) */}
                  <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 sticky bottom-0">
                    <button
                      onClick={() => {
                        // Освобождаем временные URL объектов при отмене
                        dossierAttachments.forEach((attachment) => {
                          if (attachment.url.startsWith('blob:')) {
                            URL.revokeObjectURL(attachment.url)
                          }
                        })
                        setIsDossierEditMode(false)
                        setDossierContent(ticket?.dossier_content || '')
                        setDossierAttachments(ticket?.dossier_attachments || [])
                      }}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Здесь будет сохранение данных
                        // В реальном приложении здесь будет API вызов для сохранения dossierContent и dossierAttachments
                        setIsDossierEditMode(false)
                        // После сохранения временные URL будут заменены на постоянные
                      }}
                      className="px-4 py-2 bg-[#1976D2] text-white rounded-md hover:bg-[#1565C0] transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </>
              )}
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
                  {ticket.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900 truncate">
                  {ticket.username
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </div>
                <div className="text-xs font-normal text-gray-500 truncate">@{ticket.username}</div>
              </div>
              <button
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
                <div className="grid grid-cols-[40%_60%] gap-2 items-start">
                  <div className="text-[13px] font-normal text-[#757575]">Source:</div>
                  <div className="flex items-center gap-2">
                    {ticket.source && (
                      <>
                        <SourceIcon className={`h-4 w-4 ${getSourceIconColor(ticket.source)}`} />
                        <span className="text-[13px] font-normal text-[#212121]" style={{ wordBreak: 'break-word', fontWeight: 400 }}>
                          {getSourceName(ticket.source, ticket.channel)}
                        </span>
                      </>
                    )}
                    {!ticket.source && (
                      <span className="text-[13px] font-normal text-[#212121]" style={{ fontWeight: 400 }}>Unknown</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-[40%_60%] gap-2 items-start">
                  <div className="text-[13px] font-normal text-[#757575]">Created:</div>
                  <div className="text-[13px] font-normal text-[#212121]" style={{ fontWeight: 400 }}>{formatDate(ticket.createdAt)}</div>
                </div>
                <div className="grid grid-cols-[40%_60%] gap-2 items-start">
                  <div className="text-[13px] font-normal text-[#757575]">Channel:</div>
                  <a
                    href="#"
                    className="text-[13px] font-normal text-[#1976D2] hover:underline inline-flex items-center gap-1"
                    style={{ wordBreak: 'break-word', fontWeight: 400 }}
                  >
                    <span className="truncate">{ticket.channel}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0 text-gray-500" />
                  </a>
                </div>
                <div className="grid grid-cols-[40%_60%] gap-2 items-start">
                  <div className="text-[13px] font-normal text-[#757575]">Category:</div>
                  <button className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded hover:bg-blue-200 transition-colors w-fit">
                    {ticket.category === 'Financial' ? 'IMPORTANT' : ticket.category.toUpperCase()}
                  </button>
                </div>
              </div>
            </div>

            {/* Секция "Source Data" */}
            {ticket.custom_fields && ticket.custom_fields.length > 0 && (
              <div className="mb-6">
                <div className="text-[11px] font-bold text-[#9E9E9E] uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Source Data
                </div>
                <div className="space-y-1">
                  {ticket.custom_fields.map((field, index) => {
                    const handleCopy = () => {
                      navigator.clipboard.writeText(field.value)
                    }

                    const isUrl = field.type === 'link' || field.value.startsWith('http://') || field.value.startsWith('https://')
                    const isEmail = field.type === 'email' || (field.value.includes('@') && field.value.includes('.'))

                    return (
                      <div key={index} className="grid grid-cols-[40%_60%] gap-2 items-start">
                        <div className="text-[13px] font-normal text-[#757575]">{field.label}:</div>
                        <div className="text-[13px] font-normal text-[#212121]" style={{ wordBreak: 'break-word', fontWeight: 400 }}>
                          {isUrl ? (
                            <a
                              href={field.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1976D2] hover:underline inline-flex items-center gap-1"
                            >
                              <span className="truncate" style={{ maxWidth: '140px' }}>
                                {field.displayText || field.value}
                              </span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0 text-gray-500" />
                            </a>
                          ) : isEmail ? (
                            <a
                              href={`mailto:${field.value}`}
                              className="text-[#212121] cursor-pointer hover:underline"
                              style={{ wordBreak: 'break-all' }}
                            >
                              {field.value}
                            </a>
                          ) : (
                            <div className="flex items-center gap-1.5 group/copy relative">
                              <span style={{ wordBreak: 'break-all' }}>{field.value}</span>
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
              <div className="mb-6">
                <div className="text-[11px] font-bold text-[#9E9E9E] uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Bot Information
                </div>
                <div className="space-y-1">
                  {ticket.transactionId && (
                    <div className="grid grid-cols-[40%_60%] gap-2 items-start">
                      <div className="text-[13px] font-normal text-[#757575]">transaction_id:</div>
                      <div className="text-[11px] font-mono text-[#212121] break-all bg-[#F5F5F5] px-2 py-1 rounded">
                        {ticket.transactionId}
                      </div>
                    </div>
                  )}
                  {ticket.environment && (
                    <div className="grid grid-cols-[40%_60%] gap-2 items-start">
                      <div className="text-[13px] font-normal text-[#757575]">environment:</div>
                      <div className="text-[11px] font-mono text-[#212121] bg-[#F5F5F5] px-2 py-1 rounded">
                        {ticket.environment}
                      </div>
                    </div>
                  )}
                  {ticket.errorLogs && (
                    <div className="mt-2">
                      <div className="text-[13px] font-normal text-[#757575] mb-1">error_logs:</div>
                      <div className="text-[11px] font-mono text-[#212121] break-all bg-[#FFEBEE] px-2 py-1 rounded" style={{ wordBreak: 'break-all' }}>
                        {ticket.errorLogs}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Секция "Управление" - Теги */}
            <div className="mb-6">
              <div className="text-[11px] font-bold text-[#9E9E9E] uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                Tags
              </div>
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
              <div className="text-[11px] font-bold text-[#9E9E9E] uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                Assigned To
              </div>
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

