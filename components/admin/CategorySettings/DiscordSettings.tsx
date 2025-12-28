'use client'

import { IntegrationConfig } from '../../../data/categories'

interface DiscordSettingsProps {
  config: IntegrationConfig
  onConfigChange: (config: IntegrationConfig) => void
}

export default function DiscordSettings({ config, onConfigChange }: DiscordSettingsProps) {
  const handleChange = (field: keyof IntegrationConfig, value: string | boolean) => {
    onConfigChange({
      ...config,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Channel Config</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discord Server (Guild)
            </label>
            <select
              value={config.discord_guild_id || ''}
              onChange={(e) => handleChange('discord_guild_id', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите сервер</option>
              <option value="guild-123">Test Server</option>
              <option value="guild-456">Production Server</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discord Category ID
            </label>
            <input
              type="text"
              value={config.discord_category_id || ''}
              onChange={(e) => handleChange('discord_category_id', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123456789012345678"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Messaging</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ticket Create Message (Приветствие бота)
            </label>
            <textarea
              value={config.welcome_message || ''}
              onChange={(e) => handleChange('welcome_message', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hello, {username}! A support agent will be with you shortly."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mention Role (Кого пинговать при создании)
            </label>
            <select
              value={config.mention_role || ''}
              onChange={(e) => handleChange('mention_role', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Не упоминать</option>
              <option value="Support">Support</option>
              <option value="Moderator">Moderator</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

