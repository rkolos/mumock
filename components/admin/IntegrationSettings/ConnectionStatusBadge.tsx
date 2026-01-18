'use client'

import { ConnectionStatus } from '../../../data/integrations'

interface ConnectionStatusBadgeProps {
  status: ConnectionStatus
}

export default function ConnectionStatusBadge({ status }: ConnectionStatusBadgeProps) {
  const getStatusDisplay = () => {
    switch (status) {
      case 'connected':
        return {
          text: 'Connected',
          dotColor: 'bg-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
        }
      case 'not_configured':
        return {
          text: 'Not Configured',
          dotColor: 'bg-gray-400',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
        }
      case 'coming_soon':
        return {
          text: 'Coming Soon',
          dotColor: 'bg-blue-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
        }
      default:
        return {
          text: 'Unknown',
          dotColor: 'bg-gray-400',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
        }
    }
  }

  const display = getStatusDisplay()

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${display.bgColor} ${display.textColor}`}>
      <div className={`w-2 h-2 rounded-full ${display.dotColor}`}></div>
      <span>{display.text}</span>
    </div>
  )
}
