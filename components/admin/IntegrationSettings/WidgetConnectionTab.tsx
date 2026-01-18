'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Integration, IntegrationSettings } from '../../../data/integrations'
import SecretField from './SecretField'

interface WidgetConnectionTabProps {
  integration: Integration
  settings: IntegrationSettings
  onSettingsChange: (settings: IntegrationSettings) => void
}

export default function WidgetConnectionTab({
  integration,
  settings,
  onSettingsChange,
}: WidgetConnectionTabProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyEmbedCode = () => {
    const embedCode = settings.widget_embed_code || ''
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerateApiKey = () => {
    // TODO: Implement API key generation
    const newKey = 'widget_' + Math.random().toString(36).substring(2, 15)
    onSettingsChange({
      ...settings,
      widget_api_key: newKey,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Widget Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Widget ID
            </label>
            <input
              type="text"
              value={settings.widget_id || ''}
              readOnly
              className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md text-gray-600 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Auto-generated widget identifier</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <div className="flex items-center gap-2">
              <SecretField
                value={settings.widget_api_key || ''}
                onChange={(value) => onSettingsChange({ ...settings, widget_api_key: value })}
                placeholder="Enter or generate API key"
                className="flex-1"
              />
              <button
                onClick={handleGenerateApiKey}
                className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-md transition-colors font-medium text-sm"
              >
                Generate
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Embed Code
            </label>
            <div className="relative">
              <textarea
                value={settings.widget_embed_code || ''}
                readOnly
                rows={3}
                className="w-full px-3 py-2 pr-10 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <button
                onClick={handleCopyEmbedCode}
                className="absolute right-2 top-2 p-2 text-gray-500 hover:text-gray-700"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Copy this code and paste it before the closing {'</body>'} tag on your website
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Widget Status</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${integration.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-700">
            {integration.isActive ? 'Widget is active' : 'Widget is inactive'}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Preview</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <iframe
            src="/widget-preview"
            className="w-full h-96 border border-gray-200 rounded"
            title="Widget Preview"
          />
        </div>
      </div>
    </div>
  )
}
