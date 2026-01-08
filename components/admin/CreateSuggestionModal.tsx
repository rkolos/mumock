'use client'

import { useState, useEffect } from 'react'
import { X, Megaphone } from 'lucide-react'
import { useSuggestions } from '../../contexts/SuggestionsContext'
import { hasAdminAccess } from '../../utils/auth'
import { Suggestion, SuggestionStatus } from '../../data/suggestions'

interface CreateSuggestionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateSuggestionModal({
  isOpen,
  onClose,
}: CreateSuggestionModalProps) {
  const { createSuggestion, getCategories, setSelectedSuggestionId } = useSuggestions()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [isOfficial, setIsOfficial] = useState(false)
  const canAccessOfficial = hasAdminAccess()
  const categories = getCategories()

  useEffect(() => {
    if (isOpen) {
      // Сброс формы при открытии
      setTitle('')
      setDescription('')
      setCategory(categories.length > 0 ? categories[0].label : '')
      setIsOfficial(false)
    }
  }, [isOpen, categories])

  useEffect(() => {
    // Установить первую категорию по умолчанию при загрузке категорий
    if (categories.length > 0 && !category) {
      setCategory(categories[0].label)
    }
  }, [categories, category])

  if (!isOpen) return null

  const handleSave = () => {
    if (!title.trim() || !description.trim() || !category) return

    // Генерация ID
    const timestamp = Date.now()
    const idPrefix = isOfficial ? 'prop' : 'sug'
    const newId = `${idPrefix}-${timestamp}`

    // Создание объекта предложения
    const newSuggestion: Suggestion = {
      id: newId,
      source: 'web',
      author: isOfficial
        ? {
            username: 'Ninja Product Team',
            avatar_url: '/assets/team-logo.png',
            isSystem: true,
          }
        : {
            username: 'Current User', // В реальном приложении берется из сессии
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
          },
      content: {
        title: title.trim(),
        description: description.trim(),
        category,
      },
      metrics: {
        score: 0,
        upvotes: 0,
        downvotes: 0,
      },
      lifecycle: {
        status: (isOfficial ? 'Open' : 'New') as SuggestionStatus,
      },
      created_at: new Date().toISOString(),
    }

    // Добавляем специфичные поля для официального предложения
    if (isOfficial) {
      newSuggestion.type = 'official_proposal'
      newSuggestion.isPinned = true
    }

    // Создаем предложение
    createSuggestion(newSuggestion)

    // Закрываем модалку и выбираем созданное предложение
    setTitle('')
    setDescription('')
    setCategory('')
    setIsOfficial(false)
    onClose()
    setSelectedSuggestionId(newId)
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[500px] mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            New Suggestion
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter suggestion title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your suggestion..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {canAccessOfficial && (
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOfficial}
                  onChange={(e) => setIsOfficial(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Post as Official Proposal
                </span>
              </label>
              <p className="mt-1 text-xs text-gray-500 ml-6">
                This will be published as an official proposal from the team
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !description.trim() || !category}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isOfficial && <Megaphone className="h-4 w-4" />}
            {isOfficial ? 'Publish Proposal' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

