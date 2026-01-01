'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Bold, Italic, Code, List, Trash2, Save } from 'lucide-react'
import { KnowledgeArticle } from '../../../data/knowledgeBase'

interface ArticleEditorProps {
  isOpen: boolean
  article: KnowledgeArticle | null
  onClose: () => void
  onSave: (article: KnowledgeArticle) => void
  onDelete: (id: string) => void
}

export default function ArticleEditor({
  isOpen,
  article,
  onClose,
  onSave,
  onDelete,
}: ArticleEditorProps) {
  const [body, setBody] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Инициализация содержимого при открытии
  useEffect(() => {
    if (isOpen) {
      setBody(article?.body || '')
      setSaveStatus('saved')
      // Фокус на textarea
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [isOpen, article])

  // Автосохранение с debounce
  useEffect(() => {
    if (!isOpen || !article) return

    // Очищаем предыдущий таймер
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Если есть изменения
    if (body !== article.body) {
      setSaveStatus('unsaved')

      // Устанавливаем новый таймер
      saveTimeoutRef.current = setTimeout(() => {
        handleSave()
      }, 2000) // 2 секунды debounce
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [body, article, isOpen])

  // Сохранение при потере фокуса
  const handleBlur = () => {
    if (article && body !== article.body && saveStatus !== 'saving') {
      handleSave()
    }
  }

  const handleSave = async () => {
    if (!article) return

    setSaveStatus('saving')

    // Симуляция сохранения
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedArticle: KnowledgeArticle = {
      ...article,
      body,
    }

    onSave(updatedArticle)
    setSaveStatus('saved')
  }

  // Обработка форматирования
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const newText = `${before}${selectedText}${after}`

    setBody(
      textarea.value.substring(0, start) + newText + textarea.value.substring(end)
    )

    // Восстанавливаем фокус и позицию курсора
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(
        selectedText ? start + before.length : newCursorPos,
        selectedText ? start + before.length + selectedText.length : newCursorPos
      )
    }, 0)
  }

  const handleBold = () => insertMarkdown('**', '**')
  const handleItalic = () => insertMarkdown('*', '*')
  const handleCode = () => insertMarkdown('`', '`')
  const handleList = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const lines = body.split('\n')
    let currentLine = 0
    let charCount = 0

    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= start) {
        currentLine = i
        break
      }
      charCount += lines[i].length + 1 // +1 для \n
    }

    lines[currentLine] = `- ${lines[currentLine]}`
    setBody(lines.join('\n'))

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + 2, start + 2)
    }, 0)
  }

  const handleDelete = () => {
    if (!article) return
    if (confirm('Вы уверены, что хотите удалить эту статью?')) {
      onDelete(article.id)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[600px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {article ? 'Edit Article' : 'New Article'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-[#e2e8f0] bg-gray-50 flex items-center gap-2">
          <button
            onClick={handleBold}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Bold"
          >
            <Bold className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={handleItalic}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Italic"
          >
            <Italic className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={handleCode}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Code"
          >
            <Code className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={handleList}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="List"
          >
            <List className="h-4 w-4 text-gray-700" />
          </button>
        </div>

        {/* Textarea */}
        <div className="flex-1 overflow-hidden">
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onBlur={handleBlur}
            placeholder="Start writing your article... Use markdown for formatting."
            className="w-full h-full px-6 py-4 border-0 focus:outline-none resize-none font-mono text-sm"
            style={{ fontFamily: 'inherit' }}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {saveStatus === 'saved' && (
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Save className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Saved</span>
                </span>
              )}
              {saveStatus === 'saving' && (
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Save className="h-4 w-4 text-blue-600 animate-pulse" />
                  <span className="text-blue-600">Saving...</span>
                </span>
              )}
              {saveStatus === 'unsaved' && (
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-orange-600">Unsaved changes</span>
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {article && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

