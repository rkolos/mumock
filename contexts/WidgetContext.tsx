'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Ticket } from '../data/tickets'
import { WidgetTicketData } from '../types/widget'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface WidgetContextType {
  isWidgetOpen: boolean
  openWidget: () => void
  closeWidget: () => void
  toggleWidget: () => void
  createTicket: (ticketData: WidgetTicketData) => Ticket
  tickets: Ticket[]
  toasts: Toast[]
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
  currentSection: string | null
  setCurrentSection: (section: string | null) => void
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined)

export function WidgetProvider({ children }: { children: ReactNode }) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [currentSection, setCurrentSection] = useState<string | null>(null)

  const openWidget = useCallback(() => {
    setIsWidgetOpen(true)
  }, [])

  const closeWidget = useCallback(() => {
    setIsWidgetOpen(false)
  }, [])

  const toggleWidget = useCallback(() => {
    setIsWidgetOpen(prev => !prev)
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id, message, type }])
    
    // Автоматически удаляем toast через 4 секунды
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  // Преобразует данные из виджета в формат Ticket админки
  const createTicket = useCallback((ticketData: WidgetTicketData): Ticket => {
    const categoryMap: Record<string, string> = {
      'general': 'General',
      'technical_support': 'Technical',
      'billing_finance': 'Financial',
      'partnership': 'General'
    }

    const category = categoryMap[ticketData.category] || 'General'
    
    // Извлекаем username из email
    const email = ticketData.formData?.email || 'user@example.com'
    const username = email.split('@')[0] || 'user'

    // Определяем приоритет на основе категории и данных
    let priority: Ticket['priority'] = 'medium'
    if (ticketData.category === 'technical_support' && ticketData.formData?.severity) {
      const severityMap: Record<string, Ticket['priority']> = {
        'low': 'low',
        'medium': 'medium',
        'high': 'high',
        'blocker': 'critical'
      }
      priority = severityMap[ticketData.formData.severity] || 'medium'
    }

    // Извлекаем динамические поля
    const transactionId = ticketData.formData?.transaction_id || undefined
    const environment = ticketData.formData?.environment || undefined
    const errorLogs = ticketData.formData?.description || undefined

    // Создаем теги на основе категории и контекста
    const tags: string[] = []
    if (ticketData.category === 'billing_finance') tags.push('payment')
    if (ticketData.category === 'technical_support') tags.push('bug')
    if (ticketData.context?.fromAI) tags.push('ai-generated')
    if (priority === 'critical' || priority === 'high') tags.push('urgent')

    const newTicket: Ticket = {
      id: ticketData.id,
      username: username,
      channel: '#support-general',
      category: category,
      assignedUsers: [],
      tags: tags.length > 0 ? tags : ['question'],
      priority: priority,
      status: 'open',
      createdAt: ticketData.timestamp || new Date().toISOString(),
      transactionId,
      environment,
      errorLogs
    }

    setTickets(prev => [newTicket, ...prev])
    return newTicket
  }, [])

  return (
    <WidgetContext.Provider
      value={{
        isWidgetOpen,
        openWidget,
        closeWidget,
        toggleWidget,
        createTicket,
        tickets,
        toasts,
        showToast,
        removeToast,
        currentSection,
        setCurrentSection
      }}
    >
      {children}
    </WidgetContext.Provider>
  )
}

export function useWidget() {
  const context = useContext(WidgetContext)
  if (context === undefined) {
    throw new Error('useWidget must be used within a WidgetProvider')
  }
  return context
}

