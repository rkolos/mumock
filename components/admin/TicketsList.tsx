'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RefreshCw, ArrowDown, Filter } from 'lucide-react'
import { mockTickets, Ticket } from '../../data/tickets'
import { useWidget } from '../../contexts/WidgetContext'
import TicketsFilterChips from './TicketsFilterChips'
import TicketsFilterDropdown from './TicketsFilterDropdown'
import QuickTimeFilters from './QuickTimeFilters'

export default function TicketsList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tickets: widgetTickets } = useWidget()
  const [allTickets, setAllTickets] = useState<Ticket[]>(mockTickets)
  
  // Состояния фильтров
  const [sourceFilter, setSourceFilter] = useState<string | null>(null)
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [priorityFilters, setPriorityFilters] = useState<string[]>([])
  const [assignedUsersFilters, setAssignedUsersFilters] = useState<string[]>([])
  const [tagsFilters, setTagsFilters] = useState<string[]>([])
  const [categoriesFilters, setCategoriesFilters] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<{ from: string; to: string } | null>(null)
  const [waitingTimeFilter, setWaitingTimeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const filterMenuRef = useRef<HTMLDivElement>(null)
  
  // Флаг для предотвращения зацикливания между URL и фильтрами
  const isSyncingFromUrl = useRef(false)

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

  // Функция подсчета тикетов для каждого фильтра времени ожидания
  const getWaitingTimeCounts = () => {
    const openTickets = allTickets.filter(t => t.status !== 'closed')
    
    return {
      all: openTickets.length,
      '1h': openTickets.filter(t => t.waitTimeHours !== undefined && t.waitTimeHours >= 1).length,
      '6h': openTickets.filter(t => t.waitTimeHours !== undefined && t.waitTimeHours >= 6).length,
      '12h': openTickets.filter(t => t.waitTimeHours !== undefined && t.waitTimeHours >= 12).length,
      '24h': openTickets.filter(t => t.waitTimeHours !== undefined && t.waitTimeHours >= 24).length,
    }
  }

  // Функция фильтрации тикетов
  const getFilteredTickets = (): Ticket[] => {
    let filtered = allTickets
    
    // Source filter
    if (sourceFilter) {
      filtered = filtered.filter(t => t.source === sourceFilter)
    }
    
    // Status filters
    if (statusFilters.length > 0) {
      filtered = filtered.filter(t => statusFilters.includes(t.status))
    }
    
    // Priority filters
    if (priorityFilters.length > 0) {
      filtered = filtered.filter(t => priorityFilters.includes(t.priority))
    }
    
    // Assigned Users filters
    if (assignedUsersFilters.length > 0) {
      filtered = filtered.filter(t => 
        t.assignedUsers.some(user => assignedUsersFilters.includes(user))
      )
    }
    
    // Tags filters
    if (tagsFilters.length > 0) {
      filtered = filtered.filter(t => 
        tagsFilters.some(tag => t.tags.includes(tag))
      )
    }
    
    // Categories filters
    if (categoriesFilters.length > 0) {
      filtered = filtered.filter(t => categoriesFilters.includes(t.category))
    }
    
    // Date filter
    if (dateFilter) {
      const fromDate = new Date(dateFilter.from).getTime()
      const toDate = new Date(dateFilter.to).getTime()
      filtered = filtered.filter(t => {
        const createdDate = new Date(t.createdAt).getTime()
        return createdDate >= fromDate && createdDate <= toDate
      })
    }
    
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.username.toLowerCase().includes(query) ||
        t.channel.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.aiTitle?.toLowerCase().includes(query)
      )
    }
    
    // Waiting Time filter (только для не закрытых тикетов)
    if (waitingTimeFilter && waitingTimeFilter !== 'all') {
      const thresholdMap: Record<string, number> = {
        '1h': 1,
        '6h': 6,
        '12h': 12,
        '24h': 24,
      }
      const threshold = thresholdMap[waitingTimeFilter]
      if (threshold !== undefined) {
        filtered = filtered.filter(t => {
          // Фильтруем только открытые тикеты
          if (t.status === 'closed') {
            return false
          }
          // Проверяем waitTimeHours
          if (t.waitTimeHours !== undefined) {
            return t.waitTimeHours >= threshold
          }
          return false
        })
      }
    }
    
    return filtered
  }

  const filteredTickets = getFilteredTickets()

  // Синхронизация URL параметров с фильтрами при изменении URL
  useEffect(() => {
    const sourceParam = searchParams.get('source')
    const statusParam = searchParams.get('status')
    const priorityParam = searchParams.get('priority')
    const assignedUsersParam = searchParams.get('assignedUsers')
    const tagsParam = searchParams.get('tags')
    const categoriesParam = searchParams.get('categories')
    const dateFromParam = searchParams.get('dateFrom')
    const dateToParam = searchParams.get('dateTo')
    const waitingTimeParam = searchParams.get('waiting_time_gte')
    
    isSyncingFromUrl.current = true
    
    // Source
    if (sourceParam) {
      if (sourceFilter !== sourceParam) {
        setSourceFilter(sourceParam)
      }
    } else {
      if (sourceFilter !== null) {
        setSourceFilter(null)
      }
    }
    
    // Status
    if (statusParam) {
      const statuses = statusParam.split(',').filter(s => s)
      if (JSON.stringify(statuses.sort()) !== JSON.stringify(statusFilters.sort())) {
        setStatusFilters(statuses)
      }
    } else {
      if (statusFilters.length > 0) {
        setStatusFilters([])
      }
    }
    
    // Priority
    if (priorityParam) {
      const priorities = priorityParam.split(',').filter(p => p)
      if (JSON.stringify(priorities.sort()) !== JSON.stringify(priorityFilters.sort())) {
        setPriorityFilters(priorities)
      }
    } else {
      if (priorityFilters.length > 0) {
        setPriorityFilters([])
      }
    }
    
    // Assigned Users
    if (assignedUsersParam) {
      const users = assignedUsersParam.split(',').filter(u => u)
      if (JSON.stringify(users.sort()) !== JSON.stringify(assignedUsersFilters.sort())) {
        setAssignedUsersFilters(users)
      }
    } else {
      if (assignedUsersFilters.length > 0) {
        setAssignedUsersFilters([])
      }
    }
    
    // Tags
    if (tagsParam) {
      const tags = tagsParam.split(',').filter(t => t)
      if (JSON.stringify(tags.sort()) !== JSON.stringify(tagsFilters.sort())) {
        setTagsFilters(tags)
      }
    } else {
      if (tagsFilters.length > 0) {
        setTagsFilters([])
      }
    }
    
    // Categories
    if (categoriesParam) {
      const categories = categoriesParam.split(',').filter(c => c)
      if (JSON.stringify(categories.sort()) !== JSON.stringify(categoriesFilters.sort())) {
        setCategoriesFilters(categories)
      }
    } else {
      if (categoriesFilters.length > 0) {
        setCategoriesFilters([])
      }
    }
    
    // Date
    if (dateFromParam && dateToParam) {
      if (!dateFilter || dateFilter.from !== dateFromParam || dateFilter.to !== dateToParam) {
        setDateFilter({ from: dateFromParam, to: dateToParam })
      }
    } else {
      if (dateFilter !== null) {
        setDateFilter(null)
      }
    }
    
    // Waiting Time
    if (waitingTimeParam) {
      const validValues = ['all', '1h', '6h', '12h', '24h']
      if (validValues.includes(waitingTimeParam) && waitingTimeFilter !== waitingTimeParam) {
        setWaitingTimeFilter(waitingTimeParam)
      }
    } else {
      if (waitingTimeFilter !== 'all') {
        setWaitingTimeFilter('all')
      }
    }
    
    // Сбрасываем флаг после небольшой задержки
    setTimeout(() => {
      isSyncingFromUrl.current = false
    }, 100)
  }, [searchParams])

  // Синхронизация фильтров с URL (когда фильтр меняется не через URL)
  useEffect(() => {
    // Пропускаем, если синхронизация идет из URL
    if (isSyncingFromUrl.current) {
      return
    }
    
    // Проверяем, что мы на клиенте
    if (typeof window === 'undefined') {
      return
    }
    
    const newUrl = new URL(window.location.href)
    
    // Source
    if (sourceFilter) {
      newUrl.searchParams.set('source', sourceFilter)
    } else {
      newUrl.searchParams.delete('source')
    }
    
    // Status
    if (statusFilters.length > 0) {
      newUrl.searchParams.set('status', statusFilters.join(','))
    } else {
      newUrl.searchParams.delete('status')
    }
    
    // Priority
    if (priorityFilters.length > 0) {
      newUrl.searchParams.set('priority', priorityFilters.join(','))
    } else {
      newUrl.searchParams.delete('priority')
    }
    
    // Assigned Users
    if (assignedUsersFilters.length > 0) {
      newUrl.searchParams.set('assignedUsers', assignedUsersFilters.join(','))
    } else {
      newUrl.searchParams.delete('assignedUsers')
    }
    
    // Tags
    if (tagsFilters.length > 0) {
      newUrl.searchParams.set('tags', tagsFilters.join(','))
    } else {
      newUrl.searchParams.delete('tags')
    }
    
    // Categories
    if (categoriesFilters.length > 0) {
      newUrl.searchParams.set('categories', categoriesFilters.join(','))
    } else {
      newUrl.searchParams.delete('categories')
    }
    
    // Date
    if (dateFilter) {
      newUrl.searchParams.set('dateFrom', dateFilter.from)
      newUrl.searchParams.set('dateTo', dateFilter.to)
    } else {
      newUrl.searchParams.delete('dateFrom')
      newUrl.searchParams.delete('dateTo')
    }
    
    // Waiting Time
    if (waitingTimeFilter && waitingTimeFilter !== 'all') {
      newUrl.searchParams.set('waiting_time_gte', waitingTimeFilter)
    } else {
      newUrl.searchParams.delete('waiting_time_gte')
    }
    
    router.replace(newUrl.pathname + newUrl.search, { scroll: false })
  }, [sourceFilter, statusFilters, priorityFilters, assignedUsersFilters, tagsFilters, categoriesFilters, dateFilter, waitingTimeFilter, router])

  // Обработчики удаления фильтров
  const handleRemoveSource = () => {
    setSourceFilter(null)
    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('source')
      router.replace(newUrl.pathname + newUrl.search, { scroll: false })
    }
  }

  const handleRemoveStatus = () => {
    setStatusFilters([])
    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('status')
      router.replace(newUrl.pathname + newUrl.search, { scroll: false })
    }
  }

  const handleRemovePriority = () => {
    setPriorityFilters([])
    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('priority')
      router.replace(newUrl.pathname + newUrl.search, { scroll: false })
    }
  }

  const handleRemoveAssignedUsers = () => {
    setAssignedUsersFilters([])
    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('assignedUsers')
      router.replace(newUrl.pathname + newUrl.search, { scroll: false })
    }
  }

  const handleRemoveTags = () => {
    setTagsFilters([])
    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('tags')
      router.replace(newUrl.pathname + newUrl.search, { scroll: false })
    }
  }

  const handleRemoveCategories = () => {
    setCategoriesFilters([])
    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('categories')
      router.replace(newUrl.pathname + newUrl.search, { scroll: false })
    }
  }

  const handleRemoveDate = () => {
    setDateFilter(null)
    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('dateFrom')
      newUrl.searchParams.delete('dateTo')
      router.replace(newUrl.pathname + newUrl.search, { scroll: false })
    }
  }

  const handleClearAll = () => {
    setSourceFilter(null)
    setStatusFilters([])
    setPriorityFilters([])
    setAssignedUsersFilters([])
    setTagsFilters([])
    setCategoriesFilters([])
    setDateFilter(null)
    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('source')
      newUrl.searchParams.delete('status')
      newUrl.searchParams.delete('priority')
      newUrl.searchParams.delete('assignedUsers')
      newUrl.searchParams.delete('tags')
      newUrl.searchParams.delete('categories')
      newUrl.searchParams.delete('dateFrom')
      newUrl.searchParams.delete('dateTo')
      router.replace(newUrl.pathname + newUrl.search, { scroll: false })
    }
  }

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
            <h2 className="text-lg font-bold text-gray-900">Tickets</h2>
            <p className="text-sm text-gray-500">
              Here you can view and manage tickets
            </p>
          </div>
        </div>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search tickets"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-[#e2e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 relative" ref={filterMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setFilterMenuOpen(!filterMenuOpen)
                }}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1.5"
              >
                <Filter className="h-3.5 w-3.5" />
                <span>Add Filter</span>
              </button>
              
              {/* Filter Dropdown */}
              <TicketsFilterDropdown
                isOpen={filterMenuOpen}
                onClose={() => setFilterMenuOpen(false)}
                sourceFilter={sourceFilter}
                statusFilters={statusFilters}
                priorityFilters={priorityFilters}
                assignedUsersFilters={assignedUsersFilters}
                tagsFilters={tagsFilters}
                categoriesFilters={categoriesFilters}
                dateFilter={dateFilter}
                onSourceChange={setSourceFilter}
                onStatusChange={setStatusFilters}
                onPriorityChange={setPriorityFilters}
                onAssignedUsersChange={setAssignedUsersFilters}
                onTagsChange={setTagsFilters}
                onCategoriesChange={setCategoriesFilters}
                onDateChange={setDateFilter}
              />
            </div>

            {/* Active Filters Chips */}
            <TicketsFilterChips
              sourceFilter={sourceFilter}
              statusFilters={statusFilters}
              priorityFilters={priorityFilters}
              assignedUsersFilters={assignedUsersFilters}
              tagsFilters={tagsFilters}
              categoriesFilters={categoriesFilters}
              dateFilter={dateFilter}
              onRemoveSource={handleRemoveSource}
              onRemoveStatus={handleRemoveStatus}
              onRemovePriority={handleRemovePriority}
              onRemoveAssignedUsers={handleRemoveAssignedUsers}
              onRemoveTags={handleRemoveTags}
              onRemoveCategories={handleRemoveCategories}
              onRemoveDate={handleRemoveDate}
              onClearAll={handleClearAll}
            />
            
            {/* Quick Time Filters */}
            <div className="ml-auto">
              <QuickTimeFilters
                value={waitingTimeFilter}
                onChange={setWaitingTimeFilter}
                counts={getWaitingTimeCounts()}
              />
            </div>
          </div>
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
              {filteredTickets.map((ticket, index) => (
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
