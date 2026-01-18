'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { IntegrationConfig, FormField } from '../../../data/categories'

interface WebWidgetSettingsProps {
  config: IntegrationConfig
  onConfigChange: (config: IntegrationConfig) => void
}

export default function WebWidgetSettings({ config, onConfigChange }: WebWidgetSettingsProps) {
  const handleChange = (field: keyof IntegrationConfig, value: string | boolean | number | FormField[] | 'low' | 'medium' | 'high') => {
    onConfigChange({
      ...config,
      [field]: value,
    })
  }

  const formFields = config.formFields || []

  const handleAddField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      name: 'new_field',
      technicalId: 'new_field',
      required: false,
      short: true,
    }
    handleChange('formFields', [...formFields, newField])
  }

  const handleDeleteField = (fieldId: string) => {
    handleChange('formFields', formFields.filter((f) => f.id !== fieldId))
  }

  const handleEditField = (fieldId: string) => {
    // В мокапе просто логируем
    console.log('Edit field:', fieldId)
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

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Limits & Logic</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={config.priority || 'medium'}
              onChange={(e) => handleChange('priority', e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Form Builder</h3>
        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-gray-700">
            Кастомные формы позволяют собирать дополнительную информацию от пользователей при создании тикета.
          </p>
        </div>

        <div className="space-y-3 mb-4">
          {formFields.map((field) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {field.required && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Required
                      </span>
                    )}
                    {field.short && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Short
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{field.name}</p>
                  <p className="text-xs text-gray-500 mt-1">ID: {field.technicalId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditField(field.id)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="p-2 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {formFields.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">
              Нет полей. Нажмите "Add Field" чтобы добавить.
            </p>
          )}
        </div>

        <button
          onClick={handleAddField}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Field</span>
        </button>

        {formFields.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Form Preview (Web Widget)</h4>
            <div className="space-y-4">
              {formFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.name} {field.required && '*'}
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-500"
                    placeholder={`Enter ${field.name}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

