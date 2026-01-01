'use client'

import { useState } from 'react'
import { Ticket, ChevronDown, Trash2, Search, Filter } from 'lucide-react'
import { KnowledgeTicket } from '../../../data/knowledgeBase'
import Link from 'next/link'

interface TicketsViewProps {
  tickets: KnowledgeTicket[]
  onDeleteTicket: (id: string) => void
}

export default function TicketsView({ tickets, onDeleteTicket }: TicketsViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedTickets, setExpandedTickets] = useState<Set<string>>(new Set())

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

  // Переключение развертывания тикета
  const toggleTicketExpanded = (ticketId: string) => {
    setExpandedTickets((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(ticketId)) {
        newSet.delete(ticketId)
      } else {
        newSet.add(ticketId)
      }
      return newSet
    })
  }

  // Фильтрация тикетов
  const filteredTickets = tickets.filter((ticket) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      ticket.content.toLowerCase().includes(query) ||
      ticket.source_ticket_display.toLowerCase().includes(query) ||
      ticket.source_ticket_id.toLowerCase().includes(query)
    )
  })

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="p-4 border-b border-[#e2e8f0] bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Learned Tickets</h2>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
              title="Filters"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets"
            className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#F5F7FB] p-6">
        {filteredTickets.length > 0 ? (
          <div className="space-y-2">
            {filteredTickets.map((ticket) => {
              const isExpanded = expandedTickets.has(ticket.id)

              return (
                <div
                  key={ticket.id}
                  className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden"
                >
                  {/* Header */}
                  <div className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <button
                      onClick={() => toggleTicketExpanded(ticket.id)}
                      className="flex items-center gap-3 flex-1 min-w-0 text-left"
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <Ticket className="h-5 w-5 text-blue-600" />
                      </div>
                      {/* Title and Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/tickets/${ticket.source_ticket_id.replace('ticket-', '')}`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            {ticket.source_ticket_display}
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            Ticket Source • {formatRelativeDate(ticket.created_at)}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${
                          isExpanded ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    {/* Action Button */}
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('Вы уверены, что хотите удалить этот тикет из базы знаний?')) {
                            onDeleteTicket(ticket.id)
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Ticket"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 py-4 border-t border-[#e2e8f0] bg-gray-50">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Knowledge Content
                        </label>
                        <div className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-white font-mono text-sm whitespace-pre-wrap">
                          {ticket.content}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-12 text-center">
            <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No tickets found' : 'Нет тикетов в базе знаний'}
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Тикеты будут автоматически добавлены в базу знаний после решения'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

