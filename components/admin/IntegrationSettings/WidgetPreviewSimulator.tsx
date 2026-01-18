'use client'

import { useState, useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import { Category } from '../../../data/categories'
import { getCategoryConfigForIntegration } from './CategorySettingsDialog'
import { mockCategories } from '../../../data/categories'

interface WidgetPreviewSimulatorProps {
  welcomeText?: string
  successMessage?: string
  selectedCategoryId?: string | null
  onCategoryClick?: (categoryId: string | null) => void
}

type SimulatorState = 'onboarding' | 'category_form' | 'ticket_created'

export default function WidgetPreviewSimulator({
  welcomeText = 'How can we help you?',
  successMessage = 'Thank you for contacting us!',
  selectedCategoryId,
  onCategoryClick,
}: WidgetPreviewSimulatorProps) {
  const [state, setState] = useState<SimulatorState>('onboarding')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  
  // Получаем категории для web_widget - только те, что показаны на вкладке Categories
  // Используем ту же логику, что и в WidgetCategoriesTab
  const categories = mockCategories.filter((cat) => cat.source_type === 'web_widget')

  // Если selectedCategoryId изменился, показываем форму
  useEffect(() => {
    if (state === 'ticket_created') return
    
    if (selectedCategoryId && selectedCategoryId !== selectedCategory?.id) {
      const category = categories.find((c) => c.id === selectedCategoryId)
      if (category) {
        setSelectedCategory(category)
        setState('category_form')
      }
    } else if (!selectedCategoryId && selectedCategory) {
      setSelectedCategory(null)
      setState('onboarding')
      setFormData({})
    }
  }, [selectedCategoryId, categories, selectedCategory, state])

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category)
    setState('category_form')
    onCategoryClick?.(category.id)
  }

  const handleCancel = () => {
    setState('onboarding')
    setSelectedCategory(null)
    setFormData({})
    onCategoryClick?.(null)
  }

  const handleReset = () => {
    setState('onboarding')
    setSelectedCategory(null)
    setFormData({})
    onCategoryClick?.(null)
  }

  const handleFormDataChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleCheckboxChange = (fieldId: string, optionValue: string, checked: boolean) => {
    const currentValue = formData[fieldId] || '[]'
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

    handleFormDataChange(fieldId, JSON.stringify(selectedValues))
  }

  const handleSubmit = () => {
    setState('ticket_created')
  }

  // Form State - показывает форму выбранной категории
  if (state === 'category_form' && selectedCategory) {
    const config = getCategoryConfigForIntegration(selectedCategory, 'web_widget')
    const formFields = config.formFields || []

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Interactive Preview</h3>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
            title="Сбросить превью"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="mb-4 pb-3 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">{selectedCategory.categoryName}</h4>
          </div>

          <div className="space-y-4 mb-4">
            {formFields.map((field) => {
              const fieldLabel = field.label || field.name
              const fieldType = field.type || (field.short ? 'short' : 'paragraph')
              const placeholder = field.placeholder || `Enter ${fieldLabel}`

              if (fieldType === 'paragraph') {
                return (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFormDataChange(field.id, e.target.value)}
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
                      {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFormDataChange(field.id, e.target.value)}
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
                      {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-2 p-3 rounded-lg">
                      {(field.options || []).map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`preview_${field.id}`}
                            value={option.value}
                            checked={formData[field.id] === option.value}
                            onChange={(e) => handleFormDataChange(field.id, e.target.value)}
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
                const currentValue = formData[field.id] || '[]'
                let selectedValues: string[] = []
                try {
                  selectedValues = JSON.parse(currentValue) || []
                } catch {
                  selectedValues = []
                }

                return (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-2 p-3 rounded-lg">
                      {(field.options || []).map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name={`preview_${field.id}`}
                            value={option.value}
                            checked={selectedValues.includes(option.value)}
                            onChange={(e) => handleCheckboxChange(field.id, option.value, e.target.checked)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              }

              // Short (text input)
              return (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                    placeholder={placeholder}
                  />
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Ticket Created State
  if (state === 'ticket_created') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Interactive Preview</h3>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
            title="Сбросить превью"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Ticket Created!</h4>
            <p className="text-sm text-gray-600">{successMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  // Onboarding State - показывает приветственное сообщение и список категорий
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Interactive Preview</h3>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="mb-4 pb-3 border-b border-gray-200">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{welcomeText}</p>
        </div>

        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-sm text-gray-400">Нет категорий</p>
          ) : (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-900"
              >
                {category.categoryName}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
