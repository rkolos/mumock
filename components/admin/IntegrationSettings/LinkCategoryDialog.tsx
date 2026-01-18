'use client'

import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'
import { Category, SourceType } from '../../../data/categories'
import { mockCategories } from '../../../data/categories'

interface LinkCategoryDialogProps {
  isOpen: boolean
  onClose: () => void
  onLink: (categoryIds: string[]) => void
  sourceType: SourceType
  currentCategoryIds: string[]
}

export default function LinkCategoryDialog({
  isOpen,
  onClose,
  onLink,
  sourceType,
  currentCategoryIds,
}: LinkCategoryDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Получаем категории, которые еще не привязаны к этой интеграции
  // Показываем категории, которые либо имеют другой source_type, либо еще не добавлены в currentCategoryIds
  const availableCategories = mockCategories.filter(
    (cat) => !currentCategoryIds.includes(cat.id)
  )

  // Фильтруем по поисковому запросу
  const filteredCategories = availableCategories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
      setSelectedIds(new Set())
    }
  }, [isOpen])

  const handleToggleSelection = (categoryId: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId)
    } else {
      newSelected.add(categoryId)
    }
    setSelectedIds(newSelected)
  }

  const handleLink = () => {
    if (selectedIds.size > 0) {
      onLink(Array.from(selectedIds))
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[600px] mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Link Categories</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 pr-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {availableCategories.length === 0
                ? 'All categories are already linked'
                : 'No categories found'}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCategories.map((category) => {
                const isSelected = selectedIds.has(category.id)
                const isAlreadyLinked = category.source_type === sourceType

                return (
                  <label
                    key={category.id}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    } ${isAlreadyLinked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => !isAlreadyLinked && handleToggleSelection(category.id)}
                      disabled={isAlreadyLinked}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {category.categoryName}
                      </div>
                      {category.description && (
                        <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                      )}
                      {isAlreadyLinked && (
                        <div className="text-xs text-blue-600 mt-1">Already linked</div>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedIds.size > 0 && `${selectedIds.size} selected`}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLink}
              disabled={selectedIds.size === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Link {selectedIds.size > 0 && `(${selectedIds.size})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
