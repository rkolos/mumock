'use client'

import { useMemo } from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import ActivityHeatmap from './ActivityHeatmap'
import UpsellOverlay from './UpsellOverlay'
import { HistoryPoint, HeatmapPoint, DateRange } from '../../../types/analytics'
import { formatDate } from '../../../utils/analyticsApi'

interface EngagementTabProps {
  activityData: HistoryPoint[]
  heatmapData: HeatmapPoint[]
  dateRange: DateRange
  isAnalyticsEnabled: boolean
}

export default function EngagementTab({
  activityData,
  heatmapData,
  dateRange,
  isAnalyticsEnabled,
}: EngagementTabProps) {
  // Форматируем данные для графика активности
  const chartData = useMemo(() => {
    return activityData.map(point => ({
      date: formatDate(point.date),
      Messages: point.messages,
      'Channels Created': point.channelsCreated,
    }))
  }, [activityData])
  
  return (
    <div className="space-y-6 relative">
      {!isAnalyticsEnabled && <UpsellOverlay feature="analytics" />}
      
      {/* Activity Volume Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Activity Volume</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'Messages', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'Channels Created', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="Messages"
              fill="#3b82f6"
              name="Messages"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Channels Created"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 3 }}
              name="Channels Created"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Activity Heatmap */}
      <ActivityHeatmap data={heatmapData} />
    </div>
  )
}
