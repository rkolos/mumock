'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Edit, Trash2, Save, Users, X } from 'lucide-react'
import { mockCategories, Category, FormField } from '../../data/categories'
import { useState } from 'react'

interface CategoryDetailProps {
  categoryId: string
}

export default function CategoryDetail({ categoryId }: CategoryDetailProps) {
  const router = useRouter()
  const category = mockCategories.find((c) => c.id === categoryId)
  const [formFields, setFormFields] = useState<FormField[]>(
    category?.formFields || []
  )
  const [assignedRoles, setAssignedRoles] = useState<string[]>(
    category?.assignedRoles || []
  )
  const [discordCategory, setDiscordCategory] = useState<boolean>(
    category?.discordCategory || false
  )
  const [categoryName, setCategoryName] = useState<string>(
    category?.categoryName || ''
  )
  const [ticketNameTemplate, setTicketNameTemplate] = useState<string>(
    category?.ticketNameTemplate || ''
  )
  const [maxOpenTicketsPerUser, setMaxOpenTicketsPerUser] = useState<number>(
    category?.maxOpenTicketsPerUser || 100
  )
  const [maxTickets, setMaxTickets] = useState<number>(category?.maxTickets || 500)
  const [ticketCreateMessage, setTicketCreateMessage] = useState<string>(
    category?.ticketCreateMessage || ''
  )

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

  const handleAddField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      name: 'new_field',
      technicalId: 'new_field',
      required: false,
      short: true,
    }
    setFormFields([...formFields, newField])
  }

  const handleDeleteField = (fieldId: string) => {
    setFormFields(formFields.filter((f) => f.id !== fieldId))
  }

  const handleEditField = (fieldId: string) => {
    // В мокапе просто логируем
    console.log('Edit field:', fieldId)
  }

  const handleRemoveRole = (role: string) => {
    setAssignedRoles(assignedRoles.filter((r) => r !== role))
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/categories')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        <p className="text-sm text-gray-500 mt-1">Category ID: {category.id}</p>
      </div>

      {/* Info and Roles Block - 2 columns (8/4) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Left Card - Category Information (8/12) */}
        <div className="md:col-span-8 bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Category Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization id
              </label>
              <p className="text-sm text-gray-900">{category.organizationId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discord Category Id
              </label>
              <p className="text-sm text-gray-900">
                {category.discordCategoryId || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Card - Assigned Roles (4/12) */}
        <div className="md:col-span-4 bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Assigned Roles ({assignedRoles.length})
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {assignedRoles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300"
              >
                {role}
                <button
                  onClick={() => handleRemoveRole(role)}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors w-full">
            <Users className="h-4 w-4" />
            <span>Manage Roles</span>
          </button>
        </div>
      </div>

      {/* Discord Toggle */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-gray-900">Discord Category</span>
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Change to For Tickets</span>
            <button
              onClick={() => setDiscordCategory(!discordCategory)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                discordCategory ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  discordCategory ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields & Form Preview - Main Constructor */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Left Section - Form Fields (8/12) */}
        <div className="md:col-span-8 bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Form Fields</h2>
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
              Кастомные формы для Discord позволяют собирать дополнительную информацию
              от пользователей при создании тикета.
            </p>
          </div>

          {/* Fields List */}
          <div className="space-y-3">
            {formFields.map((field) => (
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
            {formFields.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">
                Нет полей. Нажмите "Add Field" чтобы добавить.
              </p>
            )}
          </div>
        </div>

        {/* Right Section - Form Preview (4/12) */}
        <div className="md:col-span-4 bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Form Preview</h2>
          <div className="space-y-4">
            {formFields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.name} {field.required && '*'}
                </label>
                <input
                  type="text"
                  readOnly
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md bg-gray-50 text-gray-500"
                  placeholder={`Enter ${field.name}`}
                />
              </div>
            ))}
            {formFields.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">
                Предпросмотр появится после добавления полей
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Discord Category Information */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Discord Category Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ticket Name Template
            </label>
            <input
              type="text"
              value={ticketNameTemplate}
              onChange={(e) => setTicketNameTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Open Tickets Per User
            </label>
            <input
              type="number"
              value={maxOpenTicketsPerUser}
              onChange={(e) => setMaxOpenTicketsPerUser(Number(e.target.value))}
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Tickets
            </label>
            <input
              type="number"
              value={maxTickets}
              onChange={(e) => setMaxTickets(Number(e.target.value))}
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors">
            <Save className="h-4 w-4" />
            <span>Save category</span>
          </button>
        </div>
      </div>

      {/* Ticket Create Message */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Ticket Create Message</h2>
        <div className="mb-4">
          <textarea
            value={ticketCreateMessage}
            onChange={(e) => setTicketCreateMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Hello, {username}! A support agent will be with you shortly."
          />
        </div>
        <button className="px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors">
          Save
        </button>
      </div>
    </div>
  )
}

