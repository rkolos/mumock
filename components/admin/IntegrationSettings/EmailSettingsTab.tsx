'use client'

import { IntegrationSettings } from '../../../data/integrations'

interface EmailSettingsTabProps {
  settings: IntegrationSettings
  onSettingsChange: (settings: IntegrationSettings) => void
}

export default function EmailSettingsTab({
  settings,
  onSettingsChange,
}: EmailSettingsTabProps) {
  const handleChange = (field: keyof IntegrationSettings, value: string | boolean) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Auto-reply Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enable Auto-reply
              </label>
              <p className="text-xs text-gray-500">Automatically reply to incoming emails</p>
            </div>
            <button
              onClick={() => handleChange('default_welcome_message', !true)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                true ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  true ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Email Templates</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auto-reply Template
            </label>
            <textarea
              value={settings.default_welcome_message || ''}
              onChange={(e) => handleChange('default_welcome_message', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Thank you for contacting us. We have received your email and will respond shortly."
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Spam Filtering</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enable Spam Filtering
              </label>
              <p className="text-xs text-gray-500">Automatically filter spam emails</p>
            </div>
            <button
              onClick={() => handleChange('default_welcome_message', !true)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                true ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  true ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Attachment Handling</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Attachment Size (MB)
            </label>
            <input
              type="number"
              value={25}
              onChange={() => {}}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="25"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allowed File Types
            </label>
            <input
              type="text"
              value="pdf,doc,docx,xls,xlsx,zip,jpg,png"
              onChange={() => {}}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="pdf,doc,docx,xls,xlsx,zip,jpg,png"
            />
            <p className="mt-1 text-xs text-gray-500">
              Comma-separated list of allowed file extensions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
