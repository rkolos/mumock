'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Macro } from '../../data/macros'

interface MacroDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (macro: Omit<Macro, 'id'> & { id?: number }) => void
  categories: string[]
  initialCategory?: string
  macro?: Macro
}

export default function MacroDialog({
  isOpen,
  onClose,
  onSave,
  categories,
  initialCategory,
  macro,
}: MacroDialogProps) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    if (isOpen) {
      if (macro) {
        setTitle(macro.title)
        setText(macro.text)
        setCategory(macro.category)
      } else {
        setTitle('')
        setText('')
        setCategory(initialCategory || categories[0] || '')
      }
    }
  }, [isOpen, macro, initialCategory, categories])

  if (!isOpen) return null

  const handleSave = () => {
    if (title.trim() && text.trim() && category) {
      onSave({
        id: macro?.id,
        title: title.trim(),
        text: text.trim(),
        category,
      })
      setTitle('')
      setText('')
      setCategory('')
      onClose()
    }
  }

  const isEditMode = !!macro

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
            {isEditMode ? 'Edit Macro' : 'Create Macro'}
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
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Macro title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Macro content"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
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
            disabled={!title.trim() || !text.trim() || !category}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditMode ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

