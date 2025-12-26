'use client'

import { Settings, Plus, Check } from 'lucide-react'
import { mockCategories, Category } from '../../data/categories'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CategoriesList() {
  const [categories] = useState<Category[]>(mockCategories)
  const [lastUpdate] = useState<string>('2025-12-10 18:31:12')
  const router = useRouter()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/categories/${categoryId}`)
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last update: {lastUpdate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors">
            <Settings className="h-4 w-4" />
            <span>Set Categories for Tickets</span>
          </button>
          <div className="h-6 w-px bg-[#e2e8f0]"></div>
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e2e8f0]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Organization Categories</h2>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#e2e8f0]">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Has Access
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e2e8f0]">
              {categories.map((category, index) => (
                <tr
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <span>{category.name}</span>
                      {category.discordCategoryId && (
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {category.hasAccess ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <Check className="h-3 w-3" />
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {formatDate(category.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#e2e8f0] flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            1-{categories.length} of {categories.length}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Records per page:</span>
            <select className="px-2 py-1 border border-[#e2e8f0] rounded text-sm text-gray-700 bg-white">
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

