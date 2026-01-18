'use client'

import { IntegrationSettings } from '../../../data/integrations'

interface TelegramSettingsTabProps {
  settings: IntegrationSettings
  onSettingsChange: (settings: IntegrationSettings) => void
}

export default function TelegramSettingsTab({
  settings,
  onSettingsChange,
}: TelegramSettingsTabProps) {
  const handleChange = (field: keyof IntegrationSettings, value: string | boolean) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Default Settings</h3>
        <p className="text-sm text-gray-500 mb-4">
          These settings will be used as defaults for new categories linked to this integration
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Welcome Command
            </label>
            <input
              type="text"
              value={settings.default_welcome_command || ''}
              onChange={(e) => handleChange('default_welcome_command', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/start"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Chat ID (Admin Notifications)
            </label>
            <input
              type="text"
              value={settings.telegram_chat_id || ''}
              onChange={(e) => handleChange('telegram_chat_id', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="-1001234567890"
            />
            <p className="mt-1 text-xs text-gray-500">
              Chat ID where admin notifications will be sent
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Auto-responses</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enable Auto-responses
              </label>
              <p className="text-xs text-gray-500">Automatically respond to common commands</p>
            </div>
            <button
              onClick={() => handleChange('default_welcome_message', !true)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                true ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  true ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Command Aliases</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Command Aliases
            </label>
            <input
              type="text"
              value="/help,/support"
              onChange={() => {}}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/help,/support"
            />
            <p className="mt-1 text-xs text-gray-500">
              Comma-separated list of command aliases
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
