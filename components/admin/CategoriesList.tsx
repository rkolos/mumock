'use client'

import { Settings, Plus, Check, MessageCircle, Globe, Mail, MessageSquare, Info } from 'lucide-react'
import { mockCategories, Category, SourceType } from '../../data/categories'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Tooltip from './Tooltip'

export default function CategoriesList() {
  const [categories] = useState<Category[]>(mockCategories)
  const [lastUpdate] = useState<string>('2025-12-10 18:31:12')
  const router = useRouter()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/categories/${categoryId}`)
  }

  // Получить все интеграции категории
  const getCategoryIntegrations = (category: Category): SourceType[] => {
    const integrations: SourceType[] = []
    
    // Добавляем основной source_type
    if (category.source_type) {
      integrations.push(category.source_type)
    }
    
    // Добавляем связанные интеграции (исключая дубликаты)
    if (category.linked_integrations) {
      category.linked_integrations.forEach(integration => {
        if (!integrations.includes(integration)) {
          integrations.push(integration)
        }
      })
    }
    
    return integrations
  }

  // Получить иконку и название интеграции
  const getIntegrationIcon = (sourceType: SourceType) => {
    switch (sourceType) {
      case 'discord':
        return {
          icon: MessageCircle,
          color: 'text-[#5865F2]',
          name: 'Discord Bot'
        }
      case 'discord_private_bot':
        return {
          icon: MessageCircle,
          color: 'text-[#5865F2]',
          name: 'Discord Private Bot',
          isCombined: true // Для Discord Private Bot показываем комбинированную иконку
        }
      case 'web_widget':
        return {
          icon: Globe,
          color: 'text-blue-600',
          name: 'Web Widget'
        }
      case 'telegram':
        return {
          icon: MessageSquare,
          color: 'text-blue-500',
          name: 'Telegram'
        }
      default:
        return {
          icon: Globe,
          color: 'text-gray-400',
          name: 'Unknown'
        }
    }
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last update: {lastUpdate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e2e8f0]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Organization Categories</h2>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#e2e8f0]">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Integrations
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Has Access
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e2e8f0]">
              {categories.map((category, index) => (
                <tr
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    <span>{category.name}</span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      {getCategoryIntegrations(category).map((integrationType) => {
                        const integration = getIntegrationIcon(integrationType)
                        const IconComponent = integration.icon
                        
                        if (integration.isCombined && integrationType === 'discord_private_bot') {
                          // Комбинированная иконка для Discord Private Bot
                          return (
                            <Tooltip key={integrationType} text={integration.name} position="top">
                              <div className="relative inline-flex items-center justify-center">
                                <IconComponent className={`h-4 w-4 ${integration.color}`} />
                                <Mail className="absolute -bottom-0.5 -right-0.5 h-2 w-2 text-[#5865F2] bg-white rounded-full p-0.5" />
                              </div>
                            </Tooltip>
                          )
                        }
                        
                        return (
                          <Tooltip key={integrationType} text={integration.name} position="top">
                            <IconComponent className={`h-4 w-4 ${integration.color}`} />
                          </Tooltip>
                        )
                      })}
                      {getCategoryIntegrations(category).length === 0 && (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {category.hasAccess ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <Check className="h-3 w-3" />
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {formatDate(category.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#e2e8f0] flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            1-{categories.length} of {categories.length}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Records per page:</span>
            <select className="px-2 py-1 border border-[#e2e8f0] rounded text-sm text-gray-700 bg-white">
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Help Tip */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-900">
              Для того, чтобы тикеты из разных источников попадали в соответствующие категории, необходимо настроить интеграцию с соответствующим источником.
            </p>
            <button
              onClick={() => router.push('/integrations')}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Настроить интеграции</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

