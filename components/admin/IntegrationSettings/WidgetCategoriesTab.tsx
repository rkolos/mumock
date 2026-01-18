'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Category, IntegrationConfig, SourceType } from '../../../data/categories'
import { mockCategories } from '../../../data/categories'
import CategoriesTable from './CategoriesTable'
import LinkCategoryDialog from './LinkCategoryDialog'
import CategorySettingsDialog from './CategorySettingsDialog'

interface WidgetCategoriesTabProps {
  integrationId: string
}

export default function WidgetCategoriesTab({ integrationId }: WidgetCategoriesTabProps) {
  const [categories, setCategories] = useState<Category[]>(
    mockCategories.filter((cat) => cat.source_type === 'web_widget')
  )
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const handleUnlink = (categoryId: string) => {
    // TODO: Implement unlink logic
    const updatedCategories = categories.filter((cat) => cat.id !== categoryId)
    setCategories(updatedCategories)
  }

  const handleLink = (categoryIds: string[]) => {
    // TODO: Implement link logic - update source_type of selected categories
    const linkedCategories = mockCategories.filter((cat) => categoryIds.includes(cat.id))
    setCategories([...categories, ...linkedCategories])
  }

  const handleSaveCategorySettings = (
    categoryId: string,
    config: IntegrationConfig,
    sourceType: SourceType
  ) => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          integration_configs: {
            ...cat.integration_configs,
            [sourceType]: config,
          },
          linked_integrations: cat.linked_integrations?.includes(sourceType)
            ? cat.linked_integrations
            : [...(cat.linked_integrations || []), sourceType],
        }
      }
      return cat
    })
    setCategories(updatedCategories)
    // TODO: Сохранить изменения на сервере
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Linked Categories</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage categories available in the widget
          </p>
        </div>
        <button
          onClick={() => setLinkDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>Link Category</span>
        </button>
      </div>

      <CategoriesTable
        categories={categories}
        sourceType="web_widget"
        onEdit={setEditingCategory}
        onUnlink={handleUnlink}
      />

      <LinkCategoryDialog
        isOpen={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onLink={handleLink}
        sourceType="web_widget"
        currentCategoryIds={categories.map((c) => c.id)}
      />

      <CategorySettingsDialog
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSave={handleSaveCategorySettings}
        category={editingCategory}
        sourceType="web_widget"
      />

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Category Display Order</h3>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop categories to reorder them in the widget
        </p>
        <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
          Drag & drop functionality coming soon
        </div>
      </div>
    </div>
  )
}
