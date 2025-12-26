'use client'

import { RefreshCw, Plus, MoreVertical, Maximize2, Settings, ChevronDown, X } from 'lucide-react'
import { mockPanels, TicketPanel } from '../../data/panels'
import { useState, useEffect, useRef } from 'react'

export default function PanelsList() {
  const [panels] = useState<TicketPanel[]>(mockPanels)
  const [lastUpdate] = useState<string>('2025-12-23 21:17:44')
  const [showAddModal, setShowAddModal] = useState(false)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false)
  const settingsMenuRef = useRef<HTMLDivElement>(null)

  // Закрываем меню действий при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuOpen) {
        setActionMenuOpen(null)
      }
      if (settingsMenuOpen && settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setSettingsMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [actionMenuOpen, settingsMenuOpen])

  const handleRefresh = () => {
    console.log('Refresh clicked')
  }

  const handleAddPanel = () => {
    setShowAddModal(true)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
  }

  const toggleActionMenu = (panelId: string) => {
    setActionMenuOpen(actionMenuOpen === panelId ? null : panelId)
  }

  const toggleSettingsMenu = () => {
    setSettingsMenuOpen(!settingsMenuOpen)
  }

  const handleSettingsAction = (action: string) => {
    setSettingsMenuOpen(false)
    console.log('Settings action:', action)
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Panels</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last update: {lastUpdate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <div className="h-6 w-px bg-[#e2e8f0]"></div>
          <button
            onClick={handleAddPanel}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Panel</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e2e8f0]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Ticket Panels</h2>
              <p className="text-sm text-gray-500 mt-1">
                Here you can view and manage ticket panels for your organization.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors">
                <Maximize2 className="h-5 w-5 text-gray-600" />
              </button>
              <div className="relative" ref={settingsMenuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSettingsMenu()
                  }}
                  className="p-2 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors flex items-center gap-1"
                >
                  <Settings className="h-5 w-5 text-gray-600" />
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>
                {settingsMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-md shadow-lg z-10 min-w-[150px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleSettingsAction('Export')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Export
                    </button>
                    <button
                      onClick={() => handleSettingsAction('Import')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Import
                    </button>
                    <button
                      onClick={() => handleSettingsAction('Columns View')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Columns View
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '800px' }}>
            <thead className="bg-gray-50 border-b border-[#e2e8f0]">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-[#e2e8f0]">
                  Panel Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-[#e2e8f0]">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-[#e2e8f0]">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-[#e2e8f0]">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-[#e2e8f0]">
                  Categories
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e2e8f0]">
              {panels.map((panel) => (
                <tr
                  key={panel.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-4 py-2 text-sm text-gray-900 border-r border-[#e2e8f0]">
                    {panel.panelName}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 border-r border-[#e2e8f0]">
                    {panel.title}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 max-w-md border-r border-[#e2e8f0]">
                    <div className="whitespace-pre-wrap break-words">
                      {panel.description}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm border-r border-[#e2e8f0]">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: '#f2c037', color: '#000' }}
                    >
                      {panel.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm border-r border-[#e2e8f0]">
                    <div className="flex flex-wrap gap-1">
                      {panel.categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                          style={{ backgroundColor: '#21ba45', color: '#fff' }}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex justify-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleActionMenu(panel.id)
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </button>
                      {actionMenuOpen === panel.id && (
                        <div
                          className="absolute right-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-md shadow-lg z-10 min-w-[120px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setActionMenuOpen(null)
                              console.log('Edit panel:', panel.id)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setActionMenuOpen(null)
                              console.log('Delete panel:', panel.id)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete
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
        <div className="px-4 py-3 border-t border-[#e2e8f0] flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            1-{panels.length} of {panels.length}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Records per page:</span>
            <select className="px-2 py-1 border border-[#e2e8f0] rounded text-sm text-gray-700 bg-white">
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Panel Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={handleCloseModal}
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Add Panel</h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter panel name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter panel title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter panel description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="SELECT_MENU">SELECT_MENU</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories
                  </label>
                  <select
                    multiple
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="🗑 Closed">🗑 Closed</option>
                    <option value="🐞 Bugs">🐞 Bugs</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors"
                  >
                    Add Panel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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

