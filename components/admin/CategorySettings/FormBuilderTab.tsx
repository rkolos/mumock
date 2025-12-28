'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Category, FormField, SourceType } from '../../../data/categories'

interface FormBuilderTabProps {
  category: Category
  onFormFieldsChange: (fields: FormField[]) => void
}

export default function FormBuilderTab({ category, onFormFieldsChange }: FormBuilderTabProps) {
  const [previewMode, setPreviewMode] = useState<'discord' | 'web'>('discord')

  const handleAddField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      name: 'new_field',
      technicalId: 'new_field',
      required: false,
      short: true,
    }
    onFormFieldsChange([...category.formFields, newField])
  }

  const handleDeleteField = (fieldId: string) => {
    onFormFieldsChange(category.formFields.filter((f) => f.id !== fieldId))
  }

  const handleEditField = (fieldId: string) => {
    // В мокапе просто логируем
    console.log('Edit field:', fieldId)
  }

  const getSourceType = (): SourceType => {
    return category.source_type
  }

  const showPreviewToggle = getSourceType() === 'discord' || getSourceType() === 'web_widget'

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Left Section - Form Fields Editor (8/12 или 6/12) */}
      <div className={`${showPreviewToggle ? 'md:col-span-8' : 'md:col-span-12'} bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Form Fields</h3>
          <button
            onClick={handleAddField}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Field</span>
          </button>
        </div>

        {/* Info Block */}
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-gray-700">
            Кастомные формы позволяют собирать дополнительную информацию от пользователей при создании тикета.
          </p>
        </div>

        {/* Fields List */}
        <div className="space-y-3">
          {category.formFields.map((field) => (
            <div
              key={field.id}
              className="p-4 border border-[#e2e8f0] rounded-lg hover:bg-gray-50 transition-colors cursor-grab"
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
          {category.formFields.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">
              Нет полей. Нажмите "Add Field" чтобы добавить.
            </p>
          )}
        </div>
      </div>

      {/* Right Section - Form Preview (4/12) */}
      {showPreviewToggle && (
        <div className="md:col-span-4">
          <div className="sticky top-6 bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Form Preview</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode('discord')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    previewMode === 'discord'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Discord
                </button>
                <button
                  onClick={() => setPreviewMode('web')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    previewMode === 'web'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Web Widget
                </button>
              </div>
            </div>

            {previewMode === 'discord' ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-900 rounded-lg text-white">
                  <p className="text-sm font-medium mb-3">Discord Modal</p>
                  {category.formFields.map((field) => (
                    <div key={field.id} className="mb-3">
                      <label className="block text-xs text-gray-300 mb-1">
                        {field.name} {field.required && '*'}
                      </label>
                      <input
                        type="text"
                        readOnly
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                        placeholder={`Enter ${field.name}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {category.formFields.map((field) => (
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
            )}

            {category.formFields.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">
                Предпросмотр появится после добавления полей
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

