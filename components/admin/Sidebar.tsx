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
} from 'lucide-react'
import { useWidget } from '../../contexts/WidgetContext'
import { useEffect } from 'react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onLinkClick?: () => void
}

export default function Sidebar({ isOpen, onToggle, onLinkClick }: SidebarProps) {
  const pathname = usePathname()
  const { setCurrentSection } = useWidget()

  // Обновляем текущий раздел при изменении pathname
  useEffect(() => {
    const sectionMap: Record<string, string> = {
      '/': 'tickets',
      '/statuses': 'statuses',
      '/tags': 'tags',
      '/categories': 'categories',
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
      { name: 'Migration', href: '/migration', icon: ArrowLeftRight },
    ],
  }

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
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
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
          <div className="flex items-center gap-3 hover:bg-slate-700/50 rounded-md p-2 transition-colors cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                admin@example.com
              </p>
            </div>
            <button className="p-1 hover:bg-slate-600 rounded">
              <Settings className="h-5 w-5 text-slate-300" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

