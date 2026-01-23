'use client'

import { useState } from 'react'
import { HeatmapPoint } from '../../../types/analytics'
import { getDayName } from '../../../utils/analyticsApi'

interface ActivityHeatmapProps {
  data: HeatmapPoint[]
}

export default function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ day: number; hour: number; value: number; x: number; y: number } | null>(null)
  
  // Находим максимальное значение для нормализации
  const maxValue = Math.max(...data.map(p => p.value))
  
  // Создаем сетку данных (день × час)
  const grid: { [key: string]: HeatmapPoint } = {}
  data.forEach(point => {
    grid[`${point.day}-${point.hour}`] = point
  })
  
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  const hours = Array.from({ length: 24 }, (_, i) => i)
  
  const getIntensity = (value: number) => {
    if (maxValue === 0) return 0
    return Math.min(100, (value / maxValue) * 100)
  }
  
  const getColor = (intensity: number) => {
    // Градиент от светло-синего (#E0F2FE) к темно-синему (#0C4A6E)
    const opacity = 0.2 + (intensity / 100) * 0.8
    return `rgba(14, 165, 233, ${opacity})` // blue-500 с переменной прозрачностью
  }
  
  const handleCellHover = (day: number, hour: number, value: number, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      day,
      hour,
      value,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    })
  }
  
  const handleCellLeave = () => {
    setTooltip(null)
  }
  
  return (
    <div className="relative">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Activity Heatmap</h3>
            <p className="text-sm text-gray-500">
              Интенсивность сообщений по дням недели и часам. Чем темнее цвет, тем больше сообщений было отправлено в этот период.
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Hours header */}
            <div className="flex mb-2">
              <div className="w-12"></div>
              <div className="flex-1 grid gap-0.5" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="text-xs text-gray-500 text-center"
                    style={{ minWidth: '20px' }}
                  >
                    {hour % 6 === 0 ? hour : ''}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Days and cells */}
            <div className="space-y-1">
              {days.map((dayName, dayIndex) => (
                <div key={dayIndex} className="flex items-center gap-2">
                  <div className="w-12 text-xs text-gray-600 text-right pr-2">
                    {dayName}
                  </div>
                  <div className="flex-1 grid gap-0.5" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
                    {hours.map((hour) => {
                      const point = grid[`${dayIndex}-${hour}`]
                      const value = point?.value || 0
                      const intensity = getIntensity(value)
                      const color = getColor(intensity)
                      
                      return (
                        <div
                          key={`${dayIndex}-${hour}`}
                          className="h-4 rounded-sm transition-all hover:ring-2 hover:ring-blue-500 hover:z-10 relative cursor-pointer"
                          style={{
                            backgroundColor: color,
                            minWidth: '20px',
                          }}
                          onMouseEnter={(e) => handleCellHover(dayIndex, hour, value, e)}
                          onMouseLeave={handleCellLeave}
                          title={`${dayName}, ${hour}:00 — ${value} messages`}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Меньше сообщений</span>
            <div className="flex-1 mx-4 h-2 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-600 rounded"></div>
            <span>Больше сообщений</span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Наведите курсор на ячейку, чтобы увидеть точное количество сообщений
          </p>
        </div>
      </div>
      
      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-md shadow-lg pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {getDayName(tooltip.day)}, {tooltip.hour.toString().padStart(2, '0')}:00 — {tooltip.value} messages
        </div>
      )}
    </div>
  )
}
