'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Brain,
} from 'lucide-react'
import { useWidget } from '../../contexts/WidgetContext'
import { useEffect, useState, useRef } from 'react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onLinkClick?: () => void
}

export default function Sidebar({ isOpen, onToggle, onLinkClick }: SidebarProps) {
  const pathname = usePathname()
  const { setCurrentSection } = useWidget()
  const [organizationDropdownOpen, setOrganizationDropdownOpen] = useState(false)

  // Обновляем текущий раздел при изменении pathname
  useEffect(() => {
    const sectionMap: Record<string, string> = {
      '/': 'tickets',
      '/statuses': 'statuses',
      '/tags': 'tags',
      '/categories': 'categories',
      '/knowledge-base': 'knowledge-base',
      '/panels': 'panels',
      '/members': 'members',
      '/roles': 'roles',
      '/migration': 'migration'
    }
    const section = sectionMap[pathname] || null
    setCurrentSection(section)
  }, [pathname, setCurrentSection])

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
      { name: 'Statuses', href: '/statuses', icon: ListChecks },
      { name: 'Tags', href: '/tags', icon: Tag },
    ],
    system: [
      { name: 'Panels', href: '/panels', icon: ShieldCheck },
      { name: 'Members', href: '/members', icon: Users },
      { name: 'Roles', href: '/roles', icon: UserCheck },
      { name: 'Categories', href: '/categories', icon: LayoutGrid },
      { name: 'Knowledge Base', href: '/knowledge-base', icon: Brain },
      { name: 'Migration', href: '/migration', icon: ArrowLeftRight },
    ],
  }

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
                const Icon = item.icon
                const isActive = pathname === item.href
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
                    <span>{item.name}</span>
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
              {navItems.system.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
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
                    <span>{item.name}</span>
                  </Link>
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

