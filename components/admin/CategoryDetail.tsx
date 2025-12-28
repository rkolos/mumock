'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { mockCategories, Category, FormField, IntegrationConfig } from '../../data/categories'
import { useState } from 'react'
import GeneralTab from './CategorySettings/GeneralTab'
import FormBuilderTab from './CategorySettings/FormBuilderTab'
import IntegrationSettingsTab from './CategorySettings/IntegrationSettingsTab'
import AccessRolesTab from './CategorySettings/AccessRolesTab'

interface CategoryDetailProps {
  categoryId: string
}

type TabType = 'general' | 'form' | 'integration' | 'access'

const getSourceBadge = (sourceType: string) => {
  switch (sourceType) {
    case 'discord':
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          <span>Discord</span>
        </div>
      )
    case 'web_widget':
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
          <span>🌐</span>
          <span>Web Widget</span>
        </div>
      )
    case 'telegram':
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
          <span>✈️</span>
          <span>Telegram</span>
        </div>
      )
    default:
      return null
  }
}

export default function CategoryDetail({ categoryId }: CategoryDetailProps) {
  const router = useRouter()
  const originalCategory = mockCategories.find((c) => c.id === categoryId)
  
  const [category, setCategory] = useState<Category | null>(originalCategory || null)
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [isActive, setIsActive] = useState<boolean>(category?.hasAccess || false)

  if (!category) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Категория не найдена</p>
          <button
            onClick={() => router.push('/categories')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    )
  }

  const handleCategoryChange = (updates: Partial<Category>) => {
    setCategory({ ...category, ...updates })
  }

  const handleFormFieldsChange = (fields: FormField[]) => {
    setCategory({ ...category, formFields: fields })
  }

  const handleAssignedRolesChange = (roles: string[]) => {
    setCategory({ ...category, assignedRoles: roles })
  }

  const handleIntegrationConfigChange = (config: IntegrationConfig) => {
    setCategory({ ...category, integration_config: config })
  }

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving category:', category)
    alert('Изменения сохранены!')
  }

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
      // TODO: Implement delete logic
      console.log('Deleting category:', category.id)
      router.push('/categories')
    }
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'form', label: 'Form Builder' },
    { id: 'integration', label: 'Integration Settings' },
    { id: 'access', label: 'Access & Roles' },
  ]

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#e2e8f0] shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back button, Name, Badge */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/categories')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={category.categoryName}
                  onChange={(e) => handleCategoryChange({ categoryName: e.target.value })}
                  className="text-xl font-bold text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 px-0"
                  style={{ width: `${category.categoryName.length * 10 + 20}px`, minWidth: '200px' }}
                />
                {getSourceBadge(category.source_type)}
              </div>
            </div>

            {/* Right: Toggle, Delete, Save */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Active</span>
                <button
                  onClick={() => {
                    setIsActive(!isActive)
                    handleCategoryChange({ hasAccess: !isActive })
                  }}
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
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Category</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors font-medium"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="px-6 border-t border-[#e2e8f0]">
          <div className="flex items-end gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-gray-900 border-black'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.id === 'integration'
                  ? category.source_type === 'discord'
                    ? 'Discord Settings'
                    : category.source_type === 'web_widget'
                    ? 'Widget Appearance'
                    : category.source_type === 'telegram'
                    ? 'Telegram Bot'
                    : 'Integration Settings'
                  : tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'general' && (
            <GeneralTab category={category} onCategoryChange={handleCategoryChange} />
          )}
          {activeTab === 'form' && (
            <FormBuilderTab
              category={category}
              onFormFieldsChange={handleFormFieldsChange}
            />
          )}
          {activeTab === 'integration' && (
            <IntegrationSettingsTab
              category={category}
              onConfigChange={handleIntegrationConfigChange}
            />
          )}
          {activeTab === 'access' && (
            <AccessRolesTab
              category={category}
              onAssignedRolesChange={handleAssignedRolesChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}
