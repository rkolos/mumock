'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, BarChart2, Settings } from 'lucide-react'
import ServerSelector from './ServerSelector'
import DateRangePicker from './DateRangePicker'
import OverviewTab from './OverviewTab'
import EngagementTab from './EngagementTab'
import LeaderboardTab from './LeaderboardTab'
import { GuildConfig, mockGuilds } from '../../../data/discordStats'
import { getIntegrationById } from '../../../data/integrations'
import { DateRange, LeaderboardSortBy } from '../../../types/analytics'
import { getDateRangePreset } from '../../../utils/analyticsApi'
import {
  getStatsOverview,
  getHistoryData,
  getHeatmapData,
  getLeaderboardData,
} from '../../../data/analytics'

export default function AnalyticsDashboard() {
  const router = useRouter()
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>(getDateRangePreset('7d'))
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'leaderboard'>('overview')
  const [leaderboardSortBy, setLeaderboardSortBy] = useState<LeaderboardSortBy>('messages')
  
  // Получаем список активных серверов
  const integration = getIntegrationById('discord_stats_bot')
  const linkedServerIds = integration?.settings?.discord_stats_linked_servers || []
  
  // Все активные серверы (включая неподключенные)
  const allActiveServers = useMemo(() => {
    return mockGuilds.filter((guild: GuildConfig) => guild.status === 'active')
  }, [])
  
  // Подключенные серверы
  const availableServers = useMemo(() => {
    return mockGuilds.filter((guild: GuildConfig) =>
      linkedServerIds.includes(guild.guild_id) && guild.status === 'active'
    )
  }, [linkedServerIds])
  
  // Устанавливаем первый подключенный сервер по умолчанию
  useEffect(() => {
    if (availableServers.length > 0 && !selectedServerId) {
      setSelectedServerId(availableServers[0].guild_id)
    }
  }, [availableServers, selectedServerId])
  
  const selectedServer = allActiveServers.find((s: GuildConfig) => s.guild_id === selectedServerId)
  const isServerLinked = selectedServer ? linkedServerIds.includes(selectedServer.guild_id) : false
  
  // Получаем данные для выбранного сервера
  const overview = useMemo(() => {
    if (!selectedServerId) return null
    return getStatsOverview(selectedServerId, dateRange)
  }, [selectedServerId, dateRange])
  
  const historyData = useMemo(() => {
    if (!selectedServerId) return []
    return getHistoryData(selectedServerId, 'members', dateRange)
  }, [selectedServerId, dateRange])
  
  const activityData = useMemo(() => {
    if (!selectedServerId) return []
    return getHistoryData(selectedServerId, 'activity', dateRange)
  }, [selectedServerId, dateRange])
  
  const heatmapData = useMemo(() => {
    if (!selectedServerId) return []
    return getHeatmapData(selectedServerId, dateRange)
  }, [selectedServerId, dateRange])
  
  const leaderboardData = useMemo(() => {
    if (!selectedServerId) return []
    return getLeaderboardData(selectedServerId, leaderboardSortBy, dateRange)
  }, [selectedServerId, leaderboardSortBy, dateRange])
  
  // Empty State - нет подключенных серверов
  if (availableServers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <BarChart2 className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Connect Discord Stats Bot
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Connect Discord Stats Bot to see analytics for your servers. Go to Settings → Integrations → Discord Stats to get started.
          </p>
          <button
            onClick={() => router.push('/integrations/discord-stats')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors font-medium"
          >
            <Bot className="h-4 w-4" />
            Connect Bot
          </button>
        </div>
      </div>
    )
  }
  
  const isAnalyticsEnabled = selectedServer?.plan_limits.module_analytics || false
  const isLeaderboardEnabled = selectedServer?.plan_limits.module_leaderboard || false
  
  // Если выбранный сервер не подключен, показываем заглушку
  if (selectedServer && !isServerLinked) {
    return (
      <div className="space-y-6">
        {/* Global Filters Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Server</label>
                <ServerSelector
                  servers={allActiveServers}
                  selectedServerId={selectedServerId}
                  onServerChange={setSelectedServerId}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
                <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Integration Not Connected State */}
        <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <Bot className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Интеграция не настроена
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Сервер <span className="font-medium">{selectedServer.name}</span> не подключен к Discord Stats Bot.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Для просмотра аналитики необходимо подключить сервер в настройках интеграции.
            </p>
            <button
              onClick={() => router.push('/integrations/discord-stats')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors font-medium"
            >
              <Settings className="h-4 w-4" />
              Настроить интеграцию
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Global Filters Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Server</label>
              <ServerSelector
                servers={allActiveServers}
                selectedServerId={selectedServerId}
                onServerChange={setSelectedServerId}
                linkedServerIds={linkedServerIds}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
              <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'overview'
                  ? 'text-gray-900 border-black'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('engagement')}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'engagement'
                  ? 'text-gray-900 border-black'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Engagement
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'leaderboard'
                  ? 'text-gray-900 border-black'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Leaderboard
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && overview && (
            <OverviewTab
              overview={overview}
              historyData={historyData}
              dateRange={dateRange}
            />
          )}
          
          {activeTab === 'engagement' && (
            <EngagementTab
              activityData={activityData}
              heatmapData={heatmapData}
              dateRange={dateRange}
              isAnalyticsEnabled={isAnalyticsEnabled}
            />
          )}
          
          {activeTab === 'leaderboard' && (
            <LeaderboardTab
              data={leaderboardData}
              sortBy={leaderboardSortBy}
              onSortChange={setLeaderboardSortBy}
              isLeaderboardEnabled={isLeaderboardEnabled}
            />
          )}
        </div>
      </div>
    </div>
  )
}
