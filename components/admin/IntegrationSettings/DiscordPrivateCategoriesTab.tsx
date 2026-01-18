'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Settings } from 'lucide-react'
import { Category, IntegrationConfig, SourceType } from '../../../data/categories'
import { mockCategories } from '../../../data/categories'
import CategoriesTable from './CategoriesTable'
import LinkCategoryDialog from './LinkCategoryDialog'
import CategorySettingsDialog from './CategorySettingsDialog'

interface DiscordPrivateCategoriesTabProps {
  integrationId: string
}

export default function DiscordPrivateCategoriesTab({ integrationId }: DiscordPrivateCategoriesTabProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>(
    mockCategories.filter((cat) => cat.source_type === 'discord_private_bot')
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
            Manage categories that use Discord Private Bot integration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/categories')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors font-medium"
          >
            <Settings className="h-4 w-4" />
            <span>Manage Categories</span>
          </button>
        <button
          onClick={() => setLinkDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>Link Category</span>
        </button>
        </div>
      </div>

      <CategoriesTable
        categories={categories}
        sourceType="discord_private_bot"
        onEdit={setEditingCategory}
        onUnlink={handleUnlink}
      />

      <LinkCategoryDialog
        isOpen={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onLink={handleLink}
        sourceType="discord_private_bot"
        currentCategoryIds={categories.map((c) => c.id)}
      />

      <CategorySettingsDialog
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSave={handleSaveCategorySettings}
        category={editingCategory}
        sourceType="discord_private_bot"
      />
    </div>
  )
}
