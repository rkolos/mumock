'use client'

import { useState, useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { KBFolder } from '../../../data/knowledgeBase'
import { getSubfolders } from '../../../utils/kbFolders'

interface DeleteFolderDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (deleteArticles: boolean) => void
  folder: KBFolder | null
  folders: KBFolder[]
  articleCount: number
}

export default function DeleteFolderDialog({
  isOpen,
  onClose,
  onConfirm,
  folder,
  folders,
  articleCount,
}: DeleteFolderDialogProps) {
  const [deleteArticles, setDeleteArticles] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setDeleteArticles(false)
    }
  }, [isOpen])

  if (!isOpen || !folder) return null

  const subfolders = getSubfolders(folder.id, folders)
  const hasSubfolders = subfolders.length > 0

  const handleConfirm = () => {
    onConfirm(deleteArticles)
    setDeleteArticles(false)
    onClose()
  }

  const handleCancel = () => {
    setDeleteArticles(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[500px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Delete Folder</h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-900 mb-2">
                Вы уверены, что хотите удалить папку <strong>"{folder.name}"</strong>?
              </p>
              {hasSubfolders && (
                <p className="text-sm text-orange-600 mb-2">
                  Внимание: в этой папке есть {subfolders.length} подпапок. Они также будут удалены или перемещены.
                </p>
              )}
              {articleCount > 0 && (
                <p className="text-sm text-gray-600 mb-4">
                  В этой папке {articleCount} {articleCount === 1 ? 'статья' : articleCount < 5 ? 'статьи' : 'статей'}.
                </p>
              )}
            </div>
          </div>

          {articleCount > 0 && (
            <div className="mb-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="deleteAction"
                  checked={!deleteArticles}
                  onChange={() => setDeleteArticles(false)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    Переместить статьи в корень
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Статьи будут перемещены в корневую папку (uncategorized)
                  </div>
                </div>
              </label>
            </div>
          )}

          {articleCount > 0 && (
            <div className="mb-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="deleteAction"
                  checked={deleteArticles}
                  onChange={() => setDeleteArticles(true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    Удалить статьи
                  </div>
                  <div className="text-xs text-red-600 mt-1">
                    Все статьи в папке будут безвозвратно удалены
                  </div>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
          >
            Delete Folder
          </button>
        </div>
      </div>
    </div>
  )
}

