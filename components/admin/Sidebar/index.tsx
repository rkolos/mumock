'use client'

import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import {
  Ticket,
  UserCog,
  ListChecks,
  Tag,
  ShieldCheck,
  Users,
  UserCheck,
  LayoutGrid,
  ArrowLeftRight,
  Settings,
  X,
  User,
  ChevronDown,
  ChevronRight,
  Brain,
  Zap,
  Lightbulb,
  Bug,
  Inbox,
  AtSign,
  Clock,
  UserX,
  Layers,
  Puzzle,
  BarChart2,
  Sliders,
  Building,
  Link as LinkIcon,
} from 'lucide-react'
import { useWidget } from '../../../contexts/WidgetContext'
import { useEffect, useState, useRef } from 'react'
import { mockSuggestions, SuggestionStatus, getStatusColor } from '../../../data/suggestions'
import { mockTickets } from '../../../data/tickets'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onLinkClick?: () => void
}

export default function Sidebar({ isOpen, onToggle, onLinkClick }: SidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setCurrentSection } = useWidget()
  const [organizationDropdownOpen, setOrganizationDropdownOpen] = useState(false)
  
  // Состояние раскрытия меню Suggestions (загружается из localStorage)
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(false)
  
  // Состояние раскрытия меню Tickets (загружается из localStorage)
  const [ticketsExpanded, setTicketsExpanded] = useState(false)

  // Состояние раскрытия групп меню SYSTEM (загружается из localStorage)
  const [systemGroupsExpanded, setSystemGroupsExpanded] = useState<Record<string, boolean>>({
    group_tickets: false,
    group_org: false,
    group_sys: false,
  })
  
  // Подсчет предложений в статусе New
  const newSuggestionsCount = mockSuggestions.filter(s => s.lifecycle.status === 'New').length
  
  // Подсчет тикетов в статусе open (аналог New)
  const newTicketsCount = mockTickets.filter(t => t.status === 'open').length

  // Загрузка состояния раскрытия из localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSuggestions = localStorage.getItem('sidebar-suggestions-expanded')
      if (savedSuggestions === 'true') {
        setSuggestionsExpanded(true)
      }
      const savedTickets = localStorage.getItem('sidebar_tickets_expanded')
      if (savedTickets === 'true') {
        setTicketsExpanded(true)
      }
      const savedSystemState = localStorage.getItem('sidebar_system_state')
      if (savedSystemState) {
        try {
          const parsed = JSON.parse(savedSystemState)
          setSystemGroupsExpanded(parsed)
        } catch (e) {
          // Игнорируем ошибки парсинга
        }
      }
    }
  }, [])

  // Сохранение состояния раскрытия в localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-suggestions-expanded', String(suggestionsExpanded))
    }
  }, [suggestionsExpanded])

  // Сохранение состояния раскрытия Tickets в localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_tickets_expanded', String(ticketsExpanded))
    }
  }, [ticketsExpanded])

  // Сохранение состояния раскрытия групп SYSTEM в localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_system_state', JSON.stringify(systemGroupsExpanded))
    }
  }, [systemGroupsExpanded])

  // Получение активного статуса из URL
  const activeStatusFromUrl = searchParams.get('status')
  
  // Маппинг URL параметров в статусы
  const statusUrlMap: Record<string, SuggestionStatus> = {
    'new': 'New',
    'open': 'Open',
    'planned': 'Planned',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'rejected': 'Rejected',
  }
  
  const activeStatus: SuggestionStatus | null = activeStatusFromUrl 
    ? (statusUrlMap[activeStatusFromUrl] || null)
    : null

  // Список статусов для подменю
  const statusOptions: { status: SuggestionStatus; label: string; urlParam: string }[] = [
    { status: 'New', label: 'New', urlParam: 'new' },
    { status: 'Open', label: 'Open', urlParam: 'open' },
    { status: 'Planned', label: 'Planned', urlParam: 'planned' },
    { status: 'In Progress', label: 'In Progress', urlParam: 'in-progress' },
    { status: 'Completed', label: 'Completed', urlParam: 'completed' },
    { status: 'Rejected', label: 'Rejected', urlParam: 'rejected' },
  ]

  // Обработчик клика по статусу в подменю
  const handleStatusClick = (urlParam: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/suggestions?status=${urlParam}`)
    handleLinkClick(e)
  }

  // Обработчик клика по родительскому пункту Suggestions
  const handleSuggestionsMainClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push('/suggestions')
    handleLinkClick(e)
  }

  // Обработчик клика по стрелке (только раскрытие/сворачивание)
  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSuggestionsExpanded(!suggestionsExpanded)
  }

  // Получение активного Smart View из URL
  const activeViewFromUrl = searchParams.get('view')
  
  // Список Smart Views для подменю Tickets
  const smartViewOptions: { view: string; label: string; urlParam: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { view: 'your_inbox', label: 'Your Inbox', urlParam: 'your_inbox', icon: Inbox },
    { view: 'mentions', label: 'Mentions', urlParam: 'mentions', icon: AtSign },
    { view: 'awaiting_reply', label: 'Awaiting Reply', urlParam: 'awaiting_reply', icon: Clock },
    { view: 'unassigned', label: 'Unassigned', urlParam: 'unassigned', icon: UserX },
    { view: 'all_tickets', label: 'All Tickets', urlParam: 'all_tickets', icon: Layers },
  ]

  // Обработчик клика по Smart View в подменю Tickets
  const handleSmartViewClick = (urlParam: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (urlParam === 'all_tickets') {
      // Для "All Tickets" очищаем параметр view
      router.push('/')
    } else {
      router.push(`/?view=${urlParam}`)
    }
    handleLinkClick(e)
  }

  // Обработчик клика по родительскому пункту Tickets
  const handleTicketsMainClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push('/')
    handleLinkClick(e)
  }

  // Обработчик клика по стрелке Tickets (только раскрытие/сворачивание)
  const handleTicketsToggleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setTicketsExpanded(!ticketsExpanded)
  }

  // Обновляем текущий раздел при изменении pathname
  useEffect(() => {
    const sectionMap: Record<string, string> = {
      '/': 'tickets',
      '/statuses': 'statuses',
      '/tags': 'tags',
      '/suggestions': 'suggestions',
      '/analytics': 'analytics',
      '/bugs': 'bugs',
      '/categories': 'categories',
      '/knowledge-base': 'knowledge-base',
      '/panels': 'panels',
      '/members': 'members',
      '/roles': 'roles',
      '/integrations': 'integrations',
      '/migration': 'migration',
      '/macros': 'macros'
    }
    const section = sectionMap[pathname] || null
    setCurrentSection(section)
  }, [pathname, setCurrentSection])

  // Автоматическое раскрытие активной группы SYSTEM
  useEffect(() => {
    const activeGroup = systemMenuGroups.find(group => 
      group.items.some(item => pathname === item.href || pathname.startsWith(item.href + '/'))
    )
    if (activeGroup) {
      setSystemGroupsExpanded(prev => ({ ...prev, [activeGroup.id]: true }))
    }
  }, [pathname])

  const handleLinkClick = (e: React.MouseEvent) => {
    // Закрываем сайдбар на мобильных при клике на ссылку
    // На desktop sidebar всегда виден через CSS (lg:translate-x-0)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onToggle()
    }
    onLinkClick?.()
  }

  const organizationDropdownRef = useRef<HTMLDivElement>(null)

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        organizationDropdownRef.current &&
        !organizationDropdownRef.current.contains(event.target as Node)
      ) {
        setOrganizationDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navItems = {
    main: [
      { name: 'Tickets', href: '/', icon: UserCog },
      { name: 'Suggestions', href: '/suggestions', icon: Lightbulb },
      { name: 'Analytics', href: '/analytics', icon: BarChart2 },
      { name: 'Bugs', href: '/bugs', icon: Bug },
    ],
  }

  const systemMenuGroups = [
    {
      label: "Ticket Configuration",
      icon: Sliders,
      id: "group_tickets",
      items: [
        { name: "Categories", href: "/categories", icon: LayoutGrid },
        { name: "Statuses", href: "/statuses", icon: ListChecks },
        { name: "Tags", href: "/tags", icon: Tag },
        { name: "Macros", href: "/macros", icon: Zap },
      ]
    },
    {
      label: "Organization",
      icon: Building,
      id: "group_org",
      items: [
        { name: "Members", href: "/members", icon: Users },
        { name: "Roles", href: "/roles", icon: UserCheck },
        { name: "Panels", href: "/panels", icon: ShieldCheck },
        { name: "Knowledge Base", href: "/knowledge-base", icon: Brain },
      ]
    },
    {
      label: "System & Connections",
      icon: LinkIcon,
      id: "group_sys",
      items: [
        { name: "Integrations", href: "/integrations", icon: Puzzle },
        { name: "Migration", href: "/migration", icon: ArrowLeftRight },
      ]
    }
  ]

  const organizations = ['TEST', 'Production', 'Development']
  const [currentOrganization] = useState('TEST')

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[260px] bg-[#1e293b] text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">NinjaTickets</span>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 hover:bg-slate-700 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Organization Switcher */}
          <div className="relative" ref={organizationDropdownRef}>
            <button
              onClick={() => setOrganizationDropdownOpen(!organizationDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-md transition-colors text-left"
            >
              <div className="flex flex-col">
                <span className="text-xs text-slate-400">Organization</span>
                <span className="text-sm font-medium text-white">{currentOrganization}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${organizationDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {organizationDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10">
                {organizations.map((org) => (
                  <button
                    key={org}
                    onClick={() => {
                      setOrganizationDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-700 first:rounded-t-md last:rounded-b-md ${
                      org === currentOrganization ? 'bg-slate-700 text-white' : 'text-slate-300'
                    }`}
                  >
                    {org}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {/* Main section */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2 px-2">
              Main
            </p>
            <div className="space-y-1">
              {navItems.main.map((item) => {
                // Специальная обработка для Tickets - раскрывающееся меню
                if (item.href === '/') {
                  const Icon = item.icon
                  const isTicketsPage = pathname === '/' || pathname.startsWith('/tickets/')
                  const isParentActive = isTicketsPage && !activeViewFromUrl
                  const showTicketsCount = newTicketsCount > 0
                  
                  return (
                    <div key={item.href} className="space-y-1">
                      {/* Родительский элемент Tickets */}
                      <div className={`
                        flex items-center rounded-md
                        transition-colors
                        ${
                          isParentActive
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }
                      `}>
                        {/* Main Area (клик - переход на /) */}
                        <button
                          onClick={handleTicketsMainClick}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-md flex-1
                            transition-colors text-left
                          `}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="flex-1">{item.name}</span>
                          {showTicketsCount && (
                            <span className={`
                              px-2 py-0.5 text-xs font-semibold rounded-full
                              ${
                                isParentActive
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-slate-600 text-white'
                              }
                            `}>
                              {newTicketsCount}
                            </span>
                          )}
                        </button>
                        
                        {/* Toggle Area (клик - только раскрытие/сворачивание) */}
                        <button
                          onClick={handleTicketsToggleClick}
                          className="flex items-center justify-center p-2 rounded-md hover:bg-slate-700 transition-colors min-w-[24px] min-h-[24px]"
                          aria-label={ticketsExpanded ? 'Свернуть меню' : 'Развернуть меню'}
                        >
                          {ticketsExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Подменю Smart Views */}
                      {ticketsExpanded && (
                        <div className="ml-4 space-y-1">
                          {smartViewOptions.map((viewOption) => {
                            const isViewActive = activeViewFromUrl === viewOption.urlParam
                            const IconComponent = viewOption.icon
                            
                            return (
                              <button
                                key={viewOption.view}
                                onClick={(e) => handleSmartViewClick(viewOption.urlParam, e)}
                                className={`
                                  w-full flex items-center gap-2 px-3 py-2 rounded-md
                                  transition-colors text-left
                                  ${
                                    isViewActive
                                      ? 'bg-blue-600 text-white'
                                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                  }
                                `}
                              >
                                {/* Иконка Smart View */}
                                <IconComponent className={`h-4 w-4 flex-shrink-0 ${
                                  isViewActive
                                    ? 'text-white'
                                    : 'text-slate-400'
                                }`} />
                                <span className="text-sm">{viewOption.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                }
                
                // Специальная обработка для Suggestions - раскрывающееся меню
                if (item.href === '/suggestions') {
                  const Icon = item.icon
                  const isSuggestionsPage = pathname === '/suggestions' || pathname.startsWith('/suggestions/')
                  const isParentActive = isSuggestionsPage && !activeStatus
                  const showSuggestionsCount = newSuggestionsCount > 0
                  
                  return (
                    <div key={item.href} className="space-y-1">
                      {/* Родительский элемент Suggestions */}
                      <div className={`
                        flex items-center rounded-md
                        transition-colors
                        ${
                          isParentActive
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }
                      `}>
                        {/* Main Area (клик - переход на /suggestions) */}
                        <button
                          onClick={handleSuggestionsMainClick}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-md flex-1
                            transition-colors text-left
                          `}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="flex-1">{item.name}</span>
                          {showSuggestionsCount && (
                            <span className={`
                              px-2 py-0.5 text-xs font-semibold rounded-full
                              ${
                                isParentActive
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-slate-600 text-white'
                              }
                            `}>
                              {newSuggestionsCount}
                            </span>
                          )}
                        </button>
                        
                        {/* Toggle Area (клик - только раскрытие/сворачивание) */}
                        <button
                          onClick={handleToggleClick}
                          className="flex items-center justify-center p-2 rounded-md hover:bg-slate-700 transition-colors min-w-[24px] min-h-[24px]"
                          aria-label={suggestionsExpanded ? 'Свернуть меню' : 'Развернуть меню'}
                        >
                          {suggestionsExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Подменю статусов */}
                      {suggestionsExpanded && (
                        <div className="ml-4 space-y-1">
                          {statusOptions.map((statusOption) => {
                            const statusColor = getStatusColor(statusOption.status)
                            const isStatusActive = activeStatus === statusOption.status
                            
                            return (
                              <button
                                key={statusOption.status}
                                onClick={(e) => handleStatusClick(statusOption.urlParam, e)}
                                className={`
                                  w-full flex items-center gap-2 px-3 py-2 rounded-md
                                  transition-colors text-left
                                  ${
                                    isStatusActive
                                      ? 'bg-blue-600 text-white'
                                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                  }
                                `}
                              >
                                {/* Цветная точка */}
                                <div className={`w-2 h-2 rounded-full ${statusColor} flex-shrink-0`} />
                                <span className="text-sm">{statusOption.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                }
                
                // Обычная обработка для остальных пунктов
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-md
                      transition-colors
                      ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* System section */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2 px-2">
              System
            </p>
            <div className="space-y-1">
              {systemMenuGroups.map((group) => {
                const GroupIcon = group.icon
                const isGroupExpanded = systemGroupsExpanded[group.id] || false
                
                // Проверяем, активен ли какой-либо пункт в группе
                const hasActiveItem = group.items.some(item => 
                  pathname === item.href || pathname.startsWith(item.href + '/')
                )

                // Обработчик клика по стрелке (только раскрытие/сворачивание)
                const handleGroupToggleClick = (e: React.MouseEvent) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSystemGroupsExpanded(prev => ({
                    ...prev,
                    [group.id]: !prev[group.id]
                  }))
                }

                return (
                  <div key={group.id} className="space-y-1">
                    {/* Родительский элемент группы */}
                    <div className={`
                      flex items-center rounded-md
                      transition-colors
                      ${
                        hasActiveItem && !isGroupExpanded
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }
                    `}>
                      {/* Main Area (клик - раскрытие/сворачивание) */}
                      <button
                        onClick={handleGroupToggleClick}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-md flex-1
                          transition-colors text-left
                        `}
                      >
                        <GroupIcon className="h-5 w-5" />
                        <span className="flex-1">{group.label}</span>
                      </button>
                      
                      {/* Toggle Area (клик - только раскрытие/сворачивание) */}
                      <button
                        onClick={handleGroupToggleClick}
                        className="flex items-center justify-center p-2 rounded-md hover:bg-slate-700 transition-colors min-w-[24px] min-h-[24px]"
                        aria-label={isGroupExpanded ? 'Свернуть меню' : 'Развернуть меню'}
                      >
                        {isGroupExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Подменю пунктов группы */}
                    {isGroupExpanded && (
                      <div className="ml-4 space-y-1">
                        {group.items.map((item) => {
                          const ItemIcon = item.icon
                          const isItemActive = pathname === item.href || pathname.startsWith(item.href + '/')
                          
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={handleLinkClick}
                              className={`
                                w-full flex items-center gap-2 px-3 py-2 rounded-md
                                transition-colors text-left
                                ${
                                  isItemActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }
                              `}
                            >
                              <ItemIcon className={`h-4 w-4 flex-shrink-0 ${
                                isItemActive
                                  ? 'text-white'
                                  : 'text-slate-400'
                              }`} />
                              <span className="text-sm">{item.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-slate-700">
          <Link
            href="/profile"
            onClick={handleLinkClick}
            className="flex items-center gap-3 hover:bg-slate-700/50 rounded-md p-2 transition-colors cursor-pointer"
          >
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-slate-700"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                v.panov@dt.team
              </p>
            </div>
            <div className="p-1">
              <Settings className="h-5 w-5 text-slate-300" />
            </div>
          </Link>
        </div>
      </aside>
    </>
  )
}

