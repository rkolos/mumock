'use client'

import React, { useState } from 'react'
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
    <div className="flex flex-col h-full w-full p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Learned Tickets</h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 mt-6 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-10 pr-4 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          title="Filters"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {filteredTickets.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SUBJECT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SOURCE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DATE
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTickets.map((ticket, index) => {
                    const isExpanded = expandedTickets.has(ticket.id)
                    const isLast = index === filteredTickets.length - 1 && !isExpanded

                    return (
                      <React.Fragment key={ticket.id}>
                        <tr
                          className={`bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors h-14 ${
                            isLast ? 'border-b-0' : ''
                          }`}
                        >
                          <td className="px-6 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleTicketExpanded(ticket.id)}
                                className="flex items-center gap-2"
                              >
                                <ChevronDown
                                  className={`h-4 w-4 text-gray-400 transition-transform ${
                                    isExpanded ? 'transform rotate-180' : ''
                                  }`}
                                />
                                <Ticket className="h-5 w-5 text-purple-500" />
                              </button>
                              <Link
                                href={`/tickets/${ticket.source_ticket_id.replace('ticket-', '')}`}
                                target="_blank"
                                onClick={(e) => e.stopPropagation()}
                                className="font-medium text-gray-900 hover:text-blue-600"
                              >
                                {ticket.source_ticket_display}
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-500">
                            Ticket Source
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-500">
                            {formatRelativeDate(ticket.created_at)}
                          </td>
                          <td className="px-6 py-3 text-sm text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (confirm('Вы уверены, что хотите удалить этот тикет из базы знаний?')) {
                                    onDeleteTicket(ticket.id)
                                  }
                                }}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete Ticket"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* Expanded Content */}
                        {isExpanded && (
                          <tr className="bg-gray-50">
                            <td colSpan={4} className="px-6 py-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Knowledge Content
                                </label>
                                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white font-mono text-sm whitespace-pre-wrap">
                                  {ticket.content}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
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

