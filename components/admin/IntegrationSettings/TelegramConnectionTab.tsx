'use client'

import { useState } from 'react'
import { Integration, IntegrationSettings } from '../../../data/integrations'
import SecretField from './SecretField'
import TestConnectionButton from './TestConnectionButton'

interface TelegramConnectionTabProps {
  integration: Integration
  settings: IntegrationSettings
  onSettingsChange: (settings: IntegrationSettings) => void
}

export default function TelegramConnectionTab({
  integration,
  settings,
  onSettingsChange,
}: TelegramConnectionTabProps) {
  const handleChange = (field: keyof IntegrationSettings, value: string) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    })
  }

  const handleTestConnection = async (): Promise<boolean> => {
    // TODO: Implement actual connection test
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return settings.telegram_bot_token ? true : false
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Bot Connection</h3>
        <div className="space-y-4">
          <SecretField
            label="Bot Token"
            value={settings.telegram_bot_token || ''}
            onChange={(value) => handleChange('telegram_bot_token', value)}
            placeholder="Enter Telegram bot token"
          />

          <TestConnectionButton onTest={handleTestConnection} className="mt-4" />

          {integration.connectionStatus === 'connected' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Connected</span>
                </div>
                {settings.telegram_bot_username && (
                  <div className="text-sm text-green-700">
                    <span className="font-medium">Bot Username:</span> @{settings.telegram_bot_username}
                  </div>
                )}
                {settings.telegram_bot_id && (
                  <div className="text-sm text-green-700">
                    <span className="font-medium">Bot ID:</span> {settings.telegram_bot_id}
                  </div>
                )}
                {integration.lastConnectedAt && (
                  <div className="text-sm text-green-700">
                    <span className="font-medium">Last Connected:</span>{' '}
                    {new Date(integration.lastConnectedAt).toLocaleString()}
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
