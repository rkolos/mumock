'use client'

import { useState, Suspense } from 'react'
import Sidebar from '../../../components/admin/Sidebar'
import Header from '../../../components/admin/Header'
import IntegrationDetailLayout from '../../../components/admin/IntegrationSettings/IntegrationDetailLayout'
import TelegramConnectionTab from '../../../components/admin/IntegrationSettings/TelegramConnectionTab'
import TelegramCategoriesTab from '../../../components/admin/IntegrationSettings/TelegramCategoriesTab'
import TelegramSettingsTab from '../../../components/admin/IntegrationSettings/TelegramSettingsTab'
import { getIntegrationById, Integration, IntegrationSettings } from '../../../data/integrations'
import { MessageSquare } from 'lucide-react'

export default function TelegramIntegrationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const integration = getIntegrationById('telegram_bot')

  if (!integration) {
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
                <p className="text-gray-600">Интеграция не найдена</p>
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
          <TelegramIntegrationContent integration={integration} />
        </main>
      </div>
    </div>
  )
}

function TelegramIntegrationContent({ integration }: { integration: Integration }) {
  const [activeTab, setActiveTab] = useState<string>('connection')
  const [settings, setSettings] = useState<IntegrationSettings>(
    integration.settings || {}
  )
  const [isActive, setIsActive] = useState<boolean>(integration.isActive)

  const tabs = [
    { id: 'connection', label: 'Connection' },
    { id: 'categories', label: 'Categories' },
    { id: 'settings', label: 'Settings' },
  ]

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving Telegram integration:', { ...integration, settings, isActive })
    alert('Изменения сохранены!')
  }

  const handleSettingsChange = (newSettings: IntegrationSettings) => {
    setSettings(newSettings)
  }

  const logo = <MessageSquare className="w-8 h-8 text-blue-500" />

  return (
    <IntegrationDetailLayout
      integration={integration}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
      onSave={handleSave}
      isActive={isActive}
      onToggleActive={setIsActive}
      logo={logo}
    >
      {activeTab === 'connection' && (
        <TelegramConnectionTab
          integration={integration}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      )}
      {activeTab === 'categories' && (
        <TelegramCategoriesTab integrationId={integration.id} />
      )}
      {activeTab === 'settings' && (
        <TelegramSettingsTab settings={settings} onSettingsChange={handleSettingsChange} />
      )}
    </IntegrationDetailLayout>
  )
}
