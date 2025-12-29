'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { Macro, MacroCategory, mockMacros } from '../../data/macros'

interface MacrosMenuProps {
  isOpen: boolean
  onClose: () => void
  onSelectMacro: (macroText: string) => void
  position?: { top?: number | string; bottom?: number | string; left?: number | string; right?: number | string }
}

export default function MacrosMenu({
  isOpen,
  onClose,
  onSelectMacro,
  position,
}: MacrosMenuProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredMacros, setFilteredMacros] = useState<MacroCategory[]>(mockMacros)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Автофокус в поле поиска при открытии
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Фильтрация макросов по поисковому запросу
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMacros(mockMacros)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered: MacroCategory[] = []

    mockMacros.forEach((category) => {
      const matchingItems = category.items.filter(
        (macro) =>
          macro.title.toLowerCase().includes(query) ||
          macro.text.toLowerCase().includes(query)
      )

      if (matchingItems.length > 0) {
        filtered.push({
          category: category.category,
          items: matchingItems,
        })
      }
    })

    setFilteredMacros(filtered)
  }, [searchQuery])

  // Закрытие меню при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen, onClose])

  const handleSelectMacro = (macro: Macro) => {
    onSelectMacro(macro.text)
    onClose()
    setSearchQuery('')
  }

  if (!isOpen) return null

  const hasResults = filteredMacros.some((cat) => cat.items.length > 0)

  const menuStyle: React.CSSProperties = {
    width: '320px',
    maxHeight: '400px',
  }

  if (position) {
    if (position.bottom !== undefined) menuStyle.bottom = position.bottom
    if (position.top !== undefined) menuStyle.top = position.top
    if (position.left !== undefined) menuStyle.left = position.left
    if (position.right !== undefined) menuStyle.right = position.right
  }

  return (
    <div
      ref={menuRef}
      className="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-50"
      style={menuStyle}
    >
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search macros..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto max-h-[340px]">
        {hasResults ? (
          <div className="py-1">
            {filteredMacros.map((category) => (
              <div key={category.category}>
                {/* Category Header */}
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {category.category}
                </div>
                {/* Macro Items */}
                {category.items.map((macro) => (
                  <button
                    key={macro.id}
                    onClick={() => handleSelectMacro(macro)}
                    className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-semibold text-sm text-gray-900 mb-0.5">
                      {macro.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {macro.text}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="px-3 py-8 text-center text-sm text-gray-500">
            No macros found
          </div>
        )}
      </div>
    </div>
  )
}

