'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Bold, Italic, Code, List, Trash2, Save, FileText, Ticket, FileEdit, Edit } from 'lucide-react'
import {
  KnowledgeFile,
  KnowledgeTicket,
  KnowledgeArticle,
} from '../../../data/knowledgeBase'

type ContentItem = KnowledgeFile | KnowledgeTicket | KnowledgeArticle

interface ContentViewerProps {
  isOpen: boolean
  item: ContentItem | null
  itemType: 'file' | 'ticket' | 'article' | null
  onClose: () => void
  onSave?: (item: ContentItem) => void
  onDelete?: (id: string) => void
}

export default function ContentViewer({
  isOpen,
  item,
  itemType,
  onClose,
  onSave,
  onDelete,
}: ContentViewerProps) {
  const [body, setBody] = useState('')
  const [originalBody, setOriginalBody] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Определение, можно ли редактировать
  const isEditable = itemType === 'article' || itemType === 'ticket'

  // Инициализация содержимого при открытии
  useEffect(() => {
    if (isOpen && item) {
      let content = ''
      if (itemType === 'article' && 'body' in item) {
        content = item.body
      } else if (itemType === 'ticket' && 'content' in item) {
        content = item.content
      } else if (itemType === 'file') {
        content = 'File content preview not available'
      }
      setBody(content)
      setOriginalBody(content)
      setIsEditing(false)
      setSaveStatus('saved')
    }
  }, [isOpen, item, itemType])

  // Переключение в режим редактирования
  const handleEdit = () => {
    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  // Отмена редактирования
  const handleCancel = () => {
    setBody(originalBody)
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!item || !onSave || !isEditable) return

    setSaveStatus('saving')

    // Симуляция сохранения
    await new Promise((resolve) => setTimeout(resolve, 500))

    let updatedItem: ContentItem
    if (itemType === 'article' && 'body' in item) {
      updatedItem = {
        ...item,
        body,
      } as KnowledgeArticle
    } else if (itemType === 'ticket' && 'content' in item) {
      updatedItem = {
        ...item,
        content: body,
      } as KnowledgeTicket
    } else {
      return
    }

    onSave(updatedItem)
    setOriginalBody(body)
    setSaveStatus('saved')
    setIsEditing(false)
  }

  // Рендеринг markdown в HTML
  const renderMarkdown = (content: string): string => {
    if (!content) return ''
    
    let html = content
    
    // Headers
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-6 text-gray-900">$1</h1>')
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3 mt-5 text-gray-900">$1</h2>')
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2 mt-4 text-gray-900">$1</h3>')
    html = html.replace(/^#### (.*$)/gim, '<h4 class="text-base font-bold mb-2 mt-3 text-gray-900">$1</h4>')
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    
    // Italic (не внутри bold)
    html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="italic">$1</em>')
    
    // Code blocks
    html = html.replace(/`([^`]+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    
    // Blockquote
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-700">$1</blockquote>')
    
    // Lists
    html = html.replace(/^- (.*$)/gim, '<li class="ml-6 mb-1">$1</li>')
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-6 mb-1">$1</li>')
    
    // Wrap consecutive list items in ul
    html = html.replace(/(<li.*?<\/li>\n?)+/g, (match) => {
      return '<ul class="list-disc space-y-2 my-4">' + match + '</ul>'
    })
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Line breaks
    html = html.replace(/\n/g, '<br />')
    
    return html
  }

  // Обработка форматирования
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const newText = `${before}${selectedText}${after}`

    setBody(textarea.value.substring(0, start) + newText + textarea.value.substring(end))

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
    if (!item || !onDelete) return
    const itemName =
      itemType === 'file' && 'name' in item
        ? item.name
        : itemType === 'article'
          ? 'статью'
          : itemType === 'ticket'
            ? 'тикет'
            : 'элемент'
    if (confirm(`Вы уверены, что хотите удалить ${itemName}?`)) {
      onDelete(item.id)
      onClose()
    }
  }

  // Получение заголовка
  const getTitle = () => {
    if (!item) return 'Content Viewer'
    if (itemType === 'file' && 'name' in item) return item.name
    if (itemType === 'ticket' && 'source_ticket_display' in item)
      return item.source_ticket_display
    if (itemType === 'article') return 'Article'
    return 'Content Viewer'
  }

  // Получение иконки
  const getIcon = () => {
    if (itemType === 'file') return <FileText className="h-5 w-5 text-gray-600" />
    if (itemType === 'ticket') return <Ticket className="h-5 w-5 text-blue-600" />
    if (itemType === 'article') return <FileEdit className="h-5 w-5 text-gray-600" />
    return null
  }

  if (!isOpen || !item) return null

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
          <div className="flex items-center gap-3">
            {getIcon()}
            <h3 className="text-lg font-bold text-gray-900">{getTitle()}</h3>
          </div>
          <div className="flex items-center gap-2">
            {isEditable && !isEditing && (
              <button
                onClick={handleEdit}
                className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Toolbar (только в режиме редактирования) */}
        {isEditable && isEditing && (
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
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isEditable && isEditing ? (
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Start writing... Use markdown for formatting."
              className="w-full h-full px-6 py-4 border-0 focus:outline-none resize-none font-mono text-sm"
              style={{ fontFamily: 'inherit' }}
            />
          ) : (
            <div className="w-full h-full px-6 py-4 overflow-y-auto">
              {isEditable ? (
                <div
                  className="text-sm text-gray-900 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
                />
              ) : (
                <div className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed font-mono">
                  {body || 'No content available'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-4">
            {isEditable && isEditing && (
              <div className="flex items-center gap-2">
                {saveStatus === 'saving' && (
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Save className="h-4 w-4 text-blue-600 animate-pulse" />
                    <span className="text-blue-600">Saving...</span>
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditable && isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving' || body === originalBody}
                  className="px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </>
            ) : (
              <>
                {onDelete && (
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

