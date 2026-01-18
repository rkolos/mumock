'use client'

import { IntegrationConfig } from '../../../data/categories'

interface TelegramSettingsProps {
  config: IntegrationConfig
  onConfigChange: (config: IntegrationConfig) => void
}

export default function TelegramSettings({ config, onConfigChange }: TelegramSettingsProps) {
  const handleChange = (field: keyof IntegrationConfig, value: string | number | 'low' | 'medium' | 'high') => {
    onConfigChange({
      ...config,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Telegram Bot</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chat ID (Куда слать уведомления админам)
            </label>
            <input
              type="text"
              value={config.telegram_chat_id || ''}
              onChange={(e) => handleChange('telegram_chat_id', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="-1001234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Welcome Command
            </label>
            <input
              type="text"
              value={config.welcome_command || ''}
              onChange={(e) => handleChange('welcome_command', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/start"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Limits & Logic</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={config.priority || 'medium'}
              onChange={(e) => handleChange('priority', e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

