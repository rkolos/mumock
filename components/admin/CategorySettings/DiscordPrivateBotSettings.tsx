'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, GripVertical, X } from 'lucide-react'
import { Category, IntegrationConfig, FormField } from '../../../data/categories'

interface DiscordPrivateBotSettingsProps {
  category: Category
  config: IntegrationConfig
  onConfigChange: (config: IntegrationConfig) => void
}

export default function DiscordPrivateBotSettings({ category, config, onConfigChange }: DiscordPrivateBotSettingsProps) {
  const formFields = config.formFields || []
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null)
  
  const handleChange = (field: keyof IntegrationConfig, value: string | boolean | number | 'low' | 'medium' | 'high' | FormField[]) => {
    onConfigChange({
      ...config,
      [field]: value,
    })
  }

  const handleAddField = () => {
    if (formFields.length >= 5) {
      alert('Максимум 5 полей в форме')
      return
    }
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
    handleChange('formFields', [...formFields, newField] as FormField[])
    setEditingFieldId(newField.id)
  }

  const handleDeleteField = (fieldId: string) => {
    handleChange('formFields', formFields.filter((f) => f.id !== fieldId) as FormField[])
    if (editingFieldId === fieldId) {
      setEditingFieldId(null)
    }
  }

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    const updatedFields = formFields.map((f) =>
      f.id === fieldId ? { ...f, ...updates } : f
    )
    handleChange('formFields', updatedFields as FormField[])
  }

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedFieldId(fieldId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault()
    if (!draggedFieldId || draggedFieldId === targetFieldId) return

    const draggedIndex = formFields.findIndex((f) => f.id === draggedFieldId)
    const targetIndex = formFields.findIndex((f) => f.id === targetFieldId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newFields = [...formFields]
    const [draggedField] = newFields.splice(draggedIndex, 1)
    newFields.splice(targetIndex, 0, draggedField)

    handleChange('formFields', newFields as FormField[])
    setDraggedFieldId(null)
  }

  const handleDragEnd = () => {
    setDraggedFieldId(null)
  }

  return (
    <div className="space-y-6">
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
            <p className="mt-1 text-xs text-gray-500">
              Приоритет по умолчанию для тикетов этой категории
            </p>
          </div>
        </div>
      </div>

      {/* Form Builder Section */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Form Builder</h3>
        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-gray-700">
            Конструктор формы, которая всплывет в Дискорде после выбора категории
          </p>
        </div>

        <div className="space-y-3 mb-4">
          {formFields.map((field, index) => {
            const isEditing = editingFieldId === field.id
            const isDragging = draggedFieldId === field.id
            const fieldLabel = field.label || field.name
            const fieldType = field.type || (field.short ? 'short' : 'paragraph')

            return (
              <div
                key={field.id}
                draggable
                onDragStart={(e) => handleDragStart(e, field.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, field.id)}
                onDragEnd={handleDragEnd}
                className={`p-4 border border-gray-200 rounded-lg transition-colors ${
                  isDragging ? 'opacity-50' : 'hover:bg-gray-50'
                } ${isEditing ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                {!isEditing ? (
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="cursor-move text-gray-400 hover:text-gray-600 mt-1">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {field.required && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Required
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {fieldType === 'short' ? 'Short' : 'Paragraph'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{fieldLabel}</p>
                        {field.placeholder && (
                          <p className="text-xs text-gray-500 mt-1">Placeholder: {field.placeholder}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">ID: {field.technicalId}</p>
                      </div>
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
                        onChange={(e) =>
                          handleUpdateField(field.id, {
                            type: e.target.value as 'short' | 'paragraph',
                            short: e.target.value === 'short',
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="short">Short (строка)</option>
                        <option value="paragraph">Paragraph (текст)</option>
                      </select>
                    </div>
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

        {/* First Message Field Selection */}
        {formFields.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Поле для первого сообщения пользователя
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Выберите поле формы, в которое будет автоматически вставлен текст первого сообщения пользователя
            </p>
            <select
              value={config.first_message_field_id || ''}
              onChange={(e) => {
                const value = e.target.value || ''
                if (value === '') {
                  // Удаляем поле из конфигурации если выбрано "Не указано"
                  const { first_message_field_id, ...rest } = config
                  onConfigChange(rest as IntegrationConfig)
                } else {
                  handleChange('first_message_field_id', value)
                }
              }}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Не указано</option>
              {formFields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.label || field.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleAddField}
          disabled={formFields.length >= 5}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          <span>Add Field {formFields.length >= 5 ? '(Max 5)' : ''}</span>
        </button>
      </div>
    </div>
  )
}
