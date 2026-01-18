'use client'

import { useState, Suspense } from 'react'
import Sidebar from '../../../components/admin/Sidebar'
import Header from '../../../components/admin/Header'
import IntegrationDetailLayout from '../../../components/admin/IntegrationSettings/IntegrationDetailLayout'
import EmailConnectionTab from '../../../components/admin/IntegrationSettings/EmailConnectionTab'
import EmailCategoriesTab from '../../../components/admin/IntegrationSettings/EmailCategoriesTab'
import EmailSettingsTab from '../../../components/admin/IntegrationSettings/EmailSettingsTab'
import EmailLogsTab from '../../../components/admin/IntegrationSettings/EmailLogsTab'
import { getIntegrationById, Integration, IntegrationSettings } from '../../../data/integrations'
import { Mail } from 'lucide-react'

export default function EmailIntegrationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const integration = getIntegrationById('email_forwarding')

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
          <EmailIntegrationContent integration={integration} />
        </main>
      </div>
    </div>
  )
}

function EmailIntegrationContent({ integration }: { integration: Integration }) {
  const [activeTab, setActiveTab] = useState<string>('connection')
  const [settings, setSettings] = useState<IntegrationSettings>(
    integration.settings || {}
  )
  const [isActive, setIsActive] = useState<boolean>(integration.isActive)

  const tabs = [
    { id: 'connection', label: 'Connection' },
    { id: 'categories', label: 'Categories' },
    { id: 'settings', label: 'Settings' },
    { id: 'logs', label: 'Logs' },
  ]

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving Email integration:', { ...integration, settings, isActive })
    alert('Изменения сохранены!')
  }

  const handleSettingsChange = (newSettings: IntegrationSettings) => {
    setSettings(newSettings)
  }

  const logo = <Mail className="w-8 h-8 text-gray-600" />

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
        <EmailConnectionTab
          integration={integration}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      )}
      {activeTab === 'categories' && (
        <EmailCategoriesTab integrationId={integration.id} />
      )}
      {activeTab === 'settings' && (
        <EmailSettingsTab settings={settings} onSettingsChange={handleSettingsChange} />
      )}
      {activeTab === 'logs' && <EmailLogsTab integrationId={integration.id} />}
    </IntegrationDetailLayout>
  )
}
