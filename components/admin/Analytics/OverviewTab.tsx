'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import KPICard, { KPI_Icons } from './KPICard'
import { StatsOverview, HistoryPoint, DateRange } from '../../../types/analytics'
import { formatDate } from '../../../utils/analyticsApi'

interface OverviewTabProps {
  overview: StatsOverview
  historyData: HistoryPoint[]
  dateRange: DateRange
}

export default function OverviewTab({ overview, historyData, dateRange }: OverviewTabProps) {
  // Форматируем данные для графика
  const chartData = useMemo(() => {
    return historyData.map(point => ({
      date: formatDate(point.date),
      'Total Members': point.members,
      'Online Members': point.online,
    }))
  }, [historyData])
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Members"
          value={overview.totalMembers.toLocaleString()}
          change={overview.memberGrowth}
          icon={KPI_Icons.members}
          iconColor="text-blue-600"
        />
        <KPICard
          title="Online Users"
          value={`${overview.onlineMembers} / ${overview.peakOnline}`}
          icon={KPI_Icons.online}
          iconColor="text-green-600"
        />
        <KPICard
          title="Messages Sent"
          value={overview.totalMessages.toLocaleString()}
          icon={KPI_Icons.messages}
          iconColor="text-purple-600"
        />
        <KPICard
          title="Voice Minutes"
          value={overview.totalVoiceMinutes.toLocaleString()}
          icon={KPI_Icons.voice}
          iconColor="text-orange-600"
        />
      </div>
      
      {/* Growth Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Member Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Total Members"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="Online Members"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
