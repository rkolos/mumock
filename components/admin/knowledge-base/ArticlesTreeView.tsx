'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Tree } from 'react-arborist'
import { MoreVertical, Edit, Trash2, FolderPlus, Folder } from 'lucide-react'
import { KBFolder, KnowledgeArticle } from '../../../data/knowledgeBase'
import { buildFolderTree, FolderTreeNode, getFolderArticleCount } from '../../../utils/kbFolders'

interface ArticlesTreeViewProps {
  folders: KBFolder[]
  articles: KnowledgeArticle[]
  selectedFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
  onNewFolder: (parentId: string | null) => void
  onEditFolder: (folder: KBFolder) => void
  onDeleteFolder: (folder: KBFolder) => void
}

// Преобразование FolderTreeNode в формат для react-arborist
function convertToArboristData(nodes: FolderTreeNode[]): any[] {
  return nodes.map((node) => ({
    id: node.id,
    name: node.name,
    children: node.children && node.children.length > 0 ? convertToArboristData(node.children) : undefined,
  }))
}

export default function ArticlesTreeView({
  folders,
  articles,
  selectedFolderId,
  onFolderSelect,
  onNewFolder,
  onEditFolder,
  onDeleteFolder,
}: ArticlesTreeViewProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    folderId: string
    folder: KBFolder
  } | null>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const treeContainerRef = useRef<HTMLDivElement>(null)
  const [treeDimensions, setTreeDimensions] = useState({ width: 300, height: 600 })

  const treeData = useMemo(() => buildFolderTree(folders), [folders])
  const arboristData = useMemo(() => convertToArboristData(treeData), [treeData])

  // Измерение размеров контейнера
  useEffect(() => {
    const updateDimensions = () => {
      if (treeContainerRef.current) {
        const rect = treeContainerRef.current.getBoundingClientRect()
        setTreeDimensions({
          width: rect.width,
          height: rect.height,
        })
      }
    }

    updateDimensions()
    const resizeObserver = new ResizeObserver(updateDimensions)
    if (treeContainerRef.current) {
      resizeObserver.observe(treeContainerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // Закрытие контекстного меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null)
      }
    }

    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [contextMenu])

  const handleContextMenu = (e: React.MouseEvent, folderId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    const folder = folders.find((f) => f.id === folderId)
    if (folder) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        folderId,
        folder,
      })
    }
  }

  const handleFolderClick = (nodeId: string | null) => {
    onFolderSelect(nodeId)
    setContextMenu(null)
  }

  return (
    <div className="flex flex-col h-full bg-white min-w-[280px]">
      {/* Tree */}
      <div ref={treeContainerRef} className="flex-1 overflow-hidden py-2">
        {arboristData.length > 0 && treeDimensions.height > 0 ? (
          <Tree
            initialData={arboristData}
            width={treeDimensions.width}
            height={treeDimensions.height}
            indent={24}
            rowHeight={36}
            onSelect={(ids) => {
              if (ids && ids.length > 0) {
                const firstId = typeof ids[0] === 'string' ? ids[0] : String(ids[0])
                handleFolderClick(firstId)
              } else {
                handleFolderClick(null)
              }
            }}
            disableDrag
          >
            {({ node, style, dragHandle }) => {
              const nodeId = typeof node.id === 'string' ? node.id : String(node.id)
              const nodeName = node.data?.name || String(node.id)
              const articleCount = getFolderArticleCount(nodeId, articles, folders)
              const isSelected = selectedFolderId === nodeId

              return (
                <div
                  ref={dragHandle}
                  style={style}
                  className={`
                    flex items-center justify-between py-2 pr-3 rounded-md cursor-pointer group
                    ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                  `}
                  onClick={() => handleFolderClick(nodeId)}
                  onContextMenu={(e) => handleContextMenu(e, nodeId)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Folder className={`h-4 w-4 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="text-sm truncate">{nodeName}</span>
                    {articleCount > 0 && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {articleCount}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleContextMenu(e, nodeId)
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </button>
                </div>
              )
            }}
          </Tree>
        ) : (
          <div className="text-center py-8 text-sm text-gray-500">
            <Folder className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No folders yet</p>
            <button
              onClick={() => onNewFolder(null)}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              Create your first folder
            </button>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            ref={contextMenuRef}
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            <button
              onClick={() => {
                onNewFolder(contextMenu.folderId)
                setContextMenu(null)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <FolderPlus className="h-4 w-4" />
              New Subfolder
            </button>
            <button
              onClick={() => {
                onEditFolder(contextMenu.folder)
                setContextMenu(null)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={() => {
                onDeleteFolder(contextMenu.folder)
                setContextMenu(null)
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

