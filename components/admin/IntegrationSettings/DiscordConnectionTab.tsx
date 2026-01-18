'use client'

import { useState, useEffect } from 'react'
import { Integration, IntegrationSettings } from '../../../data/integrations'
import SecretField from './SecretField'
import TestConnectionButton from './TestConnectionButton'

interface DiscordConnectionTabProps {
  integration: Integration
  settings: IntegrationSettings
  onSettingsChange: (settings: IntegrationSettings) => void
}

export default function DiscordConnectionTab({
  integration,
  settings,
  onSettingsChange,
}: DiscordConnectionTabProps) {
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    if (integration.lastConnectedAt) {
      setFormattedDate(new Date(integration.lastConnectedAt).toLocaleString())
    }
  }, [integration.lastConnectedAt])

  const handleChange = (field: keyof IntegrationSettings, value: string) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    })
  }

  const handleTestConnection = async (): Promise<boolean> => {
    // TODO: Implement actual connection test
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return settings.discord_bot_token ? true : false
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Bot Connection</h3>
        <div className="space-y-4">
          <SecretField
            label="Bot Token"
            value={settings.discord_bot_token || ''}
            onChange={(value) => handleChange('discord_bot_token', value)}
            placeholder="Enter Discord bot token"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discord Server (Guild)
            </label>
            <select
              value={settings.discord_guild_id || ''}
              onChange={(e) => handleChange('discord_guild_id', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите сервер</option>
              <option value="guild-123">Test Server</option>
              <option value="guild-456">Production Server</option>
            </select>
          </div>

          <TestConnectionButton onTest={handleTestConnection} className="mt-4" />

          {integration.connectionStatus === 'connected' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Connected</span>
                </div>
                {settings.discord_bot_name && (
                  <div className="text-sm text-green-700">
                    <span className="font-medium">Bot Name:</span> {settings.discord_bot_name}
                  </div>
                )}
                {settings.discord_bot_id && (
                  <div className="text-sm text-green-700">
                    <span className="font-medium">Bot ID:</span> {settings.discord_bot_id}
                  </div>
                )}
                {integration.lastConnectedAt && formattedDate && (
                  <div className="text-sm text-green-700">
                    <span className="font-medium">Last Connected:</span> {formattedDate}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
