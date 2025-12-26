'use client'

import { useRouter } from 'next/navigation'
import { RefreshCw, Maximize2, Settings, Plus, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react'
import { mockTickets, Ticket } from '../../data/tickets'
import { useWidget } from '../../contexts/WidgetContext'
import { useEffect, useState } from 'react'

export default function TicketsList() {
  const router = useRouter()
  const { tickets: widgetTickets } = useWidget()
  const [allTickets, setAllTickets] = useState<Ticket[]>(mockTickets)

  // Объединяем статические тикеты с тикетами из виджета
  useEffect(() => {
    if (widgetTickets.length > 0) {
      // Объединяем тикеты из виджета со статическими, избегая дубликатов
      const widgetTicketIds = new Set(widgetTickets.map(t => t.id))
      const staticTickets = mockTickets.filter(t => !widgetTicketIds.has(t.id))
      setAllTickets([...widgetTickets, ...staticTickets])
    } else {
      setAllTickets(mockTickets)
    }
  }, [widgetTickets])

  const handleRowClick = (ticketId: string) => {
    router.push(`/tickets/${ticketId}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
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
        return 'text-green-600'
      case 'in-progress':
        return 'text-blue-600'
      case 'resolved':
        return 'text-green-600'
      case 'closed':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusDot = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return '●'
      case 'in-progress':
        return '●'
      case 'resolved':
        return '●'
      case 'closed':
        return '●'
      default:
        return '●'
    }
  }

  const getPriorityDot = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'critical':
        return '●'
      case 'high':
        return '●'
      case 'medium':
        return '●'
      case 'low':
        return '●'
      default:
        return '●'
    }
  }

  const getPriorityTextColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tickets: <span className="text-gray-500 font-normal">total {allTickets.length}</span>
          </h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Discord Tickets</h2>
            <p className="text-sm text-gray-500">
              Here you can view and manage Discord tickets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors">
              <Maximize2 className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors flex items-center gap-1">
              <Settings className="h-5 w-5 text-gray-600" />
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <button className="px-3 py-1.5 bg-[#2563eb] text-white text-sm rounded-md flex items-center gap-1.5">
            <ArrowDown className="h-3.5 w-3.5" />
            <span>Created At</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors">
            Assigned users
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors">
            Statuses
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors">
            Tags
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors">
            Categories
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Filter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#e2e8f0]">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Assigned Users
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Created At
                    <ArrowDown className="h-3.5 w-3.5" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e2e8f0]">
              {allTickets.map((ticket, index) => (
                <tr
                  key={ticket.id}
                  onClick={() => handleRowClick(ticket.id)}
                  className={`
                    cursor-pointer transition-colors
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    hover:bg-blue-50
                  `}
                >
                  <td className="px-4 py-2.5 text-sm text-gray-900 font-medium">
                    {ticket.username}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">
                    {ticket.channel}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-900">
                    {ticket.category}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">
                    {ticket.assignedUsers.length > 0
                      ? ticket.assignedUsers.join(', ')
                      : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {ticket.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-sm">
                    <span className={`text-xs font-medium ${getPriorityTextColor(ticket.priority)}`}>
                      {getPriorityDot(ticket.priority)} {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-sm">
                    <span className={`text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusDot(ticket.status)} {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">
                    {formatDate(ticket.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

