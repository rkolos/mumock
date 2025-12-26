'use client'

import { useState } from 'react'
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
  Save,
} from 'lucide-react'
import { mockTickets, Ticket } from '../../data/tickets'
import { mockStatuses } from '../../data/statuses'
import { mockTags } from '../../data/tags'
import { mockCategories } from '../../data/categories'

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
  const [leftPanelWidth, setLeftPanelWidth] = useState(20)
  const [isDragging, setIsDragging] = useState(false)
  const [messageText, setMessageText] = useState('')

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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const startX = e.clientX
    const startWidth = leftPanelWidth

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const containerWidth = window.innerWidth
      const newWidth = ((startWidth / 100) * containerWidth + deltaX) / containerWidth
      const clampedWidth = Math.max(15, Math.min(30, newWidth * 100))
      setLeftPanelWidth(clampedWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const selectedTicket = mockTickets.find((t) => t.id === selectedTicketId) || ticket

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Head Page - Верхняя панель управления */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">
              ticket-{ticket.username.replace('_', '')}-{ticket.id}
            </span>
            <button
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Открыть в Discord"
            >
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <span className="text-sm text-gray-500">{formatDate(ticket.createdAt)}</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Приоритет */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
            <ChevronsUp className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {getPriorityLabel(ticket.priority)}
            </span>
          </div>
          {/* Статус */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getStatusBadgeColor(
              ticket.status
            )}`}
          >
            <div className={`h-2 w-2 rounded-full ${getStatusColor(ticket.status)}`}></div>
            <span className="text-sm font-medium">{getStatusLabel(ticket.status)}</span>
          </div>
          {/* Действия */}
          <button className="px-4 py-1.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors">
            Close Ticket
          </button>
          <button className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 transition-colors">
            Close Ticket info
          </button>
        </div>
      </div>

      {/* Трехпанельная структура */}
      <div className="flex-1 flex overflow-hidden">
        {/* Левая панель - Список тикетов и фильтры */}
        <div
          className="bg-white border-r border-gray-200 flex flex-col overflow-hidden"
          style={{ width: `${leftPanelWidth}%` }}
        >
          {/* Поиск */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded">
                <Settings className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Фильтры */}
          <div className="px-4 py-3 border-b border-gray-200">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
              <Filter className="h-4 w-4" />
              <span>Add Filter</span>
            </button>
            {/* Скрытые фильтры (для мокапа) */}
            <div className="hidden">
              <button>Assigned Users</button>
              <button>Statuses</button>
              <button>Tags</button>
              <button>Categories</button>
            </div>
          </div>

          {/* Список тикетов */}
          <div className="flex-1 overflow-y-auto">
            {mockTickets.map((t) => {
              const isActive = t.id === selectedTicketId
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTicketId(t.id)
                    router.push(`/tickets/${t.id}`)
                  }}
                  className={`
                    flex items-center gap-3 p-3 border-b border-gray-100 cursor-pointer
                    hover:bg-gray-50 transition-colors relative
                    ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
                  `}
                >
                  <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-600">
                      {t.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {t.username}
                      </span>
                      <div
                        className={`h-2 w-2 rounded-full flex-shrink-0 ${getStatusColor(
                          t.status
                        )}`}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 truncate">{t.channel}</div>
                    <div className="text-xs text-gray-400">{formatTime(t.createdAt)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Разделитель */}
        <div
          className={`w-1 bg-gray-200 hover:bg-blue-500 cursor-col-resize flex items-center justify-center transition-colors relative ${
            isDragging ? 'bg-blue-500' : ''
          }`}
          onMouseDown={handleMouseDown}
        >
          <GripVertical
            className={`h-5 w-5 absolute transition-colors ${
              isDragging ? 'text-blue-600' : 'text-gray-400'
            }`}
          />
        </div>

        {/* Центральная панель - Чат */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
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

                  <div className="group flex items-start gap-3 px-4 py-1.5 hover:bg-gray-50 rounded transition-colors">
                    {/* Аватар */}
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      {message.isBot ? (
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">B</span>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-600">
                          {message.author.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Контент сообщения */}
                    <div className="flex-1 min-w-0">
                      {/* Заголовок сообщения */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {message.author}
                        </span>
                        {message.isBot && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            APP
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                        {message.edited && (
                          <span className="text-xs text-gray-400 italic">(edited)</span>
                        )}
                      </div>

                      {/* Reply Preview */}
                      {message.replyTo && (
                        <div className="mb-2 pl-4 border-l-4 border-blue-500 text-sm text-gray-600">
                          <span className="font-medium">{message.replyTo.author}</span>
                          <span className="ml-2">{message.replyTo.content}</span>
                        </div>
                      )}

                      {/* Текст сообщения */}
                      <div className="text-sm text-gray-700 mb-2">{message.content}</div>

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-2 max-w-md">
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
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 mt-1 transition-opacity">
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
                        <button
                          className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                          title="More options"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Ввод сообщения */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-end gap-2">
              <button className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0">
                <Plus className="h-5 w-5 text-gray-500" />
              </button>
              <div className="flex-1 min-h-[44px] max-h-32 overflow-y-auto border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <textarea
                  placeholder={`Message ${ticket.channel}`}
                  className="w-full resize-none border-none outline-none text-sm"
                  rows={1}
                  value={messageText}
                  onChange={handleTextareaChange}
                  style={{ minHeight: '24px', maxHeight: '128px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Правая панель - Метаданные */}
        <div className="w-[30%] bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Блок пользователя */}
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors border border-transparent hover:border-gray-200">
              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-medium text-gray-600">
                  {ticket.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">
                  {ticket.username
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </div>
                <div className="text-sm text-gray-500 truncate">@{ticket.username}</div>
              </div>
            </div>

            {/* Метаданные */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Ticket Metadata</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Created At</div>
                  <div className="text-sm text-gray-900">{formatDate(ticket.createdAt)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Channel</div>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {ticket.channel}
                  </a>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Category</div>
                  <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                    {ticket.category === 'Financial' ? 'IMPORTANT' : ticket.category.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Теги */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {ticket.tags.length > 0 ? (
                  ticket.tags.map((tag) => {
                    const tagData = mockTags.find((t) => t.name === tag)
                    const tagColor = tagData?.color || '#000000'
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-900 text-white text-xs font-medium rounded"
                        style={{ backgroundColor: tagColor !== '#000000' ? tagColor : undefined }}
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                        {tag}
                      </span>
                    )
                  })
                ) : (
                  <span className="text-xs text-gray-400">Нет тегов</span>
                )}
              </div>
            </div>

            {/* Форма редактирования */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Ticket Information</h3>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors">
                  <Save className="h-3 w-3" />
                  <span>Save</span>
                </button>
              </div>
              <div className="space-y-4">
                {/* Tags Select */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Tags</label>
                  <select
                    multiple
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    size={4}
                  >
                    {mockTags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assigned To Select */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Assigned To
                  </label>
                  <select
                    multiple
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    size={4}
                  >
                    {ticket.assignedUsers.map((user, idx) => (
                      <option key={idx} value={user}>
                        {user}
                      </option>
                    ))}
                    <option value="admin@example.com">admin@example.com</option>
                    <option value="tech@example.com">tech@example.com</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

