'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Category } from '../../../data/categories'
import { mockCategories } from '../../../data/categories'
import CategoriesTable from './CategoriesTable'
import LinkCategoryDialog from './LinkCategoryDialog'

interface EmailCategoriesTabProps {
  integrationId: string
}

interface RoutingRule {
  id: string
  name: string
  type: 'from' | 'subject' | 'custom'
  value: string
  categoryId: string
}

export default function EmailCategoriesTab({ integrationId }: EmailCategoriesTabProps) {
  const [categories, setCategories] = useState<Category[]>(
    [] // Email categories would use a different source type, for now empty
  )
  const [routingRules] = useState<RoutingRule[]>([])
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)

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

  const handleAddRoutingRule = () => {
    // TODO: Implement add routing rule
    console.log('Add routing rule')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Linked Categories</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage categories that use Email Forwarding integration
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
        sourceType="telegram"
        onUnlink={handleUnlink}
      />

      <LinkCategoryDialog
        isOpen={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onLink={handleLink}
        sourceType="telegram"
        currentCategoryIds={categories.map((c) => c.id)}
      />

      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Routing Rules</h3>
            <p className="text-sm text-gray-500 mt-1">
              Automatically route emails to categories based on rules
            </p>
          </div>
          <button
            onClick={handleAddRoutingRule}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Add Routing Rule</span>
          </button>
        </div>

        {routingRules.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            No routing rules configured
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rule Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {routingRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 capitalize">{rule.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{rule.value}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {categories.find((c) => c.id === rule.categoryId)?.categoryName || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
