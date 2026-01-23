'use client'

import { Lock } from 'lucide-react'
import { GuildConfig } from '../../../data/discordStats'

interface DiscordStatsServerSettingsTabProps {
  guild: GuildConfig
}

export default function DiscordStatsServerSettingsTab({
  guild,
}: DiscordStatsServerSettingsTabProps) {
  const planLimits = guild.plan_limits

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Settings & Limits</h3>
        <p className="text-sm text-gray-500 mb-6">
          Эти настройки управляются тарифным планом и не могут быть изменены вручную.
        </p>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          {/* Analytics Tracking */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">Analytics Tracking</span>
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Отслеживание статистики и аналитики сервера
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${
                planLimits.analytics_enabled ? 'text-green-600' : 'text-gray-400'
              }`}>
                {planLimits.analytics_enabled ? 'Enabled' : 'Disabled'}
              </span>
              <label className="relative inline-flex items-center cursor-not-allowed">
                <input
                  type="checkbox"
                  checked={planLimits.analytics_enabled}
                  disabled
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full ${
                  planLimits.analytics_enabled ? 'bg-gray-300' : 'bg-gray-200'
                } opacity-50`}>
                  <div className={`mt-0.5 ml-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    planLimits.analytics_enabled ? 'translate-x-5' : ''
                  }`} />
                </div>
              </label>
            </div>
            {!planLimits.analytics_enabled && (
              <span className="text-xs text-gray-500 italic">Upgrade to Pro to enable</span>
            )}
          </div>

          {/* Leaderboard Commands */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">Leaderboard Commands</span>
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Команды для отображения таблицы лидеров
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${
                planLimits.module_leaderboard ? 'text-green-600' : 'text-gray-400'
              }`}>
                {planLimits.module_leaderboard ? 'Enabled' : 'Disabled'}
              </span>
              <label className="relative inline-flex items-center cursor-not-allowed">
                <input
                  type="checkbox"
                  checked={planLimits.module_leaderboard || false}
                  disabled
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full ${
                  planLimits.module_leaderboard ? 'bg-gray-300' : 'bg-gray-200'
                } opacity-50`}>
                  <div className={`mt-0.5 ml-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    planLimits.module_leaderboard ? 'translate-x-5' : ''
                  }`} />
                </div>
              </label>
            </div>
            {!planLimits.module_leaderboard && (
              <span className="text-xs text-gray-500 italic">Upgrade to Pro to enable</span>
            )}
          </div>

          {/* Update Frequency */}
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">Update Frequency</span>
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Частота обновления счетчиков и статистики
              </p>
            </div>
            <span className="text-sm font-medium text-gray-900">
              Every {planLimits.update_freq} minutes
            </span>
          </div>

          {/* Max Counters */}
          <div className="flex items-center justify-between py-3 border-t border-gray-200">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-900">Max Counters</span>
              <p className="text-xs text-gray-500 mt-1">
                Максимальное количество активных счетчиков
              </p>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {planLimits.max_counters}
            </span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note:</span> Для изменения этих настроек необходимо обновить тарифный план. 
            Обратитесь к администратору для получения дополнительной информации.
          </p>
        </div>
      </div>
    </div>
  )
}
