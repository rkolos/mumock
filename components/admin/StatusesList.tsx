'use client'

import { RefreshCw, Maximize2, Settings, Plus, MoreVertical, Copy, ChevronDown } from 'lucide-react'
import { mockStatuses, TicketStatus } from '../../data/statuses'
import { useState } from 'react'

export default function StatusesList() {
  const [statuses] = useState<TicketStatus[]>(mockStatuses)
  const [lastUpdate] = useState<string>(() => {
    const now = new Date()
    return now.toISOString().replace('T', ' ').slice(0, 19)
  })


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Ticket Statuses</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last update: {lastUpdate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <div className="h-6 w-px bg-[#e2e8f0]"></div>
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Status</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e2e8f0]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Discord Panels</h2>
              <p className="text-sm text-gray-500 mt-1">
                Here you can view and manage Discord panels for your organization.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors">
                <Maximize2 className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors flex items-center gap-1">
                <Settings className="h-5 w-5 text-gray-600" />
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#e2e8f0]">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Color
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Updated At
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e2e8f0]">
              {statuses.map((status) => (
                <tr
                  key={status.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-4 py-2 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <span>{status.name}</span>
                      <button
                        onClick={(e) => handleCopyId(status.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: status.color }}
                      ></div>
                      <span className="text-xs font-mono">{status.color}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {formatDate(status.createdAt)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {formatDate(status.updatedAt)}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#e2e8f0] flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            1-{statuses.length} of {statuses.length}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Records per page:</span>
            <select className="px-2 py-1 border border-[#e2e8f0] rounded text-sm text-gray-700 bg-white">
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

