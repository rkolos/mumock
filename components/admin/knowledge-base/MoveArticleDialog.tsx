'use client'

import { useState } from 'react'
import { X, Folder } from 'lucide-react'
import { KBFolder } from '../../../data/knowledgeBase'
import { buildFolderTree, FolderTreeNode } from '../../../utils/kbFolders'

interface MoveArticleDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (folderId: string | null) => void
  folders: KBFolder[]
  currentFolderId: string | null
}

export default function MoveArticleDialog({
  isOpen,
  onClose,
  onConfirm,
  folders,
  currentFolderId,
}: MoveArticleDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  if (!isOpen) return null

  const tree = buildFolderTree(folders)

  const handleConfirm = () => {
    onConfirm(selectedFolderId)
    setSelectedFolderId(null)
    onClose()
  }

  const handleCancel = () => {
    setSelectedFolderId(null)
    onClose()
  }

  const renderFolderNode = (node: FolderTreeNode, level: number = 0): JSX.Element => {
    const isSelected = selectedFolderId === node.id
    const isCurrent = currentFolderId === node.id

    return (
      <div key={node.id} style={{ paddingLeft: `${level * 20}px` }}>
        <button
          type="button"
          onClick={() => setSelectedFolderId(node.id)}
          disabled={isCurrent}
          className={`
            w-full text-left px-3 py-2 rounded-md mb-1 transition-colors
            flex items-center gap-2
            ${
              isSelected
                ? 'bg-blue-100 text-blue-900'
                : isCurrent
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'hover:bg-gray-100 text-gray-700'
            }
          `}
        >
          <Folder className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 truncate">{node.name}</span>
          {isCurrent && <span className="text-xs text-gray-500">(current)</span>}
        </button>
        {node.children && node.children.map((child) => renderFolderNode(child, level + 1))}
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[500px] mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Move Article</h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <p className="text-sm text-gray-600 mb-4">
            Выберите папку, в которую переместить статью:
          </p>

          {/* Root option */}
          <button
            type="button"
            onClick={() => setSelectedFolderId(null)}
            className={`
              w-full text-left px-3 py-2 rounded-md mb-2 transition-colors
              flex items-center gap-2
              ${
                selectedFolderId === null
                  ? 'bg-blue-100 text-blue-900'
                  : 'hover:bg-gray-100 text-gray-700'
              }
            `}
          >
            <Folder className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">Root (Uncategorized)</span>
          </button>

          {/* Folder tree */}
          <div className="border-t border-gray-200 pt-2">
            {tree.map((node) => renderFolderNode(node))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors"
          >
            Move
          </button>
        </div>
      </div>
    </div>
  )
}

