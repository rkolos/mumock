'use client'

import { useState } from 'react'
import { IntegrationSettings } from '../../../data/integrations'
import WidgetPreviewSimulator from './WidgetPreviewSimulator'

interface WidgetSettingsTabProps {
  settings: IntegrationSettings
  onSettingsChange: (settings: IntegrationSettings) => void
}

export default function WidgetSettingsTab({
  settings,
  onSettingsChange,
}: WidgetSettingsTabProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const handleChange = (field: keyof IntegrationSettings, value: string | boolean) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Global Widget Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.default_widget_color || '#000000'}
                onChange={(e) => handleChange('default_widget_color', e.target.value)}
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings.default_widget_color || ''}
                onChange={(e) => handleChange('default_widget_color', e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Widget Position
            </label>
            <select
              value="bottom-right"
              onChange={() => {}}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Default Messages</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Welcome Text
            </label>
            <input
              type="text"
              value={settings.default_widget_title || ''}
              onChange={(e) => handleChange('default_widget_title', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="How can we help you?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Success Message
            </label>
            <input
              type="text"
              value={settings.default_welcome_message || ''}
              onChange={(e) => handleChange('default_welcome_message', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Thank you for contacting us!"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Behavior</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Auto-open on Page Load
              </label>
              <p className="text-xs text-gray-500">Automatically open widget when page loads</p>
            </div>
            <button
              onClick={() => handleChange('default_welcome_message', !false)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                false ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  false ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Show Notification Badge
              </label>
              <p className="text-xs text-gray-500">Show notification badge on widget icon</p>
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

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Allow Guest Submissions (Global)
              </label>
              <p className="text-xs text-gray-500">Allow tickets without user login</p>
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
      </div>

      {/* Simulator */}
      <div className="lg:col-span-4 lg:sticky lg:top-6 h-fit">
        <WidgetPreviewSimulator
          welcomeText={settings.default_widget_title || 'How can we help you?'}
          successMessage={settings.default_welcome_message || 'Thank you for contacting us!'}
          selectedCategoryId={selectedCategoryId}
          onCategoryClick={setSelectedCategoryId}
        />
      </div>
    </div>
  )
}
