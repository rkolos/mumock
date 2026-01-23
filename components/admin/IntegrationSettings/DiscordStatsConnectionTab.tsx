'use client'

import { useState } from 'react'
import { Copy, RefreshCw, ExternalLink, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Integration, IntegrationSettings } from '../../../data/integrations'
import { mockGuilds, GuildConfig } from '../../../data/discordStats'

interface DiscordStatsConnectionTabProps {
  integration: Integration
  settings: IntegrationSettings
  onSettingsChange: (settings: IntegrationSettings) => void
}

export default function DiscordStatsConnectionTab({
  integration,
  settings,
  onSettingsChange,
}: DiscordStatsConnectionTabProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false)
  
  const companyToken = settings.discord_stats_company_token || 'ninjatickets_v8a9s8d7f6e5c4b3a2'
  
  // Получаем список подключенных серверов
  const linkedGuildIds = settings.discord_stats_linked_servers || []
  const linkedServers = mockGuilds.filter(guild => linkedGuildIds.includes(guild.guild_id))

  const handleCopyToken = () => {
    navigator.clipboard.writeText(companyToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerateToken = () => {
    // TODO: Implement actual token regeneration
    const newToken = `ninjatickets_${Math.random().toString(36).substring(2, 15)}`
    onSettingsChange({
      ...settings,
      discord_stats_company_token: newToken,
    })
    setShowRegenerateConfirm(false)
    alert('Токен успешно обновлен! Не забудьте обновить команду на всех серверах.')
  }

  const handleManageServer = (guildId: string) => {
    router.push(`/integrations/discord-stats/${guildId}`)
  }

  const getAnalyticsStatus = (guild: GuildConfig) => {
    return guild.plan_limits.analytics_enabled ? '🟢 On' : '⚪ Off'
  }

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Kicked
      </span>
    )
  }

  const getCountersUsage = (guild: GuildConfig) => {
    const used = guild.active_counters.length
    const max = guild.plan_limits.max_counters
    const percentage = (used / max) * 100
    
    return { used, max, percentage }
  }

  return (
    <div className="space-y-6">
      {/* Company Link Token Block */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Setup Instructions</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Step 1:</span>
              <button
                onClick={() => window.open('https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot', '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] text-white rounded-md hover:bg-[#4752C4] transition-colors text-sm font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                Invite Bot
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Step 2:</span>
                <span className="text-sm text-gray-600">Company Link Token</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={companyToken}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 font-mono text-sm"
                />
                <button
                  onClick={handleCopyToken}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Скопировано!' : 'Copy'}
                </button>
                <button
                  onClick={() => setShowRegenerateConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate Token
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Run command <code className="bg-gray-100 px-1 py-0.5 rounded">/setup token:{companyToken}</code> on your Discord server.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Regenerate Token Confirmation Dialog */}
      {showRegenerateConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Подтверждение</h3>
            <p className="text-sm text-gray-600 mb-4">
              Вы уверены, что хотите сгенерировать новый токен? Это сбросит старые настройки на всех серверах, где использовался предыдущий токен.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRegenerateConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleRegenerateToken}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Сгенерировать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Linked Servers Table */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Linked Servers</h3>
        {linkedServers.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">Нет подключенных серверов</p>
            <p className="text-sm text-gray-400 mt-2">
              Добавьте бота на сервер и выполните команду /setup для подключения
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Server
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Counters Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Analytics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {linkedServers.map((guild) => {
                  const usage = getCountersUsage(guild)
                  return (
                    <tr key={guild.guild_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {guild.icon ? (
                            <img
                              src={guild.icon}
                              alt={guild.name}
                              className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const fallback = target.nextElementSibling as HTMLElement
                                if (fallback) fallback.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div
                            className={`h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 ${
                              guild.icon ? 'hidden' : ''
                            }`}
                          >
                            <span className="text-white text-sm font-semibold">
                              {guild.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{guild.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                            <div
                              className={`h-2 rounded-full ${
                                usage.percentage >= 100 ? 'bg-red-500' : usage.percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(usage.percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {usage.used} / {usage.max} Active
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm">{getAnalyticsStatus(guild)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(guild.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleManageServer(guild.guild_id)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Manage
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
