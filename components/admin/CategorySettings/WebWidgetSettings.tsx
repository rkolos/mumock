'use client'

import { IntegrationConfig } from '../../../data/categories'

interface WebWidgetSettingsProps {
  config: IntegrationConfig
  onConfigChange: (config: IntegrationConfig) => void
}

export default function WebWidgetSettings({ config, onConfigChange }: WebWidgetSettingsProps) {
  const handleChange = (field: keyof IntegrationConfig, value: string | boolean) => {
    onConfigChange({
      ...config,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Visuals</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accent Color (Цвет шапки тикета)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.widget_color || '#000000'}
                onChange={(e) => handleChange('widget_color', e.target.value)}
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={config.widget_color || ''}
                onChange={(e) => handleChange('widget_color', e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#000000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Widget Title (Заголовок окна)
            </label>
            <input
              type="text"
              value={config.widget_title || ''}
              onChange={(e) => handleChange('widget_title', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Свяжитесь с нами"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Behavior</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Success Message (Что показать после отправки формы)
            </label>
            <input
              type="text"
              value={config.success_text || ''}
              onChange={(e) => handleChange('success_text', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Спасибо за обращение!"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return URL (Куда редиректить после создания)
            </label>
            <input
              type="url"
              value={config.return_url || ''}
              onChange={(e) => handleChange('return_url', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/thank-you"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Allow Guest Submission (Тикеты без логина)
            </label>
            <button
              onClick={() => handleChange('allow_guest_submission', !config.allow_guest_submission)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.allow_guest_submission ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.allow_guest_submission ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

