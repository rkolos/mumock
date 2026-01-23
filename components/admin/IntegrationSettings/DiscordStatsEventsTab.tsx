'use client'

import { useState } from 'react'
import { GuildConfig } from '../../../data/discordStats'

interface DiscordStatsEventsTabProps {
  guild: GuildConfig
  onGuildConfigChange: (guild: GuildConfig) => void
}

export default function DiscordStatsEventsTab({
  guild,
  onGuildConfigChange,
}: DiscordStatsEventsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'welcome' | 'goodbye'>('welcome')
  const moduleWelcome = guild.plan_limits.module_welcome ?? false
  
  const welcomeConfig = guild.welcome_config || {
    enabled: false,
    channel_id: '',
    channel_name: '',
    message: '',
    embed: {},
  }

  const goodbyeConfig = guild.goodbye_config || {
    enabled: false,
    channel_id: '',
    channel_name: '',
    message: '',
    embed: {},
  }

  // Mock список каналов
  const mockChannels = [
    { id: '999000111', name: 'welcome' },
    { id: '999000222', name: 'general' },
    { id: '999000333', name: 'announcements' },
  ]

  // Welcome handlers
  const handleToggleWelcome = (enabled: boolean) => {
    if (!moduleWelcome) {
      alert('Welcome messages недоступны в вашем тарифном плане')
      return
    }

    onGuildConfigChange({
      ...guild,
      welcome_config: {
        ...welcomeConfig,
        enabled,
      },
    })
  }

  const handleWelcomeChannelChange = (channelId: string) => {
    const channel = mockChannels.find(c => c.id === channelId)
    onGuildConfigChange({
      ...guild,
      welcome_config: {
        ...welcomeConfig,
        channel_id: channelId,
        channel_name: channel?.name || '',
      },
    })
  }

  const handleWelcomeMessageChange = (field: string, value: string) => {
    onGuildConfigChange({
      ...guild,
      welcome_config: {
        ...welcomeConfig,
        [field]: value,
      },
    })
  }

  const handleWelcomeEmbedChange = (field: string, value: string) => {
    onGuildConfigChange({
      ...guild,
      welcome_config: {
        ...welcomeConfig,
        embed: {
          ...welcomeConfig.embed,
          [field]: value,
        },
      },
    })
  }

  // Goodbye handlers
  const handleToggleGoodbye = (enabled: boolean) => {
    if (!moduleWelcome) {
      alert('Goodbye messages недоступны в вашем тарифном плане')
      return
    }

    onGuildConfigChange({
      ...guild,
      goodbye_config: {
        ...goodbyeConfig,
        enabled,
      },
    })
  }

  const handleGoodbyeChannelChange = (channelId: string) => {
    const channel = mockChannels.find(c => c.id === channelId)
    onGuildConfigChange({
      ...guild,
      goodbye_config: {
        ...goodbyeConfig,
        channel_id: channelId,
        channel_name: channel?.name || '',
      },
    })
  }

  const handleGoodbyeMessageChange = (field: string, value: string) => {
    onGuildConfigChange({
      ...guild,
      goodbye_config: {
        ...goodbyeConfig,
        [field]: value,
      },
    })
  }

  const handleGoodbyeEmbedChange = (field: string, value: string) => {
    onGuildConfigChange({
      ...guild,
      goodbye_config: {
        ...goodbyeConfig,
        embed: {
          ...goodbyeConfig.embed,
          [field]: value,
        },
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Events</h3>
        
        {/* Sub-tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex items-end gap-1">
            <button
              onClick={() => setActiveSubTab('welcome')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeSubTab === 'welcome'
                  ? 'text-gray-900 border-black'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              👋 User Join
            </button>
            <button
              onClick={() => setActiveSubTab('goodbye')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeSubTab === 'goodbye'
                  ? 'text-gray-900 border-black'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              🚪 User Leave
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        {activeSubTab === 'welcome' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            {/* Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Enable Welcome Messages</label>
                <p className="text-xs text-gray-500 mt-1">
                  Отправлять приветственное сообщение при присоединении нового участника
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={welcomeConfig.enabled && moduleWelcome}
                  onChange={(e) => handleToggleWelcome(e.target.checked)}
                  disabled={!moduleWelcome}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer ${
                  welcomeConfig.enabled && moduleWelcome ? 'bg-black' : 'bg-gray-300'
                } ${!moduleWelcome ? 'opacity-50 cursor-not-allowed' : ''} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500`}>
                  <div className={`mt-0.5 ml-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    welcomeConfig.enabled && moduleWelcome ? 'translate-x-5' : ''
                  }`} />
                </div>
              </label>
            </div>

            {!moduleWelcome && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Welcome messages недоступны в вашем тарифном плане. Обновите план для доступа к этой функции.
                </p>
              </div>
            )}

            {welcomeConfig.enabled && moduleWelcome && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {/* Channel Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={welcomeConfig.channel_id || ''}
                    onChange={(e) => handleWelcomeChannelChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите канал</option>
                    {mockChannels.map((channel) => (
                      <option key={channel.id} value={channel.id}>
                        #{channel.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Builder */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Message Builder</h4>
                  
                  {/* Text Content */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Content
                    </label>
                    <textarea
                      value={welcomeConfig.message || ''}
                      onChange={(e) => handleWelcomeMessageChange('message', e.target.value)}
                      placeholder="Добро пожаловать, {user}!"
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Переменные: <code className="bg-gray-100 px-1 py-0.5 rounded">{'{user}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">{'{server}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">{'{member_count}'}</code>
                    </p>
                  </div>

                  {/* Embed Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Embed Title
                    </label>
                    <input
                      type="text"
                      value={welcomeConfig.embed?.title || ''}
                      onChange={(e) => handleWelcomeEmbedChange('title', e.target.value)}
                      placeholder="Добро пожаловать на {server}!"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Embed Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Embed Description
                    </label>
                    <textarea
                      value={welcomeConfig.embed?.description || ''}
                      onChange={(e) => handleWelcomeEmbedChange('description', e.target.value)}
                      placeholder="Теперь у нас {member_count} участников"
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={welcomeConfig.embed?.image_url || ''}
                      onChange={(e) => handleWelcomeEmbedChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.png"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-900 rounded-lg p-4 mt-4">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <div className="bg-[#2F3136] rounded p-3">
                    {welcomeConfig.embed?.title && (
                      <h4 className="text-white font-semibold mb-1">
                        {welcomeConfig.embed.title.replace('{server}', guild.name)}
                      </h4>
                    )}
                    {welcomeConfig.message && (
                      <p className="text-gray-300 text-sm mb-2">
                        {welcomeConfig.message.replace('{user}', '@username')}
                      </p>
                    )}
                    {welcomeConfig.embed?.description && (
                      <p className="text-gray-400 text-sm">
                        {welcomeConfig.embed.description.replace('{member_count}', '1,204')}
                      </p>
                    )}
                    {welcomeConfig.embed?.image_url && (
                      <img
                        src={welcomeConfig.embed.image_url}
                        alt="Preview"
                        className="mt-2 rounded max-w-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Goodbye Section */}
        {activeSubTab === 'goodbye' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            {/* Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Enable Goodbye Messages</label>
                <p className="text-xs text-gray-500 mt-1">
                  Отправлять сообщение при выходе участника из сервера
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={goodbyeConfig.enabled && moduleWelcome}
                  onChange={(e) => handleToggleGoodbye(e.target.checked)}
                  disabled={!moduleWelcome}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer ${
                  goodbyeConfig.enabled && moduleWelcome ? 'bg-black' : 'bg-gray-300'
                } ${!moduleWelcome ? 'opacity-50 cursor-not-allowed' : ''} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500`}>
                  <div className={`mt-0.5 ml-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    goodbyeConfig.enabled && moduleWelcome ? 'translate-x-5' : ''
                  }`} />
                </div>
              </label>
            </div>

            {!moduleWelcome && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Goodbye messages недоступны в вашем тарифном плане. Обновите план для доступа к этой функции.
                </p>
              </div>
            )}

            {goodbyeConfig.enabled && moduleWelcome && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {/* Channel Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={goodbyeConfig.channel_id || ''}
                    onChange={(e) => handleGoodbyeChannelChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите канал</option>
                    {mockChannels.map((channel) => (
                      <option key={channel.id} value={channel.id}>
                        #{channel.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Builder */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Message Builder</h4>
                  
                  {/* Text Content */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Content
                    </label>
                    <textarea
                      value={goodbyeConfig.message || ''}
                      onChange={(e) => handleGoodbyeMessageChange('message', e.target.value)}
                      placeholder="User {user} has left the server."
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Переменные: <code className="bg-gray-100 px-1 py-0.5 rounded">{'{user}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">{'{server}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">{'{member_count}'}</code>
                    </p>
                  </div>

                  {/* Embed Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Embed Title
                    </label>
                    <input
                      type="text"
                      value={goodbyeConfig.embed?.title || ''}
                      onChange={(e) => handleGoodbyeEmbedChange('title', e.target.value)}
                      placeholder="User {user} left {server}"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Embed Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Embed Description
                    </label>
                    <textarea
                      value={goodbyeConfig.embed?.description || ''}
                      onChange={(e) => handleGoodbyeEmbedChange('description', e.target.value)}
                      placeholder="We are now {member_count} members."
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={goodbyeConfig.embed?.image_url || ''}
                      onChange={(e) => handleGoodbyeEmbedChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.png"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-900 rounded-lg p-4 mt-4">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <div className="bg-[#2F3136] rounded p-3">
                    {goodbyeConfig.embed?.title && (
                      <h4 className="text-white font-semibold mb-1">
                        {goodbyeConfig.embed.title.replace('{server}', guild.name).replace('{user}', '@username')}
                      </h4>
                    )}
                    {goodbyeConfig.message && (
                      <p className="text-gray-300 text-sm mb-2">
                        {goodbyeConfig.message.replace('{user}', '@username')}
                      </p>
                    )}
                    {goodbyeConfig.embed?.description && (
                      <p className="text-gray-400 text-sm">
                        {goodbyeConfig.embed.description.replace('{member_count}', '1,203')}
                      </p>
                    )}
                    {goodbyeConfig.embed?.image_url && (
                      <img
                        src={goodbyeConfig.embed.image_url}
                        alt="Preview"
                        className="mt-2 rounded max-w-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
