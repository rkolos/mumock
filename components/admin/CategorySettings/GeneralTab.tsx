'use client'

import { Category } from '../../../data/categories'

interface GeneralTabProps {
  category: Category
  onCategoryChange: (updates: Partial<Category>) => void
}

export default function GeneralTab({ category, onCategoryChange }: GeneralTabProps) {
  const handleChange = (field: keyof Category, value: string | number | undefined) => {
    onCategoryChange({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Basic Info</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={category.categoryName}
              onChange={(e) => handleChange('categoryName', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Внутреннее описание для админов)
            </label>
            <textarea
              value={category.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Описание категории..."
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Limits & Logic</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Open Tickets Per User
            </label>
            <input
              type="number"
              value={category.maxOpenTicketsPerUser}
              onChange={(e) => handleChange('maxOpenTicketsPerUser', Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ticket Name Template (e.g., Support-{'{id}'})
            </label>
            <input
              type="text"
              value={category.ticketNameTemplate}
              onChange={(e) => handleChange('ticketNameTemplate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Bug-{num}"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={category.priority || 'medium'}
              onChange={(e) => handleChange('priority', e.target.value)}
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
        <h3 className="text-base font-semibold text-gray-900 mb-4 text-gray-500">Meta (Read-only)</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-500">Category UUID:</span>
            <span className="ml-2 text-gray-900 font-mono">{category.id}</span>
          </div>
          <div>
            <span className="text-gray-500">Created At:</span>
            <span className="ml-2 text-gray-900">
              {new Date(category.createdAt).toLocaleString('ru-RU')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

