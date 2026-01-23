'use client'

export default function DiscordStatsGlobalLimitsTab() {
  // Mock данные о лимитах тарифа
  const planLimits = {
    max_servers: 10,
    max_counters_per_server: 10,
    analytics_enabled: true,
    welcome_messages_enabled: true,
    leaderboard_enabled: false,
    update_frequency: 6, // минут
    plan_name: 'Pro',
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Plan Limits</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">Current Plan</span>
              <span className="text-sm text-gray-900 font-semibold">{planLimits.plan_name}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Max Servers</span>
                <span className="text-sm font-medium text-gray-900">{planLimits.max_servers}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Max Counters per Server</span>
                <span className="text-sm font-medium text-gray-900">{planLimits.max_counters_per_server}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Analytics Tracking</span>
                <span className={`text-sm font-medium ${planLimits.analytics_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                  {planLimits.analytics_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Welcome Messages</span>
                <span className={`text-sm font-medium ${planLimits.welcome_messages_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                  {planLimits.welcome_messages_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Leaderboard Commands</span>
                <span className={`text-sm font-medium ${planLimits.leaderboard_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                  {planLimits.leaderboard_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Update Frequency</span>
                <span className="text-sm font-medium text-gray-900">Every {planLimits.update_frequency} minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Note:</span> Эти лимиты применяются ко всем подключенным серверам. 
          Для изменения лимитов обновите тарифный план.
        </p>
      </div>
    </div>
  )
}
