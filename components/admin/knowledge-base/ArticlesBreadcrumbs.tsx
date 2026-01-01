'use client'

import { ChevronRight, Folder } from 'lucide-react'
import { KBFolder } from '../../../data/knowledgeBase'
import { getFolderPath } from '../../../utils/kbFolders'

interface ArticlesBreadcrumbsProps {
  folderId: string | null
  folders: KBFolder[]
  onFolderClick: (folderId: string | null) => void
}

export default function ArticlesBreadcrumbs({
  folderId,
  folders,
  onFolderClick,
}: ArticlesBreadcrumbsProps) {
  const path = folderId !== null ? getFolderPath(folderId, folders) : []

  return (
    <nav className="flex items-center text-sm text-gray-500">
      <button
        onClick={() => onFolderClick(null)}
        className="hover:text-gray-700 transition-colors"
      >
        Internal Articles
      </button>
      {path.length > 0 && (
        <>
          {path.map((folder, index) => (
            <div key={folder.id} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              {index === path.length - 1 ? (
                <span className="font-semibold text-gray-900">{folder.name}</span>
              ) : (
                <button
                  onClick={() => onFolderClick(folder.id)}
                  className="hover:text-gray-700 transition-colors"
                >
                  {folder.name}
                </button>
              )}
            </div>
          ))}
        </>
      )}
    </nav>
  )
}

