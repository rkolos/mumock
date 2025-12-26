'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Bot } from 'lucide-react'
import { mockTickets } from '../../data/tickets'
import { Ticket } from '../../data/tickets'

interface TicketDetailsProps {
  ticketId: string
}

export default function TicketDetails({ ticketId }: TicketDetailsProps) {
  const router = useRouter()
  const ticket = mockTickets.find((t) => t.id === ticketId)

  if (!ticket) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Тикет не найден</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in-progress':
        return 'bg-purple-100 text-purple-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад к списку тикетов</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Детали тикета #{ticket.id}</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Username</label>
                <p className="text-gray-900 font-medium">{ticket.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Channel</label>
                <p className="text-gray-900">{ticket.channel}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-gray-900">{ticket.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-gray-900">{formatDate(ticket.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Fields based on Category */}
          {ticket.category === 'Financial' && ticket.transactionId && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Финансовые данные
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    Transaction ID
                    <Bot className="h-4 w-4 text-blue-600" title="Заполнено ИИ" />
                  </label>
                  <p className="text-gray-900 font-mono bg-gray-50 p-2 rounded border">
                    {ticket.transactionId}
                  </p>
                </div>
              </div>
            </div>
          )}

          {ticket.category === 'Technical' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Технические данные
              </h2>
              <div className="space-y-4">
                {ticket.environment && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      Environment
                      <Bot className="h-4 w-4 text-blue-600" title="Заполнено ИИ" />
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                      {ticket.environment}
                    </p>
                  </div>
                )}
                {ticket.errorLogs && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      Error Logs
                      <Bot className="h-4 w-4 text-blue-600" title="Заполнено ИИ" />
                    </label>
                    <pre className="text-sm text-gray-900 bg-gray-50 p-3 rounded border overflow-x-auto">
                      {ticket.errorLogs}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Статус</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Priority</label>
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded ${getPriorityColor(
                    ticket.priority
                  )}`}
                >
                  {ticket.priority}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Status</label>
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Users */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Назначенные пользователи</h2>
            {ticket.assignedUsers.length > 0 ? (
              <div className="space-y-2">
                {ticket.assignedUsers.map((user, index) => (
                  <div key={index} className="text-sm text-gray-900">
                    {user}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Не назначены</p>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Теги</h2>
            <div className="flex flex-wrap gap-2">
              {ticket.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

