'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { ReactNode } from 'react'
import { Integration, ConnectionStatus } from '../../../data/integrations'
import ConnectionStatusBadge from './ConnectionStatusBadge'

interface IntegrationDetailLayoutProps {
  integration: Integration
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: { id: string; label: string }[]
  children: ReactNode
  onSave?: () => void
  isActive: boolean
  onToggleActive: (active: boolean) => void
  logo?: ReactNode
}

export default function IntegrationDetailLayout({
  integration,
  activeTab,
  onTabChange,
  tabs,
  children,
  onSave,
  isActive,
  onToggleActive,
  logo,
}: IntegrationDetailLayoutProps) {
  const router = useRouter()

  const handleSave = () => {
    onSave?.()
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#e2e8f0] shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back button, Name, Logo, Status */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/integrations')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                {logo && <div className="flex items-center justify-center w-8 h-8">{logo}</div>}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{integration.name}</h1>
                  <p className="text-sm text-gray-500">{integration.description}</p>
                </div>
                <ConnectionStatusBadge status={integration.connectionStatus} />
              </div>
            </div>

            {/* Right: Toggle, Save */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Active</span>
                <button
                  onClick={() => onToggleActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isActive ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {onSave && (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors font-medium"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="px-6 border-t border-[#e2e8f0]">
          <div className="flex items-end gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-gray-900 border-black'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
