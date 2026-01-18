'use client'

import { useState } from 'react'
import { Search, Download } from 'lucide-react'

interface EmailLog {
  id: string
  timestamp: string
  eventType: 'email_received' | 'error' | 'connection_failed' | 'processed'
  details: string
  status: 'success' | 'error' | 'warning'
}

interface EmailLogsTabProps {
  integrationId: string
}

const mockLogs: EmailLog[] = [
  {
    id: '1',
    timestamp: '2024-01-20T10:30:00Z',
    eventType: 'email_received',
    details: 'Email received from user@example.com',
    status: 'success',
  },
  {
    id: '2',
    timestamp: '2024-01-20T09:15:00Z',
    eventType: 'processed',
    details: 'Ticket created from email #12345',
    status: 'success',
  },
  {
    id: '3',
    timestamp: '2024-01-19T15:45:00Z',
    eventType: 'error',
    details: 'Failed to parse email attachment',
    status: 'error',
  },
]

export default function EmailLogsTab({ integrationId }: EmailLogsTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [logs] = useState<EmailLog[]>(mockLogs)

  const filteredLogs = logs.filter(
    (log) =>
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getEventTypeLabel = (type: EmailLog['eventType']) => {
    switch (type) {
      case 'email_received':
        return 'Email Received'
      case 'error':
        return 'Error'
      case 'connection_failed':
        return 'Connection Failed'
      case 'processed':
        return 'Processed'
      default:
        return type
    }
  }

  const getStatusColor = (status: EmailLog['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExport = () => {
    // TODO: Implement export logic
    console.log('Exporting logs')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Event Logs</h3>
          <p className="text-sm text-gray-500 mt-1">
            View history of email integration events and errors
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-md transition-colors font-medium"
        >
          <Download className="h-4 w-4" />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search logs by event type or details..."
          className="w-full pl-10 pr-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <select className="px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Event Types</option>
          <option value="email_received">Email Received</option>
          <option value="processed">Processed</option>
          <option value="error">Error</option>
          <option value="connection_failed">Connection Failed</option>
        </select>

        <select className="px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
          <option value="warning">Warning</option>
        </select>
      </div>

      {/* Table */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          No logs found
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Event Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {getEventTypeLabel(log.eventType)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.details}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${getStatusColor(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
