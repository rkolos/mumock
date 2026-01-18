'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'
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
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
  const [previewFormData, setPreviewFormData] = useState<Record<string, string>>({})

  const handleAddField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      name: 'new_field',
      technicalId: `field_${Date.now()}`,
      required: false,
      short: true,
      label: 'new_field',
      type: 'short',
      placeholder: '',
    }
    handleChange('formFields', [...formFields, newField])
    setEditingFieldId(newField.id)
  }

  const handleDeleteField = (fieldId: string) => {
    handleChange('formFields', formFields.filter((f) => f.id !== fieldId))
    if (editingFieldId === fieldId) {
      setEditingFieldId(null)
    }
  }

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    const updatedFields = formFields.map((f) =>
      f.id === fieldId ? { ...f, ...updates } : f
    )
    handleChange('formFields', updatedFields)
  }

  const handleAddOption = (fieldId: string) => {
    const field = formFields.find((f) => f.id === fieldId)
    if (!field) return

    const newOptions = [
      ...(field.options || []),
      { value: `option_${Date.now()}`, label: 'Новая опция' },
    ]
    handleUpdateField(fieldId, { options: newOptions })
  }

  const handleUpdateOption = (fieldId: string, optionIndex: number, updates: { value?: string; label?: string }) => {
    const field = formFields.find((f) => f.id === fieldId)
    if (!field || !field.options) return

    const newOptions = field.options.map((opt, idx) =>
      idx === optionIndex ? { ...opt, ...updates } : opt
    )
    handleUpdateField(fieldId, { options: newOptions })
  }

  const handleDeleteOption = (fieldId: string, optionIndex: number) => {
    const field = formFields.find((f) => f.id === fieldId)
    if (!field || !field.options) return

    const newOptions = field.options.filter((_, idx) => idx !== optionIndex)
    handleUpdateField(fieldId, { options: newOptions })
  }

  // Синхронизация состояния предпросмотра при изменении полей
  useEffect(() => {
    const newPreviewData: Record<string, string> = {}
    
    formFields.forEach((field) => {
      const fieldType = field.type || (field.short ? 'short' : 'paragraph')
      
      if (fieldType === 'checkbox') {
        // Для checkbox инициализируем пустым JSON массивом
        if (!previewFormData[field.id]) {
          newPreviewData[field.id] = '[]'
        } else {
          newPreviewData[field.id] = previewFormData[field.id]
        }
      } else {
        // Для остальных типов - пустая строка
        if (!previewFormData[field.id]) {
          newPreviewData[field.id] = ''
        } else {
          newPreviewData[field.id] = previewFormData[field.id]
        }
      }
    })

    setPreviewFormData(newPreviewData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formFields.length, formFields.map(f => f.id).join(',')])

  const handlePreviewInputChange = (fieldId: string, value: string) => {
    setPreviewFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handlePreviewCheckboxChange = (fieldId: string, optionValue: string, checked: boolean) => {
    const currentValue = previewFormData[fieldId] || '[]'
    let selectedValues: string[] = []
    
    try {
      selectedValues = JSON.parse(currentValue) || []
    } catch {
      selectedValues = []
    }

    if (checked) {
      if (!selectedValues.includes(optionValue)) {
        selectedValues.push(optionValue)
      }
    } else {
      selectedValues = selectedValues.filter(v => v !== optionValue)
    }

    handlePreviewInputChange(fieldId, JSON.stringify(selectedValues))
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
          {formFields.map((field) => {
            const isEditing = editingFieldId === field.id
            const fieldLabel = field.label || field.name
            const fieldType = field.type || (field.short ? 'short' : 'paragraph')
            const needsOptions = fieldType === 'dropdown' || fieldType === 'radio' || fieldType === 'checkbox'

            return (
              <div
                key={field.id}
                className={`p-4 border border-gray-200 rounded-lg transition-colors ${
                  isEditing ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                }`}
              >
                {!isEditing ? (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {field.required && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Required
                          </span>
                        )}
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {fieldType === 'short' ? 'Short' : 
                           fieldType === 'paragraph' ? 'Paragraph' :
                           fieldType === 'dropdown' ? 'Dropdown' :
                           fieldType === 'radio' ? 'Radio' :
                           fieldType === 'checkbox' ? 'Checkbox' : 'Text'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{fieldLabel}</p>
                      {field.placeholder && (
                        <p className="text-xs text-gray-500 mt-1">Placeholder: {field.placeholder}</p>
                      )}
                      {needsOptions && field.options && field.options.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Опций: {field.options.length}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">ID: {field.technicalId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingFieldId(field.id)}
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
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Редактирование поля</h4>
                      <button
                        onClick={() => setEditingFieldId(null)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Label (Вопрос)
                      </label>
                      <input
                        type="text"
                        value={fieldLabel}
                        onChange={(e) =>
                          handleUpdateField(field.id, {
                            label: e.target.value,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ваш Email"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={fieldType}
                        onChange={(e) => {
                          const newType = e.target.value as 'short' | 'paragraph' | 'dropdown' | 'radio' | 'checkbox'
                          const updates: Partial<FormField> = {
                            type: newType,
                            short: newType === 'short',
                          }
                          if ((newType === 'dropdown' || newType === 'radio' || newType === 'checkbox') && !field.options) {
                            updates.options = []
                          }
                          handleUpdateField(field.id, updates)
                        }}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="short">Short (строка)</option>
                        <option value="paragraph">Paragraph (текст)</option>
                        <option value="dropdown">Dropdown (выпадающий список)</option>
                        <option value="radio">Radio (один из многих)</option>
                        <option value="checkbox">Checkbox (много из многих)</option>
                      </select>
                    </div>
                    {needsOptions && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-medium text-gray-700">
                            Опции
                          </label>
                          <button
                            onClick={() => handleAddOption(field.id)}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            + Добавить опцию
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(field.options || []).map((option, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={option.label}
                                onChange={(e) => handleUpdateOption(field.id, idx, { label: e.target.value })}
                                placeholder="Название опции"
                                className="flex-1 px-2 py-1.5 text-xs bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                value={option.value}
                                onChange={(e) => handleUpdateOption(field.id, idx, { value: e.target.value })}
                                placeholder="Значение"
                                className="flex-1 px-2 py-1.5 text-xs bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                onClick={() => handleDeleteOption(field.id, idx)}
                                className="p-1.5 hover:bg-red-50 rounded transition-colors"
                              >
                                <X className="h-3 w-3 text-red-600" />
                              </button>
                            </div>
                          ))}
                          {(!field.options || field.options.length === 0) && (
                            <p className="text-xs text-gray-500 italic">Нет опций. Нажмите "Добавить опцию" чтобы добавить.</p>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Placeholder (Подсказка)
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Введите текст..."
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-700">Обязательно</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required || false}
                          onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
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
              {formFields.map((field) => {
                const fieldLabel = field.label || field.name
                const fieldType = field.type || (field.short ? 'short' : 'paragraph')
                const placeholder = field.placeholder || `Enter ${fieldLabel}`

                if (fieldType === 'paragraph') {
                  return (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {fieldLabel} {field.required && '*'}
                      </label>
                      <textarea
                        value={previewFormData[field.id] || ''}
                        onChange={(e) => handlePreviewInputChange(field.id, e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all text-gray-900"
                        placeholder={placeholder}
                      />
                    </div>
                  )
                }

                if (fieldType === 'dropdown') {
                  return (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {fieldLabel} {field.required && '*'}
                      </label>
                      <select
                        value={previewFormData[field.id] || ''}
                        onChange={(e) => handlePreviewInputChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white text-gray-900"
                      >
                        <option value="">Выберите...</option>
                        {(field.options || []).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                }

                if (fieldType === 'radio') {
                  return (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {fieldLabel} {field.required && '*'}
                      </label>
                      <div className="space-y-2 p-3 rounded-lg">
                        {(field.options || []).map((option) => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`preview_${field.id}`}
                              value={option.value}
                              checked={previewFormData[field.id] === option.value}
                              onChange={(e) => handlePreviewInputChange(field.id, e.target.value)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                }

                if (fieldType === 'checkbox') {
                  const currentValue = previewFormData[field.id] || '[]'
                  let selectedValues: string[] = []
                  try {
                    selectedValues = JSON.parse(currentValue) || []
                  } catch {
                    selectedValues = []
                  }

                  return (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {fieldLabel} {field.required && '*'}
                      </label>
                      <div className="space-y-2 p-3 rounded-lg">
                        {(field.options || []).map((option) => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name={`preview_${field.id}`}
                              value={option.value}
                              checked={selectedValues.includes(option.value)}
                              onChange={(e) => handlePreviewCheckboxChange(field.id, option.value, e.target.checked)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {fieldLabel} {field.required && '*'}
                    </label>
                    <input
                      type="text"
                      value={previewFormData[field.id] || ''}
                      onChange={(e) => handlePreviewInputChange(field.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                      placeholder={placeholder}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

