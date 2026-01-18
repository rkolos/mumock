'use client'

import { Settings, Trash2, Search } from 'lucide-react'
import { useState } from 'react'
import { Category, SourceType } from '../../../data/categories'
import { getCategoryConfigForIntegration } from './CategorySettingsDialog'

interface CategoriesTableProps {
  categories: Category[]
  sourceType: SourceType
  onEdit?: (category: Category) => void
  onUnlink?: (categoryId: string) => void
}

export default function CategoriesTable({ categories, sourceType, onEdit, onUnlink }: CategoriesTableProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (category: Category) => {
    onEdit?.(category)
  }

  const handleUnlink = (categoryId: string) => {
    if (confirm('Вы уверены, что хотите отвязать эту категорию?')) {
      onUnlink?.(categoryId)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по категориям..."
          className="w-full pl-10 pr-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {categories.length === 0 ? 'Нет связанных категорий' : 'Категории не найдены'}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category Name
                </th>
                {(sourceType === 'discord' || sourceType === 'discord_private_bot') && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Button
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Form
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.map((category) => {
                const config = getCategoryConfigForIntegration(category, sourceType)
                const buttonLabel = config.button_label || category.categoryName
                const buttonEmoji = config.button_emoji || ''
                const buttonStyle = config.button_style || 'PRIMARY'
                const priority = config.priority || 'medium'
                const formFieldsCount = config.formFields?.length || 0
                
                const getButtonStyleLabel = (style?: string) => {
                  switch (style) {
                    case 'PRIMARY': return 'Blue'
                    case 'SECONDARY': return 'Gray'
                    case 'SUCCESS': return 'Green'
                    case 'DANGER': return 'Red'
                    default: return 'Blue'
                  }
                }

                const getPriorityBadge = (priority: string) => {
                  const styles = {
                    low: 'bg-gray-100 text-gray-800',
                    medium: 'bg-blue-100 text-blue-800',
                    high: 'bg-red-100 text-red-800',
                  }
                  return styles[priority as keyof typeof styles] || styles.medium
                }

                return (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{category.categoryName}</td>
                    {(sourceType === 'discord' || sourceType === 'discord_private_bot') && (
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          {buttonEmoji && <span>{buttonEmoji}</span>}
                          <span>{buttonLabel}</span>
                          <span className="text-xs text-gray-500">({getButtonStyleLabel(buttonStyle)})</span>
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium capitalize ${getPriorityBadge(priority)}`}
                      >
                        {priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formFieldsCount > 0 ? (
                        <span>{formFieldsCount} {formFieldsCount === 1 ? 'field' : 'fields'}</span>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                          category.hasAccess
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {category.hasAccess ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          title="Edit Config"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUnlink(category.id)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Отвязать"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
