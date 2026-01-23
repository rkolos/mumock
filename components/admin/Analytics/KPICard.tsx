'use client'

import { TrendingUp, TrendingDown, Users, MessageSquare, Headphones, User } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  change?: number // Percentage change
  icon?: React.ReactNode
  iconColor?: string
}

export default function KPICard({ title, value, change, icon, iconColor = 'text-blue-600' }: KPICardProps) {
  const hasPositiveChange = change !== undefined && change > 0
  const hasNegativeChange = change !== undefined && change < 0
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {hasPositiveChange ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : hasNegativeChange ? (
                <TrendingDown className="h-4 w-4 text-red-600" />
              ) : null}
              <span
                className={`text-sm font-medium ${
                  hasPositiveChange
                    ? 'text-green-600'
                    : hasNegativeChange
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {hasPositiveChange ? '+' : ''}
                {change.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">за период</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`${iconColor} p-3 rounded-lg bg-gray-50`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

// Предустановленные иконки для разных метрик
export const KPI_Icons = {
  members: <Users className="h-6 w-6" />,
  online: <User className="h-6 w-6" />,
  messages: <MessageSquare className="h-6 w-6" />,
  voice: <Headphones className="h-6 w-6" />,
}
