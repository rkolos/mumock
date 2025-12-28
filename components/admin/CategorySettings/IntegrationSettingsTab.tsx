'use client'

import { Category, IntegrationConfig, SourceType } from '../../../data/categories'
import DiscordSettings from './DiscordSettings'
import WebWidgetSettings from './WebWidgetSettings'
import TelegramSettings from './TelegramSettings'

interface IntegrationSettingsTabProps {
  category: Category
  onConfigChange: (config: IntegrationConfig) => void
}

export default function IntegrationSettingsTab({
  category,
  onConfigChange,
}: IntegrationSettingsTabProps) {
  const renderIntegrationComponent = () => {
    switch (category.source_type) {
      case 'discord':
        return <DiscordSettings config={category.integration_config} onConfigChange={onConfigChange} />
      case 'web_widget':
        return <WebWidgetSettings config={category.integration_config} onConfigChange={onConfigChange} />
      case 'telegram':
        return <TelegramSettings config={category.integration_config} onConfigChange={onConfigChange} />
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Неизвестный тип источника: {category.source_type}
          </div>
        )
    }
  }

  const getTabTitle = (sourceType: SourceType): string => {
    switch (sourceType) {
      case 'discord':
        return 'Discord Settings'
      case 'web_widget':
        return 'Widget Appearance'
      case 'telegram':
        return 'Telegram Bot'
      default:
        return 'Integration Settings'
    }
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-6">{getTabTitle(category.source_type)}</h3>
      {renderIntegrationComponent()}
    </div>
  )
}

