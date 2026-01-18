'use client'

import { Category, IntegrationConfig, SourceType } from '../../../data/categories'
import DiscordSettings from './DiscordSettings'
import DiscordPrivateBotSettings from './DiscordPrivateBotSettings'
import WebWidgetSettings from './WebWidgetSettings'
import TelegramSettings from './TelegramSettings'

interface IntegrationSettingsTabProps {
  category: Category
  onConfigChange: (config: IntegrationConfig, sourceType?: SourceType) => void
  integrationSourceType?: SourceType // Если передан, показывать настройки для этой интеграции
  currentConfig?: IntegrationConfig // Текущая конфигурация для отображаемой интеграции
}

export default function IntegrationSettingsTab({
  category,
  onConfigChange,
  integrationSourceType,
  currentConfig,
}: IntegrationSettingsTabProps) {
  // Используем переданный integrationSourceType или category.source_type
  const displaySourceType = integrationSourceType || category.source_type
  // Используем переданную конфигурацию или категорию integration_config
  const displayConfig = currentConfig || category.integration_config

  const renderIntegrationComponent = () => {
    switch (displaySourceType) {
      case 'discord':
        return <DiscordSettings config={displayConfig} onConfigChange={(config) => onConfigChange(config, displaySourceType)} />
      case 'discord_private_bot':
        return <DiscordPrivateBotSettings category={category} config={displayConfig} onConfigChange={(config) => onConfigChange(config, displaySourceType)} />
      case 'web_widget':
        return <WebWidgetSettings config={displayConfig} onConfigChange={(config) => onConfigChange(config, displaySourceType)} />
      case 'telegram':
        return <TelegramSettings config={displayConfig} onConfigChange={(config) => onConfigChange(config, displaySourceType)} />
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Неизвестный тип источника: {displaySourceType}
          </div>
        )
    }
  }

  const getTabTitle = (sourceType: SourceType): string => {
    switch (sourceType) {
      case 'discord':
        return 'Discord Settings'
      case 'discord_private_bot':
        return 'Discord DM Bot Settings'
      case 'web_widget':
        return 'Widget Appearance'
      case 'telegram':
        return 'Telegram Bot'
      default:
        return 'Integration Settings'
    }
  }

  // Проверяем, привязана ли категория к этой интеграции
  const isLinked = integrationSourceType
    ? category.linked_integrations?.includes(integrationSourceType) || category.source_type === integrationSourceType
    : true

  return (
    <div>
      {integrationSourceType && integrationSourceType !== category.source_type && !isLinked && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Эта категория еще не привязана к интеграции {getTabTitle(integrationSourceType)}. Настройте параметры и сохраните, чтобы привязать.
          </p>
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-900 mb-6">{getTabTitle(displaySourceType)}</h3>
      {renderIntegrationComponent()}
    </div>
  )
}

