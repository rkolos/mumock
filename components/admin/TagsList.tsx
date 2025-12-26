'use client'

import { RefreshCw, Plus, MoreVertical, Copy, X, Edit, Trash2 } from 'lucide-react'
import { mockTags, TicketTag } from '../../data/tags'
import { useState, useEffect } from 'react'

export default function TagsList() {
  const [tags] = useState<TicketTag[]>(mockTags)
  const [lastUpdate] = useState<string>('2025-12-23 21:20:18')
  const [showAddModal, setShowAddModal] = useState(false)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [recordsPerPage] = useState<number>(5)

  // Закрываем меню действий при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuOpen) {
        setActionMenuOpen(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [actionMenuOpen])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().replace('T', ' ').slice(0, 19)
  }

  const handleCopyName = (name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(name)
    setNotificationMessage(`Tag name "${name}" copied to clipboard`)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const handleRefresh = () => {
    // Мокап - просто обновляем lastUpdate
    console.log('Refresh clicked')
  }

  const handleAddTag = () => {
    setShowAddModal(true)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
  }

  const toggleActionMenu = (tagId: string) => {
    setActionMenuOpen(actionMenuOpen === tagId ? null : tagId)
  }

  const handleEdit = (tagId: string) => {
    setActionMenuOpen(null)
    console.log('Edit tag:', tagId)
    // Мокап - можно открыть модалку редактирования
  }

  const handleDelete = (tagId: string) => {
    setActionMenuOpen(null)
    console.log('Delete tag:', tagId)
    // Мокап - можно показать подтверждение
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* Notification */}
      {showNotification && (
        <div
          className="fixed top-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-md shadow-lg z-50 animate-in slide-in-from-right"
          style={{
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          <div className="flex items-center gap-2">
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Ticket Tags</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last update: {lastUpdate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-[#e2e2e4] hover:bg-gray-50 rounded-md transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <div className="h-6 w-px bg-[#e2e2e4]"></div>
          <button
            onClick={handleAddTag}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Tag</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-[#e2e2e4] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e2e2e4]">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Ticket Tags</h2>
            <p className="text-sm text-gray-500 mt-1">
              Here you can view and manage ticket tags for your organization.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#e2e2e4]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tag Name
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Color
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Updated At
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e2e2e4]">
              {tags.map((tag) => (
                <tr
                  key={tag.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <span>{tag.name}</span>
                      <button
                        onClick={(e) => handleCopyName(tag.name, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                        title="Copy tag name"
                      >
                        <Copy className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-5 h-5 rounded"
                        style={{ backgroundColor: tag.color, borderRadius: '4px' }}
                      ></div>
                      <span className="text-xs font-mono">{tag.color}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(tag.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(tag.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex justify-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleActionMenu(tag.id)
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </button>
                      {actionMenuOpen === tag.id && (
                        <div
                          className="absolute right-0 top-full mt-1 bg-white border border-[#e2e2e4] rounded-md shadow-lg z-10 min-w-[120px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleEdit(tag.id)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(tag.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#e2e2e4] flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            1-{tags.length} of {tags.length}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Records per page:</span>
            <select
              value={recordsPerPage}
              className="px-2 py-1 border border-[#e2e2e4] rounded text-sm text-gray-700 bg-white"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Tag Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={handleCloseModal}
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Add Tag</h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Модальное окно для добавления нового тега (макет)
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

