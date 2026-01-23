'use client'

import { useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '../../../../components/admin/Sidebar'
import Header from '../../../../components/admin/Header'
import IntegrationDetailLayout from '../../../../components/admin/IntegrationSettings/IntegrationDetailLayout'
import DiscordStatsCountersTab from '../../../../components/admin/IntegrationSettings/DiscordStatsCountersTab'
import DiscordStatsEventsTab from '../../../../components/admin/IntegrationSettings/DiscordStatsEventsTab'
import DiscordStatsServerSettingsTab from '../../../../components/admin/IntegrationSettings/DiscordStatsServerSettingsTab'
import { getGuildById, GuildConfig } from '../../../../data/discordStats'
import { ConnectionStatus } from '../../../../data/integrations'

export default function DiscordStatsGuildPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const params = useParams()
  const guildId = params?.guildId as string
  const guild = guildId ? getGuildById(guildId) : undefined

  if (!guild) {
    return (
      <div className="flex h-screen bg-[#f8fafc]">
        <Suspense fallback={<div className="fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[#1e293b]" />}>
          <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        </Suspense>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Сервер не найден</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Suspense fallback={<div className="fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[#1e293b]" />}>
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </Suspense>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          <DiscordStatsGuildContent guild={guild} />
        </main>
      </div>
    </div>
  )
}

function DiscordStatsGuildContent({ guild }: { guild: GuildConfig }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('counters')
  const [guildConfig, setGuildConfig] = useState<GuildConfig>(guild)

  const tabs = [
    { id: 'counters', label: 'Counters' },
    { id: 'events', label: 'Events' },
    { id: 'settings', label: 'Settings & Limits' },
  ]

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving guild config:', guildConfig)
    alert('Изменения сохранены!')
  }

  const handleGuildConfigChange = (newConfig: GuildConfig) => {
    setGuildConfig(newConfig)
  }

  // Создаем mock интеграцию для использования IntegrationDetailLayout
  const mockIntegration = {
    id: 'discord_stats_bot',
    name: `Настройка сервера "${guild.name}"`,
    description: 'Управление счетчиками, событиями и настройками сервера',
    logo: '/assets/logos/discord.svg',
    isActive: guild.status === 'active',
    connectionStatus: (guild.status === 'active' ? 'connected' : 'not_configured') as ConnectionStatus,
    configUrl: `/integrations/discord-stats/${guild.guild_id}`,
  }

  const logo = (
    <div className="flex items-center gap-3">
      {guild.icon ? (
        <img
          src={guild.icon}
          alt={guild.name}
          className="h-8 w-8 rounded-full object-cover flex-shrink-0"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const fallback = target.nextElementSibling as HTMLElement
            if (fallback) fallback.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        className={`h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 ${
          guild.icon ? 'hidden' : ''
        }`}
      >
        <span className="text-white text-xs font-semibold">
          {guild.name.charAt(0).toUpperCase()}
        </span>
      </div>
    </div>
  )

  return (
    <IntegrationDetailLayout
      integration={mockIntegration}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
      onSave={handleSave}
      isActive={guild.status === 'active'}
      onToggleActive={(active) => {
        setGuildConfig({ ...guildConfig, status: active ? 'active' : 'kicked' })
      }}
      logo={logo}
    >
      {activeTab === 'counters' && (
        <DiscordStatsCountersTab
          guild={guildConfig}
          onGuildConfigChange={handleGuildConfigChange}
        />
      )}
      {activeTab === 'events' && (
        <DiscordStatsEventsTab
          guild={guildConfig}
          onGuildConfigChange={handleGuildConfigChange}
        />
      )}
      {activeTab === 'settings' && (
        <DiscordStatsServerSettingsTab guild={guildConfig} />
      )}
    </IntegrationDetailLayout>
  )
}
