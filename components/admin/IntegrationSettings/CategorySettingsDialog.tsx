'use client'

import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { Category, IntegrationConfig, SourceType } from '../../../data/categories'
import DiscordSettings from '../CategorySettings/DiscordSettings'
import DiscordPrivateBotSettings from '../CategorySettings/DiscordPrivateBotSettings'
import WebWidgetSettings from '../CategorySettings/WebWidgetSettings'
import TelegramSettings from '../CategorySettings/TelegramSettings'

interface CategorySettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (categoryId: string, config: IntegrationConfig, sourceType: SourceType) => void
  category: Category | null
  sourceType: SourceType
}

// Функция-хелпер для получения конфигурации категории для интеграции
export function getCategoryConfigForIntegration(
  category: Category | null,
  sourceType: SourceType
): IntegrationConfig {
  if (!category) return {}

  // Если есть integration_configs для этой интеграции
  if (category.integration_configs?.[sourceType]) {
    return category.integration_configs[sourceType]
  }

  // Если это основной source_type категории
  if (category.source_type === sourceType) {
    return category.integration_config
  }

  // Иначе возвращаем пустую конфигурацию (для новой связи)
  return {}
}

export default function CategorySettingsDialog({
  isOpen,
  onClose,
  onSave,
  category,
  sourceType,
}: CategorySettingsDialogProps) {
  const [localConfig, setLocalConfig] = useState<IntegrationConfig>({})

  useEffect(() => {
    if (isOpen && category) {
      const config = getCategoryConfigForIntegration(category, sourceType)
      setLocalConfig(config)
    }
  }, [isOpen, category, sourceType])

  if (!isOpen || !category) return null

  const handleSave = () => {
    onSave(category.id, localConfig, sourceType)
    onClose()
  }

  const getDialogTitle = (): string => {
    const baseTitle = `Настройки категории "${category.categoryName}"`
    switch (sourceType) {
      case 'discord':
        return `${baseTitle} - Discord Bot`
      case 'discord_private_bot':
        return `${baseTitle} - Discord Private Bot`
      case 'web_widget':
        return `${baseTitle} - Web Widget`
      case 'telegram':
        return `${baseTitle} - Telegram`
      default:
        return baseTitle
    }
  }

  const renderIntegrationComponent = () => {
    switch (sourceType) {
      case 'discord':
        return <DiscordSettings config={localConfig} onConfigChange={setLocalConfig} />
      case 'discord_private_bot':
        return (
          <DiscordPrivateBotSettings
            category={category}
            config={localConfig}
            onConfigChange={setLocalConfig}
          />
        )
      case 'web_widget':
        return <WebWidgetSettings config={localConfig} onConfigChange={setLocalConfig} />
      case 'telegram':
        return <TelegramSettings config={localConfig} onConfigChange={setLocalConfig} />
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Неизвестный тип интеграции: {sourceType}
          </div>
        )
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[800px] mx-4 max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">{getDialogTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">{renderIntegrationComponent()}</div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Сохранить настройки
          </button>
        </div>
      </div>
    </div>
  )
}
