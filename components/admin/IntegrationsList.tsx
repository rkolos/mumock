'use client'

import { useState } from 'react'
import { Plus, Settings, Mail, Globe, MessageSquare } from 'lucide-react'
import { mockIntegrations, Integration, ConnectionStatus } from '../../data/integrations'
import { mockCategories, SourceType } from '../../data/categories'
import { useRouter } from 'next/navigation'

export default function IntegrationsList() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const router = useRouter()

  const handleToggle = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, isActive: !integration.isActive }
          : integration
      )
    )
  }

  const handleConfigure = (integration: Integration) => {
    if (integration.isComingSoon) {
      return // Не открываем настройки для Coming Soon
    }
    router.push(integration.configUrl)
  }

  const getStatusDisplay = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return { text: 'Connected', color: 'bg-green-500', dotColor: 'bg-green-500' }
      case 'not_configured':
        return { text: 'Not Configured', color: 'bg-gray-400', dotColor: 'bg-gray-400' }
      case 'coming_soon':
        return { text: 'Coming Soon', color: 'bg-blue-500', dotColor: 'bg-blue-500' }
      default:
        return { text: 'Unknown', color: 'bg-gray-400', dotColor: 'bg-gray-400' }
    }
  }

  // Получить SourceType для integration.id
  const getSourceTypeForIntegration = (integrationId: string): SourceType | null => {
    switch (integrationId) {
      case 'discord_bot':
        return 'discord'
      case 'discord_private_bot':
        return 'discord_private_bot'
      case 'website_widget':
        return 'web_widget'
      case 'telegram_bot':
        return 'telegram'
      default:
        return null
    }
  }

  // Получить количество связанных категорий для интеграции
  const getLinkedCategoriesCount = (integrationId: string): number => {
    const sourceType = getSourceTypeForIntegration(integrationId)
    if (!sourceType) return 0

    return mockCategories.filter((category) => {
      // Категория связана, если source_type совпадает или в linked_integrations
      return (
        category.source_type === sourceType ||
        category.linked_integrations?.includes(sourceType)
      )
    }).length
  }

  const getLogoIcon = (id: string) => {
    const discordIcon = (
      <svg
        className="w-12 h-12 text-[#5865F2]"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    )

    const discordStatsIcon = (
      <div className="relative">
        <svg
          className="w-12 h-12 text-[#5865F2]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
        <span className="absolute -top-1 -right-1 text-lg">📊</span>
      </div>
    )

    switch (id) {
      case 'discord_bot':
        return discordIcon
      case 'discord_private_bot':
        return discordIcon
      case 'discord_stats_bot':
        return discordStatsIcon
      case 'email_forwarding':
        return <Mail className="w-12 h-12 text-gray-600" />
      case 'website_widget':
        return <Globe className="w-12 h-12 text-blue-600" />
      case 'telegram_bot':
        return <MessageSquare className="w-12 h-12 text-blue-500" />
      default:
        return <Globe className="w-12 h-12 text-gray-400" />
    }
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your support channels and external connections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 text-gray-400 border border-[#e2e8f0] rounded-md transition-colors cursor-not-allowed opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Integration</span>
          </button>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const statusDisplay = getStatusDisplay(integration.connectionStatus)
          const isDisabled = integration.isComingSoon
          const linkedCategoriesCount = getLinkedCategoriesCount(integration.id)

          return (
            <div
              key={integration.id}
              className={`bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-6 ${
                isDisabled ? 'opacity-60' : ''
              }`}
            >
              {/* Header: Logo and Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12">
                  {getLogoIcon(integration.id)}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={integration.isActive}
                    onChange={() => handleToggle(integration.id)}
                    disabled={isDisabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {/* Body: Name and Description */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{integration.name}</h3>
                <p className="text-sm text-gray-600 leading-5 h-10 overflow-hidden mb-2">{integration.description}</p>
                {linkedCategoriesCount > 0 && integration.id !== 'discord_stats_bot' && (
                  <div className="text-xs text-gray-500 mt-2">
                    <span className="font-medium">{linkedCategoriesCount}</span>{' '}
                    {linkedCategoriesCount === 1 ? 'category' : 'categories'} linked
                  </div>
                )}
                {integration.id === 'discord_stats_bot' && integration.settings?.discord_stats_linked_servers && (
                  <div className="text-xs text-gray-500 mt-2">
                    <span className="font-medium">{integration.settings.discord_stats_linked_servers.length}</span>{' '}
                    {integration.settings.discord_stats_linked_servers.length === 1 ? 'server' : 'servers'} linked
                  </div>
                )}
              </div>

              {/* Footer: Status and Configure Button */}
              <div className="flex items-center justify-between pt-4 border-t border-[#e2e8f0]">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusDisplay.dotColor}`}></div>
                  <span className="text-sm text-gray-600">{statusDisplay.text}</span>
                </div>
                <button
                  onClick={() => handleConfigure(integration)}
                  disabled={isDisabled}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    isDisabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Configure</span>
                </button>
              </div>

              {/* Coming Soon Badge */}
              {integration.isComingSoon && (
                <div className="mt-3 pt-3 border-t border-[#e2e8f0]">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
